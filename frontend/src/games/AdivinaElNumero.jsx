import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AdivinaElNumero() {
  const [numeroSecreto] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [intento, setIntento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [ganaste, setGanaste] = useState(false);

  const handleChange = (e) => setIntento(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(intento, 10);
    if (isNaN(num)) {
      setMensaje("Por favor, ingresa un número válido.");
      return;
    }
    setIntentos((prev) => prev + 1);
    if (num === numeroSecreto) {
      setMensaje(`¡Correcto! El número era ${numeroSecreto}.`);
      setGanaste(true);
    } else if (num < numeroSecreto) {
      setMensaje("Demasiado bajo.");
    } else {
      setMensaje("Demasiado alto.");
    }
  };

  const reiniciar = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Adivina el Número</h2>
        <p className="mb-4 text-gray-700">
          Elige un número entre 1 y 100. ¿Puedes adivinar el número secreto?
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            min="1"
            max="100"
            value={intento}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            disabled={ganaste}
            placeholder="Tu intento"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={ganaste}
          >
            Probar
          </button>
        </form>
        <div className="mt-4 text-lg text-gray-800">{mensaje}</div>
        <div className="mt-2 text-sm text-gray-500">Intentos: {intentos}</div>
        {ganaste && (
          <button
            onClick={reiniciar}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Jugar de nuevo
          </button>
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