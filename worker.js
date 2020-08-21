importScripts('math.js','scene.js','fractal.js');
let lightRadius = 0.2; 

self.addEventListener('message', message => {
    scene.lightSources = message.data.lights.map(l => new LightSource(new Vec3(...l), lightRadius));
    self.postMessage({
        image: generateImage(message.data.width, message.data.height)
    });
});

let camera = { position: new Vec3(0, 0, 0), direction: new Vec3(0, 0, 1) }; // position fixed.
let scene = new Scene(camera);

let subPixelSampleSize = 2;

// scene.addSphere(new Sphere(new Vec3(0, 0, 4), 1));
scene.addLight(new LightSource(new Vec3(-1, 1.5, 2), lightRadius));
scene.addPlane(new Plane(new Vec3(0, -1, 0), new Vec3(0, 1, 0), 'mirror'));
// scene.addLight(new LightSource(new Vec3(2, 1.5, 5), lightRadius));
// scene.addSphere(new Sphere(new Vec3(2, .5, 5), .5));
// scene.addSphere(new Sphere(new Vec3(-3, .5, 5), .5))
scene.addPlane(new Plane(new Vec3(0, 0, 9), new Vec3(0, -1, -1).normalized()));
// scene.addPlane(new Plane(new Vec3(0, 0, 5), new Vec3(0, 0, -1).normalized(), 'mirror'));
let printed = false; // DEBUG STUFF (can't print too much) 
// let printCount = 100; // DEBUG STUFF
generateFractal(new Vec3(0, 0, 4), new Vec3(0, 1, 0), 1, 3)


function generateImage(width, height) {
    let image = [];
    for (let i = 0; i < width; i++) {
        let row = [];
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
            row.push(col);
        }
        image.push(row);
    }
    return image;
}