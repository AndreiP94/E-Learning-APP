import React, { useState } from "react";
import "./login.css";

function SchimbaParola() {
  const [username, setUsername] = useState("");
  const [parolaVeche, setParolaVeche] = useState("");
  const [parolaNoua, setParolaNoua] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleLogIn = () => {
    window.location.href = "/Login";
  };
  const handleSchimbaParola = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            oldPassword: parolaVeche,
            newPassword: parolaNoua,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Eroare în timpul schimbării parolei");
      } else {
        window.location.href = "/Login";
      }

      setSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="body-login">
      <div className="reset-card">
        <div className="user-image"></div>

        <input
          type="text"
          className="input-field"
          placeholder="Nume utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Parolă Veche"
          value={parolaVeche}
          onChange={(e) => setParolaVeche(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Parolă Nouă"
          value={parolaNoua}
          onChange={(e) => setParolaNoua(e.target.value)}
        />
        <button className="forgot-password" onClick={handleSchimbaParola}>
          Schimbă Parola
        </button>
        <br />
        <button className="signin-button" onClick={handleLogIn}>
          Pagina Log In
        </button>
        {error && <p className="text-danger">{error}</p>}
        {success && (
          <p className="text-success">Parola a fost schimbată cu succes!</p>
        )}
      </div>
    </div>
  );
}

export default SchimbaParola;
