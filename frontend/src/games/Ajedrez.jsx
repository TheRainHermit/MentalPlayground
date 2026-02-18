import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Link } from "react-router-dom";

function getPieceSymbol(piece) {
  if (!piece) return "";
  const symbols = {
    p: piece.color === "w" ? "♙" : "♟",
    r: piece.color === "w" ? "♖" : "♜",
    n: piece.color === "w" ? "♘" : "♞",
    b: piece.color === "w" ? "♗" : "♝",
    q: piece.color === "w" ? "♕" : "♛",
    k: piece.color === "w" ? "♔" : "♚",
  };
  return symbols[piece.type];
}

export default function Ajedrez() {
  const [game, setGame] = useState(() => {
    const saved = localStorage.getItem("chessGameFen");
    return saved ? new Chess(saved) : new Chess();
  });
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    localStorage.setItem("chessGameFen", game.fen());
  }, [game]);

  const board = game.board();

  const handleCellClick = (row, col) => {
    const square = String.fromCharCode(97 + col) + (8 - row);
    if (selected) {
      const move = game.move({ from: selected, to: square, promotion: "q" });
      if (move) {
        setGame(new Chess(game.fen()));
        setSelected(null);
        setLegalMoves([]);
        setMensaje("");
      } else {
        setSelected(null);
        setLegalMoves([]);
        setMensaje("Movimiento ilegal");
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.color === game.turn()) {
        setSelected(square);
        const moves = game.moves({ square, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
        setMensaje("");
      }
    }
  };

  const reiniciar = () => {
    setGame(new Chess());
    setSelected(null);
    setLegalMoves([]);
    setMensaje("");
    localStorage.removeItem("chessGameFen");
  };

  const deshacer = () => {
    game.undo();
    setGame(new Chess(game.fen()));
    setSelected(null);
    setLegalMoves([]);
    setMensaje("");
  };

  const cargar = () => {
    const saved = localStorage.getItem("chessGameFen");
    if (saved) {
      setGame(new Chess(saved));
      setSelected(null);
      setLegalMoves([]);
      setMensaje("Partida cargada.");
    } else {
      setMensaje("No hay partida guardada.");
    }
  };

  const guardar = () => {
    localStorage.setItem("chessGameFen", game.fen());
    setMensaje("Partida guardada.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Ajedrez</h2>
        <p className="mb-4 text-gray-700">
          Tablero de ajedrez con todas las reglas oficiales (usando chess.js).
        </p>
        <div className="flex flex-col items-center mb-4">
          <div className="grid" style={{ gridTemplateColumns: "repeat(8, 40px)" }}>
            {board.map((fila, i) =>
              fila.map((pieza, j) => {
                const square = String.fromCharCode(97 + j) + (8 - i);
                const isSelected = selected === square;
                const isLegal = legalMoves.includes(square);
                return (
                  <button
                    key={`${i}-${j}`}
                    className={`w-10 h-10 border border-gray-400 flex items-center justify-center text-xl font-bold
                      ${(i + j) % 2 === 0 ? "bg-gray-200" : "bg-white"}
                      ${isSelected ? "ring-2 ring-blue-500" : ""}
                      ${isLegal ? "bg-green-200" : ""}
                    `}
                    onClick={() => handleCellClick(i, j)}
                  >
                    {getPieceSymbol(pieza)}
                  </button>
                );
              })
            )}
          </div>
        </div>
        <div className="text-lg text-gray-800 mb-2">
          Turno: <span className={game.turn() === "w" ? "text-blue-700" : "text-purple-700"}>
            {game.turn() === "w" ? "Blancas" : "Negras"}
          </span>
        </div>
        <div className="text-red-600 mb-2">{mensaje}</div>
        <div className="flex gap-2 mb-2">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            onClick={reiniciar}
          >
            Reiniciar
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            onClick={guardar}
          >
            Guardar
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={cargar}
          >
            Cargar
          </button>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
            onClick={deshacer}
            disabled={game.history().length === 0}
          >
            Deshacer
          </button>
        </div>
        <div className="mb-2">
          {game.isCheckmate() && (
            <span className="text-red-700 font-bold">¡Jaque mate!</span>
          )}
          {game.isDraw() && (
            <span className="text-gray-700 font-bold">¡Tablas!</span>
          )}
          {game.inCheck() && !game.isCheckmate() && (
            <span className="text-orange-600 font-bold">¡Jaque!</span>
          )}
        </div>
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