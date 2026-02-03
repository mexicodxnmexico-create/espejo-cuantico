export function Header() {
  return (
    <header style={{ padding: "1rem 0", borderBottom: "1px solid #eaeaea" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Espejo Cuántico</div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href="#about" style={{ textDecoration: "none", color: "#666" }}>Acerca de</a>
          <a href="#stats" style={{ textDecoration: "none", color: "#666" }}>Estadísticas</a>
        </div>
      </nav>
    </header>
  );
}
