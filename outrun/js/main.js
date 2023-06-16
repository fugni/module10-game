// @ts-ignore
/// <reference path="https://cdn.babylonjs.com/babylon.d.ts" />

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas,true);

var createScene = function () {
var scene = new BABYLON.Scene(engine);

// camera
var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 10, 0), scene);
camera.attachControl(canvas, true);

// light
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// ground
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 80, height: 80}, scene);

var groundMaterial = new BABYLON.GridMaterial("groundMaterial");
groundMaterial.gridRatio = 2;
groundMaterial.backFaceCulling = false;
groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
groundMaterial.opacity = 0.98;

ground.material = groundMaterial;

BABYLON.SceneLoader.Append("./", "duck.gltf", scene, function (scene) {
    // do something with the scene
  });

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