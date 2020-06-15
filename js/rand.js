// based on the c-rand implementation, since JS random the seed cant be set
export class Rand {
  constructor(seed) {
    this.initialSeed = typeof (seed) === 'undefined'
      ? Math.floor(Math.random() * 32768)
      : seed;
    this.steps = 0;
    this.state = this.initialSeed;
  }

  next() {
    this.steps++;
    this.state = (this.state * 1103515245 + 12345) % 4294967296;
    return Math.floor((this.state / 65536) % 32768);
  }

  nextFloat() {
    return this.next() / 32768;
  }

  static testZero() {
    debugger;
    let r = new Rand(0);
    for (let i = 0; i < 500; ++i) {
      let next = r.nextFloat();
      console.log(next);
    }
  }
}
