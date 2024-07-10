import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./eleviCursuri.css";
import ChatListPopup from "../Chat/ChatListPopup";

const EleviCursuri = () => {
  const [cursuri, setCursuri] = useState([]);
  const [selectedCurs, setSelectedCurs] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [titlu, setTitlu] = useState("");
  const [poza, setPoza] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [elev, setElev] = useState([]);
  const [saptamani, setSaptamani] = useState(1);
  const [editingMode, setEditingMode] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  const logOut = () => {
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchCursuri();
  }, []);
  const handlePhotoClick = () => {
    setIsPhotoModalOpen(true);
  };

  const handleChangePhoto = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      console.log(file);
      try {
        const response = await fetch(
          `http://localhost:8080/api/elevi/changePhoto/${elev.id}/${file.name}`,
          {
            method: "PUT",
          }
        );
        if (!response.ok) throw new Error("nu am putut face update la poza");
      } catch (error) {
        console.log("nu");
      }
    }
    setIsPhotoModalOpen(false);
    window.location.reload();
  };

  const fetchCursuri = async () => {
    let elevLocal = [];
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      console.log(username);
      const responseElev = await fetch(
        `http://localhost:8080/api/elevi/getElev/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!responseElev.ok) {
        throw new Error("Date despre elev nu au putut fi obținute!");
      } else {
        elevLocal = await responseElev.json();
        setElev(elevLocal);
        console.log(elevLocal);
      }

      const responseCursuri = await fetch(
        `http://localhost:8080/api/cursuri/elev/${elevLocal.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("am facut fetch");
      if (!responseCursuri.ok) {
        throw new Error("Date despre cursuri nu au putut fi obținute!");
      } else {
        const cursuri = await responseCursuri.json();
        console.log(cursuri);
        setCursuri(cursuri);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDocumentClick = () => {
    setMenuOpen(false);
  };
  const handleNote = () => {
    window.location.href = "/noteElev";
  };
  const handleCursClick = (cursId) => {
    localStorage.setItem("selectedCursId", cursId);
    window.location.href = `/cursElev/${cursId}`;
  };

  const closePopupChat = () => {
    setIsPopupChatOpened(false);
  };

  const getUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Date could not be fetched!");
      } else {
        const data = await response.json();
        setUsersListChat(data);
        setIsPopupChatOpened(true);
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="eleviCursuri-container" onClick={handleDocumentClick}>
      <header className="eleviCursuri-header">
        <h1>E-Learning </h1>
        <div className="header-content">
          <button className="eleviCursuri-option-button">Cursuri</button>
          <button className="eleviCursuri-option-button" onClick={handleNote}>
            Note
          </button>
          <button className="eleviCursuri-option-button" onClick={getUsers}>
            Chat
          </button>
          <button className="eleviCursuri-option-button" onClick={logOut}>
            Log Out
          </button>
          <ChatListPopup
            isOpen={isPopupChatOpene}
            userListChat={usersListChat}
            closePopupChat={closePopupChat}
          />
          {elev.pozaProfil ? (
            <img
              src={`/${elev.mail}/${elev.pozaProfil}`}
              onClick={handlePhotoClick}
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
            <div onClick={handlePhotoClick} className="initials-circle-header">
              {`${elev.nume?.charAt(0) ?? ""}${elev.prenume?.charAt(0) ?? ""}`}
            </div>
          )}
        </div>
      </header>

      <div className="eleviCursuri-large-boxes-container">
        {cursuri.map((curs, index) => (
          <div className="eleviCursuri-large-box" key={index}>
            <img src={`/Images/${curs.poza}`} alt={`Poza ${curs.titlu}`} />
            <div className="eleviCursuri-large-box-options">
              <p
                onClick={() => handleCursClick(curs.id)}
                className="link-stilizat"
                style={{ cursor: "pointer" }}
              >
                {curs.titlu}
              </p>
            </div>
          </div>
        ))}
      </div>

      <footer className="eleviCursuri-footer">
        <p>@2024copyright</p>
      </footer>
      {isPhotoModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              onClick={() => {
                setIsPhotoModalOpen(false);
              }}
              className="close-button"
            >
              ❌
            </button>
            <h3>Alege o poza de profil</h3>
            <input type="file" onChange={handleChangePhoto} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EleviCursuri;
