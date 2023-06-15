// @ts-ignore
/// <reference path="https://cdn.babylonjs.com/babylon.d.ts" />

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas,true);

var createScene = function () {
var scene = new BABYLON.Scene(engine);

// camera
var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, 10), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

// light
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// ground
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);

engine.runRenderLoop(function () {

}) 

return scene;
};

const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
}
);
window.addEventListener("resize", function () {
    engine.resize();
}
);