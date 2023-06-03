from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from io import BytesIO
from PyPDF2 import PdfReader
import pandas as pd
from openai.embeddings_utils import get_embedding, cosine_similarity
import openai
import os
import requests
import redis
from _md5 import md5
import cohere

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")

db = redis.StrictRedis(host='localhost', port=6379, db=0)


class Chatbot():

    def extraxt_txt(self, txt):
        with open(txt, "r") as f:
            text = f.read()
        return str(text)

    def extract_pdf(self, pdf):
        print("Parsing paper")
        number_of_pages = len(pdf.pages)
        print(f"Total number of pages: {number_of_pages}")
        paper_text = []
        for i in range(number_of_pages):
            page = pdf.pages[i]
            page_text = []

            def visitor_body(text, cm, tm, fontDict, fontSize):
                x = tm[4]
                y = tm[5]
                # ignore header/footer
                if (y > 50 and y < 720) and (len(text.strip()) > 1):
                    page_text.append({"fontsize": fontSize, "text": text.strip().replace("\x03", ""), "x": x, "y": y})

            _ = page.extract_text(visitor_text=visitor_body)

            blob_font_size = None
            blob_text = ""
            processed_text = []

            for t in page_text:
                if t["fontsize"] == blob_font_size:
                    blob_text += f" {t['text']}"
                    if len(blob_text) >= 200:
                        processed_text.append({"fontsize": blob_font_size, "text": blob_text, "page": i})
                        blob_font_size = None
                        blob_text = ""
                else:
                    if blob_font_size is not None and len(blob_text) >= 1:
                        processed_text.append({"fontsize": blob_font_size, "text": blob_text, "page": i})
                    blob_font_size = t["fontsize"]
                    blob_text = t["text"]
                paper_text += processed_text
        print("Done parsing paper")
        # print(paper_text)
        return paper_text

    def create_df(self, data):

        if type(data) == list:
            print("Extracting text from pdf")
            print("Creating dataframe")
            print(type(data))
            filtered_pdf = []
            # print(pdf.pages[0].extract_text())
            for row in data:
                if len(row["text"]) < 30:
                    continue
                filtered_pdf.append(row)
            df = pd.DataFrame(filtered_pdf)
            print(df.columns)
            # remove elements with identical df[text] and df[page] values
            df = df.drop_duplicates(subset=["text", "page"], keep="first")
            # df['length'] = df['text'].apply(lambda x: len(x))
            print("Done creating dataframe")

        elif type(data) == str:
            print("Extracting text from txt")
            print("Creating dataframe")
            # Parse the text and add each paragraph to a column 'text' in a dataframe
            df = pd.DataFrame(data.split("\n"), columns=["text"])

        return df

    def embeddings(self, df):
        print("Calculating embeddings")
        # openai.api_key = os.getenv('OPENAI_API_KEY')
        embedding_model = "text-embedding-ada-002"
        embeddings = df.text.apply([lambda x: get_embedding(x, engine=embedding_model)])
        df["embeddings"] = embeddings
        print("Done calculating embeddings")
        return df

    def search(self, df, query, n=3, pprint=True):
        query_embedding = get_embedding(query, engine="text-embedding-ada-002")
        df["similarity"] = df.embeddings.apply(lambda x: cosine_similarity(x, query_embedding))

        results = df.sort_values("similarity", ascending=False, ignore_index=True)
        # make a dictionary of the the first three results with the page number as the key and the text as the value. The page number is a column in the dataframe.
        results = results.head(n)
        print(results)
        sources = []
        for i in range(n):
            # append the page number and the text as a dict to the sources list
            sources.append({"Page " + str(results.iloc[i]["page"]): results.iloc[i]["text"][:150] + "..."})
        print(sources)
        return {"results": results, "sources": sources}

    def create_prompt(self, df, user_input):
        print('Creating prompt')
        print(user_input)
        print(df)

        result = self.search(df, user_input, n=3)
        data = result['results']
        sources = result['sources']
        print(data)
        system_role = """You are a AI assistant whose expertise is reading and summarizing scientific papers. You are given a query, 
        a series of text embeddings and the title from a paper in order of their cosine similarity to the query. 
        You must take the given embeddings and return a very detailed summary of the paper in the languange of the query:
        """

        user_input = user_input + """
        Here are the embeddings:

        1.""" + str(data.iloc[0]['text']) + """
        2.""" + str(data.iloc[1]['text']) + """
        3.""" + str(data.iloc[2]['text']) + """
        """

        print(system_role)

        history = [
        {"role": "system", "content": system_role},
        {"role": "user", "content": str(user_input)}]

        print('Done creating prompt')
        return {'messages': history, 'sources': sources}

    def gpt(self, context, source):
        print(context)
        print('Sending request to GPT-3')
        openai.api_key = os.getenv('OPENAI_API_KEY')
        r = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=context)
        answer = r.choices[0]["message"]["content"]
        print('Done sending request to GPT-3')
        response = {'answer': answer, 'sources': source}
        return response

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

def cohere_search(query, docs):
    co = cohere.Client('MIT9tAqimYrMfFrBmSsHgBN2EaQc2inGKH9IQziY')
    
    response = co.rerank(
    model = 'rerank-english-v2.0',
    query = query,
    documents = docs,
    top_n = 3,
    )

    print(response)
    return response

@app.post("/process_pdf")
async def process_pdf(request: Request):
    print("Processing pdf")
    print(request)
    body = await request.body()
    key = md5(body).hexdigest()
    print(key)

    if db.get(key) is not None:
        print("Already processed pdf")
        return JSONResponse({"key": key})
    
    file = body
    pdf = PdfReader(BytesIO(file))

    chatbot = Chatbot()
    paper_text = chatbot.extract_pdf(pdf)
    df = chatbot.create_df(paper_text)
    df = chatbot.embeddings(df)

    if db.get(key) is None:
        db.set(key, df.to_json())

    # print(db.set(key, df.to_json()))
    # print(db.get(key))

    print("Done processing pdf")
    return JSONResponse({"key": key})

@app.post("/download_pdf")
async def download_pdf(url: str):
    chatbot = Chatbot()
    r = requests.get(str(url))
    key = md5(r.content).hexdigest()
    if db.get(key) is not None:
        return JSONResponse({"key": key})
    pdf = PdfReader(BytesIO(r.content))
    paper_text = chatbot.extract_pdf(pdf)
    df = chatbot.create_df(paper_text)
    df = chatbot.embeddings(df)
    if db.get(key) is None:
        db.set(key, df.to_json())
    print("Done processing pdf")
    return JSONResponse({"key": key})

@app.post("/reply")
async def reply(request: Request):
    data = await request.json()
    key = data.get('key')
    query = data.get('query')
    
    chatbot = Chatbot()
    query = str(query)
    df = pd.read_json(BytesIO(db.get(key)))
    print(df.head(5))
    prompt = chatbot.create_prompt(df, query)

    chat = []
    chat.extend(prompt['messages'])

    response = chatbot.gpt(chat, prompt['sources'])
    print(response)
    return JSONResponse(content=response, status_code=200)
