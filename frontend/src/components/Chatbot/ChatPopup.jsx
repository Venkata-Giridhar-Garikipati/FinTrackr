import React, { useState } from "react";
import Chatbot from "../Chatbot";

const ChatPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
                onClick={toggleChat}
            >
                💬
            </button>
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 bg-white shadow-xl rounded-lg">
                    <Chatbot/>
                </div>
            )}
        </div>
    );
};

export default ChatPopup;
