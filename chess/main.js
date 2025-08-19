const board = document.getElementById("chessboard");
let selectedSquare = null;
let currentTurn = "white";

// বোর্ড তৈরি ও ক্লাস বসানো
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.classList.add((row + col) % 2 === 0 ? "white" : "black");
    square.dataset.row = row;
    square.dataset.col = col;
    board.appendChild(square);
  }
}

// পিস বসানো
const pieces = {
  rook: ["♖", "♜"],
  knight: ["♘", "♞"],
  bishop: ["♗", "♝"],
  queen: ["♕", "♛"],
  king: ["♔", "♚"],
  pawn: ["♙", "♟"]
};

const initialSetup = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

function getPieceColor(piece) {
  if (!piece) return null;
  return "♙♖♘♗♕♔".includes(piece) ? "white" : "black";
}

function getValidMoves(piece, fromRow, fromCol) {
  const moves = [];

  if (piece === "♙") {
    // White pawn
    if (fromRow > 0 && getPieceAt(fromRow - 1, fromCol) === "")
      moves.push([fromRow - 1, fromCol]);
  } else if (piece === "♟") {
    // Black pawn
    if (fromRow < 7 && getPieceAt(fromRow + 1, fromCol) === "")
      moves.push([fromRow + 1, fromCol]);
  } else if (piece === "♘" || piece === "♞") {
    // Knight
    const dirs = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (let [dr, dc] of dirs) {
      const r = fromRow + dr, c = fromCol + dc;
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const targetPiece = getPieceAt(r, c);
        if (!targetPiece || getPieceColor(targetPiece) !== currentTurn)
          moves.push([r, c]);
      }
    }
  }

  // ভবিষ্যতে: rook, bishop, queen, king-এর মুভ যুক্ত করা যাবে

  return moves;
}

function getPieceAt(row, col) {
  const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
  return square.textContent;
}

function clearHighlights() {
  document.querySelectorAll(".square").forEach(sq => {
    sq.classList.remove("selected");
    sq.classList.remove("valid-move");
  });
}

function renderBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
      square.textContent = initialSetup[row][col];
    }
  }
}
renderBoard();

// হ্যান্ডল ক্লিক
document.querySelectorAll(".square").forEach(square => {
  square.addEventListener("click", () => {
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const clickedPiece = getPieceAt(row, col);

    if (selectedSquare) {
      const [fromRow, fromCol] = [parseInt(selectedSquare.dataset.row), parseInt(selectedSquare.dataset.col)];
      const movingPiece = getPieceAt(fromRow, fromCol);
      const validMoves = getValidMoves(movingPiece, fromRow, fromCol);

      const isValid = validMoves.some(move => move[0] === row && move[1] === col);
      if (isValid) {
        // মুভ করাও
        initialSetup[row][col] = movingPiece;
        initialSetup[fromRow][fromCol] = "";
        currentTurn = currentTurn === "white" ? "black" : "white";
        renderBoard();
      }
      selectedSquare = null;
      clearHighlights();
    } else if (clickedPiece && getPieceColor(clickedPiece) === currentTurn) {
      // সিলেক্ট করো এবং বৈধ মুভ দেখাও
      selectedSquare = square;
      square.classList.add("selected");
      const validMoves = getValidMoves(clickedPiece, row, col);
      for (let [r, c] of validMoves) {
        const validSquare = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
        validSquare.classList.add("valid-move");
      }
    }
  });
});
