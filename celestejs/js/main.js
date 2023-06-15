// @ts-ignore
/// <reference path="https://cdn.babylonjs.com/babylon.d.ts" />

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // camera
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 20, -100), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    // light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 150, height: 150 }, scene);

    // mount ain
    var mountain;
    BABYLON.SceneLoader.ImportMesh("", "assets/", "Terrain2NevitDilmen.stl", scene, function (meshes) {
        mountain = meshes[0];

        mountain.position.y = 0.005; // no more z-fighting

        mountain.material = new BABYLON.StandardMaterial("Mountain Material");
        mountain.material.diffuseColor = BABYLON.Color3.Teal();
    });

    // character
    var character;
    BABYLON.SceneLoader.ImportMesh("", "assets/", "amogus.stl", scene, function (meshes) {
        character = meshes[0];

        // starting position
        character.position.y = 3;
        character.position.z = -60;
        character.rotation.y = Math.PI / -2;

        character.material = new BABYLON.StandardMaterial("Character Material");
        character.material.diffuseColor = BABYLON.Color3.Red();
    });

    // character properties
    var isJumping = false;
    var jumpPower = 0.4;
    var gravity = -0.01;
    var jumpPosition = 0;
    var verticalSpeed = 0;

    // shitty fix to make code not run before the character is loaded
    var characterIsLoaded = false;
    setTimeout(() => {
        characterIsLoaded = true;
    }, 10);

    function characterJump() {
        if (!isJumping) {
            isJumping = true;
            jumpPosition = character.position.y;
            verticalSpeed = jumpPower;
        }
    }

    // input and stuff
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
            character.position.z += 0.1;
            character.rotation.y = Math.PI / -2;
        }
        if (inputMap["a"]) {
            character.position.x -= 0.1;
            character.rotation.y = Math.PI;
        }
        if (inputMap["s"]) {
            character.position.z -= 0.1;
            character.rotation.y = Math.PI / 2;
        }
        if (inputMap["d"]) {
            character.position.x += 0.1;
            character.rotation.y = Math.PI * 2;
        }
        if (inputMap[" "]) {
            characterJump();
        }

        if (isJumping) {
            character.position.y += verticalSpeed;
            verticalSpeed += gravity;

            if (character.position.y <= jumpPosition) {
                character.position.y = jumpPosition;
                isJumping = false;
            }
        }

        if (!isJumping && characterIsLoaded) {
            character.position.y += verticalSpeed;
            verticalSpeed += gravity;

            if (character.position.y < ground.position.y + character.scaling.y * 2.4) {
                character.position.y = ground.position.y + character.scaling.y * 2.4;
                verticalSpeed = 0;
            }
        }
    })

    return scene;
};

const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});
window.addEventListener("resize", function () {
    engine.resize();
});