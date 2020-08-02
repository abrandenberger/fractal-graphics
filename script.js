// 'use strict';
let camera = { position: new Vec3(0, 0, 0), direction: new Vec3(0, 0, 1) }; // position fixed.
let scene = new Scene(camera);

let epsilon = 0.0001;
let subPixelSampleSize = 2;

let sliders = { xAxes: [], yAxes: [], zAxes: [] };
let labels = { xlabels: [], ylabels: [], zlabels: [] };

let l_ratio = 0.4;

// scene.addSphere(new Sphere(new Vec3(0, 0, 4), 1));
scene.addLight(new LightSource(new Vec3(-1, 1.5, 2), .2));
scene.addPlane(new Plane(new Vec3(0, -1, 0), new Vec3(0, 1, 0), 'mirror'));
// scene.addLight(new LightSource(new Vec3(2, 1.5, 5), .2));
// scene.addSphere(new Sphere(new Vec3(2, .5, 5), .5));
// scene.addSphere(new Sphere(new Vec3(-3, .5, 5), .5))
scene.addPlane(new Plane(new Vec3(0, 0, 9), new Vec3(0, -1, -1).normalized()));
// scene.addPlane(new Plane(new Vec3(0, 0, 5), new Vec3(0, 0, -1).normalized(), 'mirror'));
let printed = false; // DEBUG STUFF (can't print too much) 
// let printCount = 100; // DEBUG STUFF
generateFractal(new Vec3(0, 0, 4), new Vec3(0,1,0), 1, 3)


function handleButton(i) {
  return function () {
    scene.lightSources[i].center = new Vec3(sliders.xAxes[i].value(), sliders.yAxes[i].value(), sliders.zAxes[i].value());
    print('x:', sliders.xAxes[i].value(), 'y:', sliders.yAxes[i].value(), 'z:', sliders.zAxes[i].value());
    redraw();
  }
}

function makeSlider(i) {
  createDiv('Light Source ' + str(i + 1) + ' Location');
  labels.xlabels[i] = createDiv('x');
  sliders.xAxes[i] = createSlider(-2, 2, scene.lightSources[i].center.x, 0.01); //local coords
  labels.xlabels[i].child(sliders.xAxes[i]);

  labels.ylabels[i] = createDiv('y');
  sliders.yAxes[i] = createSlider(-.2, 4, scene.lightSources[i].center.y, 0.01);
  labels.ylabels[i].child(sliders.yAxes[i]);

  labels.zlabels[i] = createDiv('z');
  sliders.zAxes[i] = createSlider(0, 8, scene.lightSources[i].center.z, 0.01);
  labels.zlabels[i].child(sliders.zAxes[i]);

  sliders.xAxes[i].input(handleButton(i));
  sliders.yAxes[i].input(handleButton(i));
  sliders.zAxes[i].input(handleButton(i));
}

function setup() {
  createElement('h2', '3D Mirror Fractal :))');
  createCanvas(500, 500);
  for (let k = 0; k < scene.lightSources.length; k++) {
    makeSlider(k);
  }
  noLoop();
}

function draw() {
  background(0);
  // scene.lightSources[0].center = new Vec3(xAxis.value(), yAxis.value(), zAxis.value());
  loadPixels();
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let col = 0;
      for (let i_ = 0; i_ < subPixelSampleSize; i_++) {
        for (let j_ = 0; j_ < subPixelSampleSize; j_++) {
          let x = 2 * ((i + i_ - 1) / width) - 1;
          let y = -(2 * ((j + j_ - 1) / height) - 1);
          let pixelVec = new Vec3(x, y, 1).normalized(); // screen: plane z=1
          col += rayTrace(camera.position, pixelVec, scene) / (subPixelSampleSize ** 2);
        }
      }
      set(i, j, color(col));
    }
  }
  updatePixels();
}

