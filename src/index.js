class Board {
    static generateRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    constructor(m, n, bombs) {
        this.m = m;
        this.n = n;
        this.bombs = bombs;
        this.isGameOver = false;
        this.boardState = Array(this.n)
            .fill(0)
            .map(() => Array(this.m).fill(0));
    }

    isReachable(x, y) {
        const { m, n } = this;
        return x >= 0 && y >= 0 && x < m && y < n;
    }

    printBoardHtml() {
        const { n, m } = this;
        const tableBody = document.createElement('tbody');
        tableBody.className = 'table';

        for (var i = 0; i < m; i += 1) {
            const row = document.createElement('tr');
            row.setAttribute('class', 'row');
            for (var j = 0; j < n; j += 1) {
                const cell = document.createElement('td');
                cell.setAttribute('class', 'cell not-mined');
                cell.setAttribute('id', `${i}-${j}`);
                cell.dataset.coord = `${i}-${j}`;
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
        }

        document.getElementById('minesweeper').appendChild(tableBody);
    }

    getBoardState() {
        return this.boardState;
    }

    initBombs() {
        const { n, m, bombs, boardState } = this;
        let bombsPlaced = 0;
        if (n * m < bombs) {
            alert('You crazy!');
            return;
        }
        while (bombsPlaced < bombs) {
            const x = Board.generateRandom(0, m);
            const y = Board.generateRandom(0, n);
            if (this.boardState[x][y] !== -1) {
                this.boardState[x][y] = -1;
                bombsPlaced++;
            }
        }
    }

    handleBoardClick(e) {
        const tempBoardState = this.boardState.slice();
        const { isGameOver } = this;
        if (isGameOver === true) {
            alert('You lost!');
            e.stopPropagation();
            return;
        }
        const id = e.target.dataset.coord.split('-');
        if (tempBoardState[id[0]][id[1]] === -1) {
            e.target.setAttribute('class', 'cell blast');
            this.isGameOver = true;
            this.gameOverBoard();
        } else {
            this.playMinesweeper(parseInt(id[0],10),parseInt(id[1],10))
        }
    }

    getCell(x, y) {
        return document.getElementById(`${x}-${y}`);
    }

    countMinesNearByUtil(x, y) {
        const { boardState } = this;
        let count = 0;
        if (
            this.isReachable(x, y + 1) === true &&
            boardState[x][y + 1] === -1
        ) {
            count += 1;
        }
        if (
            this.isReachable(x + 1, y + 1) === true &&
            boardState[x + 1][y + 1] === -1
        ) {
            count += 1;
        }
        if (
            this.isReachable(x + 1, y) === true &&
            boardState[x + 1][y] === -1
        ) {
            count += 1;
        }
        if (
            this.isReachable(x + 1, y - 1) === true &&
            boardState[x + 1][y - 1] === -1
        ) {
            count += 1;
        }
        if (
            this.isReachable(x, y - 1) === true &&
            boardState[x][y - 1] === -1
        ) {
            count += 1;
        }
        if (
            this.isReachable(x - 1, y - 1) === true &&
            boardState[x - 1][y - 1] === -1
        ) {
            count += 1;
        }
        if (
            this.isReachable(x - 1, y + 1) === true &&
            boardState[x - 1][y + 1] === -1
        ) {
            count += 1;
        }
        if (
            this.isReachable(x - 1, y) === true &&
            boardState[x - 1][y] === -1
        ) {
            count += 1;
        }

        return count;
    }

    countMinesAll() {
        const { n, m, boardState } = this;
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                if (boardState[i][j] !== -1) {
                    boardState[i][j] = this.countMinesNearByUtil(i, j);
                }
            }
        }
    }

    openTile(x, y) {
        const e = this.getCell(x, y);
        e.setAttribute('class', 'cell mined');
        e.innerHTML = this.boardState[x][y];
    }

    playMinesweeper(x, y) {
        const { boardState } = this;
        if (boardState[x][y] === -1) {
            return;
        } else {
                if (
                    this.isReachable(x, y) === true &&
                    boardState[x][y] !== -1
                ) {
                    this.openTile(x, y);
                }
                if (
                    this.isReachable(x, y + 1) === true &&
                    boardState[x][y + 1] !== -1
                ) {
                    this.openTile(x, y + 1);
                }
                if (
                    this.isReachable(x + 1, y + 1) === true &&
                    boardState[x + 1][y + 1] !== -1
                ) {
                    this.openTile(x + 1, y + 1);
                }
                if (
                    this.isReachable(x + 1, y) === true &&
                    boardState[x + 1][y] !== -1
                ) {
                    this.openTile(x + 1, y);
                }
                if (
                    this.isReachable(x + 1, y - 1) === true &&
                    boardState[x + 1][y - 1] !== -1
                ) {
                    this.openTile(x + 1, y - 1);
                }
                if (
                    this.isReachable(x, y - 1) === true &&
                    boardState[x][y - 1] !== -1
                ) {
                    this.openTile(x, y - 1);
                }
                if (
                    this.isReachable(x - 1, y - 1) === true &&
                    boardState[x - 1][y - 1] !== -1
                ) {
                    this.openTile(x - 1, y - 1);
                }
                if (
                    this.isReachable(x - 1, y + 1) === true &&
                    boardState[x - 1][y + 1] !== -1
                ) {
                    this.openTile(x - 1, y + 1);
                }
                if (
                    this.isReachable(x - 1, y) === true &&
                    boardState[x - 1][y] !== -1
                ) {
                    this.openTile(x - 1, y);
                }
        }
    }

    gameOverBoard() {
        const { m, n, boardState } = this
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                if (boardState[i][j] !== -1) {
                    boardState[i][j] = this.openTile(i, j);
                } else {
                    const e = getCell(i,j)
                    e.setAttribute('class', 'cell bomb');
                }
            }
        }
    }
}

(function() {
    const board = new Board(10, 10, 20);

    board.printBoardHtml();
    board.initBombs();
    board.countMinesAll();
    window.board = board;
    // document.getElementById('minesweeper').addEventListener('click', handleClick.bind(board))
    document
        .getElementById('minesweeper')
        .addEventListener('click', board.handleBoardClick.bind(board));
})();
