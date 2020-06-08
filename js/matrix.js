export class Matrix {
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
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        res.push(this.get(x, y).toString().padStart(3) + ",")
      }
      res.push('\n');
    }
    return res.join('');
  }

  applyMatrixPattern(x, y, pattern) {
    for (let px = 0; px < pattern.width; ++px) {
      if (px + x > this.width)
        break;
      for (let py = 0; py < pattern.height; ++py) {
        if (py + y > this.height)
          break;
        this.set(px + x, py + y, pattern.get(px, py));
      }
    }
  }

  getAsSubMatrix(rootX, rootY, x, y, wrapAround) {

    wrapAround = typeof (wrapAround) !== 'undefined' ? wrapAround : false;
    let finalX = rootX + x;
    let finalY = rootY + y;

    if (finalX >= this.width) {
      if (wrapAround)
        finalX -= this.width;
      else
        return null;
    }

    if (finalY >= this.height) {
      if (wrapAround)
        finalY -= this.height;
      else
        return null;
    }

    if (finalX < 0) {
      if (wrapAround)
        finalX += this.width;
      else
        return null;
    }
    if (finalY < 0) {
      if (wrapAround)
        finalY += this.height;
      else
        return null;
    }

    return this.get(finalX, finalY);
  }

  //Assume an integer can encode the values of a matrix based on the base b.
  updateFromInt(val, base) {
    //the last value is the least significant, if we
    // want to be the same as wolfram's so big endian
    // since its bigendian, we have to start from
    // the end and work back
    let digit = 0;
    for (let y = this.height - 1; y >= 0; --y) {
      for (let x = this.width - 1; x >= 0; --x) {
        let power = Math.pow(base, digit);
        let digitVal = Math.floor(val / power) % base; 
        this.set(x, y, digitVal);
        digit++;
      }
    }
  }

  getAsInt(base) {
    let digits = this.width * this.height;
    if (digits > 31 * Math.log(2) / Math.log(base))
      throw new Error(`Cannot express this matrix in base ${base}`);
    let res = 0;
    let digit = 0;
    for (let y = this.height - 1; y >= 0; --y) {
      for (let x = this.width - 1; x >= 0; --x) {
        let power = Math.pow(base, digit);
        res += this.get(x,y) * power;
        digit++;
      }
    }
    return res;
  }

  getSubMatrixAsInt(rootX,rootY,width,height,base) {
    let digits = width * height;
    if (digits > 31 * Math.log(2) / Math.log(base))
      throw new Error(`Cannot express this matrix in base ${base}`);
    let res = 0;
    let digit = 0;
    for (let y = height - 1; y >= 0; --y) {
      for (let x = width - 1; x >= 0; --x) {
        let power = Math.pow(base, digit);
        res += this.getAsSubMatrix(rootX, rootY, x, y, true) * power;
        digit++;
      }
    }
    return res;
  }
}
