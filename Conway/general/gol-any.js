import { Matrix } from './../../js/matrix.js';
import { GolCanvas } from './golCanvas.js';

var site = site || {};

var debug = true;
/**
 * TODO:
 * Implement multi-state
 */


class GolRuleSet {
  constructor(base, radius) {
    this._base = base;
    this._radius = radius;
    //B: base (or number of possible states)
    //R: radius of affecting cells (R = 1 classic GoL)
    //re: number of elements affecting a state. Will be (2*R + 1)^2  for 2D GoL
    //Nr = B^re : number of rules in a rule set
    //    e.g. 1-D GoL => B = 2, re = 3, Nr = 2 ^ 3 = 8 Rules
    //    e.g. 2-D GoL => B = 2, re = 9, Nr = 2 ^ 9 = 512 Rules
    //    e.g. 2-D 4 color game                    => 262'144 Rules = 2^18
    //    e.g. 2-D 2-radius game, re = 25          => 33'554'432‬ Rules = 2^25
    //    e.g. 2-D 16 color game => B = 16, re = 9 => 68'719'476'736 Rules = 2^36 (at 1 byte per rule, thats 68GB)
    //|Sr| = Nr^re =  B^(B^re) = number of possilbe rulesets
    //    e.g. 1-D GoL => B = 2, re = 3, 2^(2^3) = 256               possible rulesets 
    //    e.g. 2-D GoL => B = 2, re = 9, 2^(2^9) = 1.3408 * 10 ^ 154 possible rulesets
    //    e.g. 2-D 4 color game          4^(4^9) ~= 10 ^ 157826  
    //        (there are an estimated 10^82 atoms in the universe)
    // luckily we only need 512 bits to represent any one of them.
    //  (Wolfram called them rules, ill call each line a rule, and a given combination of rules a ruleset)
    let submatrixWidth = 2 * this._radius + 1;
    this._affectingElementCount = submatrixWidth * submatrixWidth;
    this._ruleCount = Math.pow(this._base, this._affectingElementCount);
    if (this._ruleCount > 1000000)
      throw new Error(`Total rule count is too large ${this._ruleCount}`);
    this._rules = new Array(this._ruleCount);
  }

  get radius() { return this._radius; }

  get base() { return this._base; }

  static getFromFunc(f, b, r) {
    let ruleset = new GolRuleSet(b, r);
    let m = new Matrix(2 * r + 1, 2 * r + 1);
    for (let i = 0; i < ruleset._ruleCount; ++i) {
      //Update matrix to one that represents i
      m.updateFromInt(i, b);
      let nextState = f(m, r, r);
      ruleset._rules[i] = nextState;
    }
    return ruleset;
  }

  apply(value) {
    return this._rules[value];
  }
}

function Initialize(param) {
  //refs:
  // 
  // perf https://www.html5rocks.com/en/tutorials/canvas/performance/#toc-ref
  window.site = site;
  site.jCanvas = $('canvas');
  site.canvas = site.jCanvas[0];
  site.ctx = site.canvas.getContext('2d');
  site.golCanvas = new GolCanvas(site, site.jCanvas);

  site.width = 100;
  site.height = 100;
  site.N = 2;
  site.R = 1;
  site.wrapAround = true;

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

  //test creating a matrix from an int
  let test = new Matrix(3, 3);
  test.updateFromInt(90, 2);
  if (test.getAsInt(2) !== 90 && debug)
    throw new Error("Should not happen");
  let classicGol = GolRuleSet.getFromFunc(computeCellNextState, 2, 1);
  site.ruleset = classicGol;
  let nextState = classicGol.apply(7);
  if (nextState !== 1 && debug)
    throw new Error("Should not happen");
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
      //newState.set(i, j, computeCellNextState(state, i, j) );
      newState.set(i, j, computeCellNextStateFromRuleSet(state, i, j, site.ruleset));
    }
  }
  return newState;
}

function computeCellNextStateFromRuleSet(state, x, y, ruleset) {
  let radius = ruleset.radius;
  let width = radius * 2 + 1
  let base = ruleset.base;
  //funny, if I dont substract the radius, i get a drifting GoL
  // same exact behavior but everything drifts north west.
  let intVal = state.getSubMatrixAsInt(x - radius, y - radius, width, width, base);
  let next = ruleset.apply(intVal);
  return next;

}


function computeCellNextState(state, x, y) {
  let livingCount = 0;
  let xStart = x - site.R;
  let yStart = y - site.R;
  let diameter = site.R * 2 + 1;
  for (let i = 0; i < diameter; ++i) {
    let val = null;
    for (let j = 0; j < diameter; ++j) {
      val = state.getAsSubMatrix(xStart, yStart, i, j, site.wrapAround);
      if (val === null)
        break;
      if (val === 1)
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