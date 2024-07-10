import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./cursuriLectie.css";
import ChatListPopup from "../Chat/ChatListPopup";

const CursuriLectie = () => {
  const { id } = useParams();
  const [curs, setCurs] = useState(null);
  const [lectii, setLectii] = useState([]);
  const [selectedLectie, setSelectedLectie] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpenQuizz, setMenuOpenQuizz] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenQuizz, setModalOpenQuizz] = useState(false);

  const [modalTitle, setModalTitle] = useState("");
  const [titlu, setTitlu] = useState("");
  const [continut, setContinut] = useState("");
  const [saptamana, setSaptamana] = useState(1);
  const [editingMode, setEditingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [elevi, setElevi] = useState([]);
  const [allElevi, setAllElevi] = useState([]);
  const [showAddEleviModal, setShowAddEleviModal] = useState(false);
  const [selectedElevi, setSelectedElevi] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [start, setStart] = useState("");
  const [stop, setStop] = useState("");
  const [saptamanaQuiz, setSaptamanaQuiz] = useState(1);
  const [titluQuiz, setTitluQuiz] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [numarIntrebariQuiz, setNumarIntrebariQuiz] = useState(0);
  const [punctajPeIntrebare, setPunctajPeIntrebare] = useState(0);
  const [profesor, setProfesor] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  useEffect(() => {
    fetchDetails();
    fetchElevi();
    fetchAllElevi();
    handleProfesor();
  }, [id]);
  const fetchElevi = async () => {
    try {
      const token = localStorage.getItem("token");

      const responseElevi = await fetch(
        `http://localhost:8080/api/cursuri/curs/elevi/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!responseElevi.ok) {
        throw new Error("Could not fetch students.");
      }
      const eleviData = await responseElevi.json();
      setElevi(eleviData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const fetchAllElevi = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8080/api/elevi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAllElevi(data);
    } catch (error) {
      console.error("Error fetching all students:", error);
    }
  };

  const handleCheckboxChange = (elevId) => {
    setSelectedElevi((prevSelectedElevi) =>
      prevSelectedElevi.includes(elevId)
        ? prevSelectedElevi.filter((id) => id !== elevId)
        : [...prevSelectedElevi, elevId]
    );
  };

  const handleProfesor = async () => {
    const emailProfesor = localStorage.getItem("username");
    try {
      const token = localStorage.getItem("token");

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

  const handleAddEleviToCurs = async () => {
    if (selectedElevi.length === 0) {
      alert("Selectează cel puțin un elev.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8080/api/cursuri/${id}/elevi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedElevi),
      });
      setShowAddEleviModal(false);
      fetchElevi();
    } catch (error) {
      console.error("Error adding students to course:", error);
    }
  };

  const fetchDetails = async () => {
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
      if (!responseCurs.ok) {
        throw new Error("Could not fetch course details.");
      }
      const cursData = await responseCurs.json();
      console.log("Course Data:", cursData);
      localStorage.setItem("curs", JSON.stringify(cursData));
      setCurs(cursData);
      const responseLectii = await fetch(
        `http://localhost:8080/api/lectii/curs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!responseLectii.ok) {
        throw new Error("Could not fetch lessons.");
      }
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
      console.log(quizzesData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const logOut = () => {
    window.location.href = "/login";
  };

  const toggleMenu = (lectie) => {
    setSelectedLectie(lectie);
    setMenuOpen(!menuOpen);
  };

  const toggleMenuQuiz = (quizz) => {
    setSelectedQuiz(quizz);
    setMenuOpenQuizz(!menuOpenQuizz);
  };

  const handleAdd = () => {
    setModalTitle("Adaugare Lecție");
    setTitlu("");
    setContinut("");
    setSaptamana(1);
    setEditingMode(false);
    setModalOpen(true);
  };

  const handleEdit = () => {
    setModalTitle("Editare Lecție");
    setTitlu(selectedLectie.titlu);
    setContinut(selectedLectie.continut);
    setSaptamana(selectedLectie.saptamana);
    setEditingMode(true);
    setModalOpen(true);
  };

  const handleEditQuiz = () => {
    setModalTitle("Editare Quiz");
    setTitluQuiz(selectedQuiz.titlu);
    setStart(selectedQuiz.start);
    setStop(selectedQuiz.stop);
    setSaptamanaQuiz(selectedQuiz.saptamanaQuiz);
    setNumarIntrebariQuiz(selectedQuiz.numarIntrebariQuiz);
    setEditingMode(true);
    setModalOpenQuizz(true);
  };

  const handleAddQuizz = () => {
    window.location.href = "/addQuizz";
  };
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/lectii/${selectedLectie.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error while deleting lesson");
      }
      fetchDetails();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/quizzes/${selectedQuiz.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error while deleting quizz");
      }
      fetchDetails();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file.name);
    setContinut(file.name);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const url = editingMode
      ? `http://localhost:8080/api/lectii/${selectedLectie.id}`
      : "http://localhost:8080/api/lectii";
    const method = editingMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titlu,
          continut,
          saptamana,
          curs: curs,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Error while ${editingMode ? "updating" : "adding"} lesson`
        );
      }
      setModalOpen(false);
      fetchDetails();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitQuizzes = async (event) => {
    event.preventDefault();
    const idquiz = selectedQuiz.id;
    const token = localStorage.getItem("token");

    const url = "http://localhost:8080/api/quizzes/" + idquiz;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titlu: titluQuiz,
          start,
          stop,
          saptamanaQuiz: saptamanaQuiz,
          numarIntrebariQuiz,
        }),
      });
      if (!response.ok) {
        throw new Error("Error while adding quiz");
      }
      setModalOpenQuizz(false);
      fetchDetails();
    } catch (error) {
      console.error("Error:", error);
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

  const handleQuizzClick = (quizz) => {
    localStorage.setItem("selectedQuizz", JSON.stringify(quizz));
    window.location.href = "/quizzProfesor";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!curs) {
    return <div>Loading...</div>;
  }
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
              alt={`${(profesor.nume ?? "").charAt(0)} ${(
                profesor.prenume ?? ""
              ).charAt(0)}`}
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
              {`${(profesor.nume ?? "").charAt(0)}${(
                profesor.prenume ?? ""
              ).charAt(0)}`}
            </div>
          )}
        </div>
      </header>

      <div className="cursurilectie-main">
        <div>
          <h1>{curs?.titlu}</h1>
          <button className="cursurilectie-add-button" onClick={handleAdd}>
            Adaugă Lecție
          </button>
          <button className="cursurilectie-add-button" onClick={handleAddQuizz}>
            Adaugă Quizz
          </button>
          {lectii.length > 0 || quizzes.length > 0 ? (
            Array.from({ length: curs.saptamani }, (_, i) => (
              <div key={i} className="week-container">
                <h2 className="week-title">Săptămâna {i + 1}</h2>
                {lectii
                  .filter((lectie) => lectie.saptamana === i + 1)
                  .map((lectie, index) => (
                    <div key={index} className="lecture-item">
                      <a
                        className="lecture-link"
                        href={`/${curs.id}/${lectie.continut}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="pdf-icon"
                          src="/Images/pdf.png"
                          alt="PDF"
                        />
                        {lectie.continut}
                      </a>
                      <button
                        className="cursurilectie-option-button"
                        onClick={() => toggleMenu(lectie)}
                      >
                        Optiuni Lectie
                      </button>

                      {selectedLectie === lectie && menuOpen && (
                        <div className="cursurilectie-menu">
                          <button onClick={handleEdit}>Edit</button>
                          <button onClick={handleDelete}>Delete</button>
                        </div>
                      )}
                    </div>
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
                      <button
                        className="cursurilectie-option-button"
                        onClick={() => toggleMenuQuiz(quizz)}
                      >
                        Optiuni Quizz
                      </button>

                      {selectedQuiz === quizz && menuOpenQuizz && (
                        <div className="cursurilectie-menu">
                          <button onClick={handleEditQuiz}>Edit</button>
                          <button onClick={handleDeleteQuiz}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <p>No lessons available for this course.</p>
          )}
        </div>
        <div className="student-list">
          <h2 style={{ textAlign: "center" }}>Elevi Înscriși</h2>
          {elevi.map((elev, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                marginBottom: "10px",
                marginTop: "20px",
              }}
            >
              {elev.pozaProfil ? (
                <img
                  src={`/${elev.mail}/${elev.pozaProfil}`}
                  alt={`${elev.nume.charAt(0)} ${elev.prenume.charAt(0)}`}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
              ) : (
                <div className="initials-circle">
                  {`${elev.nume.charAt(0)}${elev.prenume.charAt(0)}`}
                </div>
              )}
              <span>
                {elev.nume} {elev.prenume} {elev.mail}
              </span>
            </div>
          ))}
          <button
            className="cursurilectie-adauga-button"
            onClick={() => setShowAddEleviModal(true)}
          >
            Adaugă Elevi la Curs
          </button>
        </div>
      </div>

      <footer className="cursurilectie-footer">
        <p>@2024 Copyright</p>
      </footer>

      {showAddEleviModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Selectează Elevii</h2>
            {allElevi.map((elev) => (
              <div key={elev.id}>
                <input
                  type="checkbox"
                  id={`elev-${elev.id}`}
                  checked={selectedElevi.includes(elev.id)}
                  onChange={() => handleCheckboxChange(elev.id)}
                />
                <label
                  htmlFor={`elev-${elev.id}`}
                >{`${elev.nume} ${elev.prenume} - ${elev.mail}`}</label>
              </div>
            ))}
            <button
              style={{
                marginRight: "15px",
              }}
              onClick={handleAddEleviToCurs}
            >
              Adaugă elevii la curs
            </button>
            <button onClick={() => setShowAddEleviModal(false)}>Închide</button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              onClick={() => {
                setModalOpen(false);
                setMenuOpen(false);
              }}
              className="close-button"
            >
              ❌
            </button>
            <h2>{modalTitle}</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="titlu">Titlu:</label>
              <input
                type="text"
                id="titlu"
                value={titlu}
                onChange={(e) => setTitlu(e.target.value)}
                required
              />
              <label htmlFor="continut">Conținut:</label>
              <input
                type="file"
                id="continut"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e)}
                required
              />
              <label htmlFor="saptamana">Săptămâna:</label>
              <input
                type="number"
                id="saptamana"
                value={saptamana}
                onChange={(e) => setSaptamana(Number(e.target.value))}
                min="1"
                required
              />
              <button type="submit" className="admin-add-button">
                Salvează
              </button>
            </form>
          </div>
        </div>
      )}

      {modalOpenQuizz && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              onClick={() => {
                setModalOpenQuizz(false);
                setMenuOpenQuizz(false);
              }}
              className="close-button"
            >
              ❌
            </button>
            <h2>{modalTitle}</h2>
            <form onSubmit={handleSubmitQuizzes}>
              <label htmlFor="titlu">Titlu:</label>
              <input
                type="text"
                id="titluQuiz"
                value={titluQuiz}
                onChange={(e) => setTitluQuiz(e.target.value)}
                required
              />
              <label htmlFor="start">Start:</label>
              <input
                type="datetime-local"
                id="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
              <label htmlFor="stop">Stop:</label>
              <input
                type="datetime-local"
                id="stop"
                value={stop}
                onChange={(e) => setStop(e.target.value)}
                required
              />
              <label htmlFor="saptamanaQuiz">Săptămâna:</label>
              <input
                type="number"
                id="saptamanaQuiz"
                value={saptamanaQuiz}
                onChange={(e) => setSaptamanaQuiz(Number(e.target.value))}
                min="1"
                required
              />
              <label htmlFor="saptamanaQuiz">Numar Intrebari Quiz:</label>
              <input
                type="number"
                id="numarIntrebariQuiz"
                value={numarIntrebariQuiz}
                onChange={(e) => setNumarIntrebariQuiz(Number(e.target.value))}
                min="1"
                required
              />
              <label htmlFor="saptamanaQuiz">Punctaj pe intrebare:</label>
              <input
                type="number"
                id="punctajPeIntrebare"
                value={punctajPeIntrebare}
                onChange={(e) => setPunctajPeIntrebare(Number(e.target.value))}
                min="1"
                required
              />
              <button type="submit" className="admin-add-button">
                Salvează
              </button>
            </form>
          </div>
        </div>
      )}
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

export default CursuriLectie;
