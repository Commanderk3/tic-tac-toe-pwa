const board = Array(9).fill('');
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

function createBoard() {
  boardElement.innerHTML = '';
  board.forEach((val, idx) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = idx;
    cell.textContent = val;
    cell.addEventListener('click', playerMove);
    boardElement.appendChild(cell);
  });
}

function playerMove(e) {
  const idx = e.target.dataset.index;
  if (board[idx] !== '' || checkWinner(board, 'X') || checkWinner(board, 'O')) return;
  board[idx] = 'X';
  updateBoard();
  if (checkWinner(board, 'X')) {
    statusElement.textContent = "You win!";
    return;
  } else if (isDraw(board)) {
    statusElement.textContent = "It's a draw!";
    return;
  }
  statusElement.textContent = "AI's turn...";
  setTimeout(() => {
    bestAIMove();
    updateBoard();
    if (checkWinner(board, 'O')) {
      statusElement.textContent = "AI wins!";
    } else if (isDraw(board)) {
      statusElement.textContent = "It's a draw!";
    } else {
      statusElement.textContent = "Your turn (X)";
    }
  }, 500);
}

function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, idx) => {
    cell.textContent = board[idx];
    cell.classList.toggle('taken', board[idx] !== '');
  });
}

function isDraw(brd) {
  return brd.every(cell => cell !== '');
}

function checkWinner(brd, player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a, b, c]) => brd[a] === player && brd[b] === player && brd[c] === player);
}

function bestAIMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  board[move] = 'O';
}

function minimax(brd, depth, isMaximizing) {
  if (checkWinner(brd, 'O')) return 10 - depth;
  if (checkWinner(brd, 'X')) return depth - 10;
  if (isDraw(brd)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (brd[i] === '') {
        brd[i] = 'O';
        best = Math.max(best, minimax(brd, depth + 1, false));
        brd[i] = '';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (brd[i] === '') {
        brd[i] = 'X';
        best = Math.min(best, minimax(brd, depth + 1, true));
        brd[i] = '';
      }
    }
    return best;
  }
}

function restartGame() {
  for (let i = 0; i < 9; i++) board[i] = '';
  statusElement.textContent = "Your turn (X)";
  createBoard();
}

createBoard();