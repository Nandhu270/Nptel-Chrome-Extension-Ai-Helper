document.addEventListener("DOMContentLoaded", addbookmark);

const images = {
  playimg: chrome.runtime.getURL("assets/play.png"),
  deleteimg: chrome.runtime.getURL("assets/delete.png"),
  aiimg: chrome.runtime.getURL("assets/ai.png"),
};

function activateTooltips() {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

async function addbookmark() {
  const bookmark = document.getElementById("bookmark-container");
  const currentbookmark = (await getbookmarks()) || [];

  bookmark.innerHTML = "";

  if (currentbookmark.length === 0) {
    bookmark.innerHTML = "<i>No Bookmarks Available</i>";
    return;
  }

  currentbookmark.forEach((data) => {
    showbookmark(data);
  });

  setTimeout(() => {
    activateTooltips();
  }, 100);
}

function showbookmark(bookmark) {
  const bookmarks = document.getElementById("bookmark-container");

  const content = document.createElement("div");
  content.classList.add("content");
  content.setAttribute("url", bookmark.url);
  content.setAttribute("name", bookmark.name);

  const name = document.createElement("div");
  name.classList.add("name");
  name.innerHTML = bookmark.name;

  const btn = document.createElement("div");
  btn.classList.add("btn");
  btn.style.display = "flex";
  btn.style.flexDirection = "row";

  const play = createimage(images.playimg, "Play Bookmark", "play");

  const deleted = createimage(images.deleteimg, "Delete", "delete");

  const ai = createimage(images.aiimg, "AI Help", "ai");

  btn.append(play);
  btn.append(deleted);
  btn.append(ai);

  content.append(name);
  content.append(btn);

  bookmarks.appendChild(content);

  play.addEventListener("click", playclick);
  deleted.addEventListener("click", deleteclick);
  ai.addEventListener("click", aiclick);
}

function createimage(src, title, css) {
  const btn = document.createElement("img");
  btn.src = src;
  btn.id = `${title.toLowerCase()}-img`;
  btn.style.borderRadius = "50%";
  btn.style.cursor = "pointer";
  btn.classList.add("tooltip-btn");

  btn.setAttribute("data-bs-toggle", "tooltip");
  btn.setAttribute("data-bs-title", title);
  btn.setAttribute("data-bs-placement", "bottom");
  btn.setAttribute("data-bs-custom-class", `custom-tooltip-${css}`);
  return btn;
}

function getbookmarks() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("Bookmark", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const bookmarks = result.Bookmark;
        resolve(Array.isArray(bookmarks) ? bookmarks : []);
      }
    });
  });
}

function playclick(event) {
  const url = event.target.parentNode.parentNode.getAttribute("url");
  window.open(url, "_blank");
}

function deleteclick(event) {
  const content = event.target.parentNode.parentNode;
  const deletebookmark = content.getAttribute("name");

  const tooltipInstance = bootstrap.Tooltip.getInstance(event.target);
  if (tooltipInstance) {
    tooltipInstance.dispose();
  }

  content.remove();
  deletefromStorage(deletebookmark);

  setTimeout(checkbookmark, 100);
}

function deletefromStorage(deletebookmark) {
  chrome.storage.sync.get(["Bookmark"], (result) => {
    const bookmark = result["Bookmark"] || [];
    const updatedBookmarks = bookmark.filter(
      (data) => data.name !== deletebookmark
    );
    chrome.storage.sync.set({ Bookmark: updatedBookmarks });
  });
}

async function aiclick(event) {
  const content = event.target.closest(".content");
  if (!content) return;

  const url = content.getAttribute("url");
  if (!url) return;
  await chrome.tabs.update({ url });

  const name = "gcb-article";
  const description = await gettext(url, name);

  if (!description.text) {
    console.error("No description retrieved");
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: openChatboxWithText,
      args: [description.text],
    });
  });
}

function openChatboxWithText(text) {
  if (!document.getElementById("chatbox-container")) {
    showChatbox(text);
  } else {
    document.getElementById("inputBox").value = text;
  }
}

function checkbookmark() {
  const bookmark = document.getElementById("bookmark-container");
  if (!bookmark.hasChildNodes()) {
    bookmark.innerHTML = "<i>No Bookmarks Available</i>";
  }
}

async function gettext(url, className) {
  try {
    const response = await fetch(url);
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const selectorsToRemove = [
      "script",
      "style",
      ".modal",
      "#prog-assignment-lang",
      ".CodeMirror-lines",
      ".gcb-unit-header",
      ".gcb-submit-only-once",
      ".gcb-prog-assignment-button",
      ".gcb-submission-due-date",
      "#gcb-submit-form",
    ];
    selectorsToRemove.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((el) => el.remove());
    });

    const elements = doc.getElementsByClassName(className);
    if (!elements.length) return { text: "No description", images: [] };

    const extractedText = Array.from(elements)
      .map((el) => el.innerText.trim())
      .filter(Boolean)
      .join("\n");

    const imageUrls = Array.from(doc.querySelectorAll(`.${className} img`))
      .map((img) => img.src)
      .filter(Boolean);

    const base64Images = await Promise.all(imageUrls.map(fetchWithCorsBypass));

    return {
      text: extractedText || "No description",
      images: base64Images.filter(Boolean),
    };
  } catch (error) {
    console.error("Error in gettext:", error);
    return { text: "No description", images: [] };
  }
}

async function fetchWithCorsBypass(url) {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  try {
    const response = await fetch(proxyUrl + url);
    const blob = await response.blob();
    return await convertBlobToBase64(blob);
  } catch (error) {
    console.error("CORS Fetch Error:", error);
    return null;
  }
}

function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
