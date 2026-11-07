package com.universidad.estudiantes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Entidad JPA que representa a un estudiante.
 * Las anotaciones de Bean Validation se evalúan cuando el controlador
 * recibe el objeto con @Valid.
 */
@Entity
@Table(name = "estudiantes",
       uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 60, message = "El nombre debe tener entre 2 y 60 caracteres")
    @Column(nullable = false, length = 60)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 60, message = "El apellido debe tener entre 2 y 60 caracteres")
    @Column(nullable = false, length = 60)
    private String apellido;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    @Column(nullable = false, length = 120)
    private String email;

    @NotBlank(message = "La carrera es obligatoria")
    @Size(max = 80, message = "La carrera no puede superar 80 caracteres")
    @Column(nullable = false, length = 80)
    private String carrera;

    public Estudiante() {
    }

    public Estudiante(String nombre, String apellido, String email, String carrera) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.carrera = carrera;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCarrera() { return carrera; }
    public void setCarrera(String carrera) { this.carrera = carrera; }
}
