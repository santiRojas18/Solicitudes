package com.santiago.solicitudes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.santiago.solicitudes.model.Solicitud;
import com.santiago.solicitudes.model.usuario;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findBySolicitante(usuario solicitante);

    List<Solicitud> findAll();

}
