import React, { useState, useEffect } from "react";
import "./rezultateElevi.css";
import ChatListPopup from "../Chat/ChatListPopup";

const RezultateElevi = () => {
  const [incercari, setIncercari] = useState([]);
  const [cursSelectat, setCursSelectat] = useState("");
  const [quizSelectat, setQuizSelectat] = useState("");
  const [profesor, setProfesor] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  useEffect(() => {
    handleProfesor();
    fetchIncercari();
  }, []);

  const handleProfesor = async () => {
    console.log("handleProfesor is called");
    const emailProfesor = localStorage.getItem("username");
    console.log(emailProfesor);
    const token = localStorage.getItem("token");
    try {
      const responseProfesor = await fetch(
        `http://localhost:8080/api/profesori/getProf/${emailProfesor}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!responseProfesor.ok) {
        throw new Error("Could not fetch profesor details.");
      }
      const profesorData = await responseProfesor.json();
      console.log("Profesor Data:", profesorData);
      setProfesor(profesorData);
    } catch (error) {
      console.error("", error);
    }
  };

  const fetchIncercari = async () => {
    console.log("fac incercari");
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/incercari-quiz/getIncercari`,
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
  };

  const logOut = () => {
    window.location.href = "/login";
  };

  const handleBackToCurs = () => {
    window.location.href = "/profesoriCursuri";
  };

  const handleCursChange = (event) => {
    setCursSelectat(event.target.value);
    setQuizSelectat("");
  };

  const handleQuizChange = (event) => {
    setQuizSelectat(event.target.value);
  };

  const cursuriUnice = [
    ...new Set(incercari.map((inc) => inc.quiz.curs.titlu)),
  ];

  const quizuriFiltrate = incercari
    .filter((inc) => inc.quiz.curs.titlu === cursSelectat)
    .map((inc) => inc.quiz.titlu);

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
          `http://localhost:8080/api/profesori/changePhoto/${profesor.id}/${file.name}`,
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
  const incercariFiltrate =
    !cursSelectat && !quizSelectat
      ? incercari
      : incercari.filter(
          (inc) =>
            inc.quiz.curs.titlu === cursSelectat &&
            (!quizSelectat || inc.quiz.titlu === quizSelectat)
        );
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
    <div className="profesorCursuri-container">
      <header className="profesorCursuri-header">
        <h1>E-Learning</h1>
        <div className="header-content">
          <button
            className="profesorCursuri-option-button"
            onClick={handleBackToCurs}
          >
            Cursuri
          </button>
          <button className="profesorCursuri-option-button">
            Rezultate Elevi
          </button>
          <button className="eleviCursuri-option-button" onClick={getUsers}>
            Chat
          </button>
          <ChatListPopup
            isOpen={isPopupChatOpene}
            userListChat={usersListChat}
            closePopupChat={closePopupChat}
          />
          <button className="profesorCursuri-option-button" onClick={logOut}>
            Log Out
          </button>
          {profesor.pozaProfil ? (
            <img
              src={`/${profesor.mail}/${profesor.pozaProfil}`}
              onClick={handlePhotoClick}
              alt={`${profesor.nume.charAt(0)} ${profesor.prenume.charAt(0)}`}
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
              {`${profesor.nume?.charAt(0) ?? ""}${
                profesor.prenume?.charAt(0) ?? ""
              }`}
            </div>
          )}
        </div>
      </header>

      <div className="dropdown-container">
        <select
          style={{
            marginRight: "10px",
          }}
          value={cursSelectat}
          onChange={handleCursChange}
        >
          <option value="">Selectează un curs</option>
          {cursuriUnice.map((titlu) => (
            <option key={titlu} value={titlu}>
              {titlu}
            </option>
          ))}
        </select>
        <select
          value={quizSelectat}
          onChange={handleQuizChange}
          disabled={!cursSelectat}
        >
          <option value="">Selectează un quiz</option>
          {[...new Set(quizuriFiltrate)].map((titlu) => (
            <option key={titlu} value={titlu}>
              {titlu}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nume Elev</th>
              <th>Prenume Elev</th>
              <th>Titlu curs</th>
              <th>Titlu Quiz</th>
              <th>Scor</th>
            </tr>
          </thead>
          <tbody>
            {incercariFiltrate.map((inc, index) => (
              <tr key={index}>
                <td>{inc.elev.nume}</td>
                <td>{inc.elev.prenume}</td>
                <td>{inc.quiz.curs.titlu}</td>
                <td>{inc.quiz.titlu}</td>
                <td>{inc.scor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="profesorCursuri-footer">
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

export default RezultateElevi;
