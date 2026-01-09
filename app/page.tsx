export default function Home() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Welcome to Espejo Cuántico</h1>
      <p>
        This project has Vercel Web Analytics enabled. Your page views and visitor data
        will be tracked and displayed in your Vercel dashboard.
      </p>
      <section style={{ marginTop: "20px" }}>
        <h2>About Vercel Web Analytics</h2>
        <p>
          Vercel Web Analytics provides real-time insights into your website's performance
          and user behavior. With the Analytics component properly integrated, you'll be able to:
        </p>
        <ul>
          <li>Track page views and visitor data</li>
          <li>Monitor Core Web Vitals</li>
          <li>View custom events (Pro/Enterprise)</li>
          <li>Filter and analyze your data</li>
        </ul>
      </section>
      <section style={{ marginTop: "20px" }}>
        <h2>Next Steps</h2>
        <ol>
          <li>Enable Web Analytics in your Vercel dashboard (Settings → Analytics)</li>
          <li>Deploy your app to Vercel</li>
          <li>View your analytics data in the dashboard</li>
        </ol>
      </section>
    </main>
  );
}
