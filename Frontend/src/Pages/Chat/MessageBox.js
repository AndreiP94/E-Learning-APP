import React, { useState, useEffect } from "react";

const MessageBox = ({ onSeen, onWriting, onSendMessage, receivedMessages }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage !== "") {
      onSendMessage(newMessage);
    }
    setNewMessage("");
  };

  useEffect(() => {}, [receivedMessages]);
  if (receivedMessages[receivedMessages.length - 1] === "(citit)") {
    localStorage.setItem("seen", "true");
    localStorage.setItem("typing", "false");
  } else {
    if (receivedMessages[receivedMessages.length - 1] === "(typing...)") {
      localStorage.setItem("seen", "false");
      localStorage.setItem("typing", "true");
    } else {
      localStorage.setItem("seen", "false");
      localStorage.setItem("typing", "false");
    }
  }

  let loggedUser = localStorage.getItem("username");
  return (
    <div>
      <div
        onClick={onSeen}
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        {receivedMessages.map((message, index) =>
          message.message === "(citit)"
            ? (localStorage.setItem("seen", "true"),
              localStorage.setItem("typing", "false"))
            : message.message === "(typing...)"
            ? localStorage.setItem("typing", "true")
            : (localStorage.setItem("seen", "false"),
              localStorage.setItem("typing", "false"))
        )}
        {receivedMessages.map((message, index) =>
          message.message !== "(citit)" && message.message !== "(typing...)" ? (
            <div
              key={index}
              style={{
                padding: "10px",
                margin: "10px 0",
                borderRadius: "8px",
                backgroundColor:
                  message.sender.username === loggedUser
                    ? "#5cb85c"
                    : "#999999",
                color: "#fff",
                textAlign:
                  message.sender.username === loggedUser ? "left" : "right",
                marginLeft:
                  message.sender.username === loggedUser ? "auto" : "0",
                marginRight:
                  message.sender.username === loggedUser ? "0" : "auto",
                width: "fit-content",
              }}
            >
              {message.message}
            </div>
          ) : (
            <p />
          )
        )}
        {localStorage.getItem("typing") === "true" ? (
          <div style={{ textAlign: "left" }}>Typing...</div>
        ) : localStorage.getItem("seen") === "true" ? (
          <div style={{ textAlign: "right" }}> Seen</div>
        ) : (
          <p />
        )}
      </div>
      <div
        style={{ marginTop: "10px", position: "relative" }}
        onClick={onWriting}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            marginRight: "10px",
            border: "1px solid #ddd",
            outline: "1px solid #ddd",
            backgroundColor: "#fff",
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: "#5cb85c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageBox;