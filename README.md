# ResearchGPT

This is a fork of the original [ResearchGPT](https://github.com/mukulpatnaik/researchgpt). The current version modifies several settings from the original:
- Use `GPT-3.5-turbo` instead of `GPT-3.5` (the original uses `GPT-3`).
- Add multi-language support.
- Improved results for journal papers (See compare results below).
- Slight modification of the frontend.

I use this repository to study OpenAI's API and Microsoft's Azure. The partial original README is below. 

This is a flask app provides an interface to enable a conversation with a research paper. You can enter a link to a pdf hosted online or upload your own pdf. The app will then extract the text from the pdf, create embeddings from the text and use them with the openai api to generate a response to a question you ask. It will also return a source for the part of the text it used to generate the response and the page number.

![home](/images/home.png)

## Example 
This web app supports query in multiple languange. Here is an example of a query in both English and Chinese:

![demo](/images/demo.png)

This app also supports pdf files in the language other than English. Here is an example of a Chinese pdf file:

![demo2](/images/demo2.png)
## Installation

```bash
git clone https://github.com/MrPeterJin/researchgpt
cd researchgpt
pip install -r requirements.txt
```

Also, you need to have an OpenAI API key and set it as the environment variable 'OPENAI_API_KEY'.

## Usage

### Run locally

```bash
python app.py
```

And then open http://127.0.0.1:8080/ in your browser.

or:

```bash
flask run
```

And then open http://127.0.0.1:5000/ in your browser.

### Microsoft Azure Deployment

Follow the instructions [here](https://learn.microsoft.com/zh-cn/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli). Once you have the azure cli set up with `az login`, you can deploy with streamed logs:

```bash
az webapp up --runtime PYTHON:3.9 --sku B1 --logs
```

## Limitations
Due to the PDF to text conversion and embedding construction technique, the web app is limited to handle papers with headers (see screenshots below for examples) and can respond unexpectedly (For instance, return the header information). Comparing to the original version, this version has specifically targeted at this problem and making improvements. We are continuing working on improving the app to give better respond.

|With Header|Without Header|
|---|---|
|![header](/images/header.png)|![noheader](/images/noheader.png)|

The improved results can be seen as follows (Click for full-sized image):

|With Header (This fork)|With Header (Original)|
|---|---|
|![header](/images/improved.png)|![noheader](/images/orig.png)|






