import { Matrix } from './../../js/matrix.js';
import { Rand } from './../../js/rand.js';
import { GolCanvas } from './golCanvas.js';

var site = site || {};

var debug = true;

const mapType = 'map';
const polyType = 'poly';
const customType = 'custom';

class GolRuleSet {

  constructor(base, radius, type) {
    this._type = typeof (type) === 'undefined'
      ? mapType
      : type;
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

    if (this._type === mapType) {
      if (this._ruleCount > 1000000)
        throw new Error(`Total rule count is too large ${this._ruleCount}`);
      this._rules = new Array(this._ruleCount);
    }
    else if (this._type === 'poly') {
      this._numOfCoefficients = Math.max(this._affectingElementCount, this._base) + 2;
      this._coeffs = new Array(this._numOfCoefficients);

    }
  }

  get radius() { return this._radius; }

  get base() { return this._base; }

  get customFunc() { return this._customFunc; }
  set customFunc(val) { this._customFunc = val; }

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
    if (this._type === mapType)
      return this._rules[value];
    else if (this._type === polyType)
      return this.evaluatePolynomial(value);
    else if (this._type === customType)
      return this._customFunc(value);
  }

  evaluatePolynomial(value) {
    let pows = this.getPowers(value, this._coeffs.length);
    let res = 0;
    for (let i = 0; i < pows.length; ++i) {
      let nextVal = res + pows[i] * this._coeffs[i];
      res = nextVal ;
    }
    return Math.floor(res) % this._base;
  }

  getPowers(val, degree) {
    let pow = 1;
    let res = new Array(degree);
    for (let i = 0; i < degree; ++i) {
      res[i] = pow % this._base;
      pow = pow * val;
    }
    return res;
  }

  //a 1D rule would then be transformed to a
  // 2D where the second dimension y is time.
  static getFrom1DRuleSet(ruleId, b, r) {
    //i = 2*r+1
    let width = 2 * r + 1;
    let ruleset = new GolRuleSet(b, r);
    let m = new Matrix(width, width);
    for (let i = 0; i < ruleset._ruleCount; ++i) {
      //Update matrix to one that represents i
      m.updateFromInt(i, b);
      //top row as a digit
      let topRow = m.getSubMatrixAsInt(0, 0, width, 1, b);
      let oldState = m.get(r, r);
      let nextState = Math.floor(ruleId / Math.pow(b, topRow) % b);
      ruleset._rules[i] = topRow !== 0 ? nextState : oldState;
    }
    return ruleset;
  }

  static getFromRandom(b, r, sparse, seed) {

    let rand = new Rand(seed);

    //let frand = {
    //  nextFloat : () => Math.random(),
    //  next : () => Math.floor(Math.random() * 32768)
    //}
    //rand = frand;

    let sparseType = typeof (sparse)
    sparse = sparseType === 'undefined' ? false : sparse;
    let sparseValue = 0.5;
    if (sparseType === 'number')
      sparseValue = sparse;

    let ruleset = new GolRuleSet(b, r);
    for (let i = 0; i < ruleset._ruleCount; ++i) {
      if (!sparse || rand.nextFloat() > sparseValue)
        ruleset._rules[i] = rand.next() % b;
      else
        ruleset._rules[i] = 0;
    }
    ruleset.seed = rand.initialSeed;
    return ruleset;
  }

  static getFromRandomPoly(b, r, seed) {

    let rand = new Rand(seed);

    let ruleset = new GolRuleSet(b, r, polyType);
    for (let i = 0; i < ruleset._coeffs.length; ++i) {
      ruleset._coeffs[i] = rand.nextFloat() * b;
    }
    ruleset.seed = rand.initialSeed;
    return ruleset;
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
  site.N = 4;
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

  //site.state.applyMatrixPattern(5, 5, pulsarSeedMatrix);
  //site.state.applyMatrixPattern(50, 30, acornMatrix);
  
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

  let ruleset90 = GolRuleSet.getFrom1DRuleSet(90, 2, 1);
  site.ruleset = ruleset90;
  //nothing about this assumes time, yet it behaves as such...
  //all it assumes is that if the top value is not 0, we should compute the next one.
  // however, because the result would be the same nothing changes until another wave passes
  // really cool
  let ruleset96 = GolRuleSet.getFrom1DRuleSet(150, 2, 1); //xor
  site.ruleset = ruleset96;
  // this ruleset is turing complete.
  let ruleset110 = GolRuleSet.getFrom1DRuleSet(110, 2, 1);
  site.ruleset = ruleset110;


  let interestingSeeds = [1316, 29223, 9459, 22713, 3074];
  //random ruleset out of 2^512 (if n = 2)
  //let randRuleSet = GolRuleSet.getFromRandom(site.N, 1, 0.77);
  //site.ruleset = randRuleSet;


  let interestingPolySeeds = [13149, 6986]
  //random ruleset out of 2^512
  //let polyRuleSet = GolRuleSet.getFromRandomPoly(site.N, 1);
  //site.ruleset = polyRuleSet;

  let customRule = new GolRuleSet(site.N, 1, customType);
  customRule.customFunc = (val) => custom1(val);
  site.ruleset = customRule;

  let startingStateSeed = 2;
  let density = 0.03;

  initRandState(startingStateSeed, density);

  site.golCanvas.draw();
  $('#seed').html(site.ruleset.seed);
}

function initRandState(seed, density) {
  let rand = new Rand(seed);
  for (let i = 0; i < site.width; ++i) {
    for (let j = 0; j < site.height; ++j) {
      if (rand.nextFloat() < density)
        site.state.set(i, j, rand.next() % site.N);
    }
  }
}

function custom1(val) {
  //return Math.floor((val % 32)/ 16);
  let res = 0;
  res = Math.floor((val / 256) % 4);
  if (res !== 0)
    return res;

  let pick = val % 9;
  let digit = Math.floor(val / Math.pow(site.N, pick)) % 4
  return digit;
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
      let nextIJstate = computeCellNextStateFromRuleSet(state, i, j, site.ruleset);
      newState.set(i, j, nextIJstate);
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
  let coord = `x=${x}, y=${y}`;
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