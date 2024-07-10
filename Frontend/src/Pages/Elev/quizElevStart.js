import React, { useState, useEffect } from "react";
import "./eleviCursuri.css";
import { format, parseISO, isWithinInterval } from "date-fns";
import ChatListPopup from "../Chat/ChatListPopup";

const QuizEleviStart = () => {
  const quizData = localStorage.getItem("selectedQuizz");
  const quiz = quizData ? JSON.parse(quizData) : null;
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [incercari, setIncercari] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [elev, setElev] = useState([]);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  useEffect(() => {
    fetchIncercari();

    const updateButtonState = () => {
      if (!quiz) return;
      const now = new Date();
      const startQuizDate = parseISO(quiz.start);
      const endQuizDate = parseISO(quiz.stop);
      const hasAttempted = incercari.some(
        (incercare) => incercare.quiz.id === quiz.id
      );
      const isWithinTimeRange = isWithinInterval(now, {
        start: startQuizDate,
        end: endQuizDate,
      });
      console.log(incercari);
      console.log("Now:", now);
      console.log("Start Quiz Date:", startQuizDate);
      console.log("End Quiz Date:", endQuizDate);
      console.log("Is within time range:", isWithinTimeRange);
      console.log("Has attempted:", hasAttempted);

      setIsButtonEnabled(isWithinTimeRange && !hasAttempted);
    };

    updateButtonState();
    const intervalId = setInterval(updateButtonState, 60000);

    return () => clearInterval(intervalId);
  }, [incercari]);

  const fetchIncercari = async () => {
    let elevLocal = [];
    const token = localStorage.getItem("token");

    const email = localStorage.getItem("username");
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
  const handleStartQuiz = async () => {
    const token = localStorage.getItem("token");

    const email = localStorage.getItem("username");
    try {
      const response = await fetch(
        `http://localhost:8080/api/incercari-quiz/createAttempt/${quiz.id}/${email}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error while creating attempt");
      }
      const incercare = await response.json();
      console.log("Attempt received:", incercare);
      localStorage.setItem("incercare", JSON.stringify(incercare));

      window.location.href = "/attemptQuiz";
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleNote = () => {
    window.location.href = "/noteElev";
  };
  const logOut = () => {
    window.location.href = "/login";
  };
  const handlePaginaCurs = () => {
    window.location.href = "/eleviCursuri";
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
    <div className="eleviCursuri-container">
      <header className="eleviCursuri-header">
        <h1>E-Learning </h1>
        <div className="header-content">
          <button
            className="eleviCursuri-option-button"
            onClick={handlePaginaCurs}
          >
            Cursuri
          </button>
          <button className="eleviCursuri-option-button" onClick={handleNote}>
            Note
          </button>
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
      {quiz && (
        <>
          <h2 className="quiz-start-title">{quiz.titlu}</h2>
          <p className="quiz-date">
            {format(parseISO(quiz.start), "dd MMMM yyyy, HH:mm")} -{" "}
            {format(parseISO(quiz.stop), "dd MMMM yyyy, HH:mm")}
          </p>
          <button
            disabled={!isButtonEnabled}
            onClick={handleStartQuiz}
            className="quiz-startquiz-button"
          >
            Start Quiz
          </button>
        </>
      )}

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

export default QuizEleviStart;
