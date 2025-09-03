const board = document.getElementById("game-board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const pvpBtn = document.getElementById("pvp");
const pvcBtn = document.getElementById("pvc");

let cells = [];
let currentPlayer = "X";
let gameActive = false;
let vsComputer = false;

function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleCellClick(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (!gameActive || cell.textContent !== "") return;

  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `${currentPlayer} Wins! 🎉`;
    gameActive = false;
    restartBtn.classList.remove("hidden");
    return;
  }

  if (cells.every(c => c.textContent !== "")) {
    statusText.textContent = "It's a Draw! 😮";
    gameActive = false;
    restartBtn.classList.remove("hidden");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (vsComputer && currentPlayer === "O" && gameActive) {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let available = cells.filter(c => c.textContent === "");
  if (available.length === 0) return;
  let move = available[Math.floor(Math.random() * available.length)];
  move.textContent = "O";
  move.classList.add("taken");

  if (checkWinner("O")) {
    statusText.textContent = "Computer Wins! 🤖";
    gameActive = false;
    restartBtn.classList.remove("hidden");
    return;
  }

  if (cells.every(c => c.textContent !== "")) {
    statusText.textContent = "It's a Draw! 😮";
    gameActive = false;
    restartBtn.classList.remove("hidden");
    return;
  }

  currentPlayer = "X";
  statusText.textContent = "Player X's Turn";
}

function checkWinner(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];

  return winPatterns.some(pattern => {
    return pattern.every(index => cells[index].textContent === player);
  });
}

function startGame(mode) {
  vsComputer = mode === "pvc";
  createBoard();
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = `Player X's Turn`;
  restartBtn.classList.add("hidden");
}

restartBtn.addEventListener("click", () => startGame(vsComputer ? "pvc" : "pvp"));
pvpBtn.addEventListener("click", () => startGame("pvp"));
pvcBtn.addEventListener("click", () => startGame("pvc"));
