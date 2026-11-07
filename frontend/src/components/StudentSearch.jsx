// Componente controlado "tonto": el término vive en App (Lifting State Up).
function StudentSearch({ searchTerm, onSearchChange }) {
  return (
    <div className="search">
      <label htmlFor="search">Buscar por nombre</label>
      <input
        id="search"
        type="search"
        placeholder="Escriba un nombre..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default StudentSearch;
