package com.santiago.solicitudes.controller;

import org.springframework.web.bind.annotation.*;
import com.santiago.solicitudes.model.usuario;
import com.santiago.solicitudes.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/registro")
    public usuario registrarUsuario(@RequestBody usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
            throw new RuntimeException("Email ya registrado");
        }
        return usuarioRepository.save(usuario);
    }

    @PostMapping("/login")
    public usuario login(@RequestBody LoginDTO dto) {
        usuario usuario = usuarioRepository.findByEmail(dto.getEmail());
        if (usuario == null || !usuario.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Email o contraseña incorrectos");
        }
        return usuario;
    }

    public static class LoginDTO {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

}
