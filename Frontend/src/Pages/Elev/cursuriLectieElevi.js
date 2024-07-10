import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./cursuriLectieElevi.css";
import ChatListPopup from "../Chat/ChatListPopup";

const CursuriLectieElevi = () => {
  const { id } = useParams();
  const [curs, setCurs] = useState(null);
  const [lectii, setLectii] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [elev, setElev] = useState([]);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      let elevLocal = [];

      try {
        const token = localStorage.getItem("token");

        const responseCurs = await fetch(
          `http://localhost:8080/api/cursuri/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const cursData = await responseCurs.json();
        setCurs(cursData);

        const responseLectii = await fetch(
          `http://localhost:8080/api/lectii/curs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const lectiiData = await responseLectii.json();
        setLectii(lectiiData);

        const responseQuizzes = await fetch(
          `http://localhost:8080/api/quizzes/quizzCurs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseQuizzes.ok) {
          throw new Error("Could not fetch quizz.");
        }
        const quizzesData = await responseQuizzes.json();
        setQuizzes(quizzesData);

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
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleNote = () => {
    window.location.href = "/noteElev";
  };
  const logOut = () => {
    window.location.href = "/login";
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

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

  const handleQuizzClick = (quizz) => {
    localStorage.setItem("selectedQuizz", JSON.stringify(quizz));
    window.location.href = "/quizElevStart";
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
    <div className="cursurilectieelevi-container">
      <header className="cursurilectieelevi-header">
        <h1>E-Learning</h1>
        <div className="header-content">
          <button
            className="cursurilectieelevi-option-button"
            onClick={handlePaginaCurs}
          >
            Cursuri
          </button>
          <button
            className="cursurilectieelevi-option-button"
            onClick={handleNote}
          >
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
          <button className="cursurilectieelevi-option-button" onClick={logOut}>
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

      <h1 style={{ textAlign: "center" }}>{curs?.titlu}</h1>

      {lectii.length > 0 || quizzes.length > 0 ? (
        Array.from({ length: curs.saptamani }, (_, i) => (
          <div key={i} className="weekelevi-container">
            <h2 className="weekelevi-title">Săptămâna {i + 1}</h2>
            {lectii
              .filter((lectie) => lectie.saptamana === i + 1)
              .map((lectie, index) => (
                <a
                  key={index}
                  className="lectureelevi-link"
                  href={`/${curs.id}/${lectie.continut}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="pdfelevi-icon"
                    src="/Images/pdf.png"
                    alt="PDF"
                  />
                  {lectie.continut}
                </a>
              ))}
            {quizzes
              .filter((quizz) => quizz.saptamanaQuiz === i + 1)
              .map((quizz, index) => (
                <div key={index} className="lecture-item">
                  <div
                    style={{ cursor: "pointer" }}
                    className="lecture-link"
                    onClick={() => handleQuizzClick(quizz)}
                  >
                    <img
                      className="pdf-icon"
                      src="/Images/Quiz.png"
                      alt="PDF"
                    />
                    {quizz.titlu}
                  </div>
                </div>
              ))}
          </div>
        ))
      ) : (
        <p>No lessons available for this course.</p>
      )}

      <footer className="cursurilectieelevi-footer">
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

export default CursuriLectieElevi;
