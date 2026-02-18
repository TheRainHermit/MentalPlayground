import React, { useState } from "react";
import { Link } from "react-router-dom";

const INITIAL_PILAS = [3, 5, 7];

export default function JuegoDelNim() {
  const [pilas, setPilas] = useState([...INITIAL_PILAS]);
  const [turno, setTurno] = useState(1); // 1 o 2
  const [seleccion, setSeleccion] = useState({ pila: null, cantidad: 1 });
  const [mensaje, setMensaje] = useState("");
  const [fin, setFin] = useState(false);

  const handleSeleccionarPila = (idx) => {
    setSeleccion({ pila: idx, cantidad: 1 });
    setMensaje("");
  };

  const handleCantidad = (e) => {
    setSeleccion((sel) => ({
      ...sel,
      cantidad: Math.max(1, Math.min(Number(e.target.value), pilas[sel.pila])),
    }));
  };

  const handleQuitar = () => {
    if (seleccion.pila === null || seleccion.cantidad < 1) {
      setMensaje("Selecciona una pila y una cantidad válida.");
      return;
    }
    if (pilas[seleccion.pila] < seleccion.cantidad) {
      setMensaje("No puedes quitar más de lo que hay.");
      return;
    }
    const nuevasPilas = pilas.map((n, i) =>
      i === seleccion.pila ? n - seleccion.cantidad : n
    );
    setPilas(nuevasPilas);
    if (nuevasPilas.every((n) => n === 0)) {
      setMensaje(`¡Jugador ${turno} gana!`);
      setFin(true);
    } else {
      setTurno(turno === 1 ? 2 : 1);
      setSeleccion({ pila: null, cantidad: 1 });
      setMensaje("");
    }
  };

  const reiniciar = () => {
    setPilas([...INITIAL_PILAS]);
    setTurno(1);
    setSeleccion({ pila: null, cantidad: 1 });
    setMensaje("");
    setFin(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Juego del Nim</h2>
        <p className="mb-4 text-gray-700">
          Hay varias pilas de objetos. En cada turno, elige una pila y quita al menos uno. Gana quien toma el último objeto.
        </p>
        <div className="flex flex-col items-center mb-4 gap-4">
          {pilas.map((cantidad, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <button
                className={`px-3 py-1 rounded ${
                  seleccion.pila === idx
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
                disabled={cantidad === 0 || fin}
                onClick={() => handleSeleccionarPila(idx)}
              >
                Pila {idx + 1}
              </button>
              <div className="flex gap-1">
                {Array(cantidad)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-2xl">●</span>
                  ))}
              </div>
              <span className="text-gray-500 ml-2">{cantidad}</span>
            </div>
          ))}
        </div>
        {!fin && (
          <div className="flex flex-col items-center gap-2 mb-2">
            <div>
              <span className="font-semibold text-blue-700">
                Turno: Jugador {turno}
              </span>
            </div>
            <div>
              <label>
                Cantidad a quitar:{" "}
                <input
                  type="number"
                  min="1"
                  max={seleccion.pila !== null ? pilas[seleccion.pila] : 1}
                  value={seleccion.cantidad}
                  onChange={handleCantidad}
                  disabled={seleccion.pila === null}
                  className="border rounded px-2 py-1 w-16"
                />
              </label>
              <button
                className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={handleQuitar}
                disabled={seleccion.pila === null}
              >
                Quitar
              </button>
            </div>
          </div>
        )}
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