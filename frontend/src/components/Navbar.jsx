import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="w-full bg-white/80 backdrop-blur shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition-colors">
          Mental Playground
        </Link>
        <div className="flex gap-6">
          <Link
            to="/"
            className={`font-semibold transition-colors ${
              location.pathname === "/" ? "text-blue-700" : "text-blue-500 hover:text-blue-900"
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/acerca"
            className={`font-semibold transition-colors ${
              location.pathname === "/acerca" ? "text-blue-700" : "text-blue-500 hover:text-blue-900"
            }`}
          >
            Acerca de
          </Link>
          <Link
            to="/juegos"
            className={`font-semibold transition-colors ${
              location.pathname === "/juegos" ? "text-blue-700" : "text-blue-500 hover:text-blue-900"
            }`}
          >
            Juegos
          </Link>
          <Link
            to="/ayuda"
            className={`font-semibold transition-colors ${
              location.pathname === "/ayuda" ? "text-blue-700" : "text-blue-500 hover:text-blue-900"
            }`}
          >
            Ayuda
          </Link>
          <Link
            to="/contacto"
            className={`font-semibold transition-colors ${
              location.pathname === "/contacto" ? "text-blue-700" : "text-blue-500 hover:text-blue-900"
            }`}
          >
            Contacto
          </Link>
          {/* Puedes agregar más pestañas aquí, como Ayuda o Contacto */}
        </div>
      </div>
    </nav>
  );
}