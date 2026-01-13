
const API_URL = 'http://3.129.18.52:8080/api/solicitudes';


export async function listarSolicitudes() {
    const response = await fetch(API_URL);
    return response.json();

}

export async function crearSolicitud(data) {
  const response = await fetch("${import.meta.env.VITE_API_URL}/api/solicitudes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Error backend crearSolicitud:", errorData);
    throw new Error("Error al crear solicitud");
  }

  return response.json();
}




export async function obtenerHistorialGlobal() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/registro`)
;
    return res.json();
}

export async function cambiarEstado(id, estado) {
    const response = await fetch(`${API_URL}/${id}/estado?estado=${estado}`, {
        method: 'PUT',

    });

    if (!response.ok) {
        throw new Error("Error al cambiar estado");
    }

    return response.json();
}

export async function agregarComentario(id, comentario) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}
/api/historial/${id}/comentario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentario }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("Respuesta del backend:", text);
        throw new Error("Error al agregar comentario");
    }

    return response.json();
}



