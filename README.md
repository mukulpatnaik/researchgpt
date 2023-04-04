# ResearchGPT

This is a flask app provides an interface to enable a conversation with a research paper. You can enter a link to a pdf hosted online or upload your own pdf. The app will then extract the text from the pdf, create embeddings from the text and use them with the openai api to generate a response to a question you ask. It will also return a source for the part of the text it used to generate the response and the page number. 

Try the demo at: https://www.dara.chat

## Example 

https://user-images.githubusercontent.com/36257370/218764852-32b79201-4767-4684-980a-73aa81e7d72a.mp4

## Installation

```bash
git clone https://github.com/mukulpatnaik/researchgpt.git
cd researchgpt
pip install -r requirements.txt
```

## Usage

An OpenAI api key is required. Update the value of the ```OPENAI_API_KEY``` environment variable in ```app.yaml``` with your OpenAI api key. Instructions for finding your OpenAI api key are available [here](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key).


## Google Cloud Deployment

Follow the instructions here: https://cloud.google.com/appengine/docs/standard/python3/building-app/deploying-web-service
Once you have the app.yaml file set up with your OpenAI api key and also have gcloud cli set up, you can deploy with:

```bash
gcloud app deploy
```

To stream logs:

```bash
gcloud app logs tail
```
