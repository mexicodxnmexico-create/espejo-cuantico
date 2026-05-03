"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { EscenaMeditacion3D } from "../3d/EscenaMeditacion3D";

interface Props {
  onCompletarMeditacion: () => void;
}

const FRECUENCIAS_SOLFEGGIO = [
  { hz: 396, nombre: "Liberación del Miedo", color: "#e63946" },
  { hz: 417, nombre: "Cambio Facilitado", color: "#f77f00" },
  { hz: 528, nombre: "Reparación del ADN", color: "#06d6a0" },
  { hz: 639, nombre: "Conexión Relaciones", color: "#118ab2" },
  { hz: 741, nombre: "Despertar Intuición", color: "#073b4c" },
  { hz: 852, nombre: "Retorno al Orden", color: "#8338ec" }
];

const GEOMETRIAS = [
  { id: "flor-vida" as const, nombre: "Flor de la Vida" },
  { id: "merkaba" as const, nombre: "Merkaba" },
  { id: "metatron" as const, nombre: "Cubo de Metatrón" },
  { id: "torus" as const, nombre: "Torus Energético" }
];

export const MeditacionAudioVisual3D = memo(function MeditacionAudioVisual3D({ onCompletarMeditacion }: Props) {
  const [activo, setActivo] = useState(false);
  const [frecuenciaSeleccionada, setFrecuenciaSeleccionada] = useState(528);
  const [geometriaSeleccionada, setGeometriaSeleccionada] = useState<"flor-vida" | "merkaba" | "metatron" | "torus">("flor-vida");
  const [duracion, setDuracion] = useState(10);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!activo || tiempoRestante <= 0) return;

    const intervalo = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          setActivo(false);
          onCompletarMeditacion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [activo, tiempoRestante, onCompletarMeditacion]);

  const iniciarAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frecuenciaSeleccionada, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
  }, [frecuenciaSeleccionada]);

  const detenerAudio = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  }, []);

  const toggleMeditacion = useCallback(() => {
    if (!activo) {
      setTiempoRestante(duracion * 60);
      iniciarAudio();
      setActivo(true);
    } else {
      detenerAudio();
      setActivo(false);
    }
  }, [activo, duracion, iniciarAudio, detenerAudio]);

  useEffect(() => {
    return () => {
      detenerAudio();
    };
  }, [detenerAudio]);

  const tiempoFormateado = `${Math.floor(tiempoRestante / 60)}:${(tiempoRestante % 60).toString().padStart(2, '0')}`;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>
        Meditación Cuántica Tridimensional
      </h2>

      <div style={{ position: "relative", marginBottom: "2rem" }}>
        <EscenaMeditacion3D
          frecuencia={frecuenciaSeleccionada}
          activo={activo}
          tipoGeometria={geometriaSeleccionada}
        />

        {activo && (
          <div style={{
            position: "absolute",
            top: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            fontSize: "3rem",
            fontWeight: "300",
            textShadow: "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)",
            zIndex: 10,
            pointerEvents: "none"
          }}>
            {tiempoFormateado}
          </div>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          padding: "1.5rem",
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #eaeaea"
        }}>
          <label htmlFor="frecuencia" style={{ display: "block", fontSize: "1rem", marginBottom: "1rem", color: "#333", fontWeight: "bold" }}>
            Frecuencia Solfeggio
          </label>
          <select
            id="frecuencia"
            value={frecuenciaSeleccionada}
            onChange={(e) => setFrecuenciaSeleccionada(Number(e.target.value))}
            disabled={activo}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              background: "#fff"
            }}
          >
            {FRECUENCIAS_SOLFEGGIO.map(f => (
              <option key={f.hz} value={f.hz}>
                {f.hz} Hz - {f.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{
          padding: "1.5rem",
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #eaeaea"
        }}>
          <label htmlFor="geometria" style={{ display: "block", fontSize: "1rem", marginBottom: "1rem", color: "#333", fontWeight: "bold" }}>
            Geometría Sagrada
          </label>
          <select
            id="geometria"
            value={geometriaSeleccionada}
            onChange={(e) => setGeometriaSeleccionada(e.target.value as any)}
            disabled={activo}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              background: "#fff"
            }}
          >
            {GEOMETRIAS.map(g => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{
          padding: "1.5rem",
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #eaeaea"
        }}>
          <label htmlFor="duracion" style={{ display: "block", fontSize: "1rem", marginBottom: "1rem", color: "#333", fontWeight: "bold" }}>
            Duración (minutos)
          </label>
          <input
            id="duracion"
            type="number"
            min="1"
            max="60"
            value={duracion}
            onChange={(e) => setDuracion(Number(e.target.value))}
            disabled={activo}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "1rem"
            }}
          />
        </div>
      </div>

      <button
        onClick={toggleMeditacion}
        style={{
          width: "100%",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "none",
          background: activo
            ? "linear-gradient(135deg, #e63946 0%, #d62828 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          fontSize: "1.25rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}
      >
        {activo ? "⏸ Detener Meditación" : "▶ Iniciar Meditación Cuántica"}
      </button>

      <div style={{
        marginTop: "2rem",
        padding: "1.5rem",
        background: "#f0f7ff",
        borderRadius: "12px",
        border: "1px solid #bde0fe"
      }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem", color: "#023e8a" }}>
          💡 Acerca de esta experiencia
        </h3>
        <p style={{ margin: 0, color: "#0466c8", lineHeight: "1.6" }}>
          La frecuencia de {frecuenciaSeleccionada} Hz combinada con la geometría sagrada {GEOMETRIAS.find(g => g.id === geometriaSeleccionada)?.nombre} crea un campo de resonancia cuántica que facilita estados profundos de meditación. Las visualizaciones tridimensionales interactivas sincronizan con las frecuencias sonoras para optimizar la coherencia cerebral y la armonización energética.
        </p>
      </div>
    </div>
  );
});
