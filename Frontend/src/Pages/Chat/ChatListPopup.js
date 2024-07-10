import React from "react";
import "./chat.css";

const startChat = (emailSelectedUser) => {
  localStorage.setItem("emailSelectedFriend", emailSelectedUser);
  window.location.replace("http://localhost:3000/chat");
};

const ChatListPopup = ({
  isOpen,
  userListChat,
  closePopupChat,
  unreadMessages = [],
}) =>
  isOpen && (
    <div className="popup" onClick={closePopupChat}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={closePopupChat}>
          &times;
        </span>
        <div className="people-list">
          {userListChat.map((person) => (
            <div
              key={person.username}
              className="search-header"
              style={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #ccc",
                color: unreadMessages.includes(person.username)
                  ? "red"
                  : "black",
              }}
              onClick={() => startChat(person.username)}
            >
              {person.username}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

export default ChatListPopup;
