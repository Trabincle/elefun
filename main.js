class Card {
  constructor(symbol) {
    this.symbol = symbol;
    this.state = 'hidden';
  }
}

class MemoryGame {
  constructor(boardContainer, symbols) {
    this.boardContainer = boardContainer;
    this.turnedCards = [];
    this.pairsCompleted = 0;

    this.board = this.generateBoard(symbols);
    this.totalPairs = this.board.length / 2;

    this.drawBoard();
  }

  static shuffle(symbols) {
    let temp, i;

    for (let m = symbols.length - 1; m > 0; m--) {
      // pick random element from unshuffled elements
      i = Math.floor(Math.random() * (m + 1));

      // swap random element with last
      temp = symbols[i];
      symbols[i] = symbols[m];
      symbols[m] = temp;
    }
  }

  generateBoard(symbols) {
    const newBoard = [];

    // add two copies of each value to newBoard
    symbols.map(val => newBoard.push(val, val));

    MemoryGame.shuffle(newBoard);

    // create Card objects out of shuffled symbols
    return newBoard.map(symbol => new Card(symbol));
  }

  drawBoard() {
    if (this.boardContainer.firstChild) {
      this.boardContainer.removeChild(this.boardContainer.firstChild);
    }

    const boardElement = document.createElement('div');
    boardElement.classList.add('memory-container');

    // delegate event handling to board
    boardElement.addEventListener('click', e => this.cardClicked(e));

    this.board.forEach((card, idx) => {
      const cardElement = document.createElement('button');
      cardElement.id = 'card' + idx;
      cardElement.classList.add('card', card.state);

      const symbolSpan = document.createElement('span');
      symbolSpan.classList.add('symbol', card.state);
      symbolSpan.textContent = card.symbol;

      cardElement.appendChild(symbolSpan);
      boardElement.appendChild(cardElement);
      this.boardContainer.appendChild(boardElement);
    });
  }

  cardClicked(e) {
    const card = e.target.closest('.card');

    // find card in board
    const cardID = card.getAttribute('id');
    const cardIndex = cardID.substring(cardID.search(/[0-9]+/));

    if (this.turnedCards.length >= 2) {
		  this.resetBoard();
    }

    if (this.board[cardIndex].state === 'hidden') {
      this.turnCard(cardIndex);
      if (this.turnedCards.length >= 2) {
        if (this.checkPair()) {
          this.clearPair();
        }
      }
    }
    this.drawBoard();
  }

  turnCard(id) {
    this.turnedCards.push(id);
    this.board[id].state = 'turned';
  }

  checkPair() {
    const first = this.board[this.turnedCards[0]].symbol;
    const second = this.board[this.turnedCards[1]].symbol;
    return first === second;
  }

  clearPair() {
    this.turnedCards.forEach(idx => {
      this.board[idx].state = 'cleared';
    });
    this.turnedCards = [];
    this.pairsCompleted++;
  }

  resetBoard() {
    this.turnedCards.forEach(idx => {
      this.board[idx].state = 'hidden';
    });
    this.turnedCards = [];
  }
}

const EMOJI = ['🌭', '🎈', '💎', '🐻', '🚀', '🍱', '🐸', '🐳'];

game1 = new MemoryGame(document.querySelector('.memory1'), EMOJI);