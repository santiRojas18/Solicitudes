package com.santiago.solicitudes.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.santiago.solicitudes.model.EstadoSolicitud;
import com.santiago.solicitudes.model.HistorialSolicitud;
import com.santiago.solicitudes.model.Solicitud;
import com.santiago.solicitudes.model.usuario;
import com.santiago.solicitudes.repository.HistorialRepository;
import com.santiago.solicitudes.repository.SolicitudRepository;
import com.santiago.solicitudes.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SolicitudService {

    private final SolicitudRepository repository;
    private final HistorialRepository historialRepository;
    private final UsuarioRepository usuarioRepository;

    public List<HistorialSolicitud> obtenerHistorial(Long solicitudId) {
        return historialRepository.findBySolicitudId(solicitudId);
    }

    public Solicitud crear(Solicitud solicitud) {
        usuario solicitante = usuarioRepository.findById(solicitud.getSolicitante().getId())
                .orElseThrow(() -> new RuntimeException("Solicitante no encontrado"));
        solicitud.setSolicitante(solicitante);

        usuario responsable = usuarioRepository.findById(solicitud.getResponsable().getId())
                .orElseThrow(() -> new RuntimeException("Responsable no encontrado"));
        solicitud.setResponsable(null);

        if (solicitud.getEstado() == null)
            solicitud.setEstado(EstadoSolicitud.PENDIENTE);
        if (solicitud.getFechaCreacion() == null)
            solicitud.setFechaCreacion(LocalDateTime.now());

        return repository.save(solicitud);
    }

    public List<Solicitud> listar(Long usuarioId) {
        usuario usuarioActual = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (usuarioActual.getRol().equals("RESPONSABLE")) {
            return repository.findAll();
        } else {
            return repository.findBySolicitante(usuarioActual);
        }
    }

    public Solicitud cambiarEstado(Long id, EstadoSolicitud nuevoEstado) {
        Solicitud solicitud = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        EstadoSolicitud estadoAnterior = solicitud.getEstado();
        solicitud.setEstado(nuevoEstado);
        Solicitud guardada = repository.save(solicitud);

        HistorialSolicitud Historial = new HistorialSolicitud();
        Historial.setSolicitud(guardada);
        Historial.setSolicitante(solicitud.getSolicitante());
        Historial.setResponsable(solicitud.getResponsable());
        Historial.setEstadoAnterior(estadoAnterior);
        Historial.setEstadoNuevo(nuevoEstado);
        Historial.setFechaCambio(java.time.LocalDateTime.now());
        historialRepository.save(Historial);
        return guardada;
    }

    public Solicitud agregarComentario(Long id, String comentario) {
        HistorialSolicitud historial = historialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        historial.setComentario(comentario);
        historialRepository.save(historial);

        return historial.getSolicitud();
    }

}
