import React, { useState } from "react";
import { Link } from "react-router-dom";

const N = 8;

function crearTablero(n) {
  return Array.from({ length: n }, () => Array(n).fill(false));
}

function esSeguro(tablero, fila, col) {
  // Verifica la columna
  for (let i = 0; i < fila; i++) {
    if (tablero[i][col]) return false;
  }
  // Verifica diagonal superior izquierda
  for (let i = fila - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (tablero[i][j]) return false;
  }
  // Verifica diagonal superior derecha
  for (let i = fila - 1, j = col + 1; i >= 0 && j < N; i--, j++) {
    if (tablero[i][j]) return false;
  }
  return true;
}

export default function NReinas() {
  const [tablero, setTablero] = useState(() => crearTablero(N));
  const [mensaje, setMensaje] = useState("");
  const [reinasColocadas, setReinasColocadas] = useState(0);

  const colocarReina = (fila, col) => {
    if (tablero[fila][col]) {
      // Quitar reina
      const nuevoTablero = tablero.map((r, i) =>
        r.map((c, j) => (i === fila && j === col ? false : c))
      );
      setTablero(nuevoTablero);
      setReinasColocadas(reinasColocadas - 1);
      setMensaje("");
      return;
    }
    if (!esSeguro(tablero, fila, col)) {
      setMensaje("No puedes colocar una reina aquí.");
      return;
    }
    const nuevoTablero = tablero.map((r, i) =>
      r.map((c, j) => (i === fila && j === col ? true : c))
    );
    setTablero(nuevoTablero);
    setReinasColocadas(reinasColocadas + 1);
    setMensaje("");
    if (reinasColocadas + 1 === N) {
      setMensaje("¡Felicidades! Has colocado todas las reinas.");
    }
  };

  const reiniciar = () => {
    setTablero(crearTablero(N));
    setMensaje("");
    setReinasColocadas(0);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">N-Reinas</h2>
        <p className="mb-4 text-gray-700">
          Coloca {N} reinas en el tablero de ajedrez sin que se amenacen entre sí.
          Haz clic en una celda para colocar o quitar una reina.
        </p>
        <div className="flex flex-col items-center mb-4">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${N}, 32px)` }}>
            {tablero.map((fila, i) =>
              fila.map((celda, j) => (
                <button
                  key={`${i}-${j}`}
                  className={`w-8 h-8 border border-gray-400 flex items-center justify-center text-lg
                    ${celda ? "bg-purple-400 text-white" : (i + j) % 2 === 0 ? "bg-gray-200" : "bg-white"}
                  `}
                  onClick={() => colocarReina(i, j)}
                >
                  {celda ? "♛" : ""}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="text-lg text-gray-800 mb-2">{mensaje}</div>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          onClick={reiniciar}
        >
          Reiniciar
        </button>
        <Link
          to="/"
          className="inline-block mt-6 text-blue-600 hover:underline"
        >
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
}