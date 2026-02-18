export const initialState = {
  board: [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    Array(8).fill("bP"),
    ...Array(4).fill(Array(8).fill("")),
    Array(8).fill("wP"),
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
  ],
  castlingRights: {
    wK: true, // Rey blanco puede enrocar corto
    wQ: true, // Rey blanco puede enrocar largo
    bK: true,
    bQ: true,
  },
  enPassantTarget: null, // {row, col} o null
};

export function isWhite(piece) {
  return piece && piece[0] === "w";
}
export function isBlack(piece) {
  return piece && piece[0] === "b";
}
export function isOpponent(piece, turn) {
  return piece && ((turn === "w" && isBlack(piece)) || (turn === "b" && isWhite(piece)));
}
export function isOwn(piece, turn) {
  return piece && ((turn === "w" && isWhite(piece)) || (turn === "b" && isBlack(piece)));
}

export function getMoves(board, fromRow, fromCol, turn, checkCheck = true) {
  const piece = board[fromRow][fromCol];
  if (!piece) return [];
  const color = piece[0];
  const type = piece[1];
  let moves = [];

  // Helper for sliding pieces
  const slide = (dr, dc) => {
    let r = fromRow + dr;
    let c = fromCol + dc;
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (!board[r][c]) {
        moves.push([r, c]);
      } else {
        if (isOpponent(board[r][c], color)) moves.push([r, c]);
        break;
      }
      r += dr;
      c += dc;
    }
  };

  // Peón
  if (type === "P") {
    const dir = color === "w" ? -1 : 1;
    const startRow = color === "w" ? 6 : 1;
    // Avance simple
    if (board[fromRow + dir] && !board[fromRow + dir][fromCol])
      moves.push([fromRow + dir, fromCol]);
    // Avance doble
    if (
      fromRow === startRow &&
      !board[fromRow + dir][fromCol] &&
      !board[fromRow + 2 * dir][fromCol]
    )
      moves.push([fromRow + 2 * dir, fromCol]);
    // Capturas
    [fromCol - 1, fromCol + 1].forEach((c) => {
      if (
        board[fromRow + dir] &&
        board[fromRow + dir][c] &&
        isOpponent(board[fromRow + dir][c], color)
      ) {
        moves.push([fromRow + dir, c]);
      }
    });
    // Promoción se maneja en el componente
    // Dentro de getMoves, en la sección del peón:
    if (enPassantTarget && Math.abs(enPassantTarget.col - fromCol) === 1 && enPassantTarget.row === fromRow + dir) {
      moves.push([enPassantTarget.row, enPassantTarget.col, "enPassant"]);
  }
  }

  // Torre
  if (type === "R") {
    slide(-1, 0);
    slide(1, 0);
    slide(0, -1);
    slide(0, 1);
  }

  // Alfil
  if (type === "B") {
    slide(-1, -1);
    slide(-1, 1);
    slide(1, -1);
    slide(1, 1);
  }

  // Reina
  if (type === "Q") {
    slide(-1, 0);
    slide(1, 0);
    slide(0, -1);
    slide(0, 1);
    slide(-1, -1);
    slide(-1, 1);
    slide(1, -1);
    slide(1, 1);
  }

  // Caballo
  if (type === "N") {
    [
      [-2, -1], [-2, 1], [2, -1], [2, 1],
      [-1, -2], [-1, 2], [1, -2], [1, 2],
    ].forEach(([dr, dc]) => {
      const r = fromRow + dr;
      const c = fromCol + dc;
      if (
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8 &&
        (!board[r][c] || isOpponent(board[r][c], color))
      ) {
        moves.push([r, c]);
      }
    });
  }

  // Rey
  if (type === "K") {
    [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], /*K*/ [0, 1],
      [1, -1], [1, 0], [1, 1],
    ].forEach(([dr, dc]) => {
      const r = fromRow + dr;
      const c = fromCol + dc;
      if (
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8 &&
        (!board[r][c] || isOpponent(board[r][c], color))
      ) {
        moves.push([r, c]);
      }
    });
    // Enroque no implementado aquí
  }

  // Dentro de getMoves, después de los movimientos normales del rey:
  if (type === "K" && checkCheck) {
    // Enroque corto
    if (
      castlingRights &&
      castlingRights[color + "K"] &&
      !board[fromRow][fromCol + 1] &&
      !board[fromRow][fromCol + 2] &&
      !estaEnJaque(board, color) &&
      !dejaEnJaque(board, fromRow, fromCol, fromRow, fromCol + 1, color) &&
      !dejaEnJaque(board, fromRow, fromCol, fromRow, fromCol + 2, color)
    ) {
      moves.push([fromRow, fromCol + 2, "castleK"]);
    }
    // Enroque largo
    if (
      castlingRights &&
      castlingRights[color + "Q"] &&
      !board[fromRow][fromCol - 1] &&
      !board[fromRow][fromCol - 2] &&
      !board[fromRow][fromCol - 3] &&
      !estaEnJaque(board, color) &&
      !dejaEnJaque(board, fromRow, fromCol, fromRow, fromCol - 1, color) &&
      !dejaEnJaque(board, fromRow, fromCol, fromRow, fromCol - 2, color)
    ) {
      moves.push([fromRow, fromCol - 2, "castleQ"]);
    }
  }

  // Filtra movimientos que dejan al rey en jaque (si checkCheck)
  if (checkCheck) {
    moves = moves.filter(([toRow, toCol]) =>
      !dejaEnJaque(board, fromRow, fromCol, toRow, toCol, color)
    );
  }

  return moves;
}

// Simula un movimiento y verifica si deja al rey en jaque
export function dejaEnJaque(board, fromRow, fromCol, toRow, toCol, color) {
  const copia = board.map((fila) => [...fila]);
  copia[toRow][toCol] = copia[fromRow][fromCol];
  copia[fromRow][fromCol] = "";
  return estaEnJaque(copia, color);
}

// Busca el rey y verifica si está amenazado
export function estaEnJaque(board, color) {
  let reyRow = -1, reyCol = -1;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === (color === "w" ? "wK" : "bK")) {
        reyRow = r;
        reyCol = c;
      }
    }
  }
  // ¿Alguna pieza rival puede capturar al rey?
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (
        board[r][c] &&
        ((color === "w" && isBlack(board[r][c])) ||
          (color === "b" && isWhite(board[r][c])))
      ) {
        const rivalMoves = getMoves(board, r, c, color === "w" ? "b" : "w", false);
        if (rivalMoves.some(([mr, mc]) => mr === reyRow && mc === reyCol)) {
          return true;
        }
      }
    }
  }
  return false;
}

// ¿El jugador está en jaque mate?
export function esJaqueMate(board, color) {
  if (!estaEnJaque(board, color)) return false;
  // Si no hay ningún movimiento legal, es mate
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && ((color === "w" && isWhite(board[r][c])) || (color === "b" && isBlack(board[r][c])))) {
        const moves = getMoves(board, r, c, color);
        if (moves.length > 0) return false;
      }
    }
  }
  return true;
}

// ¿Tablas por ahogado?
export function esTablas(board, color) {
  if (estaEnJaque(board, color)) return false;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && ((color === "w" && isWhite(board[r][c])) || (color === "b" && isBlack(board[r][c])))) {
        const moves = getMoves(board, r, c, color);
        if (moves.length > 0) return false;
      }
    }
  }
  return true;
}