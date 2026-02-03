export function Hero() {
  return (
    <section style={{ padding: "4rem 0", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Refleja tu Potencial</h1>
      <p style={{ fontSize: "1.25rem", color: "#666", maxWidth: "600px", margin: "0 auto 2rem" }}>
        Espejo Cuántico es una plataforma experimental para observar y optimizar tu presencia digital en tiempo real.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", backgroundColor: "#000", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>
          Empezar Viaje
        </button>
        <button style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "1px solid #eaeaea", backgroundColor: "#fff", color: "#000", cursor: "pointer" }}>
          Saber más
        </button>
      </div>
    </section>
  );
}
