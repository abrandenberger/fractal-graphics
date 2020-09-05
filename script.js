// 'use strict';
// let camera = { position: new Vec3(0, 0, 0), direction: new Vec3(0, 0, 1) }; // position fixed.
// let scene = new Scene(camera);

// let subPixelSampleSize = 2;

let sliders = { xAxes: [], yAxes: [], zAxes: [] };
let labels = { xlabels: [], ylabels: [], zlabels: [] };

let light1 = [-1, 1.5, 2]; 
let light2 = [2, 1.5, 5]; 
let lights = [light1, light2];

// // scene.addSphere(new Sphere(new Vec3(0, 0, 4), 1));
// scene.addLight(new LightSource(new Vec3(-1, 1.5, 2), .2));
// scene.addPlane(new Plane(new Vec3(0, -1, 0), new Vec3(0, 1, 0), 'mirror'));
// scene.addLight(new LightSource(new Vec3(2, 1.5, 5), .2));
// // scene.addSphere(new Sphere(new Vec3(2, .5, 5), .5));
// // scene.addSphere(new Sphere(new Vec3(-3, .5, 5), .5))
// scene.addPlane(new Plane(new Vec3(0, 0, 9), new Vec3(0, -1, -1).normalized()));
// // scene.addPlane(new Plane(new Vec3(0, 0, 5), new Vec3(0, 0, -1).normalized(), 'mirror'));
// let printed = false; // DEBUG STUFF (can't print too much) 
// // let printCount = 100; // DEBUG STUFF
// generateFractal(new Vec3(0, 0, 4), new Vec3(0,1,0), 1, 3)


function handleSlider(i) {
  return function () {
    lights[i] = [sliders.xAxes[i].value(), sliders.yAxes[i].value(), sliders.zAxes[i].value()];
    console.log('x:', sliders.xAxes[i].value(), 'y:', sliders.yAxes[i].value(), 'z:', sliders.zAxes[i].value());
    // redraw();
  }
}

function makeSlider(i) {
  createDiv('Light Source ' + str(i + 1) + ' Location');
  labels.xlabels[i] = createDiv('x');
  sliders.xAxes[i] = createSlider(-2, 2, lights[i][0], 0.01); //local coords
  labels.xlabels[i].child(sliders.xAxes[i]);

  labels.ylabels[i] = createDiv('y');
  sliders.yAxes[i] = createSlider(-.2, 4, lights[i][1], 0.01);
  labels.ylabels[i].child(sliders.yAxes[i]);

  labels.zlabels[i] = createDiv('z');
  sliders.zAxes[i] = createSlider(0, 8, lights[i][2], 0.01);
  labels.zlabels[i].child(sliders.zAxes[i]);

  sliders.xAxes[i].input(handleSlider(i));
  sliders.yAxes[i].input(handleSlider(i));
  sliders.zAxes[i].input(handleSlider(i));
}

function newWorkerImage() {
  let worker = new Worker('worker.js');
  worker.postMessage({
    lights: lights, 
    width: width, 
    height: height
  }); 
  worker.addEventListener('message', (message) => {  // worker doesn't work until we post a message 
    let image = message.data.image; 
    for (let i = 0; i < image.length; i++) {
      for (let j = 0; j < image[0].length; j++) {
        set(i, j, color(image[i][j]));
      }
    }
    redraw();
  }); 
}

function setup() {
  createElement('h2', '3D Mirror Fractal :))');
  createCanvas(400, 400);
  for (let k = 0; k < lights.length; k++) {
    makeSlider(k);
  }
  let button = createButton('Redraw');
  button.mousePressed(newWorkerImage);

  noLoop();
  newWorkerImage();
}

function draw() {
  background(0);
  updatePixels();
}

