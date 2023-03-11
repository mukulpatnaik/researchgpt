export function SaveAccessKey(ak) {
  localStorage.setItem("AccessToken", ak);
}

export function ClearAccessKey() {
  localStorage.removeItem("AccessToken");
}

export function LoadAccessKey() {
  const AccessToken = localStorage.getItem("AccessToken");
  if (AccessToken == null) {
    return null;
  }
  return AccessToken;
}

export async function PostDownloadPDF(url) {
  const resp = await fetch(`/api/download_pdf?ak=${ak}`, {
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
  const ak = LoadAccessKey();
  const fileArrayBuffer = await fileBlob.arrayBuffer();
  const resp = await fetch(`/api/process_pdf?ak=${ak}`, {
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
  const ak = LoadAccessKey();
  const resp = await fetch(`/api/reply?ak=${ak}`, {
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

export async function PostAuthed(ak) {
  const resp = await fetch(`/api/auth?ak=${ak}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

  if (resp.status == 401) {
    throw Error("Invaild code!");
  }

  if (resp.status != 200) {
    throw Error("Invaild response from API");
  }

  return resp.json();
}
