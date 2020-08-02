class Sphere {
  constructor(center, radius, material='matte') {
    this.center = center;
    this.radius = radius;
    this.material = material;
  }

  rayIntersection(point, ray) {
    let v = Vec3.substract(point, this.center);
    let a = ray.norm ** 2;
    let b = 2 * Vec3.dotProd(ray, v);
    let c = v.norm ** 2 - this.radius ** 2;
    let q = new QuadraticSolver(a, b, c);
    if (q.hasSol() && q.getMinSol() > 0) {
      return [q.getMinSol()];
    }
    else {
      return [];
    }
  }

  getNormalVec(point, ray, t) {
    let k = Vec3.add(point, ray.scale(t));
    return Vec3.substract(k, this.center).normalized(); // destination - source 
  }
}

class Plane {
  constructor(point, normal, material='matte') {
    this.point = point;
    this.normal = normal;
    this.material = material;
  }

  rayIntersection(point, ray) {
    let v = Vec3.substract(point, this.point);
    let denom = Vec3.dotProd(ray, this.normal);
    if (denom == 0) {
      return [];
    }
    else {
      let t = - Vec3.dotProd(v, this.normal) / denom;
      if (t > epsilon) { return [t]; }
      else { return []; }
    }
  }

  getNormalVec(point, ray, t) {
    return this.normal;
  }
}

class LightSource extends Sphere {
  constructor(center, radius) {
    super(center, radius);
    this.material = 'pointLight';
  }
};

class Scene {
  constructor(camera, spheres = [], planes = [], lightSources = []) {
    this.spheres = spheres; // [Sphere object]
    this.planes = planes;
    this.lightSources = lightSources;
    this.camera = camera; // {position, direction}
    this.bounceDepth = 4;
  }

  addSphere(sphere) {
    this.spheres.push(sphere);
  }
  addPlane(plane) {
    this.planes.push(plane);
  }
  addLight(light) {
    this.lightSources.push(light);
  }

}

function castRay(point, pixelVec, scene) {
  // returns (object, time) for the first object that this (x,y) ray intersects 
  let tArray = [];
  scene.spheres.forEach(sphere => {
    tSols = sphere.rayIntersection(point, pixelVec);
    if (tSols.length > 0) {
      tArray.push({ object: sphere, t: tSols[0] });
    }
  });
  scene.planes.forEach(plane => {
    tSols = plane.rayIntersection(point, pixelVec);
    if (tSols.length > 0) {
      tArray.push({ object: plane, t: tSols[0] });
    }
  });
  scene.lightSources.forEach(light => {
    tSols = light.rayIntersection(point, pixelVec);
    if (tSols.length > 0) {
      tArray.push({ object: light, t: tSols[0] });
    }
  });
  // already know all the values are > 0 
  tArray.sort((a, b) => a.t - b.t);
  if (tArray.length == 0) {
    return null;
  }
  return tArray[0];
}

function rayTrace(position, ray, scene, numBounces=0) { // returns a colour 
  let col = 0; 
  let closestObj = castRay(position, ray, scene);
  if (closestObj != null) {
    let t = closestObj.t;
    let obj = closestObj.object;

    let k = Vec3.add(position, ray.scale(t)); 
    let normalVec = obj.getNormalVec(position, ray, t); 
    if (obj.material == 'pointLight') {
      return 255;
    }
    if (obj.material == 'mirror') {
      if (numBounces >= Scene.bounceDepth) {

      }
      let r = Vec3.substract(ray, normalVec.scale(2 * Vec3.dotProd(ray, normalVec))); // already unit vector 
      return 0.95 * rayTrace(k, r, scene, numBounces+1);
    }

    else {
      scene.lightSources.forEach(lightSource => {
        let colTBA = 0;
        let lightVec = Vec3.subtract(k, lightSource.center).normalized();
        let normalLightDotP = Vec3.dotProd(normalVec, lightVec);
        if (normalLightDotP <= 0) {
          let shadowRay = Vec3.substract(lightSource.center, k);
          let closestObj = castRay(k, shadowRay.normalized(), scene);
          if (closestObj != null) {
            if (closestObj.object != lightSource) { return 0; }
          }
          colTBA = (-255 * normalLightDotP);
        }

        col += colTBA / scene.lightSources.length;
      });

      col += 5;
    }
  }
  return col; 
}
