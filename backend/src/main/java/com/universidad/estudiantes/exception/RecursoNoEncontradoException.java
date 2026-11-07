package com.universidad.estudiantes.exception;

public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(Long id) {
        super("No existe un estudiante con id " + id);
    }
}
