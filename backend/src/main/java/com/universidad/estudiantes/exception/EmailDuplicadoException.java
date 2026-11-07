package com.universidad.estudiantes.exception;

public class EmailDuplicadoException extends RuntimeException {

    public EmailDuplicadoException(String email) {
        super("Ya existe un estudiante registrado con el email " + email);
    }
}
