document.getElementById("pdf-file").addEventListener("change", function() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function() {
      const pdfData = reader.result;
      const pdfContainer = document.getElementById("pdf-display");
      const pdfViewer = document.createElement("embed");
      pdfViewer.setAttribute("src", pdfData);
      pdfViewer.setAttribute("width", "50%");
      pdfViewer.setAttribute("height", "100%");
      pdfContainer.appendChild(pdfViewer);
    });
    reader.readAsDataURL(file);
  });
  
  const chatUI = document.getElementById("chat-ui");
  chatUI.style.width = "50%";
  chatUI.style.height = "100%";
  chatUI.style.float = "right";
  chatUI.innerHTML = `
    <h2>Chat UI</h2>
    <textarea id="chat-input"></textarea>
    <button id="send-message">Send</button>
    <div id="chat-messages"></div>
  `;
  
  document.getElementById("send-message").addEventListener("click", function() {
    const input = document.getElementById("chat-input").value;
    const messages = document.getElementById("chat-messages");
    const message = document.createElement("div");
    message.innerHTML = input;
    messages.appendChild(message);
  });
  