import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import SolicitudesPrincipal from "./pages/SolicitudesPrincipal";

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);

  const handleLogout = () => setUsuarioActual(null);

  return (
    <Routes>
      <Route
        path="/"
        element={
          usuarioActual ? <Navigate to="/solicitudes" /> : <Login onLogin={setUsuarioActual} />
        }
      />
      <Route
        path="/registro"
        element={usuarioActual ? <Navigate to="/solicitudes" /> : <Registro />}
      />
      <Route
        path="/solicitudes"
        element={
          usuarioActual ? (
            <SolicitudesPrincipal
              usuarioActual={usuarioActual}
              setUsuarioActual={setUsuarioActual}
            />

          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
