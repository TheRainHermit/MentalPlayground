import React from "react";
import { useNavigate } from "react-router-dom";

const games = [
  { name: "Las 12 Monedas", key: "las12monedas" },
  { name: "Adivina el Número", key: "adivinaelnumero" },
  { name: "Torres de Hanói", key: "torresdehanoi" },
  { name: "Lobo, Cabra y Col", key: "lobocabra" },
  { name: "N-Reinas", key: "nreinas" },
  { name: "Sudoku", key: "sudoku" },
  { name: "Tres en Raya", key: "tresenraya" },
  { name: "Conecta 4", key: "conecta4" },
  { name: "Laberintos (BFS/DFS)", key: "laberintos" },
  { name: "Juego del Nim", key: "nim" },
  { name: "Puente y la Antorcha", key: "puente" },
  { name: "Ordenamiento con Cartas", key: "ordenamientocartas" },
  { name: "El Cartero Chino", key: "carterochino" },
  { name: "Ajedrez", key: "ajedrez" },
];

export default function Juegos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 flex flex-col w-screen items-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Catálogo de Juegos</h2>
        <p className="text-gray-700">Explora y selecciona un juego para comenzar.</p>
      </div>
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
          {games.map((game) => (
            <div
              key={game.key}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col items-center cursor-pointer border border-transparent hover:border-blue-400 group"
              onClick={() => navigate(`/${game.key}`)}
            >
              <div className="w-16 h-16 mb-3 rounded-full bg-gradient-to-tr from-blue-200 to-purple-200 flex items-center justify-center overflow-hidden">
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
              <span className="text-base md:text-lg font-semibold text-gray-800 text-center group-hover:text-blue-700 transition-colors">
                {game.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}