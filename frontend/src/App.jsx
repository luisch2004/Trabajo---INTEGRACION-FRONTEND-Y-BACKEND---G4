import { useReducer, useState, useEffect, useMemo, useCallback } from 'react';
import StudentForm from './components/StudentForm.jsx';
import StudentList from './components/StudentList.jsx';
import StudentSearch from './components/StudentSearch.jsx';
import StudentCounter from './components/StudentCounter.jsx';
import { studentReducer, initialState, ACTIONS } from './reducers/studentReducer.js';
import * as studentService from './services/studentService.js';

/**
 * Componente raíz: es el "dueño" del estado compartido (Lifting State Up).
 *  - useReducer -> estado de datos del servidor (lista, loading, error, success)
 *  - useState   -> estado de UI local (término de búsqueda y estudiante en edición)
 * Los hijos reciben datos y funciones únicamente por props.
 */
function App() {
  const [state, dispatch] = useReducer(studentReducer, initialState);
  const { students, loading, error, success } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [studentToEdit, setStudentToEdit] = useState(null);

  // ---------- Carga inicial (GET) ----------
  const loadStudents = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_INIT });
    try {
      const data = await studentService.getStudents();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Oculta el mensaje de éxito automáticamente a los 3 s
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => dispatch({ type: ACTIONS.CLEAR_STATUS }), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  // ---------- Crear / actualizar (POST / PUT) ----------
  // Devuelve true/false para que el formulario sepa si debe limpiarse.
  const handleSave = async (formData) => {
    dispatch({ type: ACTIONS.FETCH_INIT });
    try {
      if (studentToEdit) {
        const updated = await studentService.updateStudent(studentToEdit.id, formData);
        dispatch({ type: ACTIONS.UPDATE_STUDENT, payload: updated });
        setStudentToEdit(null);
      } else {
        const created = await studentService.createStudent(formData);
        dispatch({ type: ACTIONS.ADD_STUDENT, payload: created });
      }
      return true;
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
      return false;
    }
  };

  // ---------- Eliminar (DELETE) ----------
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que desea eliminar este estudiante?')) return;
    dispatch({ type: ACTIONS.FETCH_INIT });
    try {
      await studentService.deleteStudent(id); // borra en la base de datos
      dispatch({ type: ACTIONS.DELETE_STUDENT, payload: id }); // y en el estado local
      if (studentToEdit?.id === id) setStudentToEdit(null);
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
    }
  };

  // ---------- Filtro en tiempo real (estado derivado, no se guarda) ----------
  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return students;
    return students.filter((s) => s.nombre.toLowerCase().includes(term));
  }, [students, searchTerm]);

  return (
    <main className="container">
      <h1>Gestión de Estudiantes</h1>

      {/* Estados asíncronos: carga, error y éxito */}
      {loading && <div className="alert alert-loading" role="status">Cargando...</div>}
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
          <button className="btn btn-small" onClick={loadStudents}>Reintentar carga</button>
        </div>
      )}
      {success && <div className="alert alert-success" role="status">{success}</div>}

      <div className="layout">
        <StudentForm
          studentToEdit={studentToEdit}
          onSave={handleSave}
          onCancel={() => setStudentToEdit(null)}
          loading={loading}
        />

        <section className="card">
          <h2>Listado</h2>
          <StudentSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <StudentCounter total={students.length} filtered={filteredStudents.length} />
          <StudentList
            students={filteredStudents}
            onEdit={setStudentToEdit}
            onDelete={handleDelete}
            disabled={loading}
          />
        </section>
      </div>
    </main>
  );
}

export default App;
