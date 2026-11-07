package com.universidad.estudiantes.service;

import com.universidad.estudiantes.exception.EmailDuplicadoException;
import com.universidad.estudiantes.exception.RecursoNoEncontradoException;
import com.universidad.estudiantes.model.Estudiante;
import com.universidad.estudiantes.repository.EstudianteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Lógica de negocio del CRUD de estudiantes. */
@Service
@Transactional
public class EstudianteService {

    private final EstudianteRepository repository;

    // Inyección por constructor (recomendada sobre @Autowired en campos)
    public EstudianteService(EstudianteRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Estudiante> listar() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Estudiante> buscarPorNombre(String nombre) {
        return repository.findByNombreContainingIgnoreCase(nombre);
    }

    @Transactional(readOnly = true)
    public Estudiante buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(id));
    }

    public Estudiante guardar(Estudiante estudiante) {
        if (repository.existsByEmailIgnoreCase(estudiante.getEmail())) {
            throw new EmailDuplicadoException(estudiante.getEmail());
        }
        estudiante.setId(null); // fuerza INSERT aunque el cliente envíe un id
        return repository.save(estudiante);
    }

    public Estudiante actualizar(Long id, Estudiante datos) {
        Estudiante existente = buscarPorId(id);

        if (repository.existsByEmailIgnoreCaseAndIdNot(datos.getEmail(), id)) {
            throw new EmailDuplicadoException(datos.getEmail());
        }

        existente.setNombre(datos.getNombre());
        existente.setApellido(datos.getApellido());
        existente.setEmail(datos.getEmail());
        existente.setCarrera(datos.getCarrera());
        return repository.save(existente);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNoEncontradoException(id);
        }
        repository.deleteById(id);
    }
}
