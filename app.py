import math
import os
from collections import Counter
from io import BytesIO

import openai
import pandas as pd
import pdfplumber
import requests
from flask import Flask, render_template, request
from flask_cors import CORS
from pathlib import Path
from llama_index import download_loader, GPTSimpleVectorIndex
from openai.embeddings_utils import cosine_similarity, get_embedding

openai.api_key = os.getenv("OPENAI_API_KEY")
if openai.api_type == "azure":
    openai.api_version = os.environ.get("OPENAI_API_VERSION", "2023-03-15-preview")
openai_chat_model = os.environ.get("OPENAI_CHAT_MODEL", "gpt-3.5-turbo")
openai_embedding_model = os.environ.get("OPENAI_EMBEDDING_MODEL", "text-embedding-ada-002") 

app = Flask(__name__, template_folder="./frontend/dist", static_folder="./frontend/dist/assets")
CORS(app)

class Chatbot():

    def parse_paper(self, pdf):
        print("Parsing paper")
        global number_of_pages
        number_of_pages = len(pdf.pages)
        print(f"Total number of pages: {number_of_pages}")
        paper_text = []
        misc_text = []
        ismisc = False
        for i in range(number_of_pages):
            page = pdf.pages[i]
            if i == 0:
                isfirstpage = True
            else:
                isfirstpage = False

            page_text = []
            misc_page_text = []
            sentences = []
            misc_sentences = []
            processed_text = []
            misc_processed_text = []

            def visitor_body(text, isfirstpage, x, top, bottom, fontSize, ismisc):
                if isfirstpage: # first page, directly process the text
                        sentences.append({
                        'fontsize': fontSize,
                        'text': ' ' + text.strip().replace('\x03', ''),
                        'x': x,
                        'y': top
                        })

                else: # not first page, rule out headers
                    if (top > 70 and bottom < 720) and (len(text.strip()) > 1) and not ismisc: # main text region
                            sentences.append({
                            'fontsize': fontSize,
                            'text': ' ' + text.strip().replace('\x03', ''),
                            'x': x,
                            'y': top
                            })
                    elif (top > 70 and bottom < 720) and (len(text.strip()) > 1) and ismisc:
                        misc_sentences.append({
                            'fontsize': fontSize,
                            'text': ' ' + text.strip().replace('\x03', ''),
                            'x': x,
                            'y': top
                            })

            extracted_words = page.extract_words(x_tolerance=1, y_tolerance=3, keep_blank_chars=False, use_text_flow=True, horizontal_ltr=True, vertical_ttb=True, extra_attrs=["fontname", "size"], split_at_punctuation=False)

            # Treat the first page, main text, and references differently, specifically targeted at headers
            # Define a list of keywords to ignore
            keywords_for_misc = ['References', 'REFERENCES', 'Bibliography', 'BIBLIOGRAPHY', 'Acknowledgements', 'ACKNOWLEDGEMENTS', 'Acknowledgments', 'ACKNOWLEDGMENTS', '参考文献', '致谢']

            keywords_for_exception = ['R', 'B', 'A']
            extracted_words = iter(extracted_words)

            # Loop through the extracted words
            for extracted_word in extracted_words:
                # Strip the text and remove any special characters
                text = extracted_word['text'].strip().replace('\x03', '')

                if len(text) == 1 and any(keyword in text for keyword in keywords_for_exception):
                    try:
                        tmp_text = text + next(extracted_words)['text']
                    except StopIteration:
                        pass

                # Check if the text contains any of the keywords to ignore
                if 'tmp_text' in locals() and any(keyword in tmp_text for keyword in keywords_for_misc):
                    ismisc = True

                # Call the visitor_body function with the relevant arguments
                visitor_body(text, isfirstpage, extracted_word['x0'], extracted_word['top'], extracted_word['bottom'], extracted_word['size'], ismisc=ismisc)

            if sentences != []:
                    if len(sentences) == 1:
                        page_text.append(sentences)
                    for j in range(len(sentences)-1):
                        if len(sentences[j]['text']) < 100 and sentences[j]['fontsize'] == sentences[j+1]['fontsize']: # average length of a sentence
                            sentences[j+1]['text'] = f"{sentences[j]['text']}" + sentences[j+1]['text']
                        else:
                            page_text.append(sentences[j])

            if ismisc == True:
                    if len(misc_sentences) == 1:
                        misc_page_text.append(misc_sentences)
                    else:
                        for j in range(len(misc_sentences)-1):
                            if len(misc_sentences[j]['text']) < 100 and misc_sentences[j]['fontsize'] == misc_sentences[j+1]['fontsize']: # average length of a sentence
                                misc_sentences[j+1]['text'] = f"{misc_sentences[j]['text']}" + misc_sentences[j+1]['text']
                            else:
                                misc_page_text.append(misc_sentences[j])

            blob_font_sizes = []
            blob_font_size = None
            blob_text = ''
            processed_text = []
            if ismisc == True:
                misc_blob_font_sizes = []
                misc_blob_font_size = None
                misc_blob_text = ''
                misc_processed_text = []
            tolerance = 1
            title_tolerance = 3.6

            # Preprocessing for title font size
            if isfirstpage:
                title_clean = []
                title_font_sizes = []
                for q in page_text:
                    title_font_sizes.append(q['fontsize'])
                title_font_sizes.sort()
                title_font_sizes_max_count = title_font_sizes.count(title_font_sizes[-1])
                title_font_sizes_second_max_count = title_font_sizes.count(title_font_sizes[-2])
                if title_font_sizes_max_count > title_font_sizes_second_max_count:
                    title_font_size = title_font_sizes[-1]
                else:
                    title_font_size = title_font_sizes[-2] # title is the word cluster with largest font size in most cases
                for r in page_text:
                    if title_font_size - title_tolerance <= r['fontsize'] <= title_font_size:
                        title_clean.append(r['text'])

                title_sentence = ' '.join(title_clean)

            # Preprocessing for main text font size
            if page_text != []:
                if len(page_text) == 1:
                    blob_font_sizes.append(page_text[0]['fontsize'])
                else:
                    for t in page_text:
                        blob_font_sizes.append(t['fontsize'])
                blob_font_size = Counter(blob_font_sizes).most_common(1)[0][0]

            if ismisc == True:
            # Preprocessing for misc text font size
                if len(misc_page_text) == 1:
                    misc_blob_font_sizes.append(misc_page_text[0]['fontsize'])
                else:
                    for s in misc_page_text:
                        misc_blob_font_sizes.append(s['fontsize'])
                misc_blob_font_size = Counter(misc_blob_font_sizes).most_common(1)[0][0]

            if page_text != []:
                if len(page_text) == 1:
                    if blob_font_size - tolerance <= page_text[0]['fontsize'] <= blob_font_size + tolerance:
                        processed_text.append({
                                'text': page_text[0]['text'],
                                'page': i+1
                            })
                else:
                    for t in range(len(page_text)):
                        if blob_font_size - tolerance <= page_text[t]['fontsize'] <= blob_font_size + tolerance:
                            blob_text += f"{page_text[t]['text']}"
                            if len(blob_text) >= 500: # set the length of a data chunk
                                processed_text.append({
                                    'text': blob_text,
                                    'page': i+1
                                })
                                blob_text = ''
                            elif t == len(page_text)-1: # last element
                                processed_text.append({
                                    'text': blob_text,
                                    'page': i+1
                                })
                paper_text += processed_text

            if ismisc == True:
                if len(misc_page_text) == 1:
                    if misc_blob_font_size - tolerance <= misc_page_text[0]['fontsize'] <= misc_blob_font_size + tolerance:
                        misc_processed_text.append({
                                'text': misc_page_text[0]['text'],
                                'page': i+1
                            })
                else:
                    for s in range(len(misc_page_text)):
                        if misc_blob_font_size - tolerance <= misc_page_text[s]['fontsize'] <= misc_blob_font_size + tolerance:
                            misc_blob_text += f"{misc_page_text[s]['text']}"
                            if len(misc_blob_text) >= 500: # set the length of a data chunk
                                misc_processed_text.append({
                                    'text': misc_blob_text,
                                    'page': i+1
                                })
                                misc_blob_text = ''
                            elif s == len(misc_page_text)-1: # last element
                                misc_processed_text.append({
                                    'text': misc_blob_text,
                                    'page': i+1
                                })
                misc_text += misc_processed_text
        print("Done parsing paper")

        # title judgement
        if len(title_clean) != 1:
            if len(title_clean) <= 3:
                for title in title_clean:
                    if len(title) > 30:
                        title_sentence = title
                        break
            else:
                for i in range(3): # try 3 times
                    if len(title_clean[i]) > 30:
                        title_sentence = title_clean[i]
                        break
        return paper_text, misc_text, title_sentence

    def paper_df(self, pdf):
        print('Creating dataframe')
        filtered_pdf= []
        for row in pdf:
            if len(row['text']) < 30:
                continue
            filtered_pdf.append(row)
        df = pd.DataFrame(filtered_pdf)
        # print(df.shape)
        # remove elements with identical df[text] and df[page] values
        df = df.drop_duplicates(subset=['text', 'page'], keep='first')
        df['length'] = df['text'].apply(lambda x: len(x))
        print('Done creating dataframe')
        return df

    def calculate_embeddings(self, df):
        print('Calculating embeddings')
        embeddings = df.text.apply([lambda x: get_embedding(x, engine=openai_embedding_model)])
        df["embeddings"] = embeddings
        print('Done calculating embeddings')
        return df

    def search_embeddings(self, df, query, n=3, pprint=True):
        query_embedding = get_embedding(
            query,
            engine=openai_embedding_model
        )
        df["similarity"] = df.embeddings.apply(lambda x: cosine_similarity(x, query_embedding))

        results = df.sort_values("similarity", ascending=False, ignore_index=True)
        # make a dictionary of the the first three results with the page number as the key and the text as the value. The page number is a column in the dataframe.
        results = results.head(n).sort_values(by='page')
        global sources
        sources = []
        for i in range(n):
            # append the page number and the text as a dict to the sources list
            sources.append({'Page '+str(results.iloc[i]['page']): results.iloc[i]['text'][:150]+'...'})
        print(sources)
        return results.head(n)

    def get_title(self, title_related):
        system_role = f"""I have a list contains a title of a paper. I want to extract the title of the paper."""

        user_content = f"""Given the string of a title and its related information: "{str(title_related)}". Return the title of the paper. Return the title only. Do not return any additional text."""

        messages = [
        {"role": "system", "content": system_role},
        {"role": "user", "content": user_content},]

        print('Done generating title information')
        return messages

    def get_scope(self, user_input):
        system_role = f"""You are going to determine if a sentence has a request of requesting detailed information of a research paper. Please note that 'main idea', 'summary', 'abstraction', 'overview' are not detailed information. Also, sentences not containing 'detail' or 'reviewer' are not detailed information and you should return a False value. Return a boolean value only."""

        user_content = f"""The sentence is: "{str(user_input)}"."""

        messages = [
        {"role": "system", "content": system_role},
        {"role": "user", "content": user_content},]

        return messages

    def create_messages(self, df, user_input, title, isdetail, *df_misc):
        if df_misc == None:
            result_df = df
        else:
            result_df = df.append(df_misc)

        if number_of_pages >= 6 and isdetail == True:
            result = self.search_embeddings(result_df, user_input, n=int(math.log2(number_of_pages)) + 2)
        elif number_of_pages >= 6:
            result = self.search_embeddings(result_df, user_input, n=int(math.log2(number_of_pages)))
        else:
            if len(df) < 3:
                result = self.search_embeddings(result_df, user_input, n=len(df))
            else:
                result = self.search_embeddings(result_df, user_input, n=3)

        total_max_string = 2000
        if isdetail == True:
            max_string = total_max_string // (int(math.log2(number_of_pages)) + 2)
        else:
            max_string = total_max_string // int(math.log2(number_of_pages))

        embeddings = []

        for i in range(int(math.log2(number_of_pages))):
            if len(result.iloc[i]['text']) > max_string:
                embeddings.append(str(result.iloc[i]['text'][:max_string]))
            else:
                embeddings.append(str(result.iloc[i]['text']))
        
        def get_gpt_augmentation(query):
          response = index.query(query)
          return response
        
        gpt_augmentation = get_gpt_augmentation(str(user_input)).response.strip()[:100]

        system_role = f"""As an academician, you are tasked with reading and summarizing a scientific paper. You are given text embeddings, the title of the paper, and a prompt sentence. Your goal is to answer any questions related to the paper using the given embeddings and the title. The embeddings are as follows: {str(embeddings)}. The title of the paper is: {title}. The prompt sentence is: {str(gpt_augmentation)}. To ensure that your answers are accurate and relevant, you must answer in the language of the question. If you cannot answer your question, you will apologize and directly say you do not have the information."""

        user_content = f"""The question is: "{str(user_input)}"."""

        messages = [
        {"role": "system", "content": system_role},
        {"role": "user", "content": user_content},
        ]

        print('Done creating messages')
        return messages

    def gpt(self, messages, isdetail):
        print('Sending request to ', openai_chat_model)
        if openai.api_type == "azure":
            model_params = {
                "engine": openai_chat_model,
            }
        else:
            model_params = {
                "model": openai_chat_model,
            }
        r = openai.ChatCompletion.create(
            **model_params,
            messages=messages,
            temperature=0.7,
            max_tokens=1500)
        answer = r.choices[0]["message"]["content"]
        print('Done sending request to', openai_chat_model)
        if isdetail:
            return {'answer': answer.replace("\n", "")}
        if 'sources' in globals().keys():
            return {'answer': answer, 'sources': sources}
        return {'answer': answer.replace("\n", "")}

@app.route("/api/process_pdf", methods=['POST'])
def process_pdf():
    print("Processing pdf")
    file = request.data
    CJKPDFReader = download_loader("CJKPDFReader")
    loader = CJKPDFReader()
    with open('upload.pdf', 'wb') as f:
          f.write(request.data)
    global document, index
    document = loader.load_data(file=Path('./upload.pdf'))
    index = GPTSimpleVectorIndex.from_documents(document)
    pdf = pdfplumber.open(BytesIO(file))
    chatbot = Chatbot()
    paper_text, misc_text, title_related = chatbot.parse_paper(pdf)
    global df_main, df_misc
    df_main = chatbot.paper_df(paper_text)
    df_main = chatbot.calculate_embeddings(df_main)
    if misc_text != []:
        df_misc = chatbot.paper_df(misc_text)
        df_misc = chatbot.calculate_embeddings(df_misc)
    title_request = chatbot.get_title(title_related)
    global title
    pdf = pdfplumber.open(BytesIO(file))
    chatbot = Chatbot()
    paper_text, misc_text, title_related = chatbot.parse_paper(pdf)
    title_request = chatbot.get_title(title_related)
    title = chatbot.gpt(title_request, False)
    title = title['answer']
    print("Done processing pdf")
    return {'key': ''}

@app.route("/api/download_pdf", methods=['POST'])
def download_pdf():
    chatbot = Chatbot()
    CJKPDFReader = download_loader("CJKPDFReader")
    loader = CJKPDFReader()
    url = request.json['url']
    r = requests.get(str(url))
    print(r.headers)
    with open('upload.pdf', 'wb') as f:
          f.write(r.content)
    global document, index
    document = loader.load_data(file=Path('./upload.pdf'))
    index = GPTSimpleVectorIndex.from_documents(document)
    pdf = pdfplumber.open(BytesIO(r.content))
    paper_text, misc_text, title_related = chatbot.parse_paper(pdf)
    global df_main, df_misc
    df_main = chatbot.paper_df(paper_text)
    df_main = chatbot.calculate_embeddings(df_main)
    if misc_text != []:
        df_misc = chatbot.paper_df(misc_text)
        df_misc = chatbot.calculate_embeddings(df_misc)
    title_request = chatbot.get_title(title_related)
    global title
    title = chatbot.gpt(title_request, False)
    title = title['answer']
    print("Done processing pdf")
    return {'key': ''}

@app.route("/api/reply", methods=['POST'])
def reply():
    chatbot = Chatbot()
    query = request.json['query']
    query = str(query)
    scope_request = chatbot.get_scope(query)
    scope = chatbot.gpt(scope_request, True)

    if 'true' in scope['answer'] or 'True' in scope['answer'] or 'yes' in scope['answer'] or 'Yes' in scope['answer']:
        scope = True
    else:
        scope = False

    print('Scope: ', scope)

    # Define a list of keywords to match
    keywords_to_match = ['reference', 'references', 'cite', 'citation', 'citations', 'cited', 'citing', 'acknowledgment', 'acknowledgements', 'appendix', 'appendices', '参考文献', '致谢', '附录']

    # Check if the query matches any of the keywords and if 'df_misc' is defined
    if any(keyword in query for keyword in keywords_to_match) and 'df_misc' in globals():
        # If the query matches and 'df_misc' is defined, create messages with 'df_misc'
        messages = chatbot.create_messages(df_main, query, title, True, df_misc)
    elif scope and 'df_misc' in globals():
        # If 'scope' is True and 'df_misc' is defined, create messages with 'df_misc'
        messages = chatbot.create_messages(df_main, query, title, True, df_misc)
    elif scope:
        # If 'scope' is True but 'df_misc' is not defined, create messages without 'df_misc'
        messages = chatbot.create_messages(df_main, query, title, True)
    else:
        # If none of the above conditions are met, create messages without 'df_misc'
        messages = chatbot.create_messages(df_main, query, title, False)

    # Call the gpt function with the messages and False as arguments
    response = chatbot.gpt(messages, False)
    print(response)
    return response, 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv("PORT"), debug=True)
