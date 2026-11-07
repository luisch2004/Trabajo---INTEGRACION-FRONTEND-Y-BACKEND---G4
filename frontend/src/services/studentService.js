// Capa de acceso a la API REST. Ningún componente usa fetch directamente:
// así la lógica HTTP queda aislada y es fácil de probar o reemplazar (p. ej. por axios).

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/estudiantes';

/**
 * Wrapper de fetch que:
 *  - envía/recibe JSON,
 *  - convierte errores de red y respuestas no-2xx en Error con un mensaje legible,
 *  - devuelve null en respuestas 204 (sin cuerpo).
 */
async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifique que el backend esté activo.');
  }

  if (!response.ok) {
    let message = `Error ${response.status}: ${response.statusText}`;
    try {
      const body = await response.json();
      if (body.message) message = body.message; // mensaje enviado por GlobalExceptionHandler
    } catch {
      /* el cuerpo no era JSON: se conserva el mensaje por defecto */
    }
    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

export const getStudents = () => request(API_URL);

export const createStudent = (student) =>
  request(API_URL, { method: 'POST', body: JSON.stringify(student) });

export const updateStudent = (id, student) =>
  request(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(student) });

export const deleteStudent = (id) =>
  request(`${API_URL}/${id}`, { method: 'DELETE' });
