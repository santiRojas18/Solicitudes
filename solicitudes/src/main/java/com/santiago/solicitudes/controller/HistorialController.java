package com.santiago.solicitudes.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.santiago.solicitudes.model.HistorialSolicitud;
import com.santiago.solicitudes.model.Solicitud;
import com.santiago.solicitudes.repository.HistorialRepository;
import com.santiago.solicitudes.repository.SolicitudRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/historial")
@CrossOrigin(origins = "http://3.129.18.52:3000")
public class HistorialController {

    private final HistorialRepository historialRepository;
    private final SolicitudRepository SolicitudRepository;

    @GetMapping
    public List<HistorialSolicitud> listar() {
        return historialRepository.findAll();
    }

    public static class ComentarioDTO {
        private String comentario;

        public String getComentario() {
            return comentario;
        }

        public void setComentario(String comentario) {
            this.comentario = comentario;
        }
    }


    @PutMapping("/{id}/comentario")
    public HistorialSolicitud agregarComentario(@PathVariable Long id, @RequestBody ComentarioDTO dto) {
        // Busca la solicitud
        Solicitud solicitud = SolicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        HistorialSolicitud historial = new HistorialSolicitud();
        historial.setSolicitud(solicitud);
        historial.setSolicitante(solicitud.getSolicitante());
        historial.setResponsable(solicitud.getResponsable());
        historial.setEstadoAnterior(solicitud.getEstado());
        historial.setEstadoNuevo(solicitud.getEstado());
        historial.setFechaCambio(LocalDateTime.now());
        historial.setComentario(dto.getComentario());

        return historialRepository.save(historial);
    }

}
