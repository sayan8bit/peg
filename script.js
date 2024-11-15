const board = [
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null],
];
let selectedPeg = null;

function initializeBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      if (board[row][col] === 1) {
        const peg = document.createElement("div");
        peg.classList.add("peg");
        cell.appendChild(peg);
      } else if (board[row][col] === 0) {
        cell.classList.add("empty");
      } else {
        cell.classList.add("hidden");
      }
      cell.addEventListener("click", () => handleCellClick(row, col));
      gameBoard.appendChild(cell);
    }
  }
}

function handleCellClick(row, col) {
  if (selectedPeg) {
    // Check if a valid move
    const [sRow, sCol] = selectedPeg;
    const dRow = Math.abs(sRow - row);
    const dCol = Math.abs(sCol - col);
    if ((dRow === 2 && dCol === 0) || (dRow === 0 && dCol === 2)) {
      const midRow = (sRow + row) / 2;
      const midCol = (sCol + col) / 2;
      if (board[midRow][midCol] === 1 && board[row][col] === 0) {
        // Perform the move
        board[sRow][sCol] = 0;
        board[midRow][midCol] = 0;
        board[row][col] = 1;
        selectedPeg = null;
        updateBoard();
        checkGameEnd();
        return;
      }
    }
    // Invalid move
    selectedPeg = null;
    updateBoard();
  } else if (board[row][col] === 1) {
    // Select peg
    selectedPeg = [row, col];
    updateBoard();
  }
}

function updateBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    cell.innerHTML = "";
    if (board[row][col] === 1) {
      const peg = document.createElement("div");
      peg.classList.add("peg");
      cell.appendChild(peg);
      if (selectedPeg && selectedPeg[0] == row && selectedPeg[1] == col) {
        peg.style.backgroundColor = "#FF9800";
      }
    } else if (board[row][col] === 0) {
      cell.classList.add("empty");
    } else {
      cell.classList.add("hidden");
    }
  });
}

function checkGameEnd() {
  let movesAvailable = false;
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      if (board[row][col] === 1) {
        if (isMoveAvailable(row, col)) {
          movesAvailable = true;
          break;
        }
      }
    }
  }
  if (!movesAvailable) {
    document.getElementById("game-message").innerText =
      "Game Over! " + (countPegs() === 1 ? "You win!" : "No moves left.");
  }
}

function isMoveAvailable(row, col) {
  const directions = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];
  return directions.some(([dRow, dCol]) => {
    const nRow = row + dRow;
    const nCol = col + dCol;
    const mRow = row + dRow / 2;
    const mCol = col + dCol / 2;
    return (
      nRow >= 0 &&
      nRow < 7 &&
      nCol >= 0 &&
      nCol < 7 &&
      board[row][col] === 1 &&
      board[mRow][mCol] === 1 &&
      board[nRow][nCol] === 0
    );
  });
}

function countPegs() {
  return board.flat().filter((peg) => peg === 1).length;
}

function resetGame() {
  // Reset the board to the initial state
  board.splice(
    0,
    board.length,
    [null, null, 1, 1, 1, null, null],
    [null, null, 1, 1, 1, null, null],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [null, null, 1, 1, 1, null, null],
    [null, null, 1, 1, 1, null, null]
  );

  selectedPeg = null;
  initializeBoard();
  document.getElementById("game-message").innerText = "";
}

initializeBoard();
