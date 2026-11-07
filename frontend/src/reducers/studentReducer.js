// Reducer: función pura (state, action) => nuevoState.
// Centraliza TODAS las transiciones del estado de datos (servidor) de la aplicación.

export const initialState = {
  students: [],   // datos provenientes de la API
  loading: false, // hay una petición en curso
  error: null,    // mensaje de error de la última petición fallida
  success: null,  // mensaje de éxito de la última operación
};

export const ACTIONS = {
  FETCH_INIT: 'FETCH_INIT',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_STUDENT: 'ADD_STUDENT',
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  DELETE_STUDENT: 'DELETE_STUDENT',
  CLEAR_STATUS: 'CLEAR_STATUS',
};

export function studentReducer(state, action) {
  switch (action.type) {
    // Inicia cualquier petición: activa loading y limpia mensajes anteriores
    case ACTIONS.FETCH_INIT:
      return { ...state, loading: true, error: null, success: null };

    // Carga inicial de la lista completa
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, error: null, students: action.payload };

    // Cualquier petición fallida
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, success: null, error: action.payload };

    // payload: estudiante creado (con id asignado por el backend)
    case ACTIONS.ADD_STUDENT:
      return {
        ...state,
        loading: false,
        error: null,
        success: 'Estudiante registrado correctamente.',
        students: [...state.students, action.payload],
      };

    // payload: estudiante actualizado
    case ACTIONS.UPDATE_STUDENT:
      return {
        ...state,
        loading: false,
        error: null,
        success: 'Estudiante actualizado correctamente.',
        students: state.students.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };

    // payload: id del estudiante eliminado
    case ACTIONS.DELETE_STUDENT:
      return {
        ...state,
        loading: false,
        error: null,
        success: 'Estudiante eliminado correctamente.',
        students: state.students.filter((s) => s.id !== action.payload),
      };

    case ACTIONS.CLEAR_STATUS:
      return { ...state, error: null, success: null };

    default:
      throw new Error(`Acción no soportada: ${action.type}`);
  }
}
