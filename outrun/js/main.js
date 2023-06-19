// @ts-ignore
/// <reference path="https://cdn.babylonjs.com/babylon.d.ts" />

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas,true);

var createScene = function () {
var scene = new BABYLON.Scene(engine);

// camera
var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -20), scene);
camera.attachControl(canvas, false);
var cameraPositionOffset = new BABYLON.Vector3(0, 7.5, -25);

// light
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// grid
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 80, height: 1000}, scene);
var startingPosition = ground._height / 2 - 50;
ground.position.z = startingPosition


var groundMaterial = new BABYLON.GridMaterial("groundMaterial");
groundMaterial.gridRatio = 2;
groundMaterial.backFaceCulling = false;
groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
groundMaterial.opacity = 0.98;

ground.material = groundMaterial;

// car
var countach;
BABYLON.SceneLoader.ImportMesh("", "./assets/countach_stylized_low-fi/", "scene.gltf", scene, function (scene) {
    countach = scene[0];
    
    countach.scaling = new BABYLON.Vector3(10, 10, 10);
    countach.rotation = new BABYLON.Vector3(0, Math.PI / -2, 0);

});

// shitty fix to make code not run before car is loaded
var characterIsLoaded = false;
setTimeout(() => {
    characterIsLoaded = true;
}, 100);

var inputMap = {};
scene.onKeyboardObservable.add((kbInfo) => {
    if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN) {
        inputMap[kbInfo.event.key] = kbInfo.event.type == "keydown";
    } else if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP) {
        inputMap[kbInfo.event.key] = kbInfo.event.type == "keydown";
    }
})

engine.runRenderLoop(function () {
    if (inputMap["w"]) {
        ground.position.z -= 0.5;
        // countach.rotation.y = Math.PI / -2;
    }
    if (inputMap["a"]) {
        ground.position.x += 0.1;
        // countach.rotation.y = Math.PI;
    }
    if (inputMap["s"]) {
        ground.position.z += 0.25;
        // countach.rotation.y = Math.PI / 2;
    }
    if (inputMap["d"]) {
        ground.position.x -= 0.1;
        // countach.rotation.y = Math.PI * 2;
    }
    if (characterIsLoaded) {
        camera.setTarget(countach.position);
        camera.position = countach.position.add(cameraPositionOffset);
    }
    if (ground.position.z <= startingPosition - 40) {
        ground.position.z = startingPosition;
    }
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