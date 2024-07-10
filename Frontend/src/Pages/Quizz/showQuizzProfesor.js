import React, { useState, useEffect } from "react";
import "./addQuizz.css";
import ChatListPopup from "../Chat/ChatListPopup";

const ShowQuizzProfesor = () => {
  const [selectedQuizz, setSelectedQuizz] = useState(null);
  const [profesor, setProfesor] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  const fetchQuizData = async (quizId) => {
    try {
      console.log(quizId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/quizzes/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Quiz data could not be fetched.");
      }
      const data = await response.json();
      setSelectedQuizz(data);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };
  useEffect(() => {
    const quizData = localStorage.getItem("selectedQuizz");
    const quiz = quizData ? JSON.parse(quizData) : null;
    console.log(quiz);
    if (quiz && quiz.id) {
      fetchQuizData(quiz.id);
    }
  }, []);
  const handleProfesor = async () => {
    console.log("handleProfesor is called");
    const token = localStorage.getItem("token");
    const emailProfesor = localStorage.getItem("username");
    console.log(emailProfesor);
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
  useEffect(() => {
    handleProfesor();
  }, []);

  if (!selectedQuizz) {
    return <div>Loading...</div>;
  }

  const handleIntrebareTextChange = (index, text) => {
    const newIntrebari = [...selectedQuizz.intrebari];
    newIntrebari[index].text = text;
    setSelectedQuizz((prevState) => ({
      ...prevState,
      intrebari: newIntrebari,
    }));
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

  const handleVariantaRaspunsChange = (
    intrebareIndex,
    variantaIndex,
    value
  ) => {
    const newIntrebari = [...selectedQuizz.intrebari];
    newIntrebari[intrebareIndex].varianteRaspuns[variantaIndex] = value;
    setSelectedQuizz((prevState) => ({
      ...prevState,
      intrebari: newIntrebari,
    }));
  };

  const handleVariantaCorectaChange = (intrebareIndex, variantaIndex) => {
    const newIntrebari = [...selectedQuizz.intrebari];
    newIntrebari[intrebareIndex].varianteCorecta =
      newIntrebari[intrebareIndex].varianteRaspuns[variantaIndex];
    setSelectedQuizz((prevState) => ({
      ...prevState,
      intrebari: newIntrebari,
    }));
  };

  const saveQuestionChanges = async (question) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/intrebari/${question.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(question),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update question");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating question:", error.message);
      alert("Failed to update question: " + error.message);
    }
  };
  const handleRezultateElevi = () => {
    window.location.href = "/rezultateElevi";
  };
  const handleBackToCurs = () => {
    window.location.href = "/profesoriCursuri";
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
    <div className="cursurilectie-container">
      <header className="cursurilectie-header">
        <h1>E-Learning</h1>
        <div className="header-content">
          <button
            className="cursurilectie-header-button"
            onClick={handleBackToCurs}
          >
            Cursuri
          </button>

          <button
            className="cursurilectie-header-button"
            onClick={handleRezultateElevi}
          >
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
          <button className="cursurilectie-header-button">Log Out</button>
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

      <div className="quizz-details">
        <h2>Detalii Quiz</h2>
        <ul className="answer-list">
          <li>
            <strong>Titlu:</strong> {selectedQuizz.titlu}
          </li>
          <li>
            <strong>Start:</strong> {selectedQuizz.start}
          </li>
          <li>
            <strong>Stop:</strong> {selectedQuizz.stop}
          </li>
          <li>
            <strong>Săptămâna:</strong> {selectedQuizz.saptamanaQuiz}
          </li>
          <li>
            <strong>Punctaj pe intrebare:</strong>{" "}
            {selectedQuizz.punctajPeIntrebare}
          </li>
          <li>
            <strong>Numar intrebari Quiz:</strong>{" "}
            {selectedQuizz.numarIntrebariQuiz}
          </li>
          {selectedQuizz.intrebari.map((intrebare, index) => (
            <li key={index}>
              <p>
                {" "}
                {index + 1}.{" "}
                <input
                  type="text"
                  style={{ width: "100%", maxWidth: "600px" }}
                  value={intrebare.text}
                  onChange={(e) =>
                    handleIntrebareTextChange(index, e.target.value)
                  }
                />
              </p>
              <ul className="answer-list-variante-edit">
                {intrebare.varianteRaspuns.map((varianta, vIndex) => (
                  <li key={vIndex}>
                    <input
                      type="text"
                      value={varianta}
                      onChange={(e) =>
                        handleVariantaRaspunsChange(
                          index,
                          vIndex,
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="checkbox"
                      checked={intrebare.varianteCorecta === varianta}
                      onChange={() =>
                        handleVariantaCorectaChange(index, vIndex)
                      }
                    />
                  </li>
                ))}
              </ul>
              <button
                className="quiz-salveaza-button"
                onClick={() => saveQuestionChanges(intrebare)}
              >
                Salvare modificare
              </button>
            </li>
          ))}
        </ul>
      </div>

      <footer className="cursurilectie-footer">
        <p>© 2024 Copyright</p>
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

export default ShowQuizzProfesor;
