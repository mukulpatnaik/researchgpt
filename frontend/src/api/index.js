export async function PostDownloadPDF(url) {
  const resp = await fetch(`/api/download_pdf`, {
    method: "POST",
    body: JSON.stringify({ url: url }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

  if (resp.status != 200) {
    throw Error("Invaild response from API");
  }

  return resp.json();
}

export async function PostProcessPDF(fileBlob) {
  const fileArrayBuffer = await fileBlob.arrayBuffer();
  const resp = await fetch(`/api/process_pdf`, {
    method: "POST",
    body: fileArrayBuffer,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": fileArrayBuffer.byteLength,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

  if (resp.status != 200) {
    throw Error("Invaild response from API");
  }

  return resp.json();
}

export async function PostChatReply(message) {
  const resp = await fetch(`/api/reply`, {
    method: "POST",
    body: JSON.stringify({ query: message, key: window.key }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

  if (resp.status != 200) {
    throw Error("Invaild response from API");
  }

  return resp.json();
}
