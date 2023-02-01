from PyQt5.QtCore import QUrl, Qt
from PyQt5.QtGui import QFont
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QHBoxLayout, QVBoxLayout, QTextEdit, QLineEdit, QPushButton, QFileDialog
from PyQt5.QtWebEngineWidgets import QWebEngineSettings, QWebEngineView
from PyPDF2 import PdfReader
import pandas as pd
from openai.embeddings_utils import get_embedding, cosine_similarity
import openai
import os

openai.api_key = os.environ['OPENAI_API_KEY']


class MainWindow(QMainWindow):

    def __init__(self):
        super(MainWindow, self).__init__()
        self.initUI()
        title = "researchGPT"
 
        # set the title
        self.setWindowTitle(title)

    def initUI(self):
        btn = QPushButton("Upload PDF", self)
        btn.clicked.connect(self.uploadPDF)
        btn.move(50, 50)
        self.setAutoFillBackground(True)
        p = self.palette()
        p.setColor(self.backgroundRole(), Qt.black)
        self.setPalette(p)

    def uploadPDF(self):
        label, width, height = self.displayPDF()
        chat_widget = self.createChatUI(width, height)
        self.mainLayout(label, chat_widget, width, height)

    def displayPDF(self):
        options = QFileDialog.Options()
        file_name, _ = QFileDialog.getOpenFileName(self, "QFileDialog.getOpenFileName()", "", "PDF Files (*.pdf);;All Files (*)", options=options)
        if file_name:

            global pdf 
            pdf = PdfReader(file_name)
            global chatbot
            chatbot = Chatbot()
            global df
            df = chatbot.calculate_embeddings(chatbot.paper_df(chatbot.parse_paper(pdf)))

            webView = QWebEngineView()
            webView.settings().setAttribute(QWebEngineSettings.PluginsEnabled, True)
            webView.settings().setAttribute(QWebEngineSettings.PdfViewerEnabled, True)
            webView.setUrl(QUrl(f"file://{file_name}"))
            return webView, webView.width(), webView.height()

    def createChatUI(self, width, height):
        chat_layout = QVBoxLayout()
        self.text_edit = QTextEdit()
        chat_layout.addWidget(self.text_edit)
        self.line_edit = QLineEdit()
        chat_layout.addWidget(self.line_edit)
        self.line_edit.setFixedHeight(50)

        font = QFont()
        font.setFamily('Roboto')
        font.setPointSize(14)
        self.line_edit.setFont(font)
        self.text_edit.setFont(font)
        self.text_edit.setStyleSheet(
                """QLineEdit { 
                background-color: black;
                color: white;
                font-size: 16px;
                font-family: Roboto; }""")
        
        send_button = QPushButton("Send")
        send_button.clicked.connect(self.sendMessage)
        chat_layout.addWidget(send_button)

        chat_widget = QWidget()
        chat_widget.setLayout(chat_layout)
        self.resize(width + 400, height)
        return chat_widget

    def sendMessage(self):
        user_input = self.line_edit.text()
        if user_input == "":
            return None
        prompt = chatbot.create_prompt(df, user_input)
        response = chatbot.reply(prompt)
        print(response)
        self.text_edit.append(f"\nQuery: {user_input}\n")
        self.text_edit.append(response+"\n")
        self.line_edit.clear()


    def mainLayout(self, label, chat_widget, width, height):
        main_layout = QHBoxLayout()
        main_layout.addWidget(label)
        main_layout.addWidget(chat_widget)
        main_widget = QWidget()
        main_widget.setLayout(main_layout)
        self.setCentralWidget(main_widget)
        self.resize(width + 400, height+400)

class Chatbot():
    
    def parse_paper(self, pdf):
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
                    page_text.append({
                    'fontsize': fontSize,
                    'text': text.strip().replace('\x03', ''),
                    'x': x,
                    'y': y
                    })

            _ = page.extract_text(visitor_text=visitor_body)

            blob_font_size = None
            blob_text = ''
            processed_text = []

            for t in page_text:
                if t['fontsize'] == blob_font_size:
                    blob_text += f" {t['text']}"
                else:
                    if blob_font_size is not None and len(blob_text) > 1:
                        processed_text.append({
                            'fontsize': blob_font_size,
                            'text': blob_text,
                            'page': i
                        })
                    blob_font_size = t['fontsize']
                    blob_text = t['text']
                paper_text += processed_text
        print("Done parsing paper")
        return paper_text

    def paper_df(self, pdf):
        filtered_pdf= []
        for row in pdf:
            if len(row['text']) < 30:
                continue
            filtered_pdf.append(row)
        df = pd.DataFrame(filtered_pdf)
        # print(df.head())
        df['length'] = df['text'].apply(lambda x: len(x))
        # print(df.shape)
        print('Done creating dataframe')
        return df

    def calculate_embeddings(self, df):
        print('Calculating embeddings')
        openai.api_key = os.getenv('OPENAI_API_KEY')
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
        # remove elements with identical df[text] and df[page] values
        results = results.drop_duplicates(subset=['text', 'page'], keep='first')
        # make a dictionary of the the first three results with the page number as the key and the text as the value. The page number is a column in the dataframe.
        results = results.head(n)
        global sources 
        sources = []
        for i in range(n):
            # append the page number and the text as a dict to the sources list
            sources.append({'page: '+str(results.iloc[i]['page']): results.iloc[i]['text'][:100]+'...'})
        print(sources)
        return results.head(n)
    
    def create_prompt(self, df, user_input):
        result = self.search_embeddings(df, user_input, n=3)
        print(result)
        prompt = """You are a large language model whose expertise is reading and summarizing scientific papers. 
        You are given a query and a series of text embeddings from a paper in order of their cosine similarity to the query.
        You must take the given embeddings and return a very detailed summary of the paper that answers the query.
            
            Given the question: """+ user_input + """
            
            and the following embeddings as data: 
            
            1.""" + str(result.iloc[0]['text']) + """
            2.""" + str(result.iloc[1]['text']) + """
            3.""" + str(result.iloc[2]['text']) + """

            Return a detailed answer based on the paper:"""

        print('Done creating prompt')
        return prompt

    def gpt(self, prompt):
        print('Sending request to GPT-3')
        openai.api_key = os.getenv('OPENAI_API_KEY')
        r = openai.Completion.create(model="text-davinci-003", prompt=prompt, temperature=0.4, max_tokens=1500)
        response = r.choices[0]['text']
        print('Done sending request to GPT-3')
        return response.strip("\n")+"\n\nsources: """+str(sources)


    def reply(self, prompt):
        print(prompt)
        prompt = self.create_prompt(df, prompt)
        return self.gpt(prompt)




if __name__ == '__main__':
        import sys
        app = QApplication(sys.argv)
        win = MainWindow()
        win.show()
        sys.exit(app.exec_())