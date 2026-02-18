import React, { useState } from "react";
import { Link } from "react-router-dom";

function generarMonedas() {
  const monedas = Array(12).fill(1);
  const diferente = Math.floor(Math.random() * 12);
  const tipo = Math.random() < 0.5 ? 0.9 : 1.1; // ligera o pesada
  monedas[diferente] = tipo;
  return { monedas, diferente, tipo };
}

export default function Las12Monedas() {
  const [{ monedas, diferente, tipo }] = useState(() => generarMonedas());
  const [seleccion, setSeleccion] = useState([]);
  const [resultado, setResultado] = useState("");
  const [pesadas, setPesadas] = useState(0);
  const [adivinanza, setAdivinanza] = useState({ index: null, tipo: null });
  const [ganaste, setGanaste] = useState(false);

  // Simula una pesada entre dos grupos
  const pesar = (grupoA, grupoB) => {
    setPesadas(pesadas + 1);
    const pesoA = grupoA.reduce((acc, idx) => acc + monedas[idx], 0);
    const pesoB = grupoB.reduce((acc, idx) => acc + monedas[idx], 0);
    if (pesoA === pesoB) return "Iguales";
    return pesoA > pesoB ? "Izquierda más pesada" : "Derecha más pesada";
  };

  // Maneja la adivinanza final
  const handleAdivinar = () => {
    if (
      adivinanza.index === diferente &&
      ((tipo < 1 && adivinanza.tipo === "ligera") ||
        (tipo > 1 && adivinanza.tipo === "pesada"))
    ) {
      setResultado("¡Correcto! Has encontrado la moneda diferente.");
      setGanaste(true);
    } else {
      setResultado(
        `Incorrecto. La moneda diferente era la #${diferente + 1} (${tipo < 1 ? "ligera" : "pesada"}).`
      );
      setGanaste(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Las 12 Monedas</h2>
        <p className="mb-4 text-gray-700">
          Una de las 12 monedas es diferente (más ligera o más pesada). Usa la balanza para descubrir cuál es.
        </p>
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {monedas.map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                adivinanza.index === idx ? "bg-blue-300" : "bg-gray-200"
              } cursor-pointer`}
              onClick={() => setAdivinanza({ ...adivinanza, index: idx })}
              title={`Moneda #${idx + 1}`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="mr-2">¿Crees que es más ligera o más pesada?</label>
          <select
            value={adivinanza.tipo || ""}
            onChange={(e) =>
              setAdivinanza({ ...adivinanza, tipo: e.target.value })
            }
            className="border rounded px-2 py-1"
          >
            <option value="">Selecciona</option>
            <option value="ligera">Ligera</option>
            <option value="pesada">Pesada</option>
          </select>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-4"
          disabled={adivinanza.index === null || !adivinanza.tipo || ganaste}
          onClick={handleAdivinar}
        >
          Adivinar moneda diferente
        </button>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Simula una pesada:</h3>
          <PesadaUI monedas={monedas} pesar={pesar} disabled={ganaste} />
        </div>
        <div className="mb-2 text-lg text-gray-800">{resultado}</div>
        <div className="text-sm text-gray-500">Pesadas realizadas: {pesadas}</div>
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

// Componente para simular pesadas
function PesadaUI({ monedas, pesar, disabled }) {
  const [grupoA, setGrupoA] = useState([]);
  const [grupoB, setGrupoB] = useState([]);
  const [resultado, setResultado] = useState("");

  const toggleMoneda = (idx, grupo, setGrupo) => {
    if (grupo.includes(idx)) {
      setGrupo(grupo.filter((i) => i !== idx));
    } else {
      setGrupo([...grupo, idx]);
    }
  };

  const handlePesar = () => {
    if (grupoA.length === 0 || grupoB.length === 0) {
      setResultado("Selecciona monedas para ambos lados.");
      return;
    }
    setResultado(pesar(grupoA, grupoB));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="font-semibold">Izquierda:</span>
        {monedas.map((_, idx) => (
          <button
            key={idx}
            className={`w-6 h-6 rounded-full border ${
              grupoA.includes(idx) ? "bg-blue-400" : "bg-gray-200"
            }`}
            disabled={disabled}
            onClick={() => toggleMoneda(idx, grupoA, setGrupoA)}
            title={`Moneda #${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="font-semibold">Derecha:</span>
        {monedas.map((_, idx) => (
          <button
            key={idx}
            className={`w-6 h-6 rounded-full border ${
              grupoB.includes(idx) ? "bg-purple-400" : "bg-gray-200"
            }`}
            disabled={disabled}
            onClick={() => toggleMoneda(idx, grupoB, setGrupoB)}
            title={`Moneda #${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <button
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition mb-2"
        disabled={disabled}
        onClick={handlePesar}
      >
        Pesar
      </button>
      <div className="text-gray-700">{resultado}</div>
    </div>
  );
}