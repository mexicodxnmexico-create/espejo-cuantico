import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Espejo Cuántico</h1>
      <p>Welcome to Espejo Cuántico - Quantum Mirror</p>
      
      <section style={{ marginTop: "2rem" }}>
        <h2>Speed Insights Enabled</h2>
        <p>
          This project has Vercel Speed Insights integrated. Performance metrics
          will be collected and available in your Vercel dashboard.
        </p>
        <p>
          The <code>@vercel/speed-insights</code> package is tracking your Web
          Vitals and other performance metrics.
        </p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Learn More</h2>
        <ul>
          <li>
            <Link href="https://vercel.com/docs/speed-insights">
              Speed Insights Documentation
            </Link>
          </li>
          <li>
            <Link href="https://nextjs.org/docs">Next.js Documentation</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
