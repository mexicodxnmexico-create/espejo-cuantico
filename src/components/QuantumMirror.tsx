import React, { useState, useEffect } from 'react';

const QuantumMirror = () => {
  const [rotation, setRotation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [frequency, setFrequency] = useState(432);
  const [history, setHistory] = useState([
    "Iniciando secuencia de sincronización...",
    "Buscando resonancia cuántica..."
  ]);

  // 1. Lógica de Sensores y Frecuencia
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setRotation({
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0
      });
      // La frecuencia cambia sutilmente con la inclinación
      setFrequency(432 + (e.beta ? Math.round(e.beta / 10) : 0));
    };

    window.addEventListener('deviceorientation', handleOrientation);
    
    // Intervalo para mensajes aleatorios en el historial
    const messages = [
      "Entropía estabilizada", 
      "Reflejo de alma detectado", 
      "Sincronizando con nodo local", 
      "Frecuencia 5D alcanzada"
    ];
    
    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setHistory(prev => [randomMsg, ...prev].slice(0, 5));
    }, 5000);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6 font-mono flex flex-col items-center justify-center">
      {/* Espejo Visual */}
      <div 
        className="w-64 h-64 rounded-full border-2 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.5)] flex items-center justify-center overflow-hidden relative"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.beta * 0.2}deg) rotateY(${rotation.gamma * 0.2}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 to-transparent animate-pulse" />
        <span className="text-4xl font-bold z-10">{frequency}Hz</span>
      </div>

      {/* Historial de Eventos */}
      <div className="mt-12 w-full max-w-md border border-cyan-900 bg-black/50 p-4 rounded-lg">
        <h3 className="text-xs uppercase tracking-widest text-cyan-700 mb-4 font-bold underline">Historial de Eventos</h3>
        <ul className="space-y-2">
          {history.map((msg, i) => (
            <li key={i} className="text-sm opacity-80 animate-fade-in">
              <span className="text-cyan-600 mr-2">{'>'}</span> {msg}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Datos Técnicos Sutiles */}
      <div className="absolute bottom-4 left-4 text-[10px] text-cyan-900 uppercase">
        AXON-60_CORE: {rotation.alpha.toFixed(1)} / {rotation.beta.toFixed(1)}
      </div>
    </div>
  );
};

export default QuantumMirror;
                       
