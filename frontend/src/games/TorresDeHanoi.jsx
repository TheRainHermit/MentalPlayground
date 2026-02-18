import React, { useState } from "react";
import { Link } from "react-router-dom";

const NUM_DISCOS = 3;

function inicializarTorres(numDiscos) {
  return [
    Array.from({ length: numDiscos }, (_, i) => numDiscos - i),
    [],
    [],
  ];
}

export default function TorresDeHanoi() {
  const [torres, setTorres] = useState(() => inicializarTorres(NUM_DISCOS));
  const [seleccion, setSeleccion] = useState({ desde: null, hacia: null });
  const [movimientos, setMovimientos] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [ganaste, setGanaste] = useState(false);

  const moverDisco = () => {
    const { desde, hacia } = seleccion;
    if (desde === null || hacia === null || desde === hacia) {
      setMensaje("Selecciona torres válidas.");
      return;
    }
    const origen = [...torres[desde]];
    const destino = [...torres[hacia]];
    const disco = origen[origen.length - 1];
    if (!disco) {
      setMensaje("No hay disco para mover.");
      return;
    }
    if (destino.length > 0 && destino[destino.length - 1] < disco) {
      setMensaje("No puedes poner un disco grande sobre uno pequeño.");
      return;
    }
    origen.pop();
    destino.push(disco);
    const nuevasTorres = torres.map((t, idx) =>
      idx === desde ? origen : idx === hacia ? destino : t
    );
    setTorres(nuevasTorres);
    setMovimientos(movimientos + 1);
    setMensaje("");
    setSeleccion({ desde: null, hacia: null });
    if (
      nuevasTorres[2].length === NUM_DISCOS &&
      nuevasTorres[2].join(",") ===
        Array.from({ length: NUM_DISCOS }, (_, i) => NUM_DISCOS - i).join(",")
    ) {
      setGanaste(true);
      setMensaje("¡Has resuelto las Torres de Hanói!");
    }
  };

  const reiniciar = () => {
    setTorres(inicializarTorres(NUM_DISCOS));
    setMovimientos(0);
    setMensaje("");
    setGanaste(false);
    setSeleccion({ desde: null, hacia: null });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Torres de Hanói</h2>
        <p className="mb-4 text-gray-700">
          Mueve todos los discos de la torre izquierda a la derecha, siguiendo las reglas:
          <br />
          - Solo puedes mover un disco a la vez.<br />
          - No puedes poner un disco grande sobre uno pequeño.
        </p>
        <div className="flex justify-between mb-6">
          {torres.map((torre, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <button
                className={`mb-2 px-2 py-1 rounded ${
                  seleccion.desde === idx
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
                disabled={ganaste}
                onClick={() =>
                  setSeleccion((sel) =>
                    sel.desde === null
                      ? { ...sel, desde: idx }
                      : { ...sel, hacia: idx }
                  )
                }
              >
                {seleccion.desde === null
                  ? "Seleccionar origen"
                  : "Seleccionar destino"}
              </button>
              <div className="h-32 w-16 flex flex-col-reverse items-center border border-gray-300 rounded bg-gray-50">
                {torre.map((disco, i) => (
                  <div
                    key={i}
                    className={`mb-1 h-6 rounded bg-purple-400`}
                    style={{
                      width: `${disco * 20}px`,
                      marginLeft: `${8 - disco * 2}px`,
                    }}
                  >
                    <span className="text-xs text-white px-2">{disco}</span>
                  </div>
                ))}
              </div>
              <span className="mt-2 text-sm text-gray-600">Torre {idx + 1}</span>
            </div>
          ))}
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-2"
          onClick={moverDisco}
          disabled={ganaste}
        >
          Mover disco
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition ml-2 mb-2"
          onClick={reiniciar}
        >
          Reiniciar
        </button>
        <div className="mt-2 text-lg text-gray-800">{mensaje}</div>
        <div className="mt-2 text-sm text-gray-500">Movimientos: {movimientos}</div>
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