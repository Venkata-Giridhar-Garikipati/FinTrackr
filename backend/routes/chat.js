const express = require('express');
const router = express.Router();
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY; // Make sure you have this in your .env file!
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp", // or any other model you prefer
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Initial Chat History Setup. This can be kept as a common base,
// or set dynamically based on user sessions.
const initialChatHistory = [
  {
    role: "user",
    parts: [
      {text: "your a chatbot for the lending management system the website name is fintrackr and when user asks anything about website you want to give reply orr else if user asks anything outside you should sorry we cant provide and as you can so give that "},
    ],
  },
  {
    role: "model",
    parts: [
      {text: "Okay, I understand. I'm now operating as a chatbot specifically for the Fintrackr lending management system. \n\nHere's how I'll respond:\n\n*   **If a user asks about Fintrackr features, functionality, or anything related to the website:** I will provide helpful and accurate information to the best of my abilities.\n*   **If a user asks something unrelated to Fintrackr:** I will politely reply with: \"I'm sorry, but I can only provide information about the Fintrackr lending management system. I can't help with questions outside of that.\"\n\nI'm ready for your questions about Fintrackr! Ask away!\n"},
    ],
  },
    {
        role: "user",
        parts: [
          {text: "how to add this in code\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, I can't give you specific code for *your* system because I don't know what language or framework you're using. However, I can give you a conceptual outline and examples in Python that demonstrate the logic of how you might implement this chatbot behavior.\n\n**Conceptual Outline**\n\n1.  **Get User Input:** Receive the user's question/message.\n2.  **Analyze the Input:**\n    *   Use techniques to determine if the input is relevant to Fintrackr (keywords, intent recognition, etc.).\n3.  **Generate Response:**\n    *   If the input is relevant to Fintrackr, generate an appropriate answer.\n    *   If the input is not relevant to Fintrackr, generate the \"I'm sorry\" response.\n4.  **Display Response:** Output the response to the user.\n\n**Python Examples**\n\nHere are a few ways you might approach this in Python:\n\n**Example 1: Simple Keyword Check**\n\n```python\ndef respond_to_user(user_input):\n    user_input = user_input.lower()\n\n    fintrackr_keywords = [\"fintrackr\", \"loan\", \"application\", \"borrow\", \"lend\", \"account\", \"payment\", \"dashboard\", \"reports\"]\n\n    is_fintrackr_related = False\n    for keyword in fintrackr_keywords:\n        if keyword in user_input:\n            is_fintrackr_related = True\n            break\n\n    if is_fintrackr_related:\n        # Replace with actual logic to respond to Fintrackr questions\n        if \"loan\" in user_input:\n             return \"I can help you with loan applications on Fintrackr\"\n        if \"account\" in user_input:\n             return \"I can help you with your Fintrackr account\"\n        else:\n            return \"I can help you with your Fintrackr questions.\"\n    else:\n        return \"I'm sorry, but I can only provide information about the Fintrackr lending management system. I can't help with questions outside of that.\"\n\n\n# Example Usage\nwhile True:\n  user_input = input(\"You: \")\n  if user_input.lower() == 'quit':\n     break\n  response = respond_to_user(user_input)\n  print(\"Chatbot:\", response)\n```\n\n**Explanation of Example 1:**\n\n*   `respond_to_user(user_input)`: This function takes user input.\n*   Keyword Matching: it has a list of keywords to identify related questions\n*   If a Keyword found it returns Fintrackr related information\n*   Otherwise, it returns the default \"I'm sorry...\" message\n\n**Example 2: Using a More Sophisticated Matching Technique (Simple Intent-Based)**\n```python\ndef respond_to_user(user_input):\n    user_input = user_input.lower()\n\n    if \"how do i\" in user_input and (\"loan\" in user_input or \"apply\" in user_input):\n         return \"To apply for a loan, navigate to the 'Loan Applications' section on your dashboard.\"\n    elif \"forgot my password\" in user_input or \"password reset\" in user_input:\n          return \"You can reset your password on the login page, please use the 'forgot password' button\"\n    elif \"reports\" in user_input or \"download data\" in user_input:\n          return \"You can access your reports from the reports section on the website\"\n\n    elif \"fintrackr\" in user_input or \"lend\" in user_input or \"account\" in user_input or \"payment\" in user_input:\n      return \"I can help you with your Fintrackr questions\"\n    else:\n        return \"I'm sorry, but I can only provide information about the Fintrackr lending management system. I can't help with questions outside of that.\"\n\n\n# Example Usage\nwhile True:\n  user_input = input(\"You: \")\n  if user_input.lower() == 'quit':\n     break\n  response = respond_to_user(user_input)\n  print(\"Chatbot:\", response)\n```\n\n**Explanation of Example 2:**\n\n*   This example uses \"if\" statements to perform simple intent matching using phrases or keywords.\n*   If none of the patterns matches it returns the \"I'm sorry...\" message\n\n**Important Considerations for Production Code:**\n\n*   **NLP/NLU Library:** For a more sophisticated chatbot, you'd likely want to use an NLP (Natural Language Processing) or NLU (Natural Language Understanding) library like:\n    *   **NLTK (Natural Language Toolkit)**: Good for tokenization, stemming, etc.\n    *   **spaCy:** Powerful for named entity recognition, etc.\n    *   **Transformers (Hugging Face):** State-of-the-art models for complex understanding.\n*   **Intent Classification:** You'll need a way to classify the user's intent (e.g., \"loan application\", \"password reset\") instead of relying only on simple keyword matching. This may involve building a model.\n*   **Database or API Connection:** If you need to access data (e.g., loan status, user information), you'll need to connect to a database or an API.\n*   **Error Handling:** Be sure to handle cases where the input is very ambiguous.\n*   **Maintainability:** Make your code modular, and easier to extend, as your needs evolve.\n\n**How to Integrate this into Your System:**\n1.  **Choose Your Language:** Decide what programming language and framework is the best suited for the Fintrackr application\n2.  **Adapt the Code:** Modify the provided Python examples to fit your project and add relevant responses based on the Fintrackr website.\n3.  **Connect to UI:**  Connect the chatbot logic to your website's UI so that the chatbot interacts with the users.\n\nI hope this gives you a good starting point! If you have more questions about specific aspects, please let me know!\n"},
        ],
      },
        {
        role: "user",
        parts: [
          {text: "in mern stack\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, let's adapt the concept to a MERN (MongoDB, Express.js, React.js, Node.js) stack. Here's a breakdown of how you could implement a basic chatbot with the described behavior in a MERN application:\n\n**1. Backend (Node.js with Express.js)**\n\n*   **Set up an API endpoint:** This endpoint will receive user messages and return chatbot responses.\n*   **Chatbot Logic:** The core logic will reside here, using techniques similar to those we discussed in the Python examples.\n\n   **`server/routes/chat.js` (Example)**\n   ```javascript\n   const express = require('express');\n   const router = express.Router();\n\n   router.post('/', (req, res) => {\n      const user_input = req.body.message.toLowerCase();\n\n\n      const respond_to_user = (user_input) =>{\n            if (\"how do i\" in user_input && (\"loan\" in user_input || \"apply\" in user_input)){\n                return \"To apply for a loan, navigate to the 'Loan Applications' section on your dashboard.\";\n            }\n            else if (\"forgot my password\" in user_input || \"password reset\" in user_input){\n              return \"You can reset your password on the login page, please use the 'forgot password' button\";\n            }\n            else if (\"reports\" in user_input || \"download data\" in user_input){\n              return \"You can access your reports from the reports section on the website\";\n            }\n            else if (\"fintrackr\" in user_input || \"lend\" in user_input || \"account\" in user_input || \"payment\" in user_input){\n              return \"I can help you with your Fintrackr questions\";\n            }\n            else{\n                return \"I'm sorry, but I can only provide information about the Fintrackr lending management system. I can't help with questions outside of that.\";\n            }\n      }\n\n     const response = respond_to_user(user_input);\n\n     res.json({ message: response });\n   });\n\n   module.exports = router;\n   ```\n\n   **`server/index.js` (Example of using `chat.js`)**\n   ```javascript\n     const express = require('express');\n     const cors = require('cors');\n     const app = express();\n     const chatRouter = require('./routes/chat');\n\n     app.use(cors());\n     app.use(express.json());\n     app.use('/api/chat', chatRouter); // Endpoint for chatbot\n\n     const port = process.env.PORT || 5000;\n     app.listen(port, () => console.log(`Server started on port ${port}`));\n   ```\n\n**2. Frontend (React.js)**\n\n*   **Create a Chat Component:** This component will manage the chat interface.\n*   **Send Messages to the Backend:** The component will send user messages to your API endpoint and receive the bot's responses.\n*   **Display Chat Messages:** The component will display both user and bot messages.\n\n**`client/src/components/Chatbot.js` (Example)**\n```jsx\n    import React, { useState } from 'react';\n    import axios from 'axios';\n\n    const Chatbot = () => {\n      const [messages, setMessages] = useState([]);\n      const [input, setInput] = useState('');\n\n      const handleInputChange = (event) => {\n        setInput(event.target.value);\n      };\n\n      const handleSendMessage = async () => {\n          if(input.trim() === '') return;\n\n        setMessages([...messages, { text: input, sender: 'user' }]);\n        setInput('');\n\n        try {\n            const response = await axios.post('http://localhost:5000/api/chat', { message: input });\n            setMessages([...messages, { text: response.data.message, sender: 'bot' }]);\n          } catch (error) {\n              console.error('Error sending message:', error);\n              setMessages([...messages, { text: 'Error communicating with chatbot', sender:'bot'}]);\n          }\n      };\n\n      return (\n        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', border: '1px solid #ccc' }}>\n          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>\n            {messages.map((message, index) => (\n              <div\n                key={index}\n                style={{\n                  padding: '10px',\n                  marginBottom: '5px',\n                  borderRadius: '5px',\n                  backgroundColor: message.sender === 'user' ? '#e0e0e0' : '#f0f0f0',\n                  textAlign: message.sender === 'user' ? 'right' : 'left',\n                }}\n              >\n                {message.text}\n              </div>\n            ))}\n          </div>\n          <div style={{ display: 'flex' }}>\n            <input\n              type=\"text\"\n              value={input}\n              onChange={handleInputChange}\n              style={{ flex: '1', padding: '10px', marginRight: '5px' }}\n            />\n            <button onClick={handleSendMessage} style={{ padding: '10px' }}>Send</button>\n          </div>\n        </div>\n      );\n    };\n\n    export default Chatbot;\n```\n\n**How To Use:**\n\n1.  **Setup** Ensure that you have a working MERN stack project, and have `nodemon`, `concurrently` packages installed\n2.  **Backend:**\n    *   Put the `server` folder inside the root folder of your MERN project\n    *   Run `npm install` in the `server` directory\n    *   Run the server `nodemon index.js` from the server directory\n3.  **Frontend:**\n    *   Put the `client` folder inside the root folder of your MERN project\n    *   Run `npm install` in the `client` directory\n    *   Run the app `npm start` from the `client` directory\n4.  **Testing:** Now you can test your Chatbot Component in your React app\n\n**Important Points for MERN Implementation**\n\n*   **`cors`:** The `cors` package allows communication between client and server running on different ports\n*   **`axios`:**  Used to send HTTP requests to the backend.\n*   **State Management:** For larger applications, you'll likely want to use a state management library (like Redux or Context API) to handle messages and chat state.\n*   **Styling:** Added basic styling to get a quick idea how to render the messages\n*   **Error Handling:** Included basic error handling for backend calls in the component\n*   **Modularity:** You can break down the chatbot component into more sub-components for better structure.\n\n**Key Improvements For a Real Application:**\n\n*   **More Robust Intent Matching:**  Use libraries (e.g., `natural`, `compromise`) or cloud-based NLP services (like Dialogflow, LUIS, or Amazon Lex).\n*   **Conversation Context:** Remember previous messages to understand more complex user inputs. This is usually done with session management and storing a conversation history.\n*   **Database Integration:** Connect to your database so the chatbot can look up data or perform actions.\n*   **User Authentication:** If users need to log in, integrate authentication into your chatbot.\n\nThis MERN example is more of a skeleton, and you will need to customize it for the specific needs of your Fintrackr application. Let me know if you'd like to dive deeper into a particular part of it!\n"},
        ],
      },
    
];

router.post('/', async (req, res) => {
    const user_input = req.body.message.toLowerCase();
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: initialChatHistory, // or retrieve from session if needed
      });

      const result = await chatSession.sendMessage(user_input);
      const responseText = result.response.text();

      res.json({ message: responseText });

    } catch (error) {
      console.error("Error using Gemini API:", error);
      res
      .status(500)
      .json({message: "Error generating chatbot response"});
    }
  });


module.exports = router;
