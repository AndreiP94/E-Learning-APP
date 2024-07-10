import React from "react";
import MessageBox from "./MessageBox";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import ChatListPopup from "./ChatListPopup";

class Chat extends React.Component {
  constructor() {
    super();
    const loggedUser = localStorage.getItem("username");
    const idReceiver = localStorage.getItem("emailSelectedFriend");

    this.state = {
      messages: [],
      idReceiver: idReceiver,
      idSender: loggedUser,
      newMessage: "",
      seenFlagState: false,
      isPopupChatOpen: false,
      usersListChat: [],
      profesor: {},
      elev: {},
    };

    this.stompClient = null;
    this.flagSeen = false;
    this.flagTyping = false;
    localStorage.setItem("typing", "false");
    localStorage.setItem("seen", "false");
  }

  connect() {
    if (this.stompClient === null) {
      console.log("In Connect");
      const URL = "http://localhost:8080/api/v1/socket/messages";
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(URL),
        onConnect: () => {
          localStorage.setItem("seen", "false");
          this.subscribeToMessages();
          this.sendSeenNotification();
        },
      });

      this.stompClient.activate();
    }
  }

  subscribeToMessages() {
    this.stompClient.subscribe(
      `/topic/messages/${this.state.idReceiver}/${this.state.idSender}`,
      (notification) => {
        localStorage.setItem("seen", "false");
        let message = notification.body;
        let parsedMessage = JSON.parse(message);
        this.flagTyping = false;
        this.flagSeen = false;
        if (parsedMessage.message === "(citit)" && this.flagSeen) {
          return;
        } else if (parsedMessage.message === "(citit)") {
          this.flagSeen = true;
          this.state.flagSeenState = true;
          this.setState({ seenFlagState: true });
        }

        if (parsedMessage.message === "(typing...)" && this.flagTyping) {
          return;
        } else if (parsedMessage.message === "(typing...)") {
          this.flagTyping = true;
          this.flagSeen = true;
          localStorage.setItem("typing", "true");
        }

        this.setState((prevState) => ({
          messages: [...prevState.messages, parsedMessage],
        }));
      }
    );
  }

  sendSeenNotification() {
    const response = {
      sender: { username: this.state.idSender },
      receiver: { username: this.state.idReceiver },
      message: "(citit)",
      timestamp: new Date(),
    };

    const messageString = JSON.stringify(response);

    this.stompClient.publish({
      destination: `/topic/messages/${this.state.idSender}/${this.state.idReceiver}`,
      body: messageString,
    });
  }

  componentDidMount() {
    this.connect();
    this.fetchMessages();

    this.messageInterval = setInterval(this.fetchMessages, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.messageInterval);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.seenFlagState !== prevState.seenFlagState) {
    }
  }

  fetchMessages = () => {
    fetch(
      `http://localhost:8080/api/chat/getMessages/${this.state.idSender}/${this.state.idReceiver}`
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          messages: data,
        });
        this.markMessagesAsSeen();
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  markMessagesAsSeen = () => {
    const { idSender, idReceiver } = this.state;
    console.log(this.state.idSender);
    fetch(
      `http://localhost:8080/api/chat/markMessagesAsSeen?receiverUsername=${idSender}&senderUsername=${idReceiver}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(() => {
        console.log("Messages marked as seen");
      })
      .catch((error) => {
        console.error("Error marking messages as seen:", error);
      });
  };

  handleSendMessage = (newMessage) => {
    console.log(this.state.idSender);
    const messagePayload = {
      sender: { username: this.state.idSender },
      receiver: { username: this.state.idReceiver },
      message: newMessage,
    };

    fetch("http://localhost:8080/api/chat/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Message sent successfully:", data);
        this.setState((prevState) => ({
          messages: [...prevState.messages, data],
        }));
        this.flagSeen = false;
        this.flagTyping = false;
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  handleSeen = () => {
    const response1 = {
      sender: { username: this.state.idReceiver },
      receiver: { username: this.state.idSender },
      message: "(citit)",
    };

    const messageString = JSON.stringify(response1);

    this.stompClient.publish({
      destination: `/topic/messages/${this.state.idSender}/${this.state.idReceiver}`,
      body: messageString,
    });
  };

  handleWriting = () => {
    console.log("In handleWriting");

    if (this.stompClient !== null) {
      const response = {
        sender: { username: this.state.idReceiver },
        receiver: { username: this.state.idSender },
        message: "(typing...)",
      };

      const messageString = JSON.stringify(response);

      this.stompClient.publish({
        destination: `/topic/messages/${this.state.idSender}/${this.state.idReceiver}`,
        body: messageString,
      });
    }
  };

  handleRezultateElevi = () => {
    window.location.href = "/rezultateElevi";
  };

  logOut = () => {
    window.location.href = "/login";
  };

  backToCurs = () => {
    window.location.href = "/profesoriCursuri";
  };

  closePopupChat = () => {
    this.setState({ isPopupChatOpen: false });
  };

  handlePaginaCurs = () => {
    window.location.href = "/eleviCursuri";
  };

  handleNote = () => {
    window.location.href = "/noteElev";
  };

  renderHeader = () => {
    const role = localStorage.getItem("role");
    const { isPopupChatOpen, usersListChat, profesor, elev } = this.state;

    if (role === "profesor") {
      return (
        <header className="profesorCursuri-header">
          <h1>E-Learning </h1>
          <div className="header-content">
            <button
              className="profesorCursuri-option-button"
              onClick={this.backToCurs}
            >
              Cursuri
            </button>
            <button
              className="profesorCursuri-option-button"
              onClick={this.handleRezultateElevi}
            >
              Rezultate Elevi
            </button>

            <ChatListPopup
              isOpen={isPopupChatOpen}
              userListChat={usersListChat}
              closePopupChat={this.closePopupChat}
            />
            <button
              className="profesorCursuri-option-button"
              onClick={this.logOut}
            >
              Log Out
            </button>
          </div>
        </header>
      );
    } else {
      return (
        <header className="eleviCursuri-header">
          <h1>E-Learning </h1>
          <div className="header-content">
            <button
              className="eleviCursuri-option-button"
              onClick={this.handlePaginaCurs}
            >
              Cursuri
            </button>
            <button
              className="eleviCursuri-option-button"
              onClick={this.handleNote}
            >
              Note
            </button>
            <button
              className="eleviCursuri-option-button"
              onClick={this.logOut}
            >
              Log Out
            </button>
            <ChatListPopup
              isOpen={isPopupChatOpen}
              userListChat={usersListChat}
              closePopupChat={this.closePopupChat}
            />
            {elev.pozaProfil ? (
              <img
                src={`/${elev.mail}/${elev.pozaProfil}`}
                onClick={this.handlePhotoClick}
                alt={`${elev.nume.charAt(0)} ${elev.prenume.charAt(0)}`}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              />
            ) : (
              <div
                onClick={this.handlePhotoClick}
                className="initials-circle-header"
              >
                {`${elev.nume?.charAt(0) ?? ""}${
                  elev.prenume?.charAt(0) ?? ""
                }`}
              </div>
            )}
          </div>
        </header>
      );
    }
  };

  render() {
    if (localStorage.getItem("clientLogged") === "false") {
      console.log(localStorage.getItem("clientLogged") === "false");
      window.location.replace("http://localhost:3000/");
    } else {
      return (
        <React.Fragment>
          {this.renderHeader()}
          <div
            style={{
              maxWidth: "600px",
              margin: "auto",
              padding: "20px",
              marginTop: "80px",
              marginBottom: "100px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  color: "#333",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
              >
                {this.state.idReceiver}{" "}
              </h2>
            </div>

            <MessageBox
              onSeen={this.handleSeen}
              onWriting={this.handleWriting}
              onSendMessage={this.handleSendMessage}
              receivedMessages={this.state.messages}
            />
          </div>
        </React.Fragment>
      );
    }
  }
}

export default Chat;
