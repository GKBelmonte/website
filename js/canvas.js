export class Canvas {
  constructor(canvasJElement) {
    this._jCanvas = canvasJElement;
    this.canvas = canvasJElement[0];
    let canvas = this.canvas;
    this.ctx = this.canvas.getContext('2d')

    let self = this;
    canvas.addEventListener("mousedown", e => self.onMouseDown(e, this));
    canvas.addEventListener("mouseup", e => self.onMouseUp(e, this));
    canvas.addEventListener("mouseover", e => self.onMouseOver(e, this));
    canvas.addEventListener("mouseout", e => self.onMouseOut(e, this));
    canvas.addEventListener("mousemove", e => self.onMouseMove(e, this));
    canvas.addEventListener('click', e => self.onMouseClick(e, this));
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
    this.canvasStart = this.htmlToCanvas(0, 0);
    this.canvasEnd = this.htmlToCanvas(this.canvas.width, this.canvas.height);
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
    return { x: xPix, y: yPix };
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