import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    try {
      const response = await axios.post('https://fintrackr-backend-l72z.onrender.com/api/chat', { message: input });
      setMessages([...messages, { text: response.data.message, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { text: 'Error communicating with chatbot', sender: 'bot' }]);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-md">
      <div className="max-h-[500px] overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 mb-2 rounded-md ${
              message.sender === 'user'
                ? 'bg-gray-200 text-right'
                : 'bg-gray-100 text-left'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-1 p-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
