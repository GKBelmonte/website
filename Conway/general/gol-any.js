import { Matrix } from './../../js/matrix.js';
import { GolCanvas } from './golCavas.js';

var site = site || {};

/**
 * TODO:
 * Implement virtual view of neighbours
 * Implement multi-state
 * Implement canvas zoom-inout
 * Implement wrap around
 */


function Initialize(param) {
  //refs:
  // 
  // perf https://www.html5rocks.com/en/tutorials/canvas/performance/#toc-ref
  window.site = site;
  site.jCanvas = $('canvas');
  site.canvas = site.jCanvas[0];
  site.ctx = site.canvas.getContext('2d');
  site.golCanvas = new GolCanvas(site, site.jCanvas);

  site.width = 150;
  site.height = 150;
  site.N = 2;

  let state = createEmptyState();

  site.golCanvas.mouseClick = changeState;
  site.golCanvas.mouseMove = canvasMouseMove;

  $('#play-button').click(playStop);

  site.state = state;
  site.play = false;
  
  let pulsarSeedMatrix = new Matrix(pulsarSeed);
  let acornMatrix = new Matrix(acorn)

  site.state.applyMatrixPattern(5, 5, pulsarSeedMatrix);
  site.state.applyMatrixPattern(50, 30, acornMatrix);
  
  site.golCanvas.draw();
}

function createEmptyState() {
  return new Matrix(site.width, site.height);
}

function playStop() {
  if (site.play) {
    site.play = false;
    $('#play-button').removeClass('play-stop-button-playing');
  } else {
    site.play = true;
    setTimeout(frame, 500);
    $('#play-button').addClass('play-stop-button-playing');
  }
}

function computeNextState(state) {
  let newState = createEmptyState();
  for (let i = 0; i < site.width; ++i) {
    for (let j = 0; j < site.height; ++j) {
      newState.set(i, j, computeCellNextState(state, i, j) );
    }
  }
  return newState;
}

function computeCellNextState(state, x, y) {
  let livingCount = 0;
  for (let i = -1; i <= 1; ++i) {
    let nx = x + i;
    if (nx >= state.width)
      break;
    for (let j = -1; j <= 1; ++j) {
      let ny = y + j;
      if (ny >= state.height)
        break;
      let s = state.get(nx,ny);
      if (s === 1)
        livingCount += 1; 
    }
  }

  let isAlive = state.get(x, y);

  if (!isAlive) {
    if (livingCount === 3)
      return 1;
    return 0;
  }
  if (livingCount <= 2)
    return 0; //under-population
  if (livingCount > 4 && isAlive)
    return 0; //over-population
  
  return 1;
}

function frame() {
  site.state = computeNextState(site.state);
  site.golCanvas.draw();
  if (site.play)
    setTimeout(frame, 500);
}

function findPos(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return { x: curleft, y: curtop };
  }
  return undefined;
}

//for ref
function clickPos(e) {
  let pos = findPos(this);
  let xPix = e.pageX - pos.x;
  let yPix = e.pageY - pos.y;
  return { x: xPix, y: yPix };
}

function changeState(e) {
  let rp = e.canvasPos;
  let x = Math.floor(rp.x / 10);
  let y = Math.floor(rp.y / 10);
  cycleState(site.state, x, y);
}

function canvasMouseMove(e) {
  let rp = e.canvasPos;
  let x = Math.floor(rp.x / 10);
  let y = Math.floor(rp.y / 10);
  let coord = "x=" + x + ", y=" + y;
  $('#loc').html(coord);
}

function cycleState(state, x, y) {
  let s = state.get(x, y);
  state.set(x, y, (s + 1) % site.N);
  site.golCanvas.draw();
}

function test(n) {
  let ctx = site.ctx;
  switch (n) {
    case 0:
      ctx.fillStyle = 'green';
      ctx.fillRect(10, 10, 150, 100);
      break;
    case 1:
      ctx.moveTo(0, 0);
      ctx.lineTo(200, 100);
      ctx.stroke();
      break;
    case 2:
      ctx.font = "30px Arial";
      ctx.fillText("Hello World", 10, 50);
      break;
    case 3:
      ctx.font = "30px Arial";
      ctx.strokeText("Hello World", 10, 50);
      break;
  }
}

//row-column order
var pulsarSeed = [
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];

var acorn = [
  [0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [1, 1, 0, 0, 1, 1, 1]
];

$(document).ready(() => Initialize(0));