// src/pages/index.tsx
import { useEffect, useState } from 'react';

export default function Home() {
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    // Genera un token único simple
    const token = Math.random().toString(36).substring(7);
    // Usamos window.location.origin para que la URL sea dinámica
    setShareLink(`${window.location.origin}/compartir/${token}`);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Bienvenido al Campo Alma Cuántico</h1>
      <p>Tu experiencia comienza aquí...</p>
      
      {shareLink && (
        <div>
          <p>Comparte tu experiencia única:</p>
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </div>
      )}
    </div>
  );
}
