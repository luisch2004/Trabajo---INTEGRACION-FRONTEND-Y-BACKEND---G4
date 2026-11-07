package com.universidad.estudiantes.controller;

import com.universidad.estudiantes.model.Estudiante;
import com.universidad.estudiantes.service.EstudianteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    private final EstudianteService service;

    public EstudianteController(EstudianteService service) {
        this.service = service;
    }

    /** GET /api/estudiantes            -> todos
     *  GET /api/estudiantes?nombre=ana -> filtrados por nombre */
    @GetMapping
    public ResponseEntity<List<Estudiante>> listar(@RequestParam(required = false) String nombre) {
        List<Estudiante> resultado = (nombre == null || nombre.isBlank())
                ? service.listar()
                : service.buscarPorNombre(nombre);
        return ResponseEntity.ok(resultado); // 200
    }

    /** GET /api/estudiantes/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id)); // 200 o 404
    }

    /** POST /api/estudiantes -> 201 Created + cabecera Location */
    @PostMapping
    public ResponseEntity<Estudiante> crear(@Valid @RequestBody Estudiante estudiante) {
        Estudiante creado = service.guardar(estudiante);
        URI ubicacion = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creado.getId()).toUri();
        return ResponseEntity.created(ubicacion).body(creado);
    }

    /** PUT /api/estudiantes/{id} -> 200, 400, 404 o 409 */
    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> actualizar(@PathVariable Long id,
                                                 @Valid @RequestBody Estudiante estudiante) {
        return ResponseEntity.ok(service.actualizar(id, estudiante));
    }

    /** DELETE /api/estudiantes/{id} -> 204 No Content o 404 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
