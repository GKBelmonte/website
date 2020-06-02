var site = site || {};

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

  debugger;
  let state = createEmptyState();

  $('#play-button').click(playStop);
  site.jCanvas.click(changeState)

  site.state = state;
  site.play = false;

  draw();
}

function draw(scale, offset) {
  drawGrid(10, 10);
  drawState(site.state);
}

function createEmptyState() {
  let state = [];
  for (let i = 0; i < site.width; ++i) {
    let row = [];
    state.push(row);
    for (let j = 0; j < site.height; ++j) {
      row.push(0);
    }
  }

  return state;
}

function playStop() {
  if (site.play) {
    site.play = false;
  } else {
    site.play = true;
    setTimeout(frame, 500);
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
  let coord = "x=" + x + ", y=" + y;
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
  for (let i = 0; i < site.width; ++i) {
    for (let j = 0; j < site.height; ++j) {
      let state = site.state[i][j];
      setStateColor(ctx, state);
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

$(document).ready(() => Initialize(0));