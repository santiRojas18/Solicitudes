import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await fetch("${API_BASE_URL}/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en login");
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
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleLogin} style={{ width: "100%" }}>
        Iniciar sesión
      </button>

      <button
        onClick={() => navigate("/registro")}
        style={{ width: "100%", backgroundColor: "#ddd", marginTop: "5px" }}
      >
        Registrarse
      </button>
    </div>
  );
}
