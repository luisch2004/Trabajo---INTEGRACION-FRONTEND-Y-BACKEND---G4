// Muestra total registrado vs. total visible tras aplicar el filtro.
function StudentCounter({ total, filtered }) {
  return (
    <div className="counter" aria-live="polite">
      <span className="badge">Total registrados: <strong>{total}</strong></span>
      <span className="badge badge-alt">Mostrando: <strong>{filtered}</strong></span>
    </div>
  );
}

export default StudentCounter;
