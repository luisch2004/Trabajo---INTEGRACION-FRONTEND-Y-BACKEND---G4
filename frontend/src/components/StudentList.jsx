// Presentacional: recibe datos y callbacks por props. No conoce la API.
function StudentList({ students, onEdit, onDelete, disabled }) {
  if (students.length === 0) {
    return <p className="empty">No hay estudiantes para mostrar.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Carrera</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.nombre}</td>
              <td>{s.apellido}</td>
              <td>{s.email}</td>
              <td>{s.carrera}</td>
              <td className="actions">
                <button className="btn btn-edit" onClick={() => onEdit(s)} disabled={disabled}>
                  Editar
                </button>
                <button className="btn btn-delete" onClick={() => onDelete(s.id)} disabled={disabled}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
