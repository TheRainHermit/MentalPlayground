import React, { useState } from "react";
import { Link } from "react-router-dom";

// Verifica si un número es válido en la posición
function esValido(tablero, fila, col, num) {
  for (let i = 0; i < 9; i++) {
    if (tablero[fila][i] === num || tablero[i][col] === num) return false;
  }
  const startRow = Math.floor(fila / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (tablero[r][c] === num) return false;
    }
  }
  return true;
}

// Genera un Sudoku completo usando backtracking
function generarSudokuCompleto() {
  const tablero = Array.from({ length: 9 }, () => Array(9).fill(0));
  function fill(r = 0, c = 0) {
    if (r === 9) return true;
    const nextR = c === 8 ? r + 1 : r;
    const nextC = c === 8 ? 0 : c + 1;
    const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
    for (let num of nums) {
      if (esValido(tablero, r, c, num)) {
        tablero[r][c] = num;
        if (fill(nextR, nextC)) return true;
        tablero[r][c] = 0;
      }
    }
    return false;
  }
  fill();
  return tablero;
}

// Quita celdas para crear el puzzle
function ocultarCeldas(tableroCompleto, vacias = 40) {
  const tablero = tableroCompleto.map((fila) => [...fila]);
  let count = 0;
  while (count < vacias) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (tablero[r][c] !== 0) {
      tablero[r][c] = 0;
      count++;
    }
  }
  return tablero;
}

function esCompleto(tablero) {
  return tablero.every((fila) => fila.every((v) => v !== 0));
}

export default function Sudoku() {
  // Aleatoriza el tablero inicial al montar el componente
  const [tableroInicial, setTableroInicial] = useState(() => {
    const completo = generarSudokuCompleto();
    return ocultarCeldas(completo, 40);
  });
  const [tablero, setTablero] = useState(() =>
    tableroInicial.map((fila) => [...fila])
  );
  const [mensaje, setMensaje] = useState("");

  const handleChange = (fila, col, valor) => {
    const num = Number(valor);
    if (num < 1 || num > 9) return;
    if (tableroInicial[fila][col] !== 0) return; // No modificar celdas fijas
    if (!esValido(tablero, fila, col, num)) {
      setMensaje("Ese número no es válido en esa celda.");
      return;
    }
    const nuevoTablero = tablero.map((f, i) =>
      f.map((v, j) => (i === fila && j === col ? num : v))
    );
    setTablero(nuevoTablero);
    setMensaje("");
    if (esCompleto(nuevoTablero)) {
      setMensaje("¡Sudoku completo y válido!");
    }
  };

  const reiniciar = () => {
    const completo = generarSudokuCompleto();
    const nuevoInicial = ocultarCeldas(completo, 40);
    setTableroInicial(nuevoInicial);
    setTablero(nuevoInicial.map((fila) => [...fila]));
    setMensaje("");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-blue-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Sudoku</h2>
        <p className="mb-4 text-gray-700">
          Completa el tablero de Sudoku. Haz clic en una celda vacía para ingresar un número. El tablero se aleatoriza en cada reinicio.
        </p>
        <div className="flex flex-col items-center mb-4">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(9, 32px)",
              gridTemplateRows: "repeat(9, 32px)",
            }}
          >
            {tablero.map((fila, i) =>
              fila.map((valor, j) => (
                <input
                  key={`${i}-${j}`}
                  type="text"
                  value={valor === 0 ? "" : valor}
                  maxLength={1}
                  disabled={tableroInicial[i][j] !== 0}
                  onChange={(e) => handleChange(i, j, e.target.value)}
                  className={`w-8 h-8 text-center border border-gray-400 text-lg font-bold
                    ${tableroInicial[i][j] !== 0 ? "bg-blue-100 text-blue-700" : "bg-white"}
                    ${((i % 3 === 2 && i !== 8) ? "border-b-2" : "")}
                    ${((j % 3 === 2 && j !== 8) ? "border-r-2" : "")}
                  `}
                />
              ))
            )}
          </div>
        </div>
        <div className="text-lg text-gray-800 mb-2">{mensaje}</div>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          onClick={reiniciar}
        >
          Reiniciar (nuevo tablero)
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