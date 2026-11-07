package com.universidad.estudiantes.repository;

import com.universidad.estudiantes.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    /** Búsqueda parcial por nombre, sin distinguir mayúsculas/minúsculas. */
    List<Estudiante> findByNombreContainingIgnoreCase(String nombre);

    /** Para validar unicidad del email al crear. */
    boolean existsByEmailIgnoreCase(String email);

    /** Para validar unicidad del email al actualizar (excluye al propio registro). */
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
}
