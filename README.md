# ResearchGPT

This is a simple fastapi app that provides a clean interface to enable a conversation with any pdf. You can enter a link to a pdf hosted online or upload your own pdf. The app will then extract the text from the pdf, create embeddings from the text and use them with the openai api to generate a response to a question you ask. It will also return a source for the part of the text it used to generate the response and the page number. 

Try the demo at: https://www.dara.chat

## Example 

https://github.com/mukulpatnaik/researchgpt/assets/36257370/e94e2d19-6e7c-4897-9c0a-ef250101e8b4

## Installation

```bash
git clone https://github.com/mukulpatnaik/researchgpt.git
cd researchgpt
pip install -r requirements.txt
```

You also need redis for storing the embeddings locally on your machine. You can find installation instructions here: https://redis.io/docs/getting-started/installation/. To start the db, run the following command in your terminal.

On MacOS:

```bash
redis-server
```

On Windows:

```bash
sudo service redis-server start
```

## Usage

You need to have an openai api key and set it as the environment variable 'OPENAI_API_KEY'.

```bash
uvicorn main:app --reload
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

If you would like to collaborate on this project, please reach out to me at mukulpatnaik@gmail.com or find me on [twitter](https://twitter.com/mukul0x)
