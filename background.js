const api1="AIzaSyBCngnMnnyo_Q3lzgk4QoaO5fLERw9ezMw";
const api2="AIzaSyA2UrPtSxvlQqWnzgd9nVlgQ2wSRLnnIDI";
const GEMINI_API_KEY = api2;

let chatHistory = [
    {
        role: "user",
        parts: [{
            text: `Main Prompt: You are an NPTEL mentor!
                    Provide the answers in HTML format (not entirely, just CSS and comment text tags like <b>,<i>, etc... for better visual appearance) so the response would render in HTML.
                    Topic: Identify the topic.
                    Hint: Provide a hint.
                    Explanation: Explain briefly.
                    Code: approach (if required in question and if code is given, it should be aligned properly like an actual working code and send the code inside the <pre> tag).
                    Do NOT provide the answer unless explicitly requested.
                    Provide me the response in the well-structured format with proper indentation and bold subtopics and also highlight the important points. Do not include any comments in your response.
                    If the question is not related to education, reply that you intend to help with NPTEL quizzes and not other irrelevant topics`
        }]
    }
];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchGeminiResponse") {
        fetchGeminiResponse(request.userMessage, chatHistory).then(response => {
            sendResponse({ aiResponse: response });
        }).catch(error => {
            console.error("Error in background.js (Text Query):", error);
            sendResponse({ aiResponse: "Oops! Something went wrong with text processing." });
        });
        return true;
    } 
    else if (request.action === "fetchGeminiImageResponse") {
        fetchGeminiImageResponse(request.imageData, chatHistory).then(response => {
            sendResponse({ aiResponse: response });
        }).catch(error => {
            console.error("Error in background.js (Image Query):", error);
            sendResponse({ aiResponse: "Oops! Something went wrong while processing the image." });
        });
        return true;
    }
    else if (request.action === "fetchGeminiUnifiedResponse") {
        fetchGeminiUnifiedResponse(request.userMessage, request.imageData, chatHistory).then(response => {
            sendResponse({ aiResponse: response });
        }).catch(error => {
            console.error("Error in background.js (Unified Query):", error);
            sendResponse({ aiResponse: "Oops! Something went wrong while processing the image and text." });
        });
        return true;
    }
});

async function fetchGeminiResponse(userMessage, chatHistory) {
    try {
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
        console.log(chatHistory);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: chatHistory
            })
        });

        const data = await response.json();
        console.log("Gemini API Text Response:", data);

        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that. Try again!";
        chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
        console.log(chatHistory);

        return aiResponse;
    } catch (error) {
        console.error("Error calling Gemini API (Text):", error);
        return "Oops! Something went wrong. Please try again.";
    }
}

async function fetchGeminiImageResponse(imageData, chatHistory) {
    try {
        chatHistory.push({ role: "user", parts: [{ text: "Analyze this image and provide details." }, { inlineData: { mimeType: "image/png", data: imageData } }] });
        console.log(chatHistory);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: chatHistory
            })
        });

        const data = await response.json();
        console.log("Gemini Vision API Response:", data);

        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't fully analyze the image. Please try another one!";
        chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });

        console.log(chatHistory);

        return aiResponse;
    } catch (error) {
        console.error("Error calling Gemini Vision API:", error);
        return "Oops! Something went wrong while processing the image.";
    }
}

async function fetchGeminiUnifiedResponse(userMessage, imageData, chatHistory) {
    try {
        console.log(chatHistory);

        let userParts = [];
        if (userMessage) {
            userParts.push({ text: userMessage });
        }
        if (imageData) {
            userParts.push({ inlineData: { mimeType: "image/png", data: imageData } });
        }

        chatHistory.push({ role: "user", parts: userParts });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: chatHistory
            })
        });

        const data = await response.json();
        console.log("Gemini API Unified Response:", data);

        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't analyze this.";
        chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
        console.log(chatHistory);

        return aiResponse;
    } catch (error) {
        console.error("Fetch Error in background.js:", error);
        return "Oops! Something went wrong while contacting Gemini API.";
    }
}