import React, { useState } from "react";
import { Link } from "react-router-dom";

function calcularGanador(tablero) {
  const lineas = [
    // Filas
    [ [0,0], [0,1], [0,2] ],
    [ [1,0], [1,1], [1,2] ],
    [ [2,0], [2,1], [2,2] ],
    // Columnas
    [ [0,0], [1,0], [2,0] ],
    [ [0,1], [1,1], [2,1] ],
    [ [0,2], [1,2], [2,2] ],
    // Diagonales
    [ [0,0], [1,1], [2,2] ],
    [ [0,2], [1,1], [2,0] ],
  ];
  for (let linea of lineas) {
    const [a, b, c] = linea;
    if (
      tablero[a[0]][a[1]] &&
      tablero[a[0]][a[1]] === tablero[b[0]][b[1]] &&
      tablero[a[0]][a[1]] === tablero[c[0]][c[1]]
    ) {
      return tablero[a[0]][a[1]];
    }
  }
  return null;
}

export default function TresEnRaya() {
  const [tablero, setTablero] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [turno, setTurno] = useState("X");
  const [mensaje, setMensaje] = useState("");
  const ganador = calcularGanador(tablero);
  const esEmpate =
    !ganador && tablero.flat().every((v) => v !== "");

  const handleClick = (fila, col) => {
    if (tablero[fila][col] || ganador || esEmpate) return;
    const nuevoTablero = tablero.map((f, i) =>
      f.map((v, j) => (i === fila && j === col ? turno : v))
    );
    setTablero(nuevoTablero);
    setTurno(turno === "X" ? "O" : "X");
    setMensaje("");
  };

  const reiniciar = () => {
    setTablero([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setTurno("X");
    setMensaje("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Tres en Raya</h2>
        <p className="mb-4 text-gray-700">
          Haz clic en una celda para colocar tu ficha. Gana quien logre tres en línea.
        </p>
        <div className="flex flex-col items-center mb-4">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(3, 48px)",
              gridTemplateRows: "repeat(3, 48px)",
            }}
          >
            {tablero.map((fila, i) =>
              fila.map((valor, j) => (
                <button
                  key={`${i}-${j}`}
                  className={`w-12 h-12 border-2 border-gray-400 text-2xl font-bold bg-white hover:bg-blue-100 transition`}
                  onClick={() => handleClick(i, j)}
                  disabled={valor || ganador || esEmpate}
                >
                  {valor}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="text-lg text-gray-800 mb-2">
          {ganador
            ? `¡Ganó ${ganador}!`
            : esEmpate
            ? "¡Empate!"
            : `Turno: ${turno}`}
        </div>
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