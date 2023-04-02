# ResearchGPT

![banner](images/banner.png)

![https://img.shields.io/github/stars/MrPeterJin/researchgpt?style=for-the-badge](https://img.shields.io/github/stars/MrPeterJin/researchgpt?style=for-the-badge) <a href="https://www.buymeacoffee.com/MakotoJin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="28" width="134"></a>

This is a fork of the original [ResearchGPT](https://github.com/mukulpatnaik/researchgpt). The current version modifies several settings from the original:
- Use `GPT-3.5-turbo` instead of `GPT-3`.
- Add Chinese language support.
- Improved results (Powered by [llama-index](https://github.com/jerryjliu/llama_index)) for research papers.
- Modification of the frontend.

I use this repository to study OpenAI's API, Microsoft's Azure, GitHub Pages, CI/CD and Vue.js Frontend Framework. The partial original README is below.

This is a flask app provides an interface to enable a conversation with a research paper. You can enter a link to a pdf hosted online or upload your own pdf. The app will then extract the text from the pdf, create embeddings from the text and use them with the openai api to generate a response to a question you ask. It will also return a source for the part of the text it used to generate the response and the page number.

![home](/images/home.png)

![home2](/images/home2.png)

## Example
This web app supports query in multiple languages and research papers in English/Chinese. Here are the examples of queries:

![demo](/images/demo.png)

![demo2](/images/demo2.png)

![demo3](/images/demo3.png)

## Installation
To run this app locally, you need to install the dependencies and build the frontend. For starters, you need to install `python3` and `yarn` by following the instructions [here](https://www.python.org/downloads/) and [here](https://classic.yarnpkg.com/en/docs/install/). The app is tested on Ubuntu and Arch Linux.

You can install the dependencies with:

```bash
git clone https://github.com/MrPeterJin/researchgpt
cd researchgpt
pip install -r requirements.txt
cd frontend
yarn
yarn build
```

Also, you need to have an OpenAI API key and set it as the environment variable 'OPENAI_API_KEY'.

## Usage

### Run locally
The local version would save the pdf embeddings in the `embedding` folder to save OpenAI API usage. You can run the app locally with:

```bash
export OPENAI_API_KEY=YOUR_API_KEY
python local.py
```

For convenience, the local version stores the embeddings in the `embedding` folder in order to save the cost and time.

And then open http://127.0.0.1:8080/ in your browser.

### Microsoft Azure Deployment

The online version does not save any data. Follow the instructions [here](https://learn.microsoft.com/zh-cn/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli). Once you have the azure cli set up with `az login`, you can deploy with streamed logs:

```bash
az webapp up --runtime PYTHON:3.9 --sku B1 --logs
```
The Microsoft Azure's services would identify `app.py` as the entry point of the app.

### Railway Deployment
Click the button below and input your OpenAI API key to deploy the app on Railway. Railway is a free hosting platform for web apps.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/Qm0r-x?referralCode=sNwXpV)

### Docker

The app has been containerized to simplify deployment.

To build:
```bash
docker build . -t researchgpt
```

To run:
```bash
docker run -p 8080:8080 -e OPENAI_API_KEY=your_api_key researchgpt
```
And then open http://127.0.0.1:8080/ in your browser.

## Limitations
Due to the PDF to text conversion and embedding construction technique, the web app is limited to handle detailed query. Also, when a paper has distinguished pattern from the ordinary paper, this application also may not able to handle it. We are continuing working on improving the app to give better respond. At this time, you are encouraged to try this app on papers less than 20 pages and give us feedback. The app does not have the limit in page number, though.

Also, current version of the app is not able to handle the query with simultaneous requests, i.e., the web page cannot serve two or more people at the same time. This is out of the scope of my knowledge and I am looking for help.

[![Star History Chart](https://api.star-history.com/svg?repos=MrPeterJin/researchgpt&type=Date)](https://star-history.com/#MrPeterJin/researchgpt&Date)


