import React, { useState, useEffect } from "react";
import "./noteElev.css";
import ChatListPopup from "../Chat/ChatListPopup";

const NoteElev = () => {
  const [incercari, setIncercari] = useState([]);
  const [titluFiltrat, setTitluFiltrat] = useState("");
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [elev, setElev] = useState([]);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  useEffect(() => {
    fetchIncercari();
  }, []);

  const fetchIncercari = async () => {
    const email = localStorage.getItem("username");
    let elevLocal = [];
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/incercari-quiz/getIncercariElev/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Could not fetch attempts.");
      }
      const incercariData = await response.json();
      setIncercari(incercariData);
      console.log(incercariData);
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
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
  };

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

  const logOut = () => {
    window.location.href = "/login";
  };

  const handlePaginaCurs = () => {
    window.location.href = "/eleviCursuri";
  };

  const handleFilterChange = (event) => {
    setTitluFiltrat(event.target.value);
  };

  const filteredIncercari = titluFiltrat
    ? incercari.filter((inc) => inc.quiz.curs.titlu === titluFiltrat)
    : incercari;
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
    <div className="eleviCursuri-container">
      <header className="eleviCursuri-header">
        <h1>E-Learning</h1>
        <div className="header-content">
          <button
            className="eleviCursuri-option-button"
            onClick={handlePaginaCurs}
          >
            Cursuri
          </button>
          <button className="eleviCursuri-option-button">Note</button>
          <button className="eleviCursuri-option-button" onClick={getUsers}>
            Chat
          </button>
          <ChatListPopup
            isOpen={isPopupChatOpene}
            userListChat={usersListChat}
            closePopupChat={closePopupChat}
          />
          <button className="eleviCursuri-option-button" onClick={logOut}>
            Log Out
          </button>
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

      <div>
        <select
          value={titluFiltrat}
          onChange={handleFilterChange}
          className="course-select"
        >
          <option value="">Selectează un curs</option>
          {[...new Set(incercari.map((item) => item.quiz.curs.titlu))].map(
            (titlu) => (
              <option key={titlu} value={titlu}>
                {titlu}
              </option>
            )
          )}
        </select>

        <table>
          <thead>
            <tr>
              <th>Titlu Curs</th>
              <th>Titlu Quiz</th>
              <th>Scor</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncercari.map((inc, index) => (
              <tr key={index}>
                <td>{inc.quiz.curs.titlu}</td>
                <td>{inc.quiz.titlu}</td>
                <td>{inc.scor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="eleviCursuri-footer">
        <p>@2024 Copyright</p>
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

export default NoteElev;
