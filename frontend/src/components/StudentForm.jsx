import { useState, useEffect } from 'react';

const EMPTY_FORM = { nombre: '', apellido: '', email: '', carrera: '' };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validación básica en cliente (el backend vuelve a validar).
function validate(values) {
  const errors = {};
  if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
  else if (values.nombre.trim().length < 2) errors.nombre = 'Mínimo 2 caracteres.';

  if (!values.apellido.trim()) errors.apellido = 'El apellido es obligatorio.';
  else if (values.apellido.trim().length < 2) errors.apellido = 'Mínimo 2 caracteres.';

  if (!values.email.trim()) errors.email = 'El email es obligatorio.';
  else if (!EMAIL_REGEX.test(values.email)) errors.email = 'Formato de email inválido.';

  if (!values.carrera.trim()) errors.carrera = 'La carrera es obligatoria.';
  return errors;
}

/**
 * Formulario de registro / edición.
 * - Estado local (useState): valores de los inputs controlados y errores de validación.
 * - Props: studentToEdit (si existe => modo edición), onSave y onCancel (callbacks hacia App).
 */
function StudentForm({ studentToEdit, onSave, onCancel, loading }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(studentToEdit);

  // Al seleccionar un estudiante para editar, se cargan sus datos en el formulario.
  useEffect(() => {
    if (studentToEdit) {
      const { nombre, apellido, email, carrera } = studentToEdit;
      setValues({ nombre, apellido, email, carrera });
    } else {
      setValues(EMPTY_FORM);
    }
    setErrors({});
  }, [studentToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const ok = await onSave({
      nombre: values.nombre.trim(),
      apellido: values.apellido.trim(),
      email: values.email.trim(),
      carrera: values.carrera.trim(),
    });
    if (ok && !isEditing) setValues(EMPTY_FORM); // limpiar solo si fue un alta exitosa
  };

  const field = (name, label, type = 'text') => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
        className={errors[name] ? 'invalid' : ''}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? 'Editar estudiante' : 'Registrar estudiante'}</h2>
      {field('nombre', 'Nombre')}
      {field('apellido', 'Apellido')}
      {field('email', 'Email', 'email')}
      {field('carrera', 'Carrera')}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {isEditing ? 'Actualizar' : 'Registrar'}
        </button>
        {isEditing && (
          <button type="button" className="btn" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default StudentForm;
