class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor() {
    this.WIDTH = 7;
    this.HEIGHT = 6;
    this.currentPlayer = null;
    this.players = [new Player(), new Player()];

    document.getElementById('start-button').addEventListener('click', this.startGame.bind(this));

    this.makeHtmlBoard();
  }

  startGame() {
    const player1Color = document.getElementById('player1-color').value;
    const player2Color = document.getElementById('player2-color').value;

    this.board = Array.from({ length: this.HEIGHT }, () => Array(this.WIDTH).fill(null));
    this.currentPlayer = this.players[0];
    this.gameOver = false;

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    this.makeHtmlBoard();

    this.players[0].color = player1Color;
    this.players[1].color = player2Color;
  }

  makeHtmlBoard() {
    const boardElement = document.getElementById('board');

    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleEvent.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    boardElement.append(top);

    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      boardElement.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currentPlayer.color;
    piece.style.top = -50 * (y + 2) + 'px';

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  }

  checkForWin() {
    function _win(cells) {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currentPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (
          _win.call(this, horiz) ||
          _win.call(this, vert) ||
          _win.call(this, diagDR) ||
          _win.call(this, diagDL)
        ) {
          return true;
        }
      }
    }
  }

  handleEvent(evt) {
    if (this.gameOver) {
      alert('Game over. Please click "Start Game" to play again.');
      return;
    }

    const x = +evt.target.id;

    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    this.board[y][x] = this.currentPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currentPlayer === this.players[0] ? '1' : '2'} won!`);
    }

    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
}

const game = new Game();
