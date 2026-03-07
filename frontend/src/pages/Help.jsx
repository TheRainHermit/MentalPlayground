import React from "react";

export default function Ayuda() {
  return (
    <div className="min-h-screen pt-20 flex flex-col w-screen items-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full mt-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Ayuda</h2>
        <p className="mb-4 text-gray-700">
          ¿Tienes dudas sobre cómo usar Mental Playground? Aquí tienes algunos consejos:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>Haz clic en cualquier juego del catálogo para comenzar a jugar.</li>
          <li>Puedes volver al inicio en cualquier momento usando el botón "Inicio" del menú.</li>
          <li>En cada juego encontrarás instrucciones y controles específicos.</li>
          <li>Si encuentras un error o tienes sugerencias, ¡contáctanos!</li>
        </ul>
        <p className="text-gray-500 text-sm">
          ¿Necesitas más ayuda? Escríbenos desde la sección de contacto.
        </p>
      </div>
    </div>
  );
}