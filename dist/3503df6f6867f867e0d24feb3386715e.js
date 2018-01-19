// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
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
        if (e.target.className === "cell mined") {
            return
        }
        if (tempBoardState[id[0]][id[1]] === -1) {
            this.gameOverBoard();            
            e.target.setAttribute('class', 'cell blast');
            this.isGameOver = true;
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
                    const e = this.getCell(i,j)
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

},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://' + window.location.hostname + ':60664/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,3])