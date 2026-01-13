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
    cargarSolicitudes();
    actualizarHistorial();
  }, []);

  async function cargarSolicitudes() {
    const data = await listarSolicitudes();
    const filtradas = data.filter((s) =>
      usuarioActual.rol === "RESPONSABLE"
        ? s.responsable?.id === usuarioActual.id && s.estado === "PENDIENTE"
        : true
    );
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
      setSolicitudes((prev) => prev.filter((sol) => sol.id !== s.id));
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
        responsable: { id: 2 },
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
      <div style={{ position: "fixed", top: 10, left: 10 }}>
        <button onClick={cerrarSesion} style={{ padding: "8px 12px" }}>
          Cerrar sesión
        </button>

      </div>
      <br />
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
        </div>
      )}

      {usuarioActual.rol === "RESPONSABLE" && (
        <div style={{ flex: 1 }}>
          <h1>SOLICITUDES PENDIENTES</h1>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {solicitudes.map((s) => (
              <li
                key={s.id}
                style={{ border: "1px solid #ddd", marginBottom: "10px", padding: "10px" }}
              >
                <div>ID: {s.id}</div>
                <div>Solicitante: {s.solicitante?.nombre}</div>
                <strong>{s.titulo}</strong>
                <div>{s.descripcion}</div>
                <div>Tipo: {s.tipo} </div>

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
                width: "350px",
                marginTop: "20px",
                padding: "15px",
                borderTop: "2px solid #ccc",
              }}
            >
              <h3>HISTORIAL</h3>
              <ul>
                {historial.map((h) => (
                  <li key={h.solicitud.id}>
                    <strong>{h.solicitud.titulo}</strong> - {h.estadoAnterior} →{" "}
                    {h.estadoNuevo} <br />
                    {h.comentario && `Comentario: ${h.comentario}`} <br />
                    {new Date(h.fechaCambio).toLocaleString()}<br />
                    {h.responsable && `Responsable: ${h.responsable.nombre}`}
                    <hr />
                  </li>
                ))}
              </ul>
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
