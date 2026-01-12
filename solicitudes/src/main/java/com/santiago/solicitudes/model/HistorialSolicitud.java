package com.santiago.solicitudes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistorialSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "solicitud_id")
    private Solicitud solicitud;
    @ManyToOne
    @JoinColumn(name = "solicitante_id")
    private usuario solicitante;
    @ManyToOne
    @JoinColumn(name = "responsable_id")
    private usuario responsable;
    @Enumerated(EnumType.STRING)
    private EstadoSolicitud estadoAnterior;
    @Enumerated(EnumType.STRING)
    private EstadoSolicitud estadoNuevo;
    private java.time.LocalDateTime fechaCambio;
    private String comentario;

}
