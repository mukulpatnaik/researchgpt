# ResearchGPT

This is a fork of the original [ResearchGPT](https://github.com/mukulpatnaik/researchgpt). I use it to study OpenAI's API and Microsoft's Azure. Partial original README is below.

This is a flask app provides an interface to enable a conversation with a research paper. You can enter a link to a pdf hosted online or upload your own pdf. The app will then extract the text from the pdf, create embeddings from the text and use them with the openai api to generate a response to a question you ask. It will also return a source for the part of the text it used to generate the response and the page number. 


## Example 

https://user-images.githubusercontent.com/36257370/218764852-32b79201-4767-4684-980a-73aa81e7d72a.mp4

## Installation

```bash
git clone https://github.com/MrPeterJin/researchgpt
cd researchgpt
pip install -r requirements.txt
```

Also, you need to specify your OpenAI API key in the variable `openai.api_key` of `app.py`.

## Usage

### Run locally

```bash
python app.py
```

or:

```bash
flask run
```

### Microsoft Azure Deployment

Follow the instructions [here](https://learn.microsoft.com/zh-cn/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli)
Once you have the azure cli set up with `az login`, you can deploy with streamed logs:

```bash
az webapp up --runtime PYTHON:3.9 --sku B1 --logs
```
