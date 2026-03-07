import React from "react";

export default function Contacto() {
  return (
    <div className="min-h-screen pt-20 flex flex-col w-screen items-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full mt-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Contacto</h2>
        <p className="mb-4 text-gray-700">
          ¿Tienes sugerencias, dudas o quieres reportar un problema? ¡Nos encantaría saber de ti!
        </p>
        <ul className="mb-4 text-gray-700">
          <li>
            <span className="font-semibold">Email:</span>{" "}
            <a href="mailto:contacto@mentalplayground.com" className="text-blue-600 hover:underline">
              contacto@mentalplayground.com
            </a>
          </li>
          <li>
            <span className="font-semibold">GitHub:</span>{" "}
            <a href="https://github.com/TheRainHermit/MentalPlayground" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              TheRainHermit/MentalPlayground
            </a>
          </li>
        </ul>
        <p className="text-gray-500 text-sm">
          También puedes dejar tus comentarios o sugerencias en nuestras redes sociales.
        </p>
      </div>
    </div>
  );
}