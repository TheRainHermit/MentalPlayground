import React, { useState } from "react";
import { Link } from "react-router-dom";

const ROWS = 10;
const COLS = 16;

function crearLaberinto() {
  // 0 = libre, 1 = muro
  const grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => (Math.random() < 0.25 ? 1 : 0))
  );
  grid[0][0] = 0; // inicio
  grid[ROWS - 1][COLS - 1] = 0; // fin
  return grid;
}

function getNeighbors(r, c, grid) {
  const moves = [
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ];
  return moves.filter(
    ([nr, nc]) =>
      nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === 0
  );
}

function bfs(grid, setVisitados, setCamino) {
  const queue = [[0, 0]];
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const parent = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  visited[0][0] = true;

  let found = false;
  let visitados = [];

  while (queue.length && !found) {
    const [r, c] = queue.shift();
    visitados.push([r, c]);
    if (r === ROWS - 1 && c === COLS - 1) {
      found = true;
      break;
    }
    for (const [nr, nc] of getNeighbors(r, c, grid)) {
      if (!visited[nr][nc]) {
        visited[nr][nc] = true;
        parent[nr][nc] = [r, c];
        queue.push([nr, nc]);
      }
    }
  }

  setVisitados(visitados);

  // Reconstruir camino
  if (found) {
    let path = [];
    let curr = [ROWS - 1, COLS - 1];
    while (curr) {
      path.push(curr);
      curr = parent[curr[0]][curr[1]];
    }
    setCamino(path.reverse());
  } else {
    setCamino([]);
  }
}

function dfs(grid, setVisitados, setCamino) {
  const stack = [[0, 0]];
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const parent = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  visited[0][0] = true;

  let found = false;
  let visitados = [];

  while (stack.length && !found) {
    const [r, c] = stack.pop();
    visitados.push([r, c]);
    if (r === ROWS - 1 && c === COLS - 1) {
      found = true;
      break;
    }
    for (const [nr, nc] of getNeighbors(r, c, grid)) {
      if (!visited[nr][nc]) {
        visited[nr][nc] = true;
        parent[nr][nc] = [r, c];
        stack.push([nr, nc]);
      }
    }
  }

  setVisitados(visitados);

  // Reconstruir camino
  if (found) {
    let path = [];
    let curr = [ROWS - 1, COLS - 1];
    while (curr) {
      path.push(curr);
      curr = parent[curr[0]][curr[1]];
    }
    setCamino(path.reverse());
  } else {
    setCamino([]);
  }
}

export default function LaberintosBFSDFS() {
  const [grid, setGrid] = useState(() => crearLaberinto());
  const [visitados, setVisitados] = useState([]);
  const [camino, setCamino] = useState([]);
  const [algoritmo, setAlgoritmo] = useState("BFS");
  const [resuelto, setResuelto] = useState(false);

  const resolver = () => {
    setVisitados([]);
    setCamino([]);
    setResuelto(false);
    setTimeout(() => {
      if (algoritmo === "BFS") {
        bfs(grid, setVisitados, setCamino);
      } else {
        dfs(grid, setVisitados, setCamino);
      }
      setResuelto(true);
    }, 100);
  };

  const nuevoLaberinto = () => {
    setGrid(crearLaberinto());
    setVisitados([]);
    setCamino([]);
    setResuelto(false);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Laberintos (BFS/DFS)</h2>
        <p className="mb-4 text-gray-700">
          Resuelve el laberinto usando BFS (anchura) o DFS (profundidad). El inicio está en la esquina superior izquierda y la meta en la inferior derecha.
        </p>
        <div className="flex gap-4 mb-4">
          <select
            value={algoritmo}
            onChange={(e) => setAlgoritmo(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="BFS">BFS (Anchura)</option>
            <option value="DFS">DFS (Profundidad)</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={resolver}
          >
            Resolver
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            onClick={nuevoLaberinto}
          >
            Nuevo laberinto
          </button>
        </div>
        <div className="overflow-auto">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 24px)`,
              gridTemplateRows: `repeat(${ROWS}, 24px)`,
            }}
          >
            {grid.map((fila, i) =>
              fila.map((celda, j) => {
                const esVisitado = visitados.some(([r, c]) => r === i && c === j);
                const esCamino = camino.some(([r, c]) => r === i && c === j);
                const esInicio = i === 0 && j === 0;
                const esFin = i === ROWS - 1 && j === COLS - 1;
                return (
                  <div
                    key={`${i}-${j}`}
                    className={`w-6 h-6 border border-gray-300 flex items-center justify-center text-xs
                      ${celda === 1 ? "bg-gray-800" : esInicio ? "bg-green-400" : esFin ? "bg-red-400" : esCamino ? "bg-yellow-300" : esVisitado ? "bg-blue-200" : "bg-white"}
                    `}
                  >
                    {esInicio ? "I" : esFin ? "F" : ""}
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="mt-4 text-lg text-gray-800">
          {resuelto && camino.length > 0 && "¡Camino encontrado!"}
          {resuelto && camino.length === 0 && "No hay camino posible."}
        </div>
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