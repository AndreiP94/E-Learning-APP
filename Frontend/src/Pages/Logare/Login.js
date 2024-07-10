import React, { useState } from "react";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [parola, setParola] = useState("");

  const handleParola = () => {
    window.location.href = "/schimbaParola";
  };

  const decodeToken = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const handleConectare = async () => {
    console.log("am intrat in functie");
    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, parola: parola }),
      });
      if (!response.ok) {
        throw new Error("Autentificare nereușită");
      }

      const token = await response.text();
      console.log(token);
      const decodedToken = decodeToken(token);
      localStorage.setItem("token", token);
      const data = decodedToken.role;
      console.log(data);
      localStorage.setItem("role", data);

      if (data === "admin") {
        window.location.href = "/admin";
      } else if (data === "profesor") {
        localStorage.setItem("username", username);
        window.location.href = "/profesoriCursuri";
      } else if (data === "elev") {
        localStorage.setItem("username", username);
        window.location.href = "/eleviCursuri";
      }
    } catch (error) {
      console.error("Eroare:", error.message);
    }
  };

  return (
    <div className="body-login">
      <div className="login-card">
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
          placeholder="Parolă"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
        />
        <button className="signin-button" onClick={handleConectare}>
          Conectare
        </button>
        <button className="forgot-password" onClick={handleParola}>
          Schimba Parola
        </button>
      </div>
    </div>
  );
}

export default Login;
