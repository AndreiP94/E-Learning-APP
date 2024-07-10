import React, { useState, useEffect } from "react";
import "./admin.css";

const Admin = () => {
  const [profesori, setProfesori] = useState([]);
  const [editingMode, setEditingMode] = useState(false);
  const [selectedProfesor, setSelectedProfesor] = useState(null);

  useEffect(() => {
    fetchProfesori();
  }, []);

  const loggOut = () => {
    window.location.href = "/login";
  };

  const butonElevi = () => {
    window.location.href = "/adaugaElev";
  };
  const butonProfesori = () => {
    window.location.href = "/admin";
  };

  const fetchProfesori = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/profesori", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Date could not be fetched!");
      } else {
        setProfesori(await response.json());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/profesori/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error while deleting profesor");
      } else {
        setProfesori(profesori.filter((profesor) => profesor.id !== id));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [mail, setMail] = useState("");
  const [materie, setMaterie] = useState("");

  const closeModal = () => {
    setModalOpen(false);
    setNume("");
    setPrenume("");
    setMail("");
    setMaterie("");
  };

  const handleEdit = (profesor) => {
    setEditingMode(true);
    setSelectedProfesor(profesor);
    setNume(profesor.nume);
    setPrenume(profesor.prenume);
    setMail(profesor.mail);
    setMaterie(profesor.materie);
    setModalTitle("Editare Profesor");
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMode(false);
    setSelectedProfesor(null);
    setModalTitle("Adaugare Profesor");
    setModalOpen(true);
    setNume("");
    setPrenume("");
    setMail("");
    setMaterie("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:8080/api/profesori";
      let method = "POST";
      if (editingMode) {
        url += `/${selectedProfesor.id}`;
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
          materie,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Error while ${editingMode ? "updating" : "adding"} profesor`
        );
      }
      closeModal();
      fetchProfesori();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Profesori </h1>
        <div className="admin-header-buttons">
          <button className="admin-option-button" onClick={butonElevi}>
            Elevi
          </button>
          <button className="admin-option-button" onClick={butonProfesori}>
            Profesori
          </button>
          <button className="admin-option-button" onClick={loggOut}>
            Log Out
          </button>
        </div>
      </header>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Email</th>
            <th>Materie</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {profesori.map((profesor) => (
            <tr key={profesor.id}>
              <td>{profesor.nume}</td>
              <td>{profesor.prenume}</td>
              <td>{profesor.mail}</td>
              <td>{profesor.materie}</td>
              <td>
                <button
                  onClick={() => handleEdit(profesor)}
                  className="admin-button admin-edit-button"
                >
                  Editare
                </button>
                <button
                  onClick={() => handleDelete(profesor.id)}
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
        + Adaugare Profesor
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
              <label htmlFor="materie">Materie:</label>
              <input
                type="text"
                id="materie"
                value={materie}
                onChange={(e) => setMaterie(e.target.value)}
                required
              />
              <button type="submit" className="admin-add-button">
                Adaugă
              </button>
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

export default Admin;
