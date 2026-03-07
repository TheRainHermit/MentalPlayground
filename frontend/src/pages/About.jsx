import React from "react";

export default function Acerca() {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full mt-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Acerca de Mental Playground</h2>
        <p className="mb-4 text-gray-700">
          Mental Playground es una biblioteca interactiva de juegos clásicos de algoritmia y lógica. 
          El objetivo es aprender, practicar y divertirse resolviendo problemas y acertijos famosos, 
          desde el Sudoku hasta el Cartero Chino.
        </p>
        <p className="mb-2 text-gray-700">
          Proyecto desarrollado por <span className="font-semibold text-blue-700">TheRainHermit</span> y colaboradores.
        </p>
        <p className="text-gray-500 text-sm">
          ¿Tienes sugerencias o quieres contribuir? ¡Contáctanos!
        </p>
      </div>
    </div>
  );
}