# Nptel-Chrome-Extension-Ai-Helper

## Overview
Nptel-Chrome-Extension-Ai-Helper is a Chrome extension designed to enhance the learning experience on the NPTEL website by providing an AI-powered chatbot and bookmarking functionalities. The chatbot assists with quiz solutions, programming assignments, and other relevant queries while ensuring that irrelevant questions are ignored.

## Technologies Used
- **HTML, CSS, JavaScript** for the extension frontend.
- **Chrome Extension API** for interaction with web pages.
- **Local Storage API** for storing chat history and bookmarks.
- **Gemini AI API** for chatbot responses.

## Features

### Chatbot Functionality
1. **Toggle Chatbot Button**: A button on the webpage toggles the chatbot on and off. The chatbot includes:
   - A text area for writing messages.
   - An option to add images.
   - A send button to submit queries.

2. **Draggable Chatbox**: Users can drag the chatbot to any location on the webpage for convenience.

3. **Multi-Input Support**: The chatbot supports text, image inputs, and mixed inputs.

4. **Context-Aware Responses**: The chatbot only responds to queries relevant to the NPTEL website and ignores unrelated questions.

5. **Persistent Chat History**:
   - Chat history is retained when the chatbox is closed and reopened.
   - Each webpage maintains a separate local storage, so chat history persists on individual pages.

6. **Additional Chatbox Features**:
   - **AI Help Button**: Extracts content from the webpage and provides relevant assistance.
     - If on a quiz page, it helps with quiz solutions.
     - If on a programming assignment page, it provides problem descriptions, algorithms, and code suggestions.
   - **Delete History Button**: Clears the chat history.
   - **Close Button**: Closes the chatbot.

### Bookmark Functionality
7. **Bookmark Button (Programming Assignment Pages Only)**:
   - If a bookmark already exists for the page, an "Existing Bookmark" label is shown.
   
8. **Popup Bookmark Viewer**:
   - When the extension icon is clicked, a popup displays all saved bookmarks.
   - Each bookmark has the following options:
     - **Play Button**: Opens the bookmarked page.
     - **Delete Button**: Removes the bookmark.
     - **AI Help Button**: Reloads the bookmarked page, opens the chatbot, and provides relevant AI-generated responses based on the page content.

## Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/your-username/Nptel-Chrome-Extension-Ai-Helper.git
   ```
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer Mode" (toggle at the top-right corner).
4. Click "Load unpacked" and select the cloned repository folder.
5. The extension is now installed and ready to use.

## Usage
- Navigate to an NPTEL webpage.
- Click the chatbot toggle button to interact with the AI assistant.
- Use the AI Help button for webpage-based assistance.
- Bookmark programming assignment pages and manage bookmarks from the extension popup.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Output

![Chatbot](https://github.com/user-attachments/assets/6b48edac-2bac-42c7-82bc-c2924e524c82)

![Chatbot with Response](https://github.com/user-attachments/assets/128f91df-c5ed-4582-9fcf-2dd8dee1ec50)

![ChatBot view](https://github.com/user-attachments/assets/40ea2ec5-b785-44a7-a308-d66a9b38e557)

![Bookmark Popup](https://github.com/user-attachments/assets/bbe868c9-1619-40f3-a1df-e189c47ec28b)

![Bookmark and Chatbot Button](https://github.com/user-attachments/assets/aa6b16c1-f142-4f0a-92fa-5f6c20637af8)
