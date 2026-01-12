package com.santiago.solicitudes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.santiago.solicitudes.model.Solicitud;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    
}
