const bookmarkimg = chrome.runtime.getURL("assets/bookmark.png");

const observer = new MutationObserver(() => {
  addFloatingButton();
});

observer.observe(document.body, { childList: true, subtree: true });

addFloatingButton();

function injectBootstrapIcons() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";
  document.head.appendChild(link);
}

injectBootstrapIcons();

function addFloatingButton() {
  if (document.getElementById("floating-ai-button")) return;

  const floatbtn = document.createElement("div");
  floatbtn.id = "floating-ai-button";
  floatbtn.innerHTML = '<i class="bi bi-lightbulb-fill"></i>';

  floatbtn.style.position = "fixed";
  floatbtn.style.bottom = "85px";
  floatbtn.style.right = "20px";
  floatbtn.style.width = "50px";
  floatbtn.style.height = "50px";
  floatbtn.style.borderRadius = "50%";
  floatbtn.style.backgroundColor = "#993333";
  floatbtn.style.color = "white";
  floatbtn.style.display = "flex";
  floatbtn.style.justifyContent = "center";
  floatbtn.style.alignItems = "center";
  floatbtn.style.fontSize = "24px";
  floatbtn.style.cursor = "pointer";
  floatbtn.style.zIndex = "99999";
  floatbtn.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
  floatbtn.style.userSelect = "none";

  const bookmarkbtn = addBookmarkbutton();

  document.body.appendChild(floatbtn);
  if (bookmarkbtn) {
    document.body.appendChild(bookmarkbtn);
    bookmarkbtn.addEventListener("click", bookmark);
  }

  floatbtn.addEventListener("click", toggleChatbox);

  console.log("Floating buttons added!..");
}

function addBookmarkbutton() {
  if (document.getElementById("bookmark-img")) return;

  if (!checkurl()) return null;

  const bookmarkbtn = document.createElement("img");
  bookmarkbtn.src = bookmarkimg;
  bookmarkbtn.id = "bookmark-img";
  bookmarkbtn.style.position = "fixed";
  bookmarkbtn.style.bottom = "150px";
  bookmarkbtn.style.right = "20px";
  bookmarkbtn.style.width = "50px";
  bookmarkbtn.style.height = "50px";
  bookmarkbtn.style.borderRadius = "50%";
  bookmarkbtn.style.cursor = "pointer";
  bookmarkbtn.style.zIndex = "99999";
  bookmarkbtn.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
  bookmarkbtn.style.userSelect = "none";
  bookmarkbtn.style.backgroundColor = "ghostwhite";

  console.log("In the Programming Page!..");
  return bookmarkbtn;
}

function checkurl() {
  const url = window.location.href;
  let c = 0;
  for (let i = 0; i < url.length; i++) {
    if (url[i] === "/") {
      c++;
      if (c === 4) {
        return url[i + 1] && url[i + 1] === "p";
      }
    }
  }
  return false;
}

function toggleChatbox() {
  const box = document.getElementById("chatbox-container");

  if (box) {
    box.remove();
  } else {
    showChatbox();
  }
}

async function bookmark() {
  const existbookmark = await getbookmarks();
  const taburl = window.location.href;
  const progname =
    document.getElementsByClassName("gcb-unit-header")[0].innerText.trim() ||
    "Unnamed";

  if (existbookmark.some((data) => data.name === progname)) {
    alert("Bookmark Already Exists");
    return;
  }

  const bookmarkobj = {
    url: taburl,
    name: progname,
  };
  const newobj = [...existbookmark, bookmarkobj];

  chrome.storage.sync.set({ Bookmark: newobj }, () => {
    alert("Bookmark Added!..");
  });
}

function getbookmarks() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("Bookmark", (result) => {
      if (chrome.runtime.lastError) {
        reject([]);
      } else {
        const bookmarks = result.Bookmark;
        resolve(Array.isArray(bookmarks) ? bookmarks : []);
      }
    });
  });
}

function showChatbox(preFilledMessage = "") {
  if (document.getElementById("chatbox-container")) return;

  const box = document.createElement("div");
  box.id = "chatbox-container";

  Object.assign(box.style, {
    position: "fixed",
    bottom: "150px",
    right: "20px",
    width: "450px",
    height: "560px",
    border: "2px solid #993333",
    borderRadius: "15px",
    backgroundColor: "white",
    zIndex: "99999",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
    fontFamily: "Arial, sans-serif",
  });

  const chatHeader = document.createElement("div");
  chatHeader.id = "chat-header";

  Object.assign(chatHeader.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  });

  const chatTitle = document.createElement("span");
  chatTitle.innerText = "NPTEL AI Help !";
  chatTitle.style.fontSize = "18px";
  chatTitle.style.fontWeight = "bold";
  chatTitle.style.color = "#993333";

  const closebtn = document.createElement("button");
  closebtn.innerHTML = '<i class="bi bi-x-circle"></i>';
  closebtn.title = "Close";
  Object.assign(closebtn.style, {
    background: "none",
    color: "red",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    fontSize: "19px",
    fontWeight: "bold",
  });
  closebtn.addEventListener("click", () => box.remove());

  const trashbtn = document.createElement("button");
  trashbtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
  trashbtn.title = "Delete";

  Object.assign(trashbtn.style, {
    background: "none",
    color: "black",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    fontSize: "19px",
    fontWeight: "bold",
  });

  const aihelp = document.createElement("button");
  aihelp.title = "Read Content";

  aihelp.innerHTML = '<i class="bi bi-file-earmark-break-fill"></i>';
  Object.assign(aihelp.style, {
    background: "none",
    color: "black",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    fontSize: "19px",
    fontWeight: "bold",
    marginLeft: "200px",
  });

  const chatMessages = document.createElement("div");
  chatMessages.id = "chatbox";

  Object.assign(chatMessages.style, {
    flex: "1",
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  });

  closebtn.addEventListener("click", () => box.remove());

  trashbtn.addEventListener("click", () => {
    const pageKey = window.location.href;
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
    delete chatHistory[pageKey];
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    const usermsg = document.querySelectorAll("#usermsg");
    const aimsg = document.querySelectorAll("#aimsg");
    if (usermsg) {
      usermsg.forEach((el) => el.remove());
    }
    if (aimsg) {
      aimsg.forEach((el) => el.remove());
    }
  });

  chatHeader.appendChild(chatTitle);
  chatHeader.appendChild(aihelp);
  chatHeader.appendChild(trashbtn);
  chatHeader.appendChild(closebtn);

  dragElement(box, chatHeader);

  const imagePreviewContainer = document.createElement("div");
  Object.assign(imagePreviewContainer.style, {
    display: "none",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  });

  const imagePreview = document.createElement("img");
  Object.assign(imagePreview.style, {
    maxWidth: "50px",
    maxHeight: "100px",
    borderRadius: "5px",
    marginRight: "10px",
  });

  const removeFileBtn = document.createElement("span");
  removeFileBtn.innerHTML = '<i class="bi bi-x"></i>';
  Object.assign(removeFileBtn.style, {
    color: "red",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  });

  removeFileBtn.addEventListener("click", () => {
    selectedFile = null;
    imagePreviewContainer.style.display = "none";
    imagePreview.src = "";
    fileInput.value = "";
  });

  imagePreviewContainer.appendChild(imagePreview);
  imagePreviewContainer.appendChild(removeFileBtn);

  const inputContainer = document.createElement("div");
  Object.assign(inputContainer.style, {
    display: "flex",
    alignItems: "center",
    borderRadius: "15px",
    padding: "10px",
    borderTop: "1px solid #ccc",
    backgroundColor: "white",
  });

  const chatInput = document.createElement("textarea");
  chatInput.id = "inputBox";
  chatInput.placeholder = "Message AI Help...";
  Object.assign(chatInput.style, {
    flex: "1",
    border: "none",
    padding: "10px",
    fontSize: "16px",
    outline: "none",
    borderRadius: "5px",
    backgroundColor: "#f5f5f5",
    maxHeight: "120px",
    minHeight: "40px",
    resize: "none",
    overflowY: "auto",
  });

  chatInput.addEventListener("input", () => {
    chatInput.style.height = "40px";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
  });

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  fileInput.id = "imageUpload";

  const fileBtn = document.createElement("button");
  fileBtn.innerText = "+";
  Object.assign(fileBtn.style, {
    border: "none",
    background: "#F5F5F5",
    borderRadius: "50%",
    fontSize: "28px",
    cursor: "pointer",
    marginLeft: "10px",
    color: "#555",
  });

  fileBtn.addEventListener("click", () => fileInput.click());

  const sendBtn = document.createElement("button");
  sendBtn.id = "sendBtn";
  sendBtn.innerHTML = '<i class="bi bi-send"></i>';
  Object.assign(sendBtn.style, {
    backgroundColor: "black",
    color: "white",
    fontSize: "40px",
    fontWeight: "bolder",
    border: "none",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    cursor: "pointer",
    marginLeft: "10px",
  });

  let selectedFile = null;

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreviewContainer.style.display = "flex";
      };
      reader.readAsDataURL(file);
    }
  });

  function sendMessage(userMessage) {
    const message = userMessage;
    if (message === "" && !selectedFile) return;

    const messageContainer = document.createElement("div");
    messageContainer.id = "usermsg";
    Object.assign(messageContainer.style, {
      background: "#f1f1f1",
      padding: "10px",
      borderRadius: "5px",
      marginBottom: "10px",
      maxWidth: "80%",
      alignSelf: "flex-end",
      display: "flex",
      flexDirection: "column",
    });

    if (selectedFile) {
      const sentImage = document.createElement("img");
      sentImage.src = imagePreview.src;
      Object.assign(sentImage.style, {
        maxWidth: "150px",
        borderRadius: "5px",
        marginBottom: "5px",
      });

      messageContainer.appendChild(sentImage);
    }

    if (message) {
      const textElement = document.createElement("span");
      textElement.innerText = message;
      messageContainer.appendChild(textElement);
    }

    chatMessages.appendChild(messageContainer);
    chatInput.value = "";
    chatInput.style.height = "40px";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    selectedFile = null;
    imagePreviewContainer.style.display = "none";
    imagePreview.src = "";
    fileInput.value = "";

    const existingGreeting = document.getElementById("greeting-message");
    if (existingGreeting) {
      existingGreeting.remove();
    }
  }

  function setResponse(aiResponse) {
    const reply = document.createElement("div");
    reply.innerHTML = aiResponse;
    reply.id = "aimsg";

    Object.assign(reply.style, {
      background: "bisque",
      padding: "10px",
      borderRadius: "5px",
      marginBottom: "10px",
      maxWidth: "80%",
      alignSelf: "flex-start",
      display: "flex",
      flexDirection: "column",
    });

    chatMessages.appendChild(reply);
  }

  const greetingMessage = document.createElement("div");
  greetingMessage.id = "greeting-message";
  greetingMessage.innerText =
    loadChatHistory() ||
    "👋 Hello I'm AI Help!. How can I help you today. Please describe your request in detail. Include details about what you want, what sort of answers you are looking for and any specific details";

  Object.assign(greetingMessage.style, {
    background: "none",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    maxWidth: "100%",
    alignSelf: "flex-start",
    display: "flex",
    flexDirection: "column",
  });

  chatMessages.appendChild(greetingMessage);

  inputContainer.append(chatInput, fileBtn, fileInput, sendBtn);
  box.append(chatHeader, chatMessages, imagePreviewContainer, inputContainer);
  document.body.appendChild(box);

  const sendBtnElement = document.getElementById("sendBtn");

  function setThinkingMessage() {
    const thinkingMessage = document.createElement("div");
    thinkingMessage.id = "thinking-message";
    thinkingMessage.style.display = "flex";
    thinkingMessage.style.justifyContent = "left";
    thinkingMessage.style.alignItems = "left";
    thinkingMessage.style.margin = "10px 0";

    const gif1 =
      "https://i.pinimg.com/originals/9c/2c/d3/9c2cd35a7e7ee54fea82835c416e8557.gif";
    const gif2 =
      "https://i.pinimg.com/originals/06/75/dd/0675ddc61014768a68fe9ab33a43f342.gif";
    const gif3 =
      "https://i.pinimg.com/originals/1a/61/7d/1a617d2d9f009d305fe0a77ee8db9b62.gif";

    const thinkingGif = document.createElement("img");
    thinkingGif.src = gif3;
    thinkingGif.alt = "Thinking...";
    thinkingGif.style.width = "60px";
    thinkingGif.style.height = "60px";

    thinkingMessage.appendChild(thinkingGif);
    document.getElementById("chatbox").appendChild(thinkingMessage);

    return thinkingMessage;
  }

  async function fetchAI(userMessage = "") {
    const inputBox = document.getElementById("inputBox");
    const chatbox = document.getElementById("chatbox");
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];

    userMessage = inputBox.value.trim();
    let base64Image = file ? await convertImageToBase64(file) : null;

    if (!userMessage && !file) return;

    sendMessage(userMessage);
    inputBox.value = "";
    fileInput.value = "";

    const thinkingMessage = setThinkingMessage();
    chatMessages.appendChild(thinkingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let aiResponse;

    if (userMessage && base64Image) {
      aiResponse = await fetchGeminiUnifiedResponse(userMessage, base64Image);
    } else if (base64Image) {
      aiResponse = await fetchGeminiImageResponse(base64Image);
    } else {
      aiResponse = await fetchGeminiResponse(userMessage);
    }

    chatMessages.removeChild(thinkingMessage);
    setResponse(aiResponse);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    userChat = userMessage
      ? userMessage
      : null + base64Image
      ? "image:" + base64Image
      : null;
    saveChatHistory(userChat, aiResponse);
  }

  if (sendBtnElement) {
    sendBtnElement.addEventListener("click", fetchAI);
  } else {
    console.error("sendBtn not found in the DOM.");
  }

  if (preFilledMessage) {
    const res = async (msg) => {
      const userMessage = "Analyse the Assignment on current page";
      sendMessage(userMessage);

      const thinkingMessage = setThinkingMessage();
      chatMessages.appendChild(thinkingMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      aiResponse = await fetchGeminiResponse(
        "I have a DOM Content programming assignment question from NPTEL. Please analyze it and provide the following:\n\
          1. Topic : (Identify the main concept the assignment focuses on.)\n\
          2. Approach : (Explain how to solve the problem step by step.)\n\
          3. Explanation : (Provide a detailed breakdown of the logic used.)\n\
          4. Code : (Give Complete Algorithm and ask the user which does he prefer if he replies give accordingly within pre tag)" +
          "The Question In DOM Content : " +
          msg
      );
      chatMessages.removeChild(thinkingMessage);
      setResponse(aiResponse);

      chatMessages.scrollTop = chatMessages.scrollHeight;
      userChat = userMessage
        ? userMessage
        : null + base64Image
        ? "image:" + base64Image
        : null;
      saveChatHistory(userChat, aiResponse);
    };
    res(preFilledMessage);
  }

  function loadChatHistory() {
    const pageKey = window.location.href;
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
    let pageChatHistory = chatHistory[pageKey] || [];

    pageChatHistory.forEach((entry) => {
      if (entry.role === "user") {
        sendMessage(entry.text);
      } else if (entry.role === "ai") {
        setResponse(entry.text);
      }
    });

    setTimeout(() => {
      const chatMessages = document.getElementById("chatbox");
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }

  function saveChatHistory(userChat, aiResponse) {
    const pageKey = window.location.href;
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};

    if (!chatHistory[pageKey]) {
      chatHistory[pageKey] = [];
    }

    chatHistory[pageKey].push({ role: "user", text: userChat });
    chatHistory[pageKey].push({ role: "ai", text: aiResponse });

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }

  aihelp.addEventListener("click", async () => {
    const elements = document.getElementsByClassName("gcb-button-box")[0];
    const about = document.getElementsByClassName("video-vtt-div")[0];

    if (elements && about) {
      const userMessage = "Analyse the Video on Current Page";

      sendMessage(userMessage);

      const thinkingMessage = setThinkingMessage();
      chatMessages.appendChild(thinkingMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      const extractedText = elements.innerText.trim();

      const aires = await fetchGeminiResponse(
        "Here is a video transcript. Please analyze it and provide the following:\n\
    1. Topic : (Identify the main subject of the video.)\n\
    2. Important Notes : (List key points covered in the video.)\n\
    3. Brief Summary : (Summarize the video's content concisely.)\n\
    4. Quiz Questions : (Generate five questions to test my understanding.)" +
          " Video Transcript : " +
          extractedText
      );

      chatMessages.removeChild(thinkingMessage);
      setResponse(aires);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      userChat = userMessage
        ? userMessage
        : null + base64Image
        ? "image:" + base64Image
        : null;
      saveChatHistory(userChat, aires);
    } else if (elements) {
      const userMessage = "Analyse the Quiz on Current Page";
      sendMessage(userMessage);

      const thinkingMessage = setThinkingMessage();
      chatMessages.appendChild(thinkingMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      const selectorsToRemove = [
        "script",
        "style",
        ".modal",
        ".gcb-submit-only-once",
        ".gcb-submission-due-date",
        "#gcb-submit-form",
        ".assessment-top-info",
        ".submission-info",
        ".assessment-pop-up",
        ".modal.fade",
        ".gcb-html-hook",
      ];

      selectorsToRemove.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });
      const extractedText = elements.innerText.trim();

      const aires = await fetchGeminiResponse(
        "I have sent you the DOM Content of all the quiz Questions now,analyze each question and give response in following manner for each question \n\
    1.Question : (Give the short Description of it)\n\
    2.Solution : (Solution of the problem) \n\
    3. Reason : (Reason for the given Answer)" +
          "The Content in the  DOM : " +
          extractedText
      );

      chatMessages.removeChild(thinkingMessage);
      setResponse(aires);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      userChat = userMessage
        ? userMessage
        : null + base64Image
        ? "image:" + base64Image
        : null;
      saveChatHistory(userChat, aires);
    } else {
      const userMessage = "Analyse the Content on Current Page";
      sendMessage(userMessage);

      const thinkingMessage = setThinkingMessage();
      chatMessages.appendChild(thinkingMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      const selectorsToRemove = ["script", "style"];

      selectorsToRemove.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });
      const extractedText = document.body.innerText.trim();

      const aires = await fetchGeminiResponse(
        "I have a DOM Content programming assignment question from NPTEL. Please analyze it and provide the following:\n\
          1. Topic : (Identify the main concept the assignment focuses on.)\n\
          2. Approach : (Explain how to solve the problem step by step.)\n\
          3. Explanation : (Provide a detailed breakdown of the logic used.)\n\
          4. Code : (Give Complete Algorithm and ask the user which does he prefer if he replies give accordingly within pre tag)" +
          "The Question In DOM Content : " +
          extractedText +
          "If Program Question not Exist reply Accordingly to the DOM Content"
      );
      chatMessages.removeChild(thinkingMessage);
      setResponse(aires);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      userChat = userMessage
        ? userMessage
        : null + base64Image
        ? "image:" + base64Image
        : null;
      saveChatHistory(userChat, aires);
    }
  });
}

function dragElement(elmnt, header) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  header.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

async function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
}

async function fetchGeminiResponse(userMessage, chatHistory) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "fetchGeminiResponse", userMessage, chatHistory },
      (response) => {
        resolve(response?.aiResponse || "Oops! Something went wrong.");
      }
    );
  });
}

async function fetchGeminiImageResponse(imageBase64, chatHistory) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        action: "fetchGeminiImageResponse",
        imageData: imageBase64,
        chatHistory,
      },
      (response) => {
        resolve(response?.aiResponse || "Oops! Something went wrong.");
      }
    );
  });
}

async function fetchGeminiUnifiedResponse(
  userMessage,
  imageBase64,
  chatHistory
) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        action: "fetchGeminiUnifiedResponse",
        userMessage,
        imageData: imageBase64,
        chatHistory,
      },
      (response) => {
        resolve(response?.aiResponse || "Oops! Something went wrong.");
      }
    );
  });
}
