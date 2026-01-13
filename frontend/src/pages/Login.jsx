import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en login");
      }

      const usuario = await res.json();
      onLogin(usuario);
      navigate("/solicitudes");
    } catch (err) {
      console.error(err);
      alert("Email o contraseña incorrectos");
    }
  }


  return (
    <div>
    
      <div
        style={{
          width: "100%",
          backgroundColor: "#1976d2",
          color: "white",
          padding: "20px 0",
          textAlign: "center",
          boxSizing: "border-box",
          marginBottom: "30px",
        }}
      >
        <h1>Iniciar Sesión</h1>
      </div>

  
      <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          Iniciar sesión
        </button>

        <button
          onClick={() => navigate("/registro")}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#ddd",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Registrarse
        </button>
      </div>
    </div>
  );

}
