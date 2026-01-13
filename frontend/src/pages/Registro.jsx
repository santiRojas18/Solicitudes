import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("SOLICITANTE");
  const navigate = useNavigate();

  async function handleRegistro() {
    try {
      const res = await fetch("${API_BASE_URL}/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, rol })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error registrando usuario");
      }

      const usuarioCreado = await res.json();
      alert("Usuario registrado correctamente: " + usuarioCreado.nombre);
      navigate("/"); 
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Registro</h2>
      <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "10px" }} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "10px" }} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "10px" }} />
      <select value={rol} onChange={e => setRol(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "10px" }}>
        <option value="SOLICITANTE">Solicitante</option>
        <option value="RESPONSABLE">Responsable</option>
      </select>
      <button onClick={handleRegistro} style={{ width: "100%" }}>
        Registrarse
      </button>
    </div>
  );
}
