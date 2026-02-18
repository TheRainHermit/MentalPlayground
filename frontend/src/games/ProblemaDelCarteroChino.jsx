import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

// --- Lógica del grafo y cartero chino ---

const NODOS = 6;

function inicializarGrafo() {
  const matriz = Array.from({ length: NODOS }, () => Array(NODOS).fill(0));
  matriz[0][1] = matriz[1][0] = 1;
  matriz[1][2] = matriz[2][1] = 1;
  matriz[2][3] = matriz[3][2] = 1;
  matriz[3][4] = matriz[4][3] = 1;
  matriz[4][5] = matriz[5][4] = 1;
  matriz[5][0] = matriz[0][5] = 1;
  matriz[1][4] = matriz[4][1] = 1;
  return matriz;
}

// Convierte la matriz de adyacencia a nodos y edges para React Flow
function matrizAGrafoReactFlow(matriz, recorrido = [], animStep = null) {
  const N = matriz.length;
  const nodes = Array.from({ length: N }, (_, i) => ({
    id: (i + 1).toString(),
    data: { label: `Nodo ${i + 1}` },
    position: {
      x: 250 + 180 * Math.cos((2 * Math.PI * i) / N),
      y: 200 + 180 * Math.sin((2 * Math.PI * i) / N),
    },
    style: {
      background:
        animStep !== null && recorrido[animStep] === i
          ? "#f59e42"
          : recorrido.slice(0, animStep !== null ? animStep + 1 : recorrido.length).includes(i)
          ? "#fde68a"
          : "#bae6fd",
      border: "2px solid #2563eb",
      width: 48,
      height: 48,
      fontWeight: "bold",
      fontSize: 18,
    },
  }));

  const edges = [];
  matriz.forEach((fila, i) =>
    fila.forEach((peso, j) => {
      if (peso > 0 && i < j) {
        let highlight = false;
        let animHighlight = false;
        if (recorrido.length > 1) {
          for (let k = 1; k < (animStep !== null ? animStep + 1 : recorrido.length); k++) {
            const a = recorrido[k - 1];
            const b = recorrido[k];
            if (
              (a === i && b === j) ||
              (a === j && b === i)
            ) {
              highlight = true;
              if (animStep !== null && k === animStep) animHighlight = true;
              break;
            }
          }
        }
        edges.push({
          id: `${i + 1}-${j + 1}`,
          source: (i + 1).toString(),
          target: (j + 1).toString(),
          label: peso.toString(),
          animated: animHighlight,
          style: {
            stroke: animHighlight
              ? "#f59e42"
              : highlight
              ? "#fde68a"
              : "#2563eb",
            strokeWidth: animHighlight ? 4 : highlight ? 3 : 2,
          },
          labelStyle: { fontWeight: "bold", fill: "#1e293b" },
        });
      }
    })
  );
  return { nodes, edges };
}

// Euleriano
function buscarCicloEuleriano(matriz) {
  const grados = matriz.map((fila) =>
    fila.reduce((acc, v) => acc + (v > 0 ? 1 : 0), 0)
  );
  if (grados.some((g) => g % 2 !== 0)) return null;
  const recorrido = [];
  const copia = matriz.map((fila) => [...fila]);
  function dfs(u) {
    for (let v = 0; v < NODOS; v++) {
      while (copia[u][v] > 0) {
        copia[u][v]--;
        copia[v][u]--;
        dfs(v);
      }
    }
    recorrido.push(u);
  }
  dfs(0);
  return recorrido.reverse();
}

// Cartero chino para grafos no Eulerianos
function nodosImpares(matriz) {
  return matriz
    .map((fila, i) =>
      fila.reduce((acc, v) => acc + (v > 0 ? 1 : 0), 0) % 2 !== 0 ? i : null
    )
    .filter((v) => v !== null);
}

function dijkstra(matriz, start) {
  const dist = Array(matriz.length).fill(Infinity);
  const prev = Array(matriz.length).fill(null);
  dist[start] = 0;
  const queue = [...Array(matriz.length).keys()];
  while (queue.length) {
    const u = queue.reduce((min, v) => (dist[v] < dist[min] ? v : min), queue[0]);
    queue.splice(queue.indexOf(u), 1);
    matriz[u].forEach((peso, v) => {
      if (peso > 0 && dist[u] + peso < dist[v]) {
        dist[v] = dist[u] + peso;
        prev[v] = u;
      }
    });
  }
  return { dist, prev };
}

function emparejamientoMinimo(matriz, impares) {
  let mejor = null;
  let mejorPeso = Infinity;
  function backtrack(pares, usados, pesoTotal) {
    if (pares.length === impares.length / 2) {
      if (pesoTotal < mejorPeso) {
        mejor = pares.slice();
        mejorPeso = pesoTotal;
      }
      return;
    }
    for (let i = 0; i < impares.length; i++) {
      if (usados[i]) continue;
      usados[i] = true;
      for (let j = i + 1; j < impares.length; j++) {
        if (usados[j]) continue;
        usados[j] = true;
        const { dist } = dijkstra(matriz, impares[i]);
        backtrack(
          [...pares, [impares[i], impares[j]]],
          usados,
          pesoTotal + dist[impares[j]]
        );
        usados[j] = false;
      }
      usados[i] = false;
      break;
    }
  }
  backtrack([], Array(impares.length).fill(false), 0);
  return mejor;
}

function duplicarAristas(matriz, pares) {
  const nueva = matriz.map((fila) => [...fila]);
  pares.forEach(([a, b]) => {
    const { prev } = dijkstra(matriz, a);
    let curr = b;
    while (curr !== a) {
      nueva[curr][prev[curr]] += 1;
      nueva[prev[curr]][curr] += 1;
      curr = prev[curr];
    }
  });
  return nueva;
}

// --- Componente principal ---

export default function ProblemaDelCarteroChino() {
  const [matriz, setMatriz] = useState(() => inicializarGrafo());
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);
  const [peso, setPeso] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [recorrido, setRecorrido] = useState([]);
  const [grafoModificado, setGrafoModificado] = useState(null);
  const [animStep, setAnimStep] = useState(null);
  const [animando, setAnimando] = useState(false);

  const agregarArista = () => {
    if (from === to || peso < 1) {
      setMensaje("Selecciona nodos distintos y peso válido.");
      return;
    }
    const nueva = matriz.map((fila) => [...fila]);
    nueva[from][to] += peso;
    nueva[to][from] += peso;
    setMatriz(nueva);
    setMensaje("");
    setRecorrido([]);
    setGrafoModificado(null);
    setAnimStep(null);
    setAnimando(false);
  };

  const calcularRecorrido = () => {
    const impares = nodosImpares(matriz);
    let matrizFinal = matriz;
    let info = "";
    if (impares.length > 0) {
      info = `Nodos de grado impar: ${impares.map((i) => i + 1).join(", ")}. Añadiendo aristas óptimas... `;
      const pares = emparejamientoMinimo(matriz, impares);
      matrizFinal = duplicarAristas(matriz, pares);
      setGrafoModificado(matrizFinal);
    } else {
      setGrafoModificado(null);
    }
    const ciclo = buscarCicloEuleriano(matrizFinal);
    if (ciclo) {
      setRecorrido(ciclo);
      setMensaje(info + "¡Recorrido óptimo encontrado!");
      setAnimStep(null);
      setAnimando(false);
    } else {
      setRecorrido([]);
      setMensaje("No existe ciclo Euleriano.");
      setAnimStep(null);
      setAnimando(false);
    }
  };

  const reiniciar = () => {
    setMatriz(inicializarGrafo());
    setRecorrido([]);
    setMensaje("");
    setGrafoModificado(null);
    setAnimStep(null);
    setAnimando(false);
  };

  // Animación del recorrido
  useEffect(() => {
    if (animando && recorrido.length > 1) {
      setAnimStep(1);
      let step = 1;
      const interval = setInterval(() => {
        step++;
        if (step > recorrido.length - 1) {
          clearInterval(interval);
          setAnimando(false);
        } else {
          setAnimStep(step);
        }
      }, 700);
      return () => clearInterval(interval);
    }
  }, [animando, recorrido]);

  const iniciarAnimacion = () => {
    if (recorrido.length > 1) {
      setAnimando(true);
      setAnimStep(1);
    }
  };

  // Visualización con React Flow
  const { nodes, edges } = useMemo(
    () => matrizAGrafoReactFlow(grafoModificado || matriz, recorrido, animStep),
    [matriz, grafoModificado, recorrido, animStep]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Problema del Cartero Chino</h2>
        <p className="mb-4 text-gray-700">
          Visualiza el grafo y encuentra el recorrido óptimo para recorrer todas las calles (aristas) al menos una vez. Si el grafo no es Euleriano, se añaden aristas óptimas automáticamente.
        </p>
        <div className="mb-4 flex gap-2 items-center">
          <label>
            De:
            <select
              value={from}
              onChange={(e) => setFrom(Number(e.target.value))}
              className="border rounded px-2 py-1 mx-1"
            >
              {Array(NODOS)
                .fill(0)
                .map((_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
            </select>
          </label>
          <label>
            A:
            <select
              value={to}
              onChange={(e) => setTo(Number(e.target.value))}
              className="border rounded px-2 py-1 mx-1"
            >
              {Array(NODOS)
                .fill(0)
                .map((_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Peso:
            <input
              type="number"
              min="1"
              value={peso}
              onChange={(e) => setPeso(Number(e.target.value))}
              className="border rounded px-2 py-1 mx-1 w-16"
            />
          </label>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={agregarArista}
          >
            Agregar arista
          </button>
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mr-2"
            onClick={calcularRecorrido}
          >
            Calcular recorrido
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mr-2"
            onClick={iniciarAnimacion}
            disabled={recorrido.length < 2 || animando}
          >
            Animar recorrido
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            onClick={reiniciar}
          >
            Reiniciar
          </button>
        </div>
        <div className="mb-4" style={{ width: "100%", height: 420 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={true}
            zoomOnScroll={true}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="mb-4 text-lg text-gray-800">{mensaje}</div>
        {recorrido.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Recorrido Euleriano:</h3>
            <div className="flex flex-wrap gap-2">
              {recorrido.map((nodo, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded font-bold ${
                    animStep !== null && animStep === idx
                      ? "bg-orange-400 text-white"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {nodo + 1}
                </span>
              ))}
            </div>
          </div>
        )}
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