import React, { useState } from "react";
import { Link } from "react-router-dom";

function mezclarCartas(n) {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function OrdenamientoConCartas() {
  const [cartas, setCartas] = useState(() => mezclarCartas(7));
  const [dragged, setDragged] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [movimientos, setMovimientos] = useState(0);

  const handleDragStart = (idx) => setDragged(idx);

  const handleDrop = (idx) => {
    if (dragged === null || dragged === idx) return;
    const nuevasCartas = [...cartas];
    const [carta] = nuevasCartas.splice(dragged, 1);
    nuevasCartas.splice(idx, 0, carta);
    setCartas(nuevasCartas);
    setDragged(null);
    setMovimientos((m) => m + 1);
    if (esOrdenado(nuevasCartas)) {
      setMensaje("¡Felicidades! Has ordenado las cartas.");
    } else {
      setMensaje("");
    }
  };

  const esOrdenado = (arr) => arr.every((v, i, a) => i === 0 || a[i - 1] <= v);

  const reiniciar = () => {
    setCartas(mezclarCartas(7));
    setMensaje("");
    setDragged(null);
    setMovimientos(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Ordenamiento con Cartas</h2>
        <p className="mb-4 text-gray-700">
          Arrastra y suelta las cartas para ordenarlas de menor a mayor.
        </p>
        <div className="flex gap-2 mb-4 transition-all duration-300">
          {cartas.map((carta, idx) => (
            <div
              key={carta}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              className={`w-12 h-16 flex items-center justify-center rounded shadow-md border-2 text-xl font-bold cursor-move select-none transition-all duration-300
                ${dragged === idx ? "border-blue-500 bg-blue-100 scale-110 z-10" : "border-gray-300 bg-white"}
              `}
              style={{
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              {carta}
            </div>
          ))}
        </div>
        <div className="text-lg text-gray-800 mb-2">{mensaje}</div>
        <div className="mb-2 text-gray-600">Movimientos: {movimientos}</div>
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