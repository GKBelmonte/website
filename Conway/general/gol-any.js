import { Matrix } from './matrix.js';

var site = site || {};

/**
 * TODO:
 * Implement virual view of neighbours
 * Implement multi-state
 * Implement cavas drag-around
 * Implement canvas zoom-inout
 * Implement init state
 * Implement wrap around
 */

class Canvas {
  constructor(canvasJElement) {
    this._jCanvas = canvasJElement;
    this.canvas = canvasJElement[0];
    let canvas = this.canvas;
    this.ctx = this.canvas.getContext('2d')

    let self = this;
    canvas.addEventListener("mousedown",  e => self.onMouseDown(e, this));
    canvas.addEventListener("mouseup",    e => self.onMouseUp(e, this));
    canvas.addEventListener("mouseover",  e => self.onMouseOver(e, this));
    canvas.addEventListener("mouseout",   e => self.onMouseOut(e, this));
    canvas.addEventListener("mousemove",  e => self.onMouseMove(e, this));
    canvas.addEventListener('click',      e => self.onMouseClick(e, this));
    canvas.addEventListener('contextmenu', event => event.preventDefault(), false);
    
    this.translatePos = {
      x: 0,
      y: 0
    };
    this.startDragOffset = {};
    this.isMouseDown = false;
    this.scale = 1;

    this.mouseMove = null;
    this.mouseClick = null;
  }

  onMouseClick(evt, orig) {
    this.raiseMouseEvent('mouseClick', evt);
  }

  onMouseDown(evt) {
    if (evt.which !== 3)
      return;
    this.isMouseDown = true;
    this.startDragOffset.x = evt.clientX - this.translatePos.x;
    this.startDragOffset.y = evt.clientY - this.translatePos.y;
  }

  onMouseUp(evt) {
    this.isMouseDown = false;
  }

  onMouseOut(evt) {
    this.isMouseDown = false;
  }

  onMouseOver(evt) {
    this.isMouseDown = false;
  }

  onMouseMove(evt, orig) {
    if (this.isMouseDown) {
      this.translatePos.x = evt.clientX - this.startDragOffset.x;
      this.translatePos.y = evt.clientY - this.startDragOffset.y;
      this.draw();
    }
    this.raiseMouseEvent('mouseMove', evt);
  }

  draw(e) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.translatePos.x, this.translatePos.y);
    this.ctx.scale(this.scale, this.scale);
    this.specializedDraw();
    this.ctx.restore();
  }

  specializedDraw() {
    //implemented by child class
  }

  get hCanvas() { return this.canvas }

  get jCanvas() { return this._jCanvas }

  htmlToCanvas(x, y) {
    let resX = x / this.scale;
    let resY = y / this.scale;
    resX = x - this.translatePos.x;
    resY = y - this.translatePos.y;
    return { x: resX, y: resY };
  }

  canvasToHtml(x, y) {
    let resX = x * this.scale;
    let resY = y * this.scale;
    resX = x + this.translatePos.x;
    resY = y + this.translatePos.y;
    return { x: resX, y: resY };
  }

  findPos() {
    let obj = this.canvas;
    let curleft = 0, curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { x: curleft, y: curtop };
    }
    return undefined;
  }

  getMouseRelativeHtmlPos(e) {
    let pos = this.findPos();
    let xPix = e.pageX - pos.x;
    let yPix = e.pageY - pos.y;
    return { x: xPix, y:yPix };
  }

  getMouseEvtData(e) {
    let htmlPos = this.getMouseRelativeHtmlPos(e);
    let canvasPos = this.htmlToCanvas(htmlPos.x, htmlPos.y);
    let evt = {
      sender: this,
      originalEvent: e,
      htmlPos: htmlPos,
      canvasPos: canvasPos
    };
    return evt;
  }

  raiseMouseEvent(name, origEvt) {
    let func = this[name];
    if (!!func) {
      let newE = this.getMouseEvtData(origEvt);
      func(newE);
    }
  }

  viewSpaceSector(x, y) {
    let hCoord = this.canvasToHtml(x, y);

    let space = { x: 0, y: 0 };

    if (hCoord.y < 0) {
      space.y = -1;
    }
    else if (hCoord.y > this.canvas.height) {
      space.y = 1;
    }

    if (hCoord.x < 0) {
      space.x = -1;
    }
    else if (hCoord.x > this.canvas.width) {
      space.x = 1;
    }

    return space;
  }
}

class GolCanvas extends Canvas {

  constructor(site, jCanvas) {
    super(jCanvas);
    this.site = site;
  }

  drawGrid(n, m) {
    let ctx = this.ctx;
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    ctx.beginPath();
    ctx.strokeStyle = 'grey';

    //horizontal line
    for (let i = 0; i < ctx.canvas.height; i += n) {
      //https://stackoverflow.com/questions/7530593/html5-canvas-and-line-width/7531540#7531540
      ctx.moveTo(0 + 0.5, i + 0.5);
      ctx.lineTo(w + 0.5, i + 0.5);
      ctx.stroke();
    }

    //vertical
    for (let i = 0; i < ctx.canvas.width; i += m) {
      ctx.moveTo(i + 0.5, 0 + 0.5);
      ctx.lineTo(i + 0.5, h + 0.5);
      ctx.stroke();
    }
  }

  drawState() {
    let ctx = this.ctx;
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    let state = this.site.state;
    //site.ctx.fillRect(1, 1, 8, 8)
    let lastState = -1;

    for (let i = 0; i < state.width; ++i) {
      let viewSpace = null;
      for (let j = 0; j < state.height; ++j) {
        let xStart = 10 * i + 1;
        let yStart = 10 * j + 1;

        //todo: better yet compute which i, and j start and end that are in view
        viewSpace = this.viewSpaceSector(xStart, yStart);
        if (viewSpace.x === -1)
          break;
        if (viewSpace.x === 1)
          break;
        if (viewSpace.y === 1)
          break; 
        if (viewSpace.y === -1)
          continue;

        let s = state.get(i, j);
        if (s !== lastState)
          this.setStateColor(ctx, s);
        lastState = s;
        
        ctx.fillRect(xStart, yStart, 8, 8);
      }
      if (viewSpace.y === 1) {
        if (viewSpace.x === 1)
          break;
        continue;
      }

    }

  }

  setStateColor(ctx, state) {
    switch (state) {
      case 0:
        ctx.fillStyle = 'black';
        break;
      case 1:
        ctx.fillStyle = 'white';
        break;
    }
  }

  specializedDraw() {
    this.drawGrid(10, 10);
    this.drawState(this.state);
    //this.testDraw();
  }

  testDraw() {
    let context = this.ctx;
    context.beginPath(); // begin custom shape
    context.moveTo(-119, -20);
    context.bezierCurveTo(-159, 0, -159, 50, -59, 50);
    context.bezierCurveTo(-39, 80, 31, 80, 51, 50);
    context.bezierCurveTo(131, 50, 131, 20, 101, 0);
    context.bezierCurveTo(141, -60, 81, -70, 51, -50);
    context.bezierCurveTo(31, -95, -39, -80, -39, -50);
    context.bezierCurveTo(-89, -95, -139, -80, -119, -20);
    context.closePath(); // complete custom shape
    let grd = context.createLinearGradient(-59, -100, 81, 100);
    grd.addColorStop(0, "#8ED6FF"); // light blue
    grd.addColorStop(1, "#004CB3"); // dark blue
    context.fillStyle = grd;
    context.fill();

    context.lineWidth = 5;
    context.strokeStyle = "#0000ff";
    context.stroke();
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

  site.width = 150;
  site.height = 150;
  site.N = 2;

  let state = createEmptyState();

  site.golCanvas.mouseClick = changeState;
  site.golCanvas.mouseMove = canvasMouseMove;


  $('#play-button').click(playStop);
  

  debugger;

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