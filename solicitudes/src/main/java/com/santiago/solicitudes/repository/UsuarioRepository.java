package com.santiago.solicitudes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.santiago.solicitudes.model.usuario;

public interface UsuarioRepository extends JpaRepository<usuario, Long> {

    usuario findByEmail(String email);

}
