import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Juegos destacados
const destacados = [
  { name: "Sudoku", key: "sudoku" },
  { name: "Ajedrez", key: "ajedrez" },
  { name: "Tres en Raya", key: "tresenraya" },
  { name: "El Cartero Chino", key: "carterochino" },
];

export default function BannerJuegos() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const autoplayDelay = 2500;
  const autoplayRef = useRef();

  // Autoplay
  useEffect(() => {
    autoplayRef.current = () => {
      setActive((prev) => (prev + 1) % destacados.length);
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      autoplayRef.current();
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, []);

  // Flechas
  const goLeft = () => setActive((prev) => (prev - 1 + destacados.length) % destacados.length);
  const goRight = () => setActive((prev) => (prev + 1) % destacados.length);

  // Swipe manual (touch)
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) goLeft();
    else if (delta < -50) goRight();
    touchStartX.current = null;
  };

  return (
    <div className="w-full flex flex-col items-center py-8 relative">
      {/* Flecha izquierda */}
      <button
        aria-label="Anterior"
        onClick={goLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-12 bg-white/80 hover:bg-blue-200 rounded-full shadow p-3 transition"
        style={{ marginLeft: 8 }}
      >
        <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Carrusel central */}
      <div
        className="w-full h-150 flex items-center justify-center overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {destacados.map((game, idx) => (
          <div
            key={game.key}
            className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-300
              ${active === idx ? "opacity-100 scale-100 z-10" : "opacity-0 scale-90 z-0 pointer-events-none"}
              w-full h-full bg-linear-to-tr from-blue-200 to-purple-200 rounded-xl shadow-lg p-6 flex flex-col items-center cursor-pointer border border-blue-100`}
            onClick={() => navigate(`/${game.key}`)}
            style={{ transition: "opacity 0.3s, transform 0.3s" }}
          >
            <div className="w-full h-full mb-4 rounded-full bg-white flex items-center justify-center">
              {/* Placeholder: ícono SVG genérico */}
              <svg
                className="w-10 h-10 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <path d="M8 8h8v8H8z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-blue-800 text-center">
              {game.name}
            </span>
          </div>
        ))}
      </div>
      {/* Flecha derecha */}
      <button
        aria-label="Siguiente"
        onClick={goRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-12 bg-white/80 hover:bg-blue-200 rounded-full shadow p-3 transition"
        style={{ marginRight: 8 }}
      >
        <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-5">
        {destacados.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Ir al juego ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-200
              ${active === idx ? "bg-blue-600 scale-125" : "bg-blue-200"}
            `}
            onClick={() => setActive(idx)}
          />
        ))}
      </div>
    </div>
  );
}