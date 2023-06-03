document.addEventListener("DOMContentLoaded", function() {
  // This file contains the JavaScript code for the web app

const input = document.querySelector("input[type='file']");
var uploadBtn = document.querySelector(".upload-btn");
const viewer = document.querySelector("#pdf-viewer");
const container = document.querySelector("#container");
var x = document.querySelector("input[name='pdf-url']");
const form = document.querySelector("form");
const p = document.querySelector("p");
const up = document.querySelector("#up");
const y = document.querySelector("#url");
const send = document.querySelector("#send");


send.addEventListener("click", function(event) {
  event.preventDefault();
  const message = document.querySelector("input[name='chat']").value;
  // if the message is empty, do nothing
  if (message === "") {
    return;
  }
  const chat = document.querySelector("#chat");
  const query = document.createElement("p");
  query.innerHTML = message;
  chat.appendChild(query);
  
  const loading = document.createElement("p");
  loading.id = "loading";
  loading.style.color = "lightgray";
  loading.style.fontSize = "14px";
  loading.innerHTML = "Loading...";
  chat.appendChild(loading);

  // call the endpoint /reply with the message and get the reply.
  fetch('/reply', {
      method: 'POST',
      body: JSON.stringify({'query': message, 'key': window.key}),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  // Append the reply to #chat as a simple paragraph without any styling
  .then(data => {
      console.log(data);

      const loading = document.querySelector("#loading");
      chat.removeChild(loading);

      const reply = document.createElement("p");
      reply.style.color = "lightgray";
      reply.style.marginBottom = "0px";
      reply.style.paddingTop = "0px";
      reply.innerHTML = data.answer;
      chat.appendChild(reply);
      chat.scrollTop = chat.scrollHeight;

      const sources = data.sources;
      console.log(sources)
      // console.log(typeof JSON.parse(sources))
      sources.forEach(function(source) {
        for (var page in source) {
          var p = document.createElement("p");
          p.style.color = "gray";
          p.style.fontSize = "12px";
          p.style.fontWeight = "bold";
          p.style.marginTop = "0px";
          p.style.marginBottom = "0px";
          p.style.paddingTop = "0px";
          p.style.paddingBottom = "5px";
          p.innerHTML = page + ": " + "'"+source[page];+"'"
          chat.appendChild(p);
        }
      });
    })
    .catch(error => {

      console.log(error);
          
      const errorMessage = document.createElement("p");
      errorMessage.style.color = "red";
      errorMessage.style.marginBottom = "0px";
      errorMessage.style.paddingTop = "0px";
      errorMessage.innerHTML = "Error: Request to OpenAI failed. Please try again.";
      chat.appendChild(errorMessage);
      chat.scrollTop = chat.scrollHeight;
    });

  document.querySelector("input[name='chat']").value = "";
});

x.addEventListener("focus", function() {
    if (this.value === "Enter URL") {
    this.value = "";
    this.style.color = "black";
    }
});

y.addEventListener("submit", function(event) {
    event.preventDefault();
    const url = this.elements["pdf-url"].value;
    if (url === "") {
        return;
    }
    // if the url does not end with .pdf, make x.value = "Error: URL does not end with .pdf"
    if (!url.endsWith(".pdf")) {
        x.value = "Error: URL does not end with .pdf";
        return;
    }
    x.value = "Loading...";
    console.log(url);
    fetch(url)
    .then(response => response.blob())
    .then(pdfBlob => {
        console.log(pdfBlob);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        pdfjsLib.getDocument(pdfUrl).promise.then(pdfDoc => {
            viewer.src = pdfUrl;
            uploadBtn.style.display = "none";
            form.style.display = "none";
            form.style.marginTop = "0px";
            p.style.display = "none";
            up.style.display = "none";
            container.style.display = "flex";
            viewer.style.display = "block";
        });
        })
        .catch(error => {
            console.error(error);
        });
    var loading = document.createElement("p");
    loading.style.color = "lightgray";
    loading.style.fontSize = "14px";
    loading.innerHTML = "Calculating embeddings...";
    chat.appendChild(loading);

    // Make a POST request to the server 'myserver/download-pdf' with the URL
    fetch('/download_pdf', {
      method: 'POST',
      body: JSON.stringify({'url': url}),
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
      })
      .then(response => response.json())
      // Append the reply to #chat as a simple paragraph without any styling
      .then(data => {
        chat.removeChild(loading);
        window.key = data.key;
      })
      .catch(error => {
        uploadBtn.innerHTML = "Error: Request to server failed. Please try again. Check the URL if there is https:// at the beginning. If not, add it.";
        x.innerHTML = "Error: Request to server failed. Please try again. Check the URL if there is https:// at the beginning. If not, add it.";
        console.error(error);
      });
});

input.addEventListener("change", async function() {
  const file = this.files[0];
  const fileArrayBuffer = await file.arrayBuffer();
  console.log(fileArrayBuffer);

  var loading = document.createElement("p");
  loading.style.color = "lightgray";
  loading.style.fontSize = "14px";
  loading.innerHTML = "Calculating embeddings...";
  chat.appendChild(loading);

  // Make a post request to /process_pdf with the file
  fetch('/process_pdf', {
      method: 'POST',
      body: fileArrayBuffer,
      headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': fileArrayBuffer.byteLength,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
  })
  .then(response => response.json())
  // Append the reply to #chat as a simple paragraph without any styling
  .then(data => {
    chat.removeChild(loading);
    window.key = data.key;
  })
  .catch(error => {
    loading.innerHTML = "Error: Processing the pdf failed due to excess load. Please try again later.  Check the URL if there is https:// at the beginning. If not, add it.";
    console.error(error);
  });
    
  pdfjsLib.getDocument(fileArrayBuffer).promise.then(pdfDoc => {
  viewer.src = URL.createObjectURL(file);
  uploadBtn.style.display = "none";
  form.style.display = "none";
  form.style.marginTop = "0px";
  p.style.display = "none";
  up.style.display = "none";
  container.style.display = "flex";
  viewer.style.display = "block";
  }).catch(error => {
  console.error(error);
  });
});
});
