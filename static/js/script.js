document.addEventListener("DOMContentLoaded", function() {
  // This file contains the JavaScript code for the web app

const input = document.querySelector("input[type='file']");
const uploadBtn = document.querySelector(".upload-btn");
const viewer = document.querySelector("#pdf-viewer");
const container = document.querySelector("#container");
const x = document.querySelector("input[name='pdf-url']");
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

  // call the endpoint /reply with the message and get the reply.
  fetch('/reply', {
      method: 'POST',
      body: JSON.stringify({'query': message}),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  // Append the reply to #chat as a simple paragraph without any styling
  .then(data => {
      console.log(data.answer)

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
    console.log(url);
    fetch('https://api.codetabs.com/v1/proxy?quest='+url)
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

});

input.addEventListener("change", async function() {
  const file = this.files[0];
  const fileArrayBuffer = await file.arrayBuffer();
  console.log(fileArrayBuffer);
  // Make a post request to "http://127.0.0.1:5000/process_pdf" with the file
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
