import { Canvas } from './../../js/canvas.js';

export class GolCanvas extends Canvas {

  constructor(site, jCanvas) {
    super(jCanvas);
    this.site = site;
    this.enableScreenSpaceOnlyDraw = true
  }

  drawGrid(n, m) {
    let ctx = this.ctx;
    let w = this.site.state.width * n;
    let h = this.site.state.height * m;
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    let firstI = 0, firstJ = 0;
    let lastJ = (this.site.state.height + 1) * m;
    let lastI = (this.site.state.width + 1) * n;

    if (this.enableScreenSpaceOnlyDraw) {
      firstI = Math.floor(this.canvasStart.x / n) * n;
      firstJ = Math.floor(this.canvasStart.y / m) * m;
      lastI = Math.ceil(this.canvasEnd.x / n) * n;
      lastJ = Math.ceil(this.canvasEnd.y / m) * m;
      firstI = Math.max(firstI, 0);
      firstJ = Math.max(firstJ, 0);
      lastI = Math.min(lastI, w + n);
      lastJ = Math.min(lastJ, w + m);
    }

    //horizontal line
    for (let i = firstJ; i < lastJ; i += n) {
      //https://stackoverflow.com/questions/7530593/html5-canvas-and-line-width/7531540#7531540
      ctx.moveTo(0 + 0.5, i + 0.5);
      ctx.lineTo(w + 0.5, i + 0.5);
      ctx.stroke();
    }

    //vertical
    for (let i = firstI; i < lastI; i += m) {
      ctx.moveTo(i + 0.5, 0 + 0.5);
      ctx.lineTo(i + 0.5, h + 0.5);
      ctx.stroke();
    }
  }

  drawState() {
    let ctx = this.ctx;
    let state = this.site.state;
    let lastState = -1;

    let firstElementI = 0, firstElementJ = 0;
    let lastElementI = state.width;
    let lastElementJ = state.height;
    //figure out what cell elements are in view and draw thos only
    if (this.enableScreenSpaceOnlyDraw) {
      firstElementI = Math.max(Math.floor(this.canvasStart.x / 10), 0);
      firstElementJ = Math.max(Math.floor(this.canvasStart.y / 10), 0);

      lastElementI = Math.min(Math.ceil(this.canvasEnd.x / 10), state.width);
      lastElementJ = Math.min(Math.ceil(this.canvasEnd.y / 10), state.height);
    }

    for (let i = firstElementI; i < lastElementI; ++i) {
      for (let j = firstElementJ; j < lastElementJ; ++j) {
        let xStart = 10 * i + 1;
        let yStart = 10 * j + 1;

        let s = state.get(i, j);
        if (s !== lastState && s !== 0)
          this.setStateColor(ctx, s);
        lastState = s;

        if (s === 0)
          continue;

        ctx.fillRect(xStart, yStart, 8, 8);
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
      case 2: //yellow
        ctx.fillStyle = '#FFEE33'; 
        break;
      case 3: //green
        ctx.fillStyle = '#1D6914';
        break;
      case 4: //cyan
        ctx.fillStyle = '#29D0D0';
        break;
      case 5: // orange 
        ctx.fillStyle = '#FF9233';
        break;
      case 6: // blue
        ctx.fillStyle = '#2A4BD7';
        break;
      case 7: // red 
        ctx.fillStyle = '#AD2323';
        break;
      default:
        throw new Error("Undefined state");
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