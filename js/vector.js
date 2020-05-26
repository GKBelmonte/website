export class Vector {
  constructor(x, y, z) {
    this.X = x;
    this.Y = y;
    this.Z = z;
  }

  getLength() {
    return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
  }

  project(otherVector) {
    let untoLength = otherVector.getLength();
    let length = this.dot(otherVector) / untoLength;
    let vec = otherVector.divide(untoLength);
    return vec.mult(length);
  }

  dot(otherVector) {
    return this.X * otherVector.X + this.Y * otherVector.Y + this.Z * otherVector.Z;
  }

  projectUntoPlane(planeVector) {
    var planeComp = this.project(planeVector);
    return this.minus(planeComp);
  }

  add(r) {
    return new Vector(this.X + r.X, this.Y + r.Y, this.Z + r.Z);
  }

  minus(r) {
    return new Vector(this.X - r.X, this.Y - r.Y, this.Z - r.Z);
  }

  mult(r) {
    return new Vector(this.X * r, this.Y * r, this.Z * r);
  }

  divide(r) {
    return new Vector(this.X / r, this.Y / r, this.Z / r);
  }

  static isZero(v) {
    return v.getLength() < 0.001;
  }

  normalize() {
    let l = this.getLength();
    return this.divide(l);
  }

  getOrientationFromVector() {
    let v = this;
    let yzProj = v.projectUntoPlane(new Vector(1, 0, 0)).normalize();
    let xRotation = Math.atan2(yzProj.Z, yzProj.Y);
    let xzProj = v.projectUntoPlane(new Vector(0, 1, 0)).normalize();
    let yRotation = Math.atan2(xzProj.Z, xzProj.X);

    return new Vector(xRotation, yRotation, 0);
  }

  getOrientationFromVectorOld() {
    let v = this;
    let yzProj = v.projectUntoPlane(new Vector(1, 0, 0)).normalize();
    let xRotation = Math.acos(yzProj.dot(new Vector(0, 0, 1)));
    let xzProj = v.projectUntoPlane(new Vector(0, 1, 0)).normalize();
    let yRotation = Math.acos(xzProj.dot(new Vector(0, 0, 1)));

    return new Vector(xRotation, yRotation, 0);
  }
}
