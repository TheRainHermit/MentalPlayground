import React, { useState } from "react";
import { Link } from "react-router-dom";

// Datos de los personajes y sus tiempos
const PERSONAS = [
  { nombre: "A", tiempo: 1 },
  { nombre: "B", tiempo: 2 },
  { nombre: "C", tiempo: 5 },
  { nombre: "D", tiempo: 10 },
];

export default function PuenteYLaAntorcha() {
  const [ladoIzq, setLadoIzq] = useState(PERSONAS.map((p) => p.nombre));
  const [ladoDer, setLadoDer] = useState([]);
  const [antorcha, setAntorcha] = useState("izq");
  const [seleccion, setSeleccion] = useState([]);
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [fin, setFin] = useState(false);

  const getTiempo = (personas) =>
    Math.max(...personas.map((n) => PERSONAS.find((p) => p.nombre === n).tiempo));

  const mover = () => {
    if (fin) return;
    if (antorcha === "izq") {
      if (seleccion.length < 1 || seleccion.length > 2) {
        setMensaje("Selecciona 1 o 2 personas para cruzar.");
        return;
      }
      const tiempo = getTiempo(seleccion);
      setLadoIzq(ladoIzq.filter((n) => !seleccion.includes(n)));
      setLadoDer([...ladoDer, ...seleccion]);
      setAntorcha("der");
      setTiempoTotal(tiempoTotal + tiempo);
      setSeleccion([]);
      setMensaje(`Cruzaron: ${seleccion.join(", ")} (Tiempo: ${tiempo})`);
      if (ladoIzq.length - seleccion.length === 0) {
        setFin(true);
        setMensaje(`¡Todos cruzaron! Tiempo total: ${tiempoTotal + tiempo}`);
      }
    } else {
      if (seleccion.length !== 1) {
        setMensaje("Selecciona 1 persona para regresar con la antorcha.");
        return;
      }
      const tiempo = getTiempo(seleccion);
      setLadoDer(ladoDer.filter((n) => !seleccion.includes(n)));
      setLadoIzq([...ladoIzq, ...seleccion]);
      setAntorcha("izq");
      setTiempoTotal(tiempoTotal + tiempo);
      setSeleccion([]);
      setMensaje(`Regresó: ${seleccion[0]} (Tiempo: ${tiempo})`);
    }
  };

  const reiniciar = () => {
    setLadoIzq(PERSONAS.map((p) => p.nombre));
    setLadoDer([]);
    setAntorcha("izq");
    setSeleccion([]);
    setTiempoTotal(0);
    setMensaje("");
    setFin(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-blue-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-yellow-700 mb-4">El Puente y la Antorcha</h2>
        <p className="mb-4 text-gray-700">
          Cuatro personas deben cruzar un puente de noche con una antorcha. Solo pueden cruzar 1 o 2 a la vez y deben llevar la antorcha. Cada persona camina a diferente velocidad.
        </p>
        <div className="flex justify-between mb-6">
          <div>
            <h3 className="font-semibold mb-2">Lado Izquierdo</h3>
            <div className="flex flex-wrap gap-2">
              {ladoIzq.map((n) => (
                <button
                  key={n}
                  className={`px-3 py-1 rounded border ${
                    seleccion.includes(n) ? "bg-yellow-300" : "bg-gray-200"
                  }`}
                  disabled={antorcha !== "izq" || fin}
                  onClick={() =>
                    setSeleccion((sel) =>
                      sel.includes(n)
                        ? sel.filter((x) => x !== n)
                        : sel.length < 2
                        ? [...sel, n]
                        : sel
                    )
                  }
                >
                  {n} ({PERSONAS.find((p) => p.nombre === n).tiempo} min)
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Lado Derecho</h3>
            <div className="flex flex-wrap gap-2">
              {ladoDer.map((n) => (
                <button
                  key={n}
                  className={`px-3 py-1 rounded border ${
                    seleccion.includes(n) ? "bg-yellow-300" : "bg-gray-200"
                  }`}
                  disabled={antorcha !== "der" || fin}
                  onClick={() =>
                    setSeleccion((sel) =>
                      sel.includes(n)
                        ? sel.filter((x) => x !== n)
                        : sel.length < 1
                        ? [...sel, n]
                        : sel
                    )
                  }
                >
                  {n} ({PERSONAS.find((p) => p.nombre === n).tiempo} min)
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4 text-lg text-gray-800">
          Antorcha:{" "}
          <span className={antorcha === "izq" ? "text-yellow-700" : "text-blue-700"}>
            {antorcha === "izq" ? "Lado Izquierdo" : "Lado Derecho"}
          </span>
        </div>
        <div className="mb-2 text-gray-700">Tiempo total: {tiempoTotal} min</div>
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition mb-2"
          onClick={mover}
          disabled={fin || seleccion.length === 0}
        >
          {antorcha === "izq" ? "Cruzar" : "Regresar"}
        </button>
        <div className="text-lg text-gray-800 mb-2">{mensaje}</div>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          onClick={reiniciar}
        >
          Reiniciar
        </button>
        <Link
          to="/"
          className="inline-block mt-6 text-yellow-700 hover:underline"
        >
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
}