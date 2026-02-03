import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StatusCard } from "@/components/StatusCard";
import { Journey } from "@/components/Journey";

export default function Home() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
      <Header />
      <main>
        <Hero />
        <StatusCard />
        <Journey />

        <section style={{ margin: "4rem 0" }}>
          <h2>Dimensiones de Rendimiento</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
            <div style={{ padding: "1.5rem", borderRadius: "8px", border: "1px solid #eaeaea" }}>
              <h4>Exploración Profunda</h4>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>Analiza los patrones de carga y optimiza la entrega de contenido.</p>
            </div>
            <div style={{ padding: "1.5rem", borderRadius: "8px", border: "1px solid #eaeaea" }}>
              <h4>Sincronía Vercel</h4>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>Utiliza Speed Insights para medir la experiencia real del usuario.</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: "2rem 0", textAlign: "center", borderTop: "1px solid #eaeaea", color: "#999", fontSize: "0.8rem" }}>
        &copy; {new Date().getFullYear()} Espejo Cuántico. Todos los derechos reservados.
      </footer>
    </div>
  );
}
