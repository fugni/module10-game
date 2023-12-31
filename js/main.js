// @ts-ignore
/// <reference path="https://cdn.babylonjs.com/babylon.d.ts" />

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // camera
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -20), scene);
    camera.attachControl(canvas, false);
    // distance from car
    var cameraPositionOffset = new BABYLON.Vector3(0, 7.5, -25);

    // light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // grid
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 80, height: 1000 }, scene);
    var startingPosition = ground._height / 2 - 50;
    ground.position.z = startingPosition

    // material of the ground
    var groundMaterial = new BABYLON.GridMaterial("groundMaterial");
    groundMaterial.gridRatio = 2;
    groundMaterial.backFaceCulling = true;
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

    // car variables
    var velocity = 0;
    var acceleration = 0.011;
    var deceleration = 0.005;
    var brake = 0.02;
    var maxVelocity = 5;
    var turnVelocity = 0.17;
    var baseRotation = Math.PI / -2;
    var turnRotation = 0.15;
    var distanceFromWall = 4;

    // shitty fix to make code not run before car is loaded
    var characterIsLoaded = false;
    setTimeout(() => {
        characterIsLoaded = true;
    }, 500);

    // gui
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var font = "./assets/public-pixel-font/PublicPixel.ttf";

    // speedometer
    var speedometer = new BABYLON.GUI.TextBlock();
    speedometer.color = "white";
    speedometer.fontFamily = "PublicPixel";
    speedometer.fontSize = 64;
    speedometer.top = "40%"
    speedometer.left = "-40%";
    advancedTexture.addControl(speedometer);

    // scoreboard
    var score = 0;
    var scoreboard = new BABYLON.GUI.TextBlock();
    scoreboard.color = "white";
    scoreboard.fontFamily = "PublicPixel";
    scoreboard.fontSize = 52;
    scoreboard.top = "-40%";
    scoreboard.left = "40%";
    advancedTexture.addControl(scoreboard);
    

    // input detection
    var inputMap = {};
    scene.onKeyboardObservable.add((kbInfo) => {
        if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN) {
            inputMap[kbInfo.event.key.toLowerCase()] = kbInfo.event.type == "keydown";
        } else if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP) {
            inputMap[kbInfo.event.key.toLowerCase()] = kbInfo.event.type == "keydown";
        }
    })

    engine.runRenderLoop(function () {
        var delta = scene.getAnimationRatio();

        // accelerate
        if (inputMap["w"]) {
            if (velocity == maxVelocity) {
                velocity = Math.min(velocity + acceleration - Math.round(Math.random() * 2) / 60, maxVelocity + 1 / 6);
            } else {
                velocity = Math.min(velocity + acceleration, maxVelocity);
            }

            ground.position.z -= velocity * delta;
        } else {
            velocity = Math.max(velocity - deceleration, 0);
            ground.position.z -= velocity * delta;
        }
        // brake
        if (inputMap["s"]) {
            velocity = Math.max(velocity - brake, 0);
            ground.position.z -= velocity * delta;
        }

        // steer left
        if (inputMap["a"]) {
            if (ground.position.x >= ground._width / 2 - distanceFromWall) {
                velocity = Math.max(velocity - deceleration * 5, 0);
                ground.position.z -= velocity * delta;
            } else {
                ground.position.x += velocity * turnVelocity * delta;
            }
            countach.rotation.y = baseRotation - turnRotation;
        }
        // steer right
        if (inputMap["d"]) {
            if (ground.position.x <= ground._width / -2 + distanceFromWall) {
                velocity = Math.max(velocity - deceleration * 5, 0);
                ground.position.z -= velocity * delta;
            } else {
                ground.position.x -= velocity * turnVelocity * delta;
            }

            countach.rotation.y = baseRotation + turnRotation;
        }

        // camera follows car
        if (characterIsLoaded) {
            camera.setTarget(countach.position);
            camera.position = countach.position.add(cameraPositionOffset);

            if (!inputMap["a"] && !inputMap["d"]) {
                countach.rotation.y = baseRotation;
            }
            if (inputMap["a"] && inputMap["d"]) {
                countach.rotation.y = baseRotation;
            }
        }

        // ground tps back every 40 units to fake infinite road
        if (ground.position.z <= startingPosition - 40) {
            ground.position.z = startingPosition;
        }

        speedometer.text = Math.round(velocity * 60);

        score += Math.round(velocity * delta);
        scoreboard.text = score;
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