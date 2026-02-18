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
        <div className="flex gap-4">
          {location.pathname !== "/" && (
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-900 font-semibold transition-colors"
            >
              Inicio
            </Link>
          )}
          {/* Puedes agregar más enlaces aquí */}
        </div>
      </div>
    </nav>
  );
}