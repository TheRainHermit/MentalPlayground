import React, { useState } from "react";
import { Link } from "react-router-dom";

const ROWS = 6;
const COLS = 7;

function crearTablero() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function verificarGanador(tablero, jugador) {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        tablero[r][c] === jugador &&
        tablero[r][c + 1] === jugador &&
        tablero[r][c + 2] === jugador &&
        tablero[r][c + 3] === jugador
      ) {
        return true;
      }
    }
  }
  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      if (
        tablero[r][c] === jugador &&
        tablero[r + 1][c] === jugador &&
        tablero[r + 2][c] === jugador &&
        tablero[r + 3][c] === jugador
      ) {
        return true;
      }
    }
  }
  // Diagonal descendente
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        tablero[r][c] === jugador &&
        tablero[r + 1][c + 1] === jugador &&
        tablero[r + 2][c + 2] === jugador &&
        tablero[r + 3][c + 3] === jugador
      ) {
        return true;
      }
    }
  }
  // Diagonal ascendente
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        tablero[r][c] === jugador &&
        tablero[r - 1][c + 1] === jugador &&
        tablero[r - 2][c + 2] === jugador &&
        tablero[r - 3][c + 3] === jugador
      ) {
        return true;
      }
    }
  }
  return false;
}

export default function Conecta4() {
  const [tablero, setTablero] = useState(crearTablero());
  const [turno, setTurno] = useState("rojo");
  const [ganador, setGanador] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const jugarColumna = (col) => {
    if (ganador) return;
    // Encuentra la fila más baja disponible en la columna
    const fila = [...Array(ROWS).keys()]
      .reverse()
      .find((r) => !tablero[r][col]);
    if (fila === undefined) {
      setMensaje("Columna llena.");
      return;
    }
    const nuevoTablero = tablero.map((row) => [...row]);
    nuevoTablero[fila][col] = turno;
    if (verificarGanador(nuevoTablero, turno)) {
      setTablero(nuevoTablero);
      setGanador(turno);
      setMensaje(`¡${turno === "rojo" ? "Rojo" : "Amarillo"} gana!`);
      return;
    }
    setTablero(nuevoTablero);
    setTurno(turno === "rojo" ? "amarillo" : "rojo");
    setMensaje("");
  };

  const reiniciar = () => {
    setTablero(crearTablero());
    setTurno("rojo");
    setGanador(null);
    setMensaje("");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Conecta 4</h2>
        <p className="mb-4 text-gray-700">
          Turno:{" "}
          <span className={turno === "rojo" ? "text-red-600" : "text-yellow-500"}>
            {turno === "rojo" ? "Rojo" : "Amarillo"}
          </span>
        </p>
        <div className="flex flex-col items-center mb-4">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, 40px)` }}>
            {tablero.map((fila, i) =>
              fila.map((celda, j) => (
                <div
                  key={`${i}-${j}`}
                  className="w-10 h-10 border border-gray-400 flex items-center justify-center"
                  style={{
                    backgroundColor: (i + j) % 2 === 0 ? "#f3f4f6" : "#fff",
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${
                      celda === "rojo"
                        ? "bg-red-500"
                        : celda === "amarillo"
                        ? "bg-yellow-400"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              ))
            )}
          </div>
          <div className="flex mt-2 gap-2">
            {Array(COLS)
              .fill(0)
              .map((_, col) => (
                <button
                  key={col}
                  className="w-10 h-8 bg-blue-200 rounded hover:bg-blue-400 transition"
                  onClick={() => jugarColumna(col)}
                  disabled={ganador}
                >
                  ↓
                </button>
              ))}
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