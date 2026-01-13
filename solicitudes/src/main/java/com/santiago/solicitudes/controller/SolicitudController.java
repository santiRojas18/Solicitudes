package com.santiago.solicitudes.controller;

import java.util.List;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.santiago.solicitudes.model.EstadoSolicitud;
import com.santiago.solicitudes.model.HistorialSolicitud;
import com.santiago.solicitudes.model.Solicitud;
import com.santiago.solicitudes.model.usuario;
import com.santiago.solicitudes.repository.HistorialRepository;
import com.santiago.solicitudes.repository.UsuarioRepository;
import com.santiago.solicitudes.service.SolicitudService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://3.129.18.52:3000")
public class SolicitudController {

    @Autowired
    private final SolicitudService service;
    private final HistorialRepository HistorialRepository;
    private final UsuarioRepository UsuarioRepository;

    @PostMapping
    public Solicitud crear(@RequestBody Solicitud solicitud) {
        return service.crear(solicitud);
    }

    @GetMapping
    public List<Solicitud> listar(@RequestParam(required = false) Long usuarioId) {
        if (usuarioId != null) {
            return service.listar(usuarioId);
        } else {
            return service.listarTodosPendientes();
        }
    }

    @GetMapping("/historial")
    public List<HistorialSolicitud> historialGlobal() {
        return HistorialRepository.findAll();
    }

    @PutMapping("/{id}/estado")
    public Solicitud cambiarEstado(@PathVariable Long id, @RequestParam("estado") EstadoSolicitud estado) {
        return service.cambiarEstado(id, estado);
    }

    @PutMapping("/{id}/comentario")
    public Solicitud agregarComentario(@PathVariable Long id, @RequestBody String comentario) {
        return service.agregarComentario(id, comentario);
    }

}
