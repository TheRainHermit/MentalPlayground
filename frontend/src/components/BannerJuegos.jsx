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
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);
  const itemWidth = 220; // px, ajusta según tu diseño
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

  // Scroll al slide activo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: active * itemWidth,
        behavior: "smooth",
      });
    }
  }, [active]);

  // Flechas
  const goLeft = () => setActive((prev) => (prev - 1 + destacados.length) % destacados.length);
  const goRight = () => setActive((prev) => (prev + 1) % destacados.length);

  // Sync con scroll manual
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / itemWidth);
    setActive(idx);
  };

  return (
    <div className="w-full py-4 relative">
      {/* Flecha izquierda */}
      <button
        aria-label="Anterior"
        onClick={goLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-blue-200 rounded-full shadow p-2 transition hidden sm:block"
        style={{ marginLeft: 4 }}
      >
        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Carrusel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-2 scrollbar-hide scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
        onScroll={handleScroll}
      >
        {destacados.map((game, idx) => (
          <div
            key={game.key}
            className={`min-w-[200px] max-w-[220px] bg-gradient-to-tr from-blue-200 to-purple-200 rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer transition-transform border border-blue-100
              ${active === idx ? "scale-105 ring-2 ring-blue-400" : "hover:scale-105"}
            `}
            onClick={() => navigate(`/${game.key}`)}
          >
            <div className="w-12 h-12 mb-2 rounded-full bg-white flex items-center justify-center">
              {/* Placeholder: ícono SVG genérico */}
              <svg
                className="w-8 h-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <path d="M8 8h8v8H8z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-blue-800 text-center">
              {game.name}
            </span>
          </div>
        ))}
      </div>
      {/* Flecha derecha */}
      <button
        aria-label="Siguiente"
        onClick={goRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-blue-200 rounded-full shadow p-2 transition hidden sm:block"
        style={{ marginRight: 4 }}
      >
        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-3">
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