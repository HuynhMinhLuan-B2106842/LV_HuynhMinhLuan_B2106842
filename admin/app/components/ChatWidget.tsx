"use client";
import React, { useState } from "react";
import { X, SendHorizontal, User } from "lucide-react";

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Hàm gửi tin nhắn đến Rasa qua API REST
  const sendMessage = async () => {
    if (input.trim()) {
      // Hiển thị tin nhắn của người dùng
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);

      try {
        // Gửi tin nhắn đến Rasa qua API REST
        const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: "user", message: input }),
        });

        const data = await response.json();
        console.log("💬 Phản hồi từ bot:", data);

        // Gộp toàn bộ phản hồi từ bot thành một đoạn văn
        if (data.length > 0) {
          const botResponse = data.map((msg) => msg.text).join("\n"); // Giữ xuống dòng
          setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
        }
      } catch (error) {
        console.error("❌ Lỗi gửi tin nhắn:", error);
      }

      setInput("");
    }
  };

  return (
    <div>
      {/* Nút mở chat */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        🤖
      </button>

      {/* Hộp chat */}
      {showChat && (
        <div className="fixed bottom-16 right-4 w-1/3 bg-white shadow-lg rounded-lg">
              {/* Thanh tiêu đề */}
          <div className="flex items-center justify-between bg-blue-500 text-white p-3 rounded-t-lg">
            {/* Ảnh đại diện chatbot + Tên chatbot */}
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xl">
                🤖
              </span>
              <span className="font-semibold">Chatbot AI</span>
            </div>

            {/* Các icon thao tác */}
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowChat(false)} className="hover:text-gray-300 text-lg">
                <X />
              </button> {/* Đóng */}
            </div>
          </div>

          <div className="h-[500px] overflow-y-auto border-b p-2 space-y-2 flex flex-col">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full items-end ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Thêm icon 🤖 cho tin nhắn bot */}
                {msg.sender !== "user" && (
                  <span className="text-xl mr-2">🤖</span>
                )}
                
                <div
                  className={`p-3 rounded-2xl max-w-[60%] text-sm whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-300 text-black rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && <span className="text-xl ml-2"><User /></span>}
              </div>
            ))}
          </div>

          {/* Input gửi tin nhắn */}
          
          <div className="flex items-center bg-gray-100 rounded-full p-4 w-full">
          
            <input
              type="text"
              className="flex-1 bg-transparent outline-none px-4 text-black"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              className="bg-transparent text-blue-500 hover:text-blue-700 p-2"
              onClick={sendMessage}
            >
              <SendHorizontal size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
