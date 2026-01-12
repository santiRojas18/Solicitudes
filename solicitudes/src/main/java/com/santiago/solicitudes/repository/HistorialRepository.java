package com.santiago.solicitudes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.santiago.solicitudes.model.HistorialSolicitud;

public interface HistorialRepository extends JpaRepository<HistorialSolicitud, Long> {

    List<HistorialSolicitud> findBySolicitudId(Long solicitudId);
    
}
