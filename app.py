from flask import Flask, request, render_template
from io import BytesIO
import pdfplumber
import pandas as pd
from openai.embeddings_utils import get_embedding, cosine_similarity
import openai
import os
import requests
import math
from collections import Counter
from flask_cors import CORS

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)


class Chatbot():
    
    def parse_paper(self, pdf):
        print("Parsing paper")
        global number_of_pages
        number_of_pages = len(pdf.pages)
        print(f"Total number of pages: {number_of_pages}")
        title_related = []
        paper_text = []
        for i in range(number_of_pages):
            page = pdf.pages[i]
            if i == 0:
                isfirstpage = True
            else:
                isfirstpage = False
            
            page_text = []
            sentences = []
            processed_text = []

            def visitor_body(text, isfirstpage, x, top, bottom, fontSize):
                # ignore header/footer
                if isfirstpage:
                    if (top <= 260) and (len(text.strip()) > 1): # Header Region, specifically treated for title-realated information
                        title_related.append({
                        'fontsize': fontSize,
                        'text': text.strip().replace('\x03', ''),
                        'x': x,
                        'y': top
                        })

                    if (top > 260 and bottom < 700) and (len(text.strip()) > 1):
                        sentences.append({
                        'fontsize': fontSize,
                        'text': text.strip().replace('\x03', ''),
                        'x': x,
                        'y': top
                        })
                else: # not first page
                    if (top > 180 and bottom < 700) and (len(text.strip()) > 1):
                        sentences.append({
                        'fontsize': fontSize,
                        'text': text.strip().replace('\x03', ''),
                        'x': x,
                        'y': top
                        })
            
            extracted_words = page.extract_words(x_tolerance=3, y_tolerance=3, keep_blank_chars=False, use_text_flow=False, horizontal_ltr=True, vertical_ttb=True, extra_attrs=["fontname", "size"], split_at_punctuation=False)
            
            # Treat the first page differently, specifically targeted at headers
            for extracted_word in extracted_words: 
                visitor_body(extracted_word['text'], isfirstpage, extracted_word['x0'], extracted_word['top'], extracted_word['bottom'], extracted_word['size'])
            
            for j in range(len(sentences)-1):
                if len(sentences[j]['text']) < 100 and sentences[j]['fontsize'] == sentences[j+1]['fontsize']: # average length of a sentence
                    sentences[j+1]['text'] = f"{sentences[j]['text']} " + sentences[j+1]['text']
                else:
                    page_text.append(sentences[j])
            
            blob_font_sizes = []
            blob_font_size = None
            blob_text = ''
            processed_text = []
            tolerance = 0.5
            
            # Preprocessing for title font size
            if isfirstpage:
                title_clean = []
                title_font_sizes = []
                for q in title_related:
                    title_font_sizes.append(q['fontsize'])
                title_font_size = max(title_font_sizes) # title is the largest font size
                for r in title_related:
                    if title_font_size - tolerance <= r['fontsize'] <= title_font_size + tolerance:
                        title_clean.append(r['text'])
            
            # Preprocessing for main text font size
            for t in page_text:
                blob_font_sizes.append(t['fontsize'])
            blob_font_size = Counter(blob_font_sizes).most_common(1)[0][0]
            
            for t in range(len(page_text)):
                if blob_font_size - tolerance <= page_text[t]['fontsize'] <= blob_font_size + tolerance:
                    blob_text += f" {page_text[t]['text']}"
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
        print("Done parsing paper")
        return paper_text, title_clean[:3]

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
        embedding_model = "text-embedding-ada-002"
        embeddings = df.text.apply([lambda x: get_embedding(x, engine=embedding_model)])
        df["embeddings"] = embeddings
        print('Done calculating embeddings')
        return df

    def search_embeddings(self, df, query, n=3, pprint=True):
        query_embedding = get_embedding(
            query,
            engine="text-embedding-ada-002"
        )
        df["similarity"] = df.embeddings.apply(lambda x: cosine_similarity(x, query_embedding))
        
        results = df.sort_values("similarity", ascending=False, ignore_index=True)
        # make a dictionary of the the first three results with the page number as the key and the text as the value. The page number is a column in the dataframe.
        results = results.head(n)
        global sources 
        sources = []
        for i in range(n):
            # append the page number and the text as a dict to the sources list
            sources.append({'Page '+str(results.iloc[i]['page']): results.iloc[i]['text'][:150]+'...'})
        print(sources)
        return results.head(n)
    
    def get_title(self, title_related):
        system_role = f"""I have a list contains a title of a paper. I want to extract the title of the paper."""
        
        user_content = f"""Given the string: "{str(title_related)}". Return the title of the paper. Return the title only. Do not return any additional text."""
        
        messages = [
        {"role": "system", "content": system_role},
        {"role": "user", "content": user_content},]
        
        print('Done extracting title')
        return messages
    
    
    def create_messages(self, df, user_input, title):
        result = self.search_embeddings(df, user_input, n=int(math.log2(number_of_pages)))
        print(result)
        
        total_max_string = 2000
        max_string = total_max_string // int(math.log2(number_of_pages))
        
        embeddings = []
        
        for i in range(int(math.log2(number_of_pages))):
            if len(result.iloc[i]['text']) > max_string:
                embeddings.append(str(result.iloc[i]['text'][:max_string]))
            else:
                embeddings.append(str(result.iloc[i]['text']))
            
        system_role = f"""Act as an academician whose expertise is reading and summarizing scientific papers. You are given a query, a series of text embeddings and the title from a paper in order of their cosine similarity to the query. You must take the given embeddings and return a very detailed summary of the paper in the languange of the query. The embeddings are as follows: {str(embeddings)}. The title of the paper is: {title}"""
        
        user_content = f"""Given the question: "{str(user_input)}". Return a detailed answer based on the paper:"""
        
        messages = [
        {"role": "system", "content": system_role},
        {"role": "user", "content": user_content},]
        
        print('Done creating messages')
        return messages

    def gpt(self, messages):
        print('Sending request to GPT-3.5-turbo')
        r = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages, temperature=0.7, max_tokens=1500)
        answer = r.choices[0]["message"]["content"]
        print('Done sending request to GPT-3.5-turbo')
        if 'sources' in globals().keys():
            response = {'answer': answer, 'sources': sources}
        else:
            response = {'answer': answer.replace("\n", "")}
        return response

    def reply(self, messages):
        print(messages)
        messages = self.create_prompt(df, messages)
        return self.gpt(messages)

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/process_pdf", methods=['POST'])
def process_pdf():
    print("Processing pdf")
    file = request.data
    pdf = pdfplumber.open(BytesIO(file))
    chatbot = Chatbot()
    paper_text, title_related = chatbot.parse_paper(pdf)
    global df
    df = chatbot.paper_df(paper_text)
    df = chatbot.calculate_embeddings(df)
    chatbot = Chatbot()
    title_request = chatbot.get_title(title_related)
    global title
    title = chatbot.gpt(title_request)
    print("Done processing pdf")
    return {'key': ''}

@app.route("/download_pdf", methods=['POST'])
def download_pdf():
    chatbot = Chatbot()
    url = request.json['url']
    r = requests.get(str(url))
    print(r.headers)
    pdf = pdfplumber.open(BytesIO(r.content))
    paper_text, title_related = chatbot.parse_paper(pdf)
    global df
    df = chatbot.paper_df(paper_text)
    df = chatbot.calculate_embeddings(df)
    chatbot = Chatbot()
    title_request = chatbot.get_title(title_related)
    global title
    title = chatbot.gpt(title_request)
    print("Done processing pdf")
    return {'key': ''}

@app.route("/reply", methods=['POST'])
def reply():
    chatbot = Chatbot()
    query = request.json['query']
    query = str(query)
    messages = chatbot.create_messages(df, query, title)
    response = chatbot.gpt(messages)
    print(response)
    return response, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
