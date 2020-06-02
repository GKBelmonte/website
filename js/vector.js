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
    //there are some special cases when y ~ 0 and z ~ 0, as
    // we approach the poles, but we'll ignore for now
    let xRotation = Math.atan2(-v.Y, v.Z);
    let yRotation = Math.atan2(v.X, v.Y);

    return new Vector(xRotation, yRotation, 0);
  }

  getPolarCoordinates() {
    let v = this;
    let r = v.getLength();
    let phi = Math.atan2(v.Y, v.X);
    let theta = Math.acos(v.Z, );

    return new Vector(r, phi, theta);
  }

  getOrientationFromVectorOld() {
    let v = this;
    let yzProj = v.projectUntoPlane(new Vector(1, 0, 0)).normalize();
    let xRotation = Math.atan2(yzProj.Z, yzProj.Y);
    let xzProj = v.projectUntoPlane(new Vector(0, 1, 0)).normalize();
    let yRotation = Math.atan2(xzProj.Z, xzProj.X);

    return new Vector(xRotation, yRotation, 0);
  }
}
