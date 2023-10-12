import './css/style.css'

let main = document.querySelector(".main");
const scroeElem = document.getElementById("score");
const levelElem = document.getElementById("level");
const nextTetroElem = document.getElementById("next-tetro");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const gameOver = document.getElementById("game-over");
const rotate = document.getElementById("rotate");
const down = document.getElementById("down");
const right = document.getElementById("right");
const left = document.getElementById("left");
const down3 = document.getElementById("down3");
const control = document.getElementsByClassName("control")
let oneColor = document.getElementById('oneColor')
let hiddenKeys = document.getElementById('hiddenKeys')
let lastFigure = 10
let end = false
let color = {
O: 10,
I: 20,
S: 30,
Z: 40,
L: 50,
J: 1,
T: 50

}
let reloadPage = document.getElementById(`reload`)
reloadPage.onclick = () => {
  location.reload(true)
}
let ONActive = false
oneColor.onclick= ()=>{
  ONActive = !ONActive
  draw()
  oneColor.blur()
}
let hidk = false
let cntrlDiv = document.getElementById(`controlDiv`)
hiddenKeys.onclick = ()=>{
  if(!hidk)
  {
    cntrlDiv.style = `visibility: hidden`
  }
  else {
    cntrlDiv.style = ``
  }
  hidk = !hidk
  
}
let playfield = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let score = 0;
let gameTimerID;
let currentLevel = 1;
let isPaused = true;
let possibleLevels = {
  1: {
    scorePerLine: 10,
    speed: 400,
    nextLevelScore: 20,
  },
  2: {
    scorePerLine: 15,
    speed: 300,
    nextLevelScore: 500,
  },
  3: {
    scorePerLine: 20,
    speed: 200,
    nextLevelScore: 1000,
  },
  4: {
    scorePerLine: 30,
    speed: 100,
    nextLevelScore: 2000,
  },
  5: {
    scorePerLine: 50,
    speed: 50,
    nextLevelScore: Infinity,
  },
};

let figures = {}
updFigures()
let activeTetro = getNewTetro();
let nextTetro = getNewTetro();

function draw() {
  let mainInnerHTML = "";
  for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) {
      if(!ONActive)
      {
        if (playfield[y][x] === 1) {
          mainInnerHTML += '<div class="cell movingCell"></div>';
        } else if (playfield[y][x] === 2) {
          mainInnerHTML += '<div class="cell fixedCell"></div>';
        } else if(playfield[y][x] === 3) {
          mainInnerHTML += '<div class="cell failCell"></div>';
        } else if(playfield[y][x] === 10 || playfield[y][x] === 11) {
          mainInnerHTML += '<div class="cell O"></div>';
        } else if(playfield[y][x] === 20 || playfield[y][x] === 21) {
          mainInnerHTML += '<div class="cell I"></div>';
        } else if(playfield[y][x] === 30 || playfield[y][x] === 31) {
          mainInnerHTML += '<div class="cell S"></div>';
        } else if(playfield[y][x] === 40 || playfield[y][x] === 41) {
          mainInnerHTML += '<div class="cell Z"></div>';
        } else if(playfield[y][x] === 50 || playfield[y][x] === 51) {
          mainInnerHTML += '<div class="cell L"></div>';
        } else {
          mainInnerHTML += '<div class="cell"></div>';
        }
      }
      else {
        if(playfield[y][x] === 1) {
          mainInnerHTML += '<div class="cell movingCell"></div>';
        }
        else if (playfield[y][x] >= 2)
        {
          mainInnerHTML += '<div class="cell fixedCell"></div>'
        }
        else {
          mainInnerHTML += '<div class="cell"></div>';
        }
      }
    }
  }
  main.innerHTML = mainInnerHTML;
}

function drawNextTetro() {
  let nextTetroInnerHTML = "";
  for (let y = 0; y < nextTetro.shape.length; y++) {
    for (let x = 0; x < nextTetro.shape[y].length; x++) {
      if (nextTetro.shape[y][x] == 1) {
        nextTetroInnerHTML += '<div class="cell movingCell"></div>';
      } else if (nextTetro.shape[y][x] === 2) {
        nextTetroInnerHTML += '<div class="cell fixedCell"></div>';
      } else if(nextTetro.shape[y][x] === 3) {
        nextTetroInnerHTML += '<div class="cell failCell"></div>';
      } else if(nextTetro.shape[y][x] === 10) {
        nextTetroInnerHTML += '<div class="cell O"></div>';
      } else if(nextTetro.shape[y][x] === 20) {
        nextTetroInnerHTML += '<div class="cell I"></div>';
      } else if(nextTetro.shape[y][x] === 30) {
        nextTetroInnerHTML += '<div class="cell S"></div>';
      } else if(nextTetro.shape[y][x] === 40) {
        nextTetroInnerHTML += '<div class="cell Z"></div>';
      } else if(nextTetro.shape[y][x] === 50) {
        nextTetroInnerHTML += '<div class="cell L"></div>';
      } else {
        nextTetroInnerHTML += '<div class="cell"></div>';
      }
    }
    nextTetroInnerHTML += "<br/>";
  }
  nextTetroElem.innerHTML = nextTetroInnerHTML;
}

function removePrevActiveTetro() {
  for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) {
      if (playfield[y][x] === 1 || playfield[y][x] === 10 || playfield[y][x] === 20 || playfield[y][x] === 30 || playfield[y][x] === 40 || playfield[y][x] === 50) {//gggg
        playfield[y][x] = 0;
      }
    }
  }
}

function addActiveTetro() {
  removePrevActiveTetro();
  for (let y = 0; y < activeTetro.shape.length; y++) {
    for (let x = 0; x < activeTetro.shape[y].length; x++) {
      if (activeTetro.shape[y][x] === 1 || activeTetro.shape[y][x] === 10 || activeTetro.shape[y][x] === 20 || activeTetro.shape[y][x] === 30 || activeTetro.shape[y][x] === 40 || activeTetro.shape[y][x] === 50) {//gggg
        playfield[activeTetro.y + y][activeTetro.x + x] =
          activeTetro.shape[y][x];
      }
    }
  }
}

function rotateTetro() {
  const prevTetroState = activeTetro.shape;

  activeTetro.shape = activeTetro.shape[0].map((val, index) =>
    activeTetro.shape.map((row) => row[index]).reverse()
  );

  if (hasCollisions()) {
    activeTetro.shape = prevTetroState;
  }
}

function hasCollisions() {
  for (let y = 0; y < activeTetro.shape.length; y++) {
    for (let x = 0; x < activeTetro.shape[y].length; x++) {
      if (
        activeTetro.shape[y][x] &&
        (playfield[activeTetro.y + y] === undefined ||
          playfield[activeTetro.y + y][activeTetro.x + x] === undefined ||
          playfield[activeTetro.y + y][activeTetro.x + x] === 2 ||
          playfield[activeTetro.y + y][activeTetro.x + x] === 11||
          playfield[activeTetro.y + y][activeTetro.x + x] === 21||
          playfield[activeTetro.y + y][activeTetro.x + x] === 31||
          playfield[activeTetro.y + y][activeTetro.x + x] === 41||
          playfield[activeTetro.y + y][activeTetro.x + x] === 51 //gggg
          )
      ) {
        return true;
      }
    }
  }
  return false;
}

function removeFullLines() {
  let canRemoveLine = true,
    filledLines = 0;
  for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) {
      if (playfield[y][x] !== 2 && playfield[y][x] !== 11 && playfield[y][x] !== 21 && playfield[y][x] !== 31 && playfield[y][x] !== 41 && playfield[y][x] !== 51 ) {//gggg
        canRemoveLine = false;
        break;
      }
    }
    if (canRemoveLine) {
        let ggg = 1
        //playfield.splice(y, 1);
        //playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        playfield.splice(y, ggg, [3,3,3,3,3,3,3,3,3,3]);
        setTimeout(() => {
          playfield.splice(y, ggg, [0,0,0,0,0,0,0,0,0,0]);
          setTimeout(() => {
            playfield.splice(y, ggg, [3,3,3,3,3,3,3,3,3,3]);
            setTimeout(() => {
              playfield.splice(y, ggg, [0,0,0,0,0,0,0,0,0,0]);
              setTimeout(() => {
                playfield.splice(y, ggg);
                playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
              }, 300);
            }, 300);
          }, 300);
        }, 300);
        filledLines += 1;
    }
    canRemoveLine = true;
  }

  switch (filledLines) {
    case 1:
      score += possibleLevels[currentLevel].scorePerLine;
      break;
    case 2:
      score += possibleLevels[currentLevel].scorePerLine * 3;
      break;
    case 3:
      score += possibleLevels[currentLevel].scorePerLine * 6;
      break;
    case 4:
      score += possibleLevels[currentLevel].scorePerLine * 12;
      break;
  }

  scroeElem.innerHTML = score;

  if (score >= possibleLevels[currentLevel].nextLevelScore) {
    currentLevel++;
    levelElem.innerHTML = currentLevel;
  }
}
function r(min,max) {
  return Math.floor(Math.random() * (max - min)) + min
}
function getNewTetro() {
  const possibleFigures = "IOLJTSZ";
  let rand = Math.floor(Math.random() * 7);
  
  for(;;)
  {
    if(rand == lastFigure)
    {
      rand = Math.floor(Math.random() * 7);
    }
    else break
  }
  lastFigure = rand
  const newTetro = figures[possibleFigures[rand]];
  return {
    x: Math.floor((r(4,16) - newTetro[0].length) / 2),
    y: 0,
    shape: newTetro,
  };
}

function fixTetro() {
  for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) {
      if (playfield[y][x] === 1) {//gggg
        playfield[y][x] = 2;
      }
      if (playfield[y][x] === 10) {//gggg
        playfield[y][x] = 11;
      }
      if (playfield[y][x] === 20) {//gggg
        playfield[y][x] = 21;
      }
      if (playfield[y][x] === 30) {//gggg
        playfield[y][x] = 31;
      }
      if (playfield[y][x] === 40) {//gggg
        playfield[y][x] = 41;
      }
      if (playfield[y][x] === 50) {//gggg
        playfield[y][x] = 51;
      }
    }
  }
  updFigures()
}


function updFigures () {
  figures = {
    O: [
      [color.O, color.O],
      [color.O, color.O],
    ],
    I: [
      [0, 0, 0, 0],
      [color.I, color.I, color.I, color.I],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    S: [
      [0, color.S, color.S],
      [color.S, color.S, 0],
      [0, 0, 0],
    ],
    Z: [
      [color.Z, color.Z, 0],
      [0, color.Z, color.Z],
      [0, 0, 0],
    ],
    L: [
      [color.L, 0, 0],
      [color.L, color.L, color.L],
      [0, 0, 0],
    ],
    J: [
      [0, 0, color.J],
      [color.J, color.J, color.J],
      [0, 0, 0],
    ],
    T: [
      [color.T, color.T, color.T], // [0, 0, 1],
      [0, color.T, 0], // [0, 1, 1],
      [0, 0, 0], // [0, 0, 1],
    ],
  };
}

function moveTetroDown() {
  activeTetro.y += 1;
  if (hasCollisions()) {
    activeTetro.y -= 1;
    fixTetro();
    removeFullLines();
    activeTetro = nextTetro;
    if (hasCollisions()) {
      reset();
    }
    nextTetro = getNewTetro();
  }
}

function dropTetro() {
  for (let y = activeTetro.y; y < playfield.length; y++) {
    activeTetro.y ++
    if (hasCollisions()) {
      activeTetro.y--;
      break;
    }
  }
}

function reset() {
  isPaused = true;
  clearTimeout(gameTimerID);
  let y = playfield.length--
  let y1 = playfield.length--
  let g = setInterval(() => {
    if(y==0) {clearInterval(g)}
    playfield.splice(y,1,[3,3,3,3,3,3,3,3,3,3])
    y--
    draw()
  }, 5);
  setTimeout(() => {
    let b = setInterval(() => {
      if(y1==0) {clearInterval(b);end = true
        draw();}
      playfield.splice(y1,1,[0,0,0,0,0,0,0,0,0,0])
      y1--
      draw()
    }, 5);
    setTimeout(() => {
      gameOver.innerHTML = `Игра окончена`
      setTimeout(()=>{location.reload()},1500)
    }, 1200);
  }, 50);
  /*clearTimeout(gameTimerID);
  playfield = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  draw();
  gameOver.style.display = "block";
  setTimeout(()=>{
    location.reload()
  }, 3000)*/
}

rotate.onclick = ()=>{
  if (!isPaused) {
  rotateTetro();
  updateGameState();
  }
}
right.onclick = ()=>{
  if (!isPaused) {
  activeTetro.x += 1;
  if (hasCollisions()) {
    activeTetro.x -= 1;
  }
  updateGameState();
  }
}
left.onclick = ()=>{
  if (!isPaused) {
  activeTetro.x -= 1;
  if (hasCollisions()) {
    activeTetro.x += 1;
  }
  updateGameState();
  }
}
down.onclick = ()=>{if (!isPaused) {moveTetroDown();updateGameState();}}
down3.onclick = ()=>{
  if (!isPaused) {
  dropTetro();
  updateGameState();
  }
}
document.onkeydown = function (e) {
  if (!isPaused) {
    if (e.keyCode === 37) {
      left.onclick()
    } else if (e.keyCode === 39) {
      right.onclick()
    } else if (e.keyCode === 40) {
      down.onclick()
    } else if (e.keyCode === 38) {
      rotate.onclick()
    } else if (e.keyCode === 32) {
      down3.onclick()
    }
  }
};

function updateGameState() {
  if (!isPaused) {
    addActiveTetro();
    draw();
    drawNextTetro();
  }
}

pauseBtn.addEventListener("click", (e) => {
  if (e.target.innerHTML === "Пауза") {
    e.target.innerHTML = "Продолжить";
    clearTimeout(gameTimerID);
  } else {
    e.target.innerHTML = "Пауза";
    gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
  }
  isPaused = !isPaused;
});
let clcbtns = false
startBtn.addEventListener("click", (e) => {
  e.target.innerHTML = "Начать заново";
  if(clcbtns)
  {
    reset()
  }
  isPaused = false;
  clcbtns=true
  gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
});

scroeElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

draw();

function startGame() {
  if(!end)
  {
    moveTetroDown();
    if (!isPaused) {
      updateGameState();
      gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
  }
}
