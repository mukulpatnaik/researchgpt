# ResearchGPT

![banner](images/banner.png)

![https://img.shields.io/github/stars/MrPeterJin/researchgpt?style=for-the-badge](https://img.shields.io/github/stars/MrPeterJin/researchgpt?style=for-the-badge)

This is a fork of the original [ResearchGPT](https://github.com/mukulpatnaik/researchgpt). The current version modifies several settings from the original:
- Use `GPT-3.5-turbo` instead of `GPT-3`.
- Add Chinese language support.
- Improved results for research papers.
- Modification of the frontend.

I use this repository to study OpenAI's API, Microsoft's Azure, GitHub Pages, CI/CD and Vue.js Frontend Framework. The partial original README is below. 

This is a flask app provides an interface to enable a conversation with a research paper. You can enter a link to a pdf hosted online or upload your own pdf. The app will then extract the text from the pdf, create embeddings from the text and use them with the openai api to generate a response to a question you ask. It will also return a source for the part of the text it used to generate the response and the page number.

![home](/images/home.png)

![home2](/images/home2.png)

## Example 
This web app supports query in multiple languanges and research papers in English/Chinese. Here are the examples of queries:

![demo](/images/demo.png)

![demo2](/images/demo2.png)

![demo3](/images/demo3.png)

## Installation
I have tested the installation on Archlinux and Ubuntu 22.04 LTS. It should work out of the box but I cannot guarantee the compatibility on other platforms.

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

## Limitations
Due to the PDF to text conversion and embedding construction technique, the web app is limited to handle detailed query. Also, when a paper has distinguished pattern from the ordinary paper, this application also may not able to handle it. Furthermore, this app can only read *research* papers, which means that other PDF documents (i.e., books, recipts, ppt converted files) are not in the scope of the capability. Comparing to the original version, this version has specifically targeted at this problem and making improvements. We are continuing working on improving the app to give better respond. At this time, you are encouraged to try this app on papers less than 20 pages and give us feedback. The app does not have the limit in page number, though.

[![Star History Chart](https://api.star-history.com/svg?repos=MrPeterJin/researchgpt&type=Date)](https://star-history.com/#MrPeterJin/researchgpt&Date)


