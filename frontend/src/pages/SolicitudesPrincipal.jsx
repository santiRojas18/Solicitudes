import { useEffect, useState } from "react";
import {
  listarSolicitudes,
  cambiarEstado,
  obtenerHistorialGlobal,
  agregarComentario,
  crearSolicitud,
} from "../services/Solicitudes";

export default function SolicitudesPrincipal({ usuarioActual, setUsuarioActual }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [nuevoFormulario, setNuevoFormulario] = useState({
    titulo: "",
    descripcion: "",
    tipo: "Normal",
  });

  useEffect(() => {
    if (usuarioActual) {
      cargarSolicitudes();
      actualizarHistorial();
    }
  }, [usuarioActual]);

  async function cargarSolicitudes() {
    const data = await listarSolicitudes();
    let filtradas;
    if (usuarioActual.rol === "RESPONSABLE") {
      filtradas = data.filter((s) => s.estado === "PENDIENTE");
    } else {
      filtradas = data.filter((s) => s.solicitante?.id === usuarioActual.id);
    }
    setSolicitudes(filtradas);
  }

  async function actualizarHistorial() {
    const data = await obtenerHistorialGlobal();
    setHistorial(data);
  }

  function handleChange(e, id) {
    setComentarios((prev) => ({ ...prev, [id]: e.target.value }));
  }

  async function guardarComentario(id) {
    try {
      await agregarComentario(id, comentarios[id] || "");
      alert("Comentario guardado correctamente");
      actualizarHistorial();
    } catch (err) {
      console.error(err);
      alert("Error guardando comentario");
    }
  }

  async function actualizarEstado(s, nuevoEstado) {
    try {
      if (comentarios[s.id]) await agregarComentario(s.id, comentarios[s.id]);
      await cambiarEstado(s.id, nuevoEstado);
      await cargarSolicitudes();
      actualizarHistorial();
    } catch (err) {
      console.error(err);
      alert("Error actualizando solicitud");
    }
  }

  async function crearNuevaSolicitud() {
    try {
      const creada = await crearSolicitud({
        ...nuevoFormulario,
        solicitante: usuarioActual,
        responsable: null,
        estado: "PENDIENTE",
      });
      setSolicitudes((prev) => [...prev, creada]);

      const idNoti = Date.now();
      setNotificaciones((prev) => [
        ...prev,
        { id: idNoti, mensaje: `Nueva solicitud: ${creada.titulo}` },
      ]);
      setTimeout(() => {
        setNotificaciones((prev) => prev.filter((n) => n.id !== idNoti));
      }, 5000);

      setNuevoFormulario({ titulo: "", descripcion: "", tipo: "Normal" });
      setMostrandoFormulario(false);
    } catch (err) {
      console.error(err);
      alert("Error al crear solicitud");
    }
  }

  function cerrarSesion() {
    setUsuarioActual(null);
  }

  return (


    <div style={{ display: "flex", padding: "20px" }}>
      <div style={{ position: "fixed", top: 10, right: 10 }}>
        <button onClick={cerrarSesion} style={{ padding: "8px 12px" }}>
          Cerrar sesión
        </button>
      </div>


      <div style={{ width: "100%", backgroundColor: "#1976d2", color: "white", padding: "15px 20px", boxSizing: "border-box" }}>
        <h1>Solicitudes</h1>
      </div>

      {usuarioActual.rol === "SOLICITANTE" && (
        <div style={{ flex: 1 }}>
          <h1>CREAR SOLICITUD</h1>
          <button onClick={() => setMostrandoFormulario(true)}>Nueva Solicitud</button>

          {mostrandoFormulario && (
            <div style={{ border: "1px solid #ccc", padding: "15px", margin: "10px 0" }}>
              <input
                placeholder="Título"
                value={nuevoFormulario.titulo}
                onChange={(e) =>
                  setNuevoFormulario((prev) => ({ ...prev, titulo: e.target.value }))
                }
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <textarea
                placeholder="Descripción"
                value={nuevoFormulario.descripcion}
                onChange={(e) =>
                  setNuevoFormulario((prev) => ({ ...prev, descripcion: e.target.value }))
                }
                style={{ width: "100%", marginBottom: "8px" }}
              />
              <button onClick={crearNuevaSolicitud}>Crear</button>
            </div>
          )}

          <h2>Mis solicitudes</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {solicitudes.map((s) => (
              <li
                key={s.id}
                style={{ border: "1px solid #ddd", marginBottom: "10px", padding: "10px" }}
              >
                <div>ID: {s.id}</div>
                <strong>{s.titulo}</strong>
                <div>{s.descripcion}</div>
                <div>Estado: {s.estado}</div>
              </li>
            ))}
          </ul>
        </div>
      )}


      {usuarioActual.rol === "RESPONSABLE" && (
        <div style={{ flex: 1, maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <h1>SOLICITUDES PENDIENTES</h1>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {solicitudes.map((s) => (
              <li
                key={s.id}
                style={{
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}
              >
                <div>ID: {s.id}</div>
                <div>Solicitante: {s.solicitante?.nombre}</div>
                <strong>{s.titulo}</strong>
                <div>{s.descripcion}</div>
                <div>Tipo: {s.tipo}</div>

                <div>comentario:</div>
                <textarea
                  value={comentarios[s.id] || ""}
                  onChange={(e) => handleChange(e, s.id)}
                  style={{ width: "100%", height: "60px" }}
                />
                <div>Estado: {s.estado}</div>
                <br />

                <button onClick={() => actualizarEstado(s, "APROBADO")}>Aprobar</button>
                <button onClick={() => actualizarEstado(s, "RECHAZADO")}>Rechazar</button>
              </li>
            ))}
          </ul>

          <button onClick={() => setMostrarHistorial(!mostrarHistorial)}>
            {mostrarHistorial ? "Cerrar Historial" : "Ver Historial"}
          </button>

          {mostrarHistorial && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderTop: "2px solid #ccc",
              }}
            >
              <h3>HISTORIAL</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "15px",
                  marginTop: "10px",
                }}
              >
                {historial.map((h) => (
                  <div
                    key={h.solicitud.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div>ID: {h.solicitud.id}</div>
                    <strong>{h.solicitud.titulo}</strong>
                    <div>Estado: {h.estadoNuevo}</div>
                    {h.comentario && <div>Comentario: {h.comentario}</div>}
                    <div>{new Date(h.fechaCambio).toLocaleString()}</div>
                    {h.responsable && <div>Responsable: {h.responsable.nombre}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}


      <div style={{ position: "fixed", top: 20, right: 20, width: 250 }}>
        {notificaciones.map((n) => (
          <div
            key={n.id}
            style={{ backgroundColor: "blue", color: "white", padding: "10px", marginBottom: "8px" }}
          >
            {n.mensaje}
          </div>
        ))}
      </div>
    </div>
  );
}
