import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./profesoriCursuri.css";
import ChatListPopup from "../Chat/ChatListPopup";

const ProfesoriCursuri = () => {
  const [cursuri, setCursuri] = useState([]);
  const [selectedCurs, setSelectedCurs] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [titlu, setTitlu] = useState("");
  const [poza, setPoza] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [profesor, setProfesor] = useState(null);
  const [saptamani, setSaptamani] = useState(1);
  const [editingMode, setEditingMode] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPopupChatOpene, setIsPopupChatOpened] = useState(false);
  const [usersListChat, setUsersListChat] = useState([]);

  const logOut = () => {
    window.location.href = "/login";
  };
  const handleRezultateElevi = () => {
    window.location.href = "/rezultateElevi";
  };
  const adaugaCurs = () => {
    setModalTitle("Adaugare Curs");
    setModalOpen(true);
  };

  const toggleMenu = (curs) => {
    setSelectedCurs(curs);
    setMenuOpen(!menuOpen);
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
  const fetchCursuri = async () => {
    try {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");
      const responseProfesor = await fetch(
        `http://localhost:8080/api/profesori/getProf/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!responseProfesor.ok) {
        throw new Error("Date despre profesor nu au putut fi obținute!");
      } else {
        const profesorLocal = await responseProfesor.json();
        setProfesor(profesorLocal);

        const responseCursuri = await fetch(
          "http://localhost:8080/api/cursuri",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseCursuri.ok) {
          throw new Error("Date despre cursuri nu au putut fi obținute!");
        } else {
          const cursuri = await responseCursuri.json();
          const cursuriProfesor = cursuri.filter(
            (curs) => curs.profesor && curs.profesor.id === profesorLocal.id
          );
          setCursuri(cursuriProfesor);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (curs) => {
    setModalTitle("Editare Curs");
    setTitlu(curs.titlu);
    setSaptamani(curs.saptamani || 1);
    setPoza(curs.poza);

    setModalOpen(true);
    setEditingMode(true);
  };

  const handleDelete = async (curs) => {
    try {
      const id = curs.id;
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/cursuri/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error while deleting profesor");
      }
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
  };

  const handleDocumentClick = () => {
    setMenuOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");

      let url = "http://localhost:8080/api/cursuri";
      let method = "POST";
      if (editingMode) {
        url += `/${selectedCurs.id}`;
        method = "PUT";
      }
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titlu,
          saptamani,
          poza,
          profesor: profesor,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Error while ${editingMode ? "updating" : "adding"} curs`
        );
      }
      setModalOpen(false);
      fetchCursuri();
      setTitlu("");
      setSaptamani(1);
      setPoza("");
      setEditingMode(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!profesor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profesorCursuri-container" onClick={handleDocumentClick}>
      <header className="profesorCursuri-header">
        <h1>E-Learning </h1>
        <div className="header-content">
          <button className="profesorCursuri-option-button">Cursuri</button>
          <button
            className="profesorCursuri-option-button"
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
              {`${profesor.nume.charAt(0)}${profesor.prenume.charAt(0)}`}
            </div>
          )}
        </div>
      </header>

      <button className="profesorCursuri-add-button1" onClick={adaugaCurs}>
        + Adaugare Curs
      </button>

      <div className="profesorCursuri-large-boxes-container">
        {cursuri.map((curs, index) => (
          <div className="profesorCursuri-large-box" key={index}>
            <img src={`/Images/${curs.poza}`} alt={`Poza ${curs.titlu}`} />
            <div className="profesorCursuri-large-box-options">
              <Link to={`/curs/${curs.id}`} className="link-stilizat">
                <p>{curs.titlu}</p>
              </Link>

              <div className="menu-container">
                <button
                  className="profesorCursuri-menu-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleMenu(curs);
                  }}
                >
                  &#8942;
                </button>
                {selectedCurs === curs && menuOpen && (
                  <div
                    className="profesorCursuri-menu"
                    onClick={handleMenuClick}
                  >
                    <button onClick={() => handleEdit(curs)}>Editare</button>
                    <button onClick={() => handleDelete(curs)}>Ștergere</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="profesorCursuri-footer">
        <p>@2024copyright</p>
      </footer>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              onClick={() => setModalOpen(false)}
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
              <label htmlFor="poza">Poza:</label>
              <input
                type="text"
                id="poza"
                value={poza}
                onChange={(e) => setPoza(e.target.value)}
                required
              />
              <label htmlFor="saptamani">Număr Săptămâni:</label>
              <input
                type="number"
                id="saptamani"
                value={saptamani}
                onChange={(e) => setSaptamani(Number(e.target.value))}
                min="1"
                required
              />

              <button type="submit" className="admin-add-button">
                Adaugă
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

export default ProfesoriCursuri;
