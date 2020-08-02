// 'use strict';

class Vec3 {
  constructor(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  get norm() {
    return (this.x**2 + this.y**2 + this.z**2)**(1/2)
  }
  static add(v1, v2) {
    return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }
  static subtract(v1, v2) { //returns v1 - v2 
    return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }
  static substract(v1, v2) {
    return Vec3.subtract(v1, v2);
  }
  scale(lambda) {
    return new Vec3(this.x*lambda, this.y*lambda, this.z*lambda);
  }
  normalized() {
    return this.scale(1/this.norm);
  }
  static dotProd(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z; 
  }
}

class QuadraticSolver {
  constructor (a,b,c) {
    this.a = a;
    this.b = b; 
    this.c = c;
    this.disc = this.b ** 2 - 4 * this.a * this.c;
  }
  hasSol() {
    return this.disc >= 0;
  }

  getSols() {
    if (this.disc > 0) {
      return [(-this.b - this.disc**.5) / (2*this.a), (-this.b + this.disc**.5) / (2*this.a) ]
    }
    else if (this.disc == 0) {
      return [ -this.b / (2*this.a) ]
    }
    else {
      return []
    }
  } 

  getMinSol() {
    return Math.min(...this.getSols());
  }
}
