import React, { useState, useEffect } from "react";
import "./admin.css";

const AdaugaElev = () => {
  const [elevi, setElevi] = useState([]);
  const [editingMode, setEditingMode] = useState(false);
  const [selectedElev, setSelectedElev] = useState(null);
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [mail, setMail] = useState("");
  const [clasa, setClasa] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalButon, setModalButon] = useState("");
  useEffect(() => {
    fetchElevi();
  }, []);

  const fetchElevi = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/elevi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Nu s-au putut extrage datele!");
      } else {
        setElevi(await response.json());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    try {
      let url = "http://localhost:8080/api/elevi";
      let method = "POST";
      if (editingMode) {
        url += `/${selectedElev.id}`;
        method = "PUT";
      }
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nume,
          prenume,
          mail,
          clasa,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Error while ${editingMode ? "updating" : "adding"} elev`
        );
      }
      setModalOpen(false);
      fetchElevi();
    } catch (error) {
      console.log(error.message);
    }
  };

  const loggOut = () => {
    window.location.href = "/login";
  };
  const butonElevi = () => {
    window.location.href = "/adaugaElev";
  };
  const butonProfesori = () => {
    window.location.href = "/admin";
  };

  const handleAdd = () => {
    setEditingMode(false);
    setModalOpen(true);
    setSelectedElev(null);
    setModalTitle("Adaugare Elev");
    setModalButon("Adauga");
    setModalOpen(true);
    setNume("");
    setPrenume("");
    setMail("");
    setClasa("");
  };

  const handleEdit = (elev) => {
    setEditingMode(true);
    setSelectedElev(elev);
    setNume(elev.nume);
    setPrenume(elev.prenume);
    setMail(elev.mail);
    setClasa(elev.clasa);
    setModalTitle("Editare Elev");
    setModalButon("Editeaza");
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8080/api/elevi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Eroare la ștergerea elevului!");
      }
      setElevi(elevi.filter((elev) => elev.id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Elevi </h1>
        <div className="admin-header-buttons">
          <button className="admin-option-button" onClick={butonElevi}>
            Elevi
          </button>
          <button className="admin-option-button" onClick={butonProfesori}>
            Profesori
          </button>
          <button className="admin-option-button" onClick={loggOut}>
            Logg Out
          </button>
        </div>
      </header>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Email</th>
            <th>Clasa</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {elevi.map((elev) => (
            <tr key={elev.id}>
              <td>{elev.nume}</td>
              <td>{elev.prenume}</td>
              <td>{elev.mail}</td>
              <td>{elev.clasa}</td>
              <td>
                <button
                  onClick={() => handleEdit(elev)}
                  className="admin-button admin-edit-button"
                >
                  Editare
                </button>
                <button
                  onClick={() => handleDelete(elev.id)}
                  className="admin-button admin-delete-button"
                >
                  Ștergere
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAdd} className="admin-add-button1">
        + Adăugare Elev
      </button>
      <footer className="admin-footer">
        <p>@2024copyright</p>
      </footer>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={closeModal} className="close-button">
              Închide
            </button>
            <h2>{modalTitle}</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="nume">Nume:</label>
              <input
                type="text"
                id="nume"
                value={nume}
                onChange={(e) => setNume(e.target.value)}
                required
              />
              <label htmlFor="prenume">Prenume:</label>
              <input
                type="text"
                id="prenume"
                value={prenume}
                onChange={(e) => setPrenume(e.target.value)}
                required
              />
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
              />
              <label htmlFor="clasa">Clasa:</label>
              <input
                type="text"
                id="clasa"
                value={clasa}
                onChange={(e) => setClasa(e.target.value)}
                required
              />
              <button type="submit">{modalButon}</button>
            </form>
            <button onClick={closeModal} className="close-button">
              Închide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaugaElev;
