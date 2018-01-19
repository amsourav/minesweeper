require=function(r,e,n){function t(n,o){function i(r){return t(i.resolve(r))}function f(e){return r[n][1][e]||e}if(!e[n]){if(!r[n]){var c="function"==typeof require&&require;if(!o&&c)return c(n,!0);if(u)return u(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}i.resolve=f;var a=e[n]=new t.Module;r[n][0].call(a.exports,i,a,a.exports)}return e[n].exports}function o(){this.bundle=t,this.exports={}}var u="function"==typeof require&&require;t.Module=o,t.modules=r,t.cache=e,t.parent=u;for(var i=0;i<n.length;i++)t(n[i]);return t}({5:[function(require,module,exports) {
class e{static generateRandom(e,t){return Math.floor(Math.random()*(t-e))+e}constructor(e,t,s){this.m=e,this.n=t,this.bombs=s,this.isGameOver=!1,this.boardState=Array(this.n).fill(0).map(()=>Array(this.m).fill(0))}isReachable(e,t){const{m:s,n:i}=this;return e>=0&&t>=0&&e<s&&t<i}printBoardHtml(){const{n:e,m:t}=this,s=document.createElement("tbody");s.className="table";for(var i=0;i<t;i+=1){const t=document.createElement("tr");t.setAttribute("class","row");for(var a=0;a<e;a+=1){const e=document.createElement("td");e.setAttribute("class","cell not-mined"),e.setAttribute("id",`${i}-${a}`),e.dataset.coord=`${i}-${a}`,t.appendChild(e)}s.appendChild(t)}document.getElementById("minesweeper").appendChild(s)}getBoardState(){return this.boardState}initBombs(){const{n:t,m:s,bombs:i,boardState:a}=this;let n=0;if(t*s<i)alert("You crazy!");else for(;n<i;){const i=e.generateRandom(0,s),a=e.generateRandom(0,t);-1!==this.boardState[i][a]&&(this.boardState[i][a]=-1,n++)}}handleBoardClick(e){const t=this.boardState.slice(),{isGameOver:s}=this;if(!0===s)return alert("You lost!"),void e.stopPropagation();const i=e.target.dataset.coord.split("-");-1===t[i[0]][i[1]]?(e.target.setAttribute("class","cell blast"),this.isGameOver=!0,this.gameOverBoard()):this.playMinesweeper(parseInt(i[0],10),parseInt(i[1],10))}getCell(e,t){return document.getElementById(`${e}-${t}`)}countMinesNearByUtil(e,t){const{boardState:s}=this;let i=0;return!0===this.isReachable(e,t+1)&&-1===s[e][t+1]&&(i+=1),!0===this.isReachable(e+1,t+1)&&-1===s[e+1][t+1]&&(i+=1),!0===this.isReachable(e+1,t)&&-1===s[e+1][t]&&(i+=1),!0===this.isReachable(e+1,t-1)&&-1===s[e+1][t-1]&&(i+=1),!0===this.isReachable(e,t-1)&&-1===s[e][t-1]&&(i+=1),!0===this.isReachable(e-1,t-1)&&-1===s[e-1][t-1]&&(i+=1),!0===this.isReachable(e-1,t+1)&&-1===s[e-1][t+1]&&(i+=1),!0===this.isReachable(e-1,t)&&-1===s[e-1][t]&&(i+=1),i}countMinesAll(){const{n:e,m:t,boardState:s}=this;for(var i=0;i<t;i++)for(var a=0;a<e;a++)-1!==s[i][a]&&(s[i][a]=this.countMinesNearByUtil(i,a))}openTile(e,t){const s=this.getCell(e,t);s.setAttribute("class","cell mined"),s.innerHTML=this.boardState[e][t]}playMinesweeper(e,t){const{boardState:s}=this;-1!==s[e][t]&&(!0===this.isReachable(e,t)&&-1!==s[e][t]&&this.openTile(e,t),!0===this.isReachable(e,t+1)&&-1!==s[e][t+1]&&this.openTile(e,t+1),!0===this.isReachable(e+1,t+1)&&-1!==s[e+1][t+1]&&this.openTile(e+1,t+1),!0===this.isReachable(e+1,t)&&-1!==s[e+1][t]&&this.openTile(e+1,t),!0===this.isReachable(e+1,t-1)&&-1!==s[e+1][t-1]&&this.openTile(e+1,t-1),!0===this.isReachable(e,t-1)&&-1!==s[e][t-1]&&this.openTile(e,t-1),!0===this.isReachable(e-1,t-1)&&-1!==s[e-1][t-1]&&this.openTile(e-1,t-1),!0===this.isReachable(e-1,t+1)&&-1!==s[e-1][t+1]&&this.openTile(e-1,t+1),!0===this.isReachable(e-1,t)&&-1!==s[e-1][t]&&this.openTile(e-1,t))}gameOverBoard(){const{m:e,n:t,boardState:s}=this;for(var i=0;i<e;i++)for(var a=0;a<t;a++){if(-1!==s[i][a])s[i][a]=this.openTile(i,a);else this.getCell(i,a).setAttribute("class","cell bomb")}}}!function(){const t=new e(10,10,20);t.printBoardHtml(),t.initBombs(),t.countMinesAll(),window.board=t,document.getElementById("minesweeper").addEventListener("click",t.handleBoardClick.bind(t))}();
},{}]},{},[5])