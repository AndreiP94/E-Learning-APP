import React, { useState, useEffect } from "react";
import "../Elev/eleviCursuri.css";
import { format, parseISO, intervalToDuration, isPast } from "date-fns";
import "./attemptQuiz.css";
import { wait } from "@testing-library/user-event/dist/utils";
import ChatListPopup from "../Chat/ChatListPopup";

const AttemptQuiz = () => {
  const quizData = localStorage.getItem("selectedQuizz");
  const quiz = quizData ? JSON.parse(quizData) : null;
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [elev, setElev] = useState([]);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  useEffect(() => {
    const handleRefresh = (event) => {
      if (!showModal) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !showModal) {
        alert("Posibila fraudă. Quiz anulat.");
        setTimeout(() => {
          const cursId = localStorage.getItem("selectedCursId");
          window.location.href = "/cursElev/" + cursId;
        }, 2000);
      }
    };

    window.addEventListener("beforeunload", handleRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [showModal]);
  useEffect(() => {
    if (localStorage.getItem("modalOpen") === "true") {
      redirectToPage();
      localStorage.removeItem("modalOpen");
    }

    const handleRefresh = (event) => {
      if (showModal) {
        localStorage.setItem("modalOpen", "true");
      }
    };

    window.addEventListener("beforeunload", handleRefresh);
    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, [showModal]);

  useEffect(() => {
    if (quiz && quiz.id) {
      fetchQuizData();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const end = parseISO(quiz.stop);
      if (isPast(end)) {
        handleSubmit();
      } else {
        const duration = intervalToDuration({ start: now, end });
        setTimeLeft(
          `${duration.hours || 0}h ${duration.minutes || 0}m ${
            duration.seconds || 0
          }s`
        );
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [selectedAnswers]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", showModal);
  }, [showModal]);

  const fetchQuizData = async () => {
    let elevLocal = [];
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8080/api/incercari-quiz/getRandomQuestions/${quiz.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setQuestions(data);
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

  const handleAnswerChange = (questionIndex, answer) => {
    if (!showModal)
      setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;
    questions.forEach((question, index) => {
      const correctAnswer = question.varianteCorecta.toLowerCase();
      const selectedAnswer = (selectedAnswers[index] || "")
        .trim()
        .toLowerCase();
      if (selectedAnswer === correctAnswer) {
        calculatedScore += quiz.punctajPeIntrebare;
      }
    });
    const incercareData = localStorage.getItem("incercare");
    const incercare = incercareData ? JSON.parse(incercareData) : null;
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/incercari-quiz/updateScor/${incercare.id}/${calculatedScore}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setScore(calculatedScore);
    setShowModal(true);
  };

  const redirectToPage = () => {
    const cursId = localStorage.getItem("selectedCursId");
    window.location.href = "/cursElev/" + cursId;
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
          <p className="timeLeft">{timeLeft}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="quiz-questions">
              {questions.map((question, index) => (
                <div key={index} className="question">
                  <h3>
                    Întrebare {index + 1}: {question.text}
                  </h3>
                  <ul className="answer-list">
                    {question.varianteRaspuns.map((varianta, vIndex) => (
                      <li key={vIndex}>
                        <label>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={varianta}
                            onChange={() => handleAnswerChange(index, varianta)}
                          />{" "}
                          {varianta}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button className="quiz-salveaza-button" type="submit">
              Verifică Răspunsurile
            </button>
          </form>
        </>
      )}
      {showModal && (
        <div className="modal-backdrop show">
          <div className="modal-content">
            <h4>
              Scorul tău este: {score} din{" "}
              {quiz.punctajPeIntrebare * questions.length}
            </h4>
            <button onClick={redirectToPage}>OK</button>
          </div>
        </div>
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

export default AttemptQuiz;
