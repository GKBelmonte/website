var site = site || {};

/**
 * TODO:
 * Implement virual view of neighbours
 * Implement multi-state
 * Implement cavas drag-around
 * Implement init state
 * Implement wrap around
 * Do we use 1-dim array with w*y + x ?
 */

class Matrix {
  constructor(w, h) {
    if (Array.isArray(arguments[0]))
      this._arrayInit(w, h);
    else if (arguments.length == 2)
      this._widthHeightInit(w, h);
    else if (arguments.length === 1)
      this._widthHeightInit(w, w);
    else
      throw new Error('Bad args to Matrix ctor');
    
  }

  _widthHeightInit(w, h) {
    this._internal = new Array(w * h);
    this.width = w;
    this.height = h;
    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        this._internal[i + j * w] = 0;
      }
    }
  }

  _arrayInit(arr, rowColumn) {
    rowColumn = typeof (rowColumn) === 'undefined' ? true : false;

    let numberOfRows = arr.length;
    let numberOfColumns = arr[0].length;

    this._internal = new Array(numberOfRows * numberOfColumns);
    if (rowColumn) {
      this.width = numberOfColumns;
      this.height = numberOfRows;

      for (let ay = 0; ay < numberOfRows; ++ay) {
        for (let ax = 0; ax < numberOfColumns; ++ax) {
          this.set(ax, ay, arr[ay][ax]);
        }
      }
    } else {
      let t = numberOfRows;
      numberOfRows = numberOfColumns;
      numberOfColumns = t;
      this.width = numberOfColumns;
      this.height = numberOfRows;

      for (let ax = 0; ax < numberOfColumns; ++ax) {
        for (let ay = 0; ay < numberOfRows; ++ay) {
          this.set(ax, ay, arr[ax][ay]);
        }
      }
    }
  }

  get(x, y) {
    return this._internal[x + y * this.width];
  }

  set(x, y, val) {
    this._internal[x + y * this.width] = val;
  }

  toString(pad) {
    pad = pad || 3;
    let res = [];
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        res.push(this.get(x, y).toString().padStart(3) + ",")
      }
      res.push('\n');
    }
    return res.join('');
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
  site.jCanvas.mousemove(canvasMouseMove);
  site.width = 100;
  site.height = 50;
  site.N = 2;

  let state = createEmptyState();

  $('#play-button').click(playStop);
  site.jCanvas.click(changeState)

  site.state = state;
  site.play = false;
  debugger;
  let pulsarSeedMatrix = new Matrix(pulsarSeed);

  applyMatrixPattern(site.state, 48, 18, pulsarSeedMatrix)
  drawGrid(10, 10);
  draw();
}

function draw(scale, offset) {
  drawState(site.state);
}

function createEmptyState() {
  let state = [];
  for (let i = 0; i < site.width; ++i) {
    let col = [];
    state.push(col);
    for (let j = 0; j < site.height; ++j) {
      col.push(0);
    }
  }

  return state;
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
      newState[i][j] = computeCellNextState(state, i, j);
    }
  }
  return newState;
}

function computeCellNextState(state, x, y) {
  let livingCount = 0;
  for (let i = -1; i <= 1; ++i) {
    for (let j = -1; j <= 1; ++j) {
      let nx = x + i;
      let ny = y + j;
      let r = state[nx];
      if (typeof (r) !== 'undefined') {
        let state = r[ny];
        if (typeof (state) !== 'undefined' && state === 1)
          livingCount += 1;
      }
      else {
        break;
      }
    }
  }
  let isAlive = site.state[x][y];

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
  draw();
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

function changeState(e) {
  let pos = findPos(this);
  let xPix = e.pageX - pos.x;
  let yPix = e.pageY - pos.y;
  let x = Math.floor(xPix / 10);
  let y = Math.floor(yPix / 10);
  cycleState(site.state, x, y);
}

function canvasMouseMove(e) {
  let pos = findPos(this);
  let x = e.pageX - pos.x;
  let y = e.pageY - pos.y;
  let coord = "x=" + Math.floor(x / 10) + ", y=" + Math.floor(y/10);
  let coordBy4 = "x=" + x / 4 + ", y=" + y / 4;
  let c = this.getContext('2d');
  let p = c.getImageData(x, y, 1, 1).data;
  let val = '?';//root[Math.floor(x/4)][Math.floor(y/4)];
  $('#loc').html(coord);
}

function drawGrid(n,m) {
  let ctx = site.ctx;
  let w = ctx.canvas.width;
  let h = ctx.canvas.height;
  ctx.beginPath();
  ctx.strokeStyle = 'grey';

  //horizontal line
  for (let i = 0; i < ctx.canvas.height; i += n) {
    //https://stackoverflow.com/questions/7530593/html5-canvas-and-line-width/7531540#7531540
    ctx.moveTo(0+0.5, i+0.5);
    ctx.lineTo(w+0.5, i+0.5);
    ctx.stroke();
  }

  for (let i = 0; i < ctx.canvas.width; i += m) {
    ctx.moveTo(i + 0.5, 0 + 0.5);
    ctx.lineTo(i + 0.5, h + 0.5);
    ctx.stroke();
  }
}

function drawState(n, m) {
  let ctx = site.ctx;
  let w = ctx.canvas.width;
  let h = ctx.canvas.height;
  //site.ctx.fillRect(1, 1, 8, 8)
  let lastState = -1;
  for (let i = 0; i < site.width; ++i) {
    for (let j = 0; j < site.height; ++j) {
      let state = site.state[i][j];
      if (state !== lastState)
        setStateColor(ctx, state);
      lastState = state;
      let xStart = 10 * i + 1;
      let yStart = 10 * j + 1;
      ctx.fillRect(xStart, yStart, 8, 8); 
    }
  }

}

function setStateColor(ctx, state) {
  switch (state) {
    case 0:
      ctx.fillStyle = 'black';
      break;
    case 1:
      ctx.fillStyle = 'white';
      break;
  }
}

function cycleState(state, x, y) {
  let s = state[x][y];
  state[x][y] = (s + 1) % site.N;
  draw();
}

function applyPattern(state, x, y, pattern) {
  //assume pattern is row-column
  let numberOfRows = pattern.length;
  if (numberOfRows === 0)
    return;
  let numberOfColumns = pattern[0].length;

  if (x >= state[0].length)
    return;
  if (y >= state.length)
    return;

  for (let py = 0; py < numberOfRows; ++py) {
    if (y + py >= state[0].length)
      break;
    for (let px = 0; px < numberOfColumns; ++px) {
      if (x + px >= state.length)
        break;
      state[x + px][y + py] = pattern[py][px];
    }
  }
}

function applyMatrixPattern(state, x, y, pattern) {

  for (let px = 0; px < pattern.width; ++px) {
    if (px + x > state.length)
      break;
    for (let py = 0; py < pattern.height; ++py) {
      if (py + y > state[0].length)
        break;
      state[px + x][py + y] = pattern.get(px, py);
    }
  }
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

$(document).ready(() => Initialize(0));