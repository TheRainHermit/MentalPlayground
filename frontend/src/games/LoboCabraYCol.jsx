import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialState = {
  left: ["Lobo", "Cabra", "Col", "Granjero"],
  right: [],
  boat: [],
  boatSide: "left",
  history: [],
  mensaje: "",
  terminado: false,
};

function isGameOver(left, right) {
  // Si el granjero no está en la orilla y el lobo y la cabra están juntos, o la cabra y la col están juntas, pierdes
  const check = (side) => {
    const hasFarmer = side.includes("Granjero");
    if (!hasFarmer) {
      if (side.includes("Lobo") && side.includes("Cabra")) return "El lobo se comió a la cabra. ¡Perdiste!";
      if (side.includes("Cabra") && side.includes("Col")) return "La cabra se comió la col. ¡Perdiste!";
    }
    return null;
  };
  return check(left) || check(right);
}

export default function LoboCabraYCol() {
  const [state, setState] = useState(initialState);

  const mover = (item) => {
    if (state.terminado) return;
    if (state.boat.length === 1 && item !== "Granjero") return;
    if (state.boatSide === "left") {
      if (!state.left.includes(item)) return;
      setState((prev) => ({
        ...prev,
        left: prev.left.filter((i) => i !== item),
        boat: [...prev.boat, item],
      }));
    } else {
      if (!state.right.includes(item)) return;
      setState((prev) => ({
        ...prev,
        right: prev.right.filter((i) => i !== item),
        boat: [...prev.boat, item],
      }));
    }
  };

  const bajar = (item) => {
    if (state.terminado) return;
    if (!state.boat.includes(item)) return;
    if (state.boatSide === "left") {
      setState((prev) => ({
        ...prev,
        left: [...prev.left, item],
        boat: prev.boat.filter((i) => i !== item),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        right: [...prev.right, item],
        boat: prev.boat.filter((i) => i !== item),
      }));
    }
  };

  const cruzar = () => {
    if (state.terminado) return;
    if (!state.boat.includes("Granjero")) {
      setState((prev) => ({
        ...prev,
        mensaje: "¡El granjero debe ir en el bote!",
      }));
      return;
    }
    setState((prev) => {
      const newBoatSide = prev.boatSide === "left" ? "right" : "left";
      const newHistory = [
        ...prev.history,
        {
          left: [...prev.left],
          right: [...prev.right],
          boat: [...prev.boat],
          boatSide: prev.boatSide,
        },
      ];
      // Baja todos los pasajeros al otro lado
      let newLeft = [...prev.left];
      let newRight = [...prev.right];
      prev.boat.forEach((item) => {
        if (newBoatSide === "left") newLeft.push(item);
        else newRight.push(item);
      });
      const mensaje = isGameOver(newLeft, newRight);
      let terminado = false;
      if (mensaje) terminado = true;
      if (
        newRight.includes("Lobo") &&
        newRight.includes("Cabra") &&
        newRight.includes("Col") &&
        newRight.includes("Granjero")
      ) {
        terminado = true;
        return {
          ...initialState,
          mensaje: "¡Felicidades! Lograste cruzar a todos sanos y salvos.",
          terminado: true,
        };
      }
      return {
        left: newLeft.filter((i) => !prev.boat.includes(i)),
        right: newRight.filter((i) => !prev.boat.includes(i)),
        boat: [],
        boatSide: newBoatSide,
        history: newHistory,
        mensaje: mensaje || "",
        terminado,
      };
    });
  };

  const reiniciar = () => setState(initialState);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Lobo, Cabra y Col</h2>
        <p className="mb-4 text-gray-700">
          Cruza el lobo, la cabra y la col al otro lado del río. El bote solo puede llevar al granjero y un acompañante. ¡Evita que el lobo se coma a la cabra o la cabra a la col!
        </p>
        <div className="flex justify-between mb-6">
          <div>
            <h3 className="font-semibold mb-2">Orilla Izquierda</h3>
            <div className="flex flex-wrap gap-2">
              {state.left.map((item) => (
                <button
                  key={item}
                  className="bg-blue-200 px-2 py-1 rounded"
                  onClick={() => mover(item)}
                  disabled={state.boat.length >= 2 || state.boatSide !== "left" || state.terminado}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Orilla Derecha</h3>
            <div className="flex flex-wrap gap-2">
              {state.right.map((item) => (
                <button
                  key={item}
                  className="bg-purple-200 px-2 py-1 rounded"
                  onClick={() => mover(item)}
                  disabled={state.boat.length >= 2 || state.boatSide !== "right" || state.terminado}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Bote ({state.boatSide === "left" ? "Izquierda" : "Derecha"})</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {state.boat.map((item) => (
              <button
                key={item}
                className="bg-green-200 px-2 py-1 rounded"
                onClick={() => bajar(item)}
                disabled={state.terminado}
              >
                {item} ⬇
              </button>
            ))}
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={cruzar}
            disabled={state.boat.length === 0 || state.terminado}
          >
            Cruzar
          </button>
        </div>
        <div className="mt-2 text-lg text-gray-800">{state.mensaje}</div>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition mt-4"
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