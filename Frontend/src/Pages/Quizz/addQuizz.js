import React, { useEffect, useState } from "react";
import "./addQuizz.css";
import ChatListPopup from "../Chat/ChatListPopup";

const AddQuizz = ({ cursId, onSubmit }) => {
  const [titlu, setTitlu] = useState("");
  const [start, setStart] = useState("");
  const [stop, setStop] = useState("");
  const [numarIntrebari, setNumarIntrebari] = useState(0);
  const [intrebari, setIntrebari] = useState([]);
  const [saptamanaQuiz, setSaptamanaQuiz] = useState("");
  const [raspunsuriCorecte, setRaspunsuriCorecte] = useState({});
  const [numarIntrebariQuiz, setNumarIntrebariQuiz] = useState(0);
  const [punctajPeIntrebare, setPunctajPeIntrebare] = useState(0);
  const curs = JSON.parse(localStorage.getItem("curs"));
  const [profesor, setProfesor] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  useEffect(() => {
    handleProfesor();
  }, []);
  const handleProfesor = async () => {
    const emailProfesor = localStorage.getItem("username");
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
  const handlePhotoClick = () => {
    setIsPhotoModalOpen(true);
  };
  const logOut = () => {
    window.location.href = "/login";
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    const quizComple = {
      quiz: {
        titlu,
        start,
        stop,
        saptamanaQuiz,
        numarIntrebariQuiz,
        punctajPeIntrebare,
      },
      intrebari: intrebari.map((intrebare, index) => ({
        text: intrebare.text,
        varianteRaspuns: Object.values(intrebare.varianteRaspuns),
        varianteCorecta: raspunsuriCorecte[index],
      })),
    };
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/quizzes/${curs.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(quizComple),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add quiz");
      }
      window.location.href = "/curs/" + curs.id;
    } catch (error) {
      console.error("Error adding quiz:", error.message);
    }
  };

  const handleIntrebareChange = (index, event) => {
    const { name, value } = event.target;
    const updatedIntrebari = [...intrebari];
    updatedIntrebari[index] = { ...updatedIntrebari[index], [name]: value };
    setIntrebari(updatedIntrebari);
  };

  const handleVariantaChange = (intrebareIndex, variantaIndex, event) => {
    const { value } = event.target;
    const updatedIntrebari = [...intrebari];
    updatedIntrebari[intrebareIndex].varianteRaspuns[variantaIndex] = value;
    setIntrebari(updatedIntrebari);
  };

  const handleCheckboxChange = (intrebareIndex, variantaIndex, event) => {
    const selectedText =
      intrebari[intrebareIndex].varianteRaspuns[variantaIndex];
    if (raspunsuriCorecte[intrebareIndex] === selectedText) {
      setRaspunsuriCorecte((prev) => ({
        ...prev,
        [intrebareIndex]: undefined,
      }));
    } else {
      setRaspunsuriCorecte((prev) => ({
        ...prev,
        [intrebareIndex]: selectedText,
      }));
    }
  };

  const handleNumarIntrebariChange = (e) => {
    const newCount = parseInt(e.target.value, 10);
    setNumarIntrebari(newCount);
    if (newCount < intrebari.length) {
      setIntrebari(intrebari.slice(0, newCount));
    } else {
      setIntrebari((current) => [
        ...current,
        ...new Array(newCount - current.length).fill({
          text: "",
          varianteRaspuns: Array(4).fill(""),
        }),
      ]);
    }
  };

  const generateIntrebariFields = () => {
    return intrebari.map((intrebare, i) => (
      <div key={i} className="question-container">
        <label className="intrebare">Întrebare {i + 1}:</label>
        <input
          type="text"
          name="text"
          className="long-input"
          value={intrebare.text || ""}
          onChange={(e) => handleIntrebareChange(i, e)}
          required
        />
        <br />
        {intrebare.varianteRaspuns.map((varianta, index) => (
          <div key={index} className="varianta-container">
            <input
              type="text"
              name={`varianta${index + 1}`}
              value={varianta || ""}
              onChange={(e) => handleVariantaChange(i, index, e)}
              placeholder={`Variantă ${index + 1}`}
              required
            />
            <input
              type="checkbox"
              checked={raspunsuriCorecte[i] === varianta}
              onChange={(e) => handleCheckboxChange(i, index, e)}
            />
          </div>
        ))}
      </div>
    ));
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
          <button className="cursurilectie-header-button" onClick={logOut}>
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
              }`}{" "}
            </div>
          )}
        </div>
      </header>
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="quiz-form-title">Quiz Nou</h2>
        <div className="quiz-details-container">
          <div>
            <label className="label-container">Titlu:</label>
            <input
              type="text"
              value={titlu}
              onChange={(e) => setTitlu(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-container">Data și ora de începere:</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-container">Data și ora de încheiere:</label>
            <input
              type="datetime-local"
              value={stop}
              onChange={(e) => setStop(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-container">Pentru săptămâna:</label>
            <input
              type="text"
              value={saptamanaQuiz}
              onChange={(e) => setSaptamanaQuiz(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-container">Număr de întrebări Quiz:</label>
            <input
              type="number"
              value={numarIntrebariQuiz}
              onChange={(e) => setNumarIntrebariQuiz(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-container">Punctaj pe întrebare:</label>
            <input
              type="number"
              value={punctajPeIntrebare}
              onChange={(e) => setPunctajPeIntrebare(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-container">Număr de întrebări:</label>
            <input
              type="number"
              value={numarIntrebari}
              onChange={handleNumarIntrebariChange}
              min={0}
              required
            />
          </div>
        </div>
        {generateIntrebariFields()}
        <div className="quiz-salveaza-button-container">
          <button type="submit" className="quiz-salveaza-button">
            Salvează Quizz
          </button>
        </div>
      </form>
      <footer className="cursurilectie-footer">
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

export default AddQuizz;
