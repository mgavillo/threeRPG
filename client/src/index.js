import { Preloader } from "./Preloader"
import { PlayerLocal, Player } from "./Player"
// import { io } from "socket.io-client";

// const socket = io.connect('http://localhost:3000',
// { upgrade: false, transports: ['websocket'], reconnection: false, forceNew: true });


// import { Easing } from "./Easing";
const ASSET_PATH = "https://raw.githubusercontent.com/mgavillo/files/master/"
const PI = 3.141592653;
const PI_2 = 1.570796326;
const PI_3 = (3 * Math.PI) / 2;
class Game {
    constructor() {
        this.modes = Object.freeze({
            NONE: Symbol("none"),
            PRELOAD: Symbol("preload"),
            INITIALISING: Symbol("initialising"),
            CREATING_LEVEL: Symbol("creating_level"),
            ACTIVE: Symbol("active"),
            GAMEOVER: Symbol("gameover")
        });
        this.mode = this.modes.NONE;

        this.container = document.getElementById('renderContainer')
        this.animations = {};
        this.camera = { object: {}, fade: 0.05 }
        this.stats;
        this.scene;
        this.renderer;
        this.controls;
        this.debug = true;
        const game = this;
        this.anims = [
            "look-around",
            "ascend-stairs",
            "gather-objects",
            "push-button",
            "run"
        ];
        const options = {
            assets: [
            ],
            oncomplete: function () {
                game.init();
            }
        };
        this.anims.forEach(function (anim) {
            options.assets.push(`${ASSET_PATH}${anim}.fbx`);
        });

        this.remotePlayers = [];
        this.remoteColliders = [];
        this.initialisingPlayers = [];
        this.remoteData = [];

        this.mode = this.modes.PRELOAD;

        this.clock = new THREE.Clock();
        const preloader = new Preloader(options);
    }


    hemisphereLight(sky = 0xE7D0A7, ground = 0x795939, intensity = 1) {
        const light1 = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(light1);
        const light = new THREE.HemisphereLight(sky, ground, intensity);
        light.position.set(0, 200, 0);
        return light
    }

    lensFlare() {
        const light = new THREE.PointLight(0xffffff, 1.5, 2000);
        light.position.set([0, 0, 60]);
        light.rotation.set([0, 90, 0])
        const textureLoader = new THREE.TextureLoader();

        const textureFlare0 = textureLoader.load(`${ASSET_PATH}lensFlare-01.png`);
        const textureFlare1 = textureLoader.load(`${ASSET_PATH}lensFlare1-02.png`);
        const textureFlare2 = textureLoader.load(`${ASSET_PATH}lensFlare2-03.png`);

        const lensflare = new THREE.Lensflare();
        lensflare.addElement(new THREE.LensflareElement(textureFlare0, 512, 0));
        lensflare.addElement(new THREE.LensflareElement(textureFlare1, 512, 10));
        lensflare.addElement(new THREE.LensflareElement(textureFlare2, 60, 0.6));

        const geometry = new THREE.BoxGeometry(0, 10, 0);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.cube.position = [0, 10, 0]
        this.scene.add(cube);

        light.add(lensflare)
    }
    directionalLight(color = 0xf0e2c1) {
        const light = new THREE.DirectionalLight(color);
        light.position.set(10, 10, 10);
        light.rotation.set([0, -76.5494, 0])
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.top = 3000;
        light.shadow.camera.bottom = -3000;
        light.shadow.camera.left = -3000;
        light.shadow.camera.right = 3000;
        light.shadow.camera.far = 3000;
        // light.add(this.lensFlare())
        return (light)
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.alpha = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.renderer.shadowMapDebug = true;
        this.container.appendChild(this.renderer.domElement);
    }

    addWindowListeners() {
        window.addEventListener("resize", function () {
            game.onWindowResize();
        }, false);
        window.addEventListener("keydown", function (evt) {
            switch (evt.key) {
                case 'ArrowDown':
                    if (game.player.moveDir.indexOf(0) == -1)
                        game.player.moveDir.push(0)
                    game.player.action = "run"
                    break;
                case 'ArrowUp':
                    if (game.player.moveDir.indexOf(PI) == -1)
                        game.player.moveDir.push(PI)
                    game.player.action = "run"
                    break;
                case 'ArrowLeft':
                    if (game.player.moveDir.indexOf(PI_3) == -1)
                        game.player.moveDir.push(PI_3)
                    game.player.action = "run"
                    break;
                case 'ArrowRight':
                    if (game.player.moveDir.indexOf(PI_2) == -1)
                        game.player.moveDir.push(PI_2)
                    // game.player.object.rotation.y = Math.PI/2;
                    game.player.action = "run"
                    break;
            }
        }, false)

        window.addEventListener("keyup", function (evt) {
            // game.playerControlMove(0)
            if (evt.key === 'ArrowDown')
                game.player.moveDir.splice(game.player.moveDir.indexOf(0), 1)
            if (evt.key === 'ArrowUp')
                game.player.moveDir.splice(game.player.moveDir.indexOf(PI), 1)
            if (evt.key === 'ArrowLeft')
                game.player.moveDir.splice(game.player.moveDir.indexOf(PI_3), 1)
            if (evt.key === 'ArrowRight')
                game.player.moveDir.splice(game.player.moveDir.indexOf(PI_2), 1)
            if (evt.key === 'ArrowDown' || evt.key === 'ArrowUp' || evt.key === 'ArrowRight' || evt.key === 'ArrowLeft') {
                if (game.player.moveDir.length === 0)
                    game.player.action = "look-around"
            }
            // game.playerControlTurn(0)

        }, false)
    }

    addButtonListeners() {
        document.getElementById("camera-btn").onclick = function () {
            game.switchCamera();
        };
    }

    initScene(col = 0x100005) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(col);
        // this.scene.fog = new THREE.Fog(col, 500, 1500);
    }

    init() {
        this.mode = this.modes.INITIALISING;

        this.createCamera()
        this.initScene()


        this.scene.add(this.hemisphereLight());
        this.scene.add(this.directionalLight());


        this.player = new PlayerLocal(this);

        this.initRenderer();
        this.controls = new THREE.OrbitControls(this.camera.object, this.renderer.domElement);

        // stats
        if (this.debug) {
            this.stats = new Stats();
            this.container.appendChild(this.stats.dom);
        }
        this.addWindowListeners()
        // this.addButtonListeners()
    }

    loadSkybox() {
        const loader = new THREE.CubeTextureLoader();

        const texture = loader.load([
            `${ASSET_PATH}bluecloud_ft.jpg`,
            `${ASSET_PATH}bluecloud_bk.jpg`,
            `${ASSET_PATH}bluecloud_up.jpg`,
            `${ASSET_PATH}bluecloud_dn.jpg`,
            `${ASSET_PATH}bluecloud_rt.jpg`,
            `${ASSET_PATH}bluecloud_lf.jpg`,
        ]);
        this.scene.background = texture;
        return (null);
    }

    loadEnvironment(loader) {

        loader.load(
            `${ASSET_PATH}island.fbx`,
            function (object) {
                game.scene.add(object);
                object.receiveShadow = true;
                object.castShadow = true;
                object.name = "Environment";
                object.traverse(function (child) {
                    if (child.isMesh) {
                        if (child.name.includes("main")) {
                            // child.material[0] = new THREE.MeshLambertMaterial({ color: 0x8AE7D4, envMap: game.camera.renderTarget });
                            child.material[0] = new THREE.MeshPhysicalMaterial({
                                reflectivity: 1.0,
                                transmission: 0.5,
                                roughness: 0,
                                metalness: 0,
                                clearcoat: 0.3,
                                clearcoatRoughness: 0.25,
                                color: new THREE.Color(0x8AE7D4),
                                ior: 1.5,
                            })
                            child.castShadow = true;
                            child.receiveShadow = true;
                        } else if (child.name.includes("mentproxy")) {
                            child.material.visible = false;
                            game.environmentProxy = child;
                        }
                    }
                });
                game.loadSkybox();
                game.loadNextAnim(loader);

            },
            null,
            this.onError
        );
    }

    // createDummyEnvironment() {
    //     const env = new THREE.Group();
    //     env.name = "Environment";
    //     this.scene.add(env);

    //     const geometry = new THREE.BoxBufferGeometry(150, 150, 150);
    //     const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    //     for (let x = -1000; x < 1000; x += 300) {
    //         for (let z = -1000; z < 1000; z += 300) {
    //             const block = new THREE.Mesh(geometry, material);
    //             block.position.set(x, 75, z);
    //             env.add(block);
    //         }
    //     }

    //     this.environmentProxy = env;
    // }

    loadNextAnim(loader) {
        let anim = this.anims.pop();
        const game = this;
        loader.load(
            `${ASSET_PATH}${anim}.fbx`,
            function (object) {
                game.player.animations[anim] = object.animations[0];
                if (game.anims.length > 0) {
                    game.loadNextAnim(loader);

                } else {
                    delete game.anims;
                    game.player.action = "look-around";
                    game.initPlayerPosition();
                    game.mode = game.modes.ACTIVE;
                    game.animate();
                }
            },
            null,
            this.onError
        );
    }

    initialOverlayAnim() {
        const overlay = document.getElementById("overlay");
        overlay.classList.add("fade-in");
        overlay.addEventListener(
            "animationend",
            function (evt) {
                evt.target.style.display = "none";
            },
            false
        );
    }

    initialCameraAnim() {
        setTimeout(function () {
            game.player.cameras.active = game.player.cameras.back;
            game.camera.fade = 0.01;
            setTimeout(function () {
                game.camera.fade = 0.1;
            }, 1500);
        }, 2000);
    }

    switchCamera(fade = 0.05) {
        const cams = Object.keys(this.player.cameras);
        cams.splice(cams.indexOf("active"), 1);
        let index;
        for (let prop in this.player.cameras) {
            if (this.player.cameras[prop] == this.player.cameras.active) {
                index = cams.indexOf(prop) + 1;
                if (index >= cams.length) index = 0;
                this.player.cameras.active = this.player.cameras[cams[index]];
                break;
            }
        }
        this.camera.fade = fade;
    }

    initCameras() {
        const front = new THREE.Object3D();
        front.position.set(112, 100, 200);
        front.parent = this.player.object;
        const back = new THREE.Object3D();
        back.position.set(0, 400, -650);
        back.parent = this.player.object;
        const wide = new THREE.Object3D();
        wide.position.set(178, 139, 465);
        wide.parent = this.player.object;
        const overhead = new THREE.Object3D();
        overhead.position.set(0, 400, 0);
        overhead.parent = this.player.object;
        const collect = new THREE.Object3D();
        collect.position.set(40, 82, 94);
        collect.parent = this.player.object;

        this.player.cameras = { front, back, wide, overhead, collect };
        this.player.cameras.active = this.player.cameras.wide;
        this.camera.fade = 1;
        this.initialCameraAnim()
    }

    /**
     * @param  {} fov=80
     * @param  {} aspect=window.innerWidth/window.innerHeight
     * @param  {} near=1
     * @param  {} far=2000
     */
    createCamera(fov = 75, aspect = window.innerWidth / window.innerHeight, near = 1, far = 20000) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        // this.camera.object = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);
        this.camera.object = new THREE.PerspectiveCamera(fov, aspect, near, far);
    }

    /**
     * @param  {} clientX
     * @param  {} clientY
     * @return pos
     */
    getMousePosition(clientX, clientY) {
        const pos = new THREE.Vector2();
        pos.x = (clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        pos.y = -(clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        return pos;
    }

    initPlayerPosition() {
        //cast down
        const dir = new THREE.Vector3(0, -1, 0);
        const pos = this.player.object.position.clone();
        pos.y += 200;
        const raycaster = new THREE.Raycaster(pos, dir);
        const gravity = 30;
        const intersect = raycaster.intersectObject(this.environmentProxy);
        if (intersect.length > 0) {
            this.player.object.position.y = pos.y - intersect[0].distance;
        }
    }

    // playerControlMove(forward) {
    //     if (forward == 0)
    //         delete this.player.move.forward;
    //     else
    //         this.player.move.forward = forward;
    //     if (forward > 0) {
    //         this.action = "walk";
    //     } else if (forward < -0.2) {
    //         this.action = "walk";
    //     } else {
    //         this.action = "look-around";
    //     }
    // }

    // playerControlTurn(turn) {
    //     if (turn == 0)
    //         delete this.player.move.turn;
    //     else
    //         this.player.move.turn = turn;

    // }


    removePlayer(id) {
        game.remotePlayers.filter(function (player) {
            if (!player) return false
            if (player.id == id) return false;
            return true
        });
    }

    rPlayerExist(id) {
        let game = this
        for (let i = 0; i < game.remotePlayers.length; i++){
            if(game.remotePlayers[i].id === id) return true
        }
        return false
    }

    createRemotePlayers(id){
        const game = this
        this.remoteData.forEach(function (data) {
                if (!game.rPlayerExist(data.id) && game.player.id != data.id) {
                    console.log("CREATE PLAYER")
                    game.remotePlayers.push(new Player(game, false, data.id));
                }
        });

    }

    updateRemotePlayers(dt) {
        if (this.remoteData === undefined || this.remoteData.length == 0 || this.player === undefined || this.player.id === undefined) return;

        this.createRemotePlayers()
        this.remotePlayers.forEach(function (player) { player.update(dt); });
    }

    moveCam() {
        var pos = this.player.object.position.clone();

        this.camera.object.position.x = pos.x;
        this.camera.object.position.y = pos.y + 600;
        this.camera.object.position.z = pos.z + 600;
        this.camera.object.lookAt(pos)

    }

    // followWithCam() {
    //     if (this.player.cameras && this.player.cameras.active) {
    //         this.camera.object.position.lerp(
    //             this.player.cameras.active.getWorldPosition(new THREE.Vector3()),
    //             this.camera.fade
    //         );
    //         let pos;
    //         if (this.cameraTarget != undefined) {
    //             this.camera.object.position.copy(this.cameraTarget.position);
    //             pos = this.cameraTarget.target;
    //         } else {
    //             pos = this.player.object.position.clone();
    //             pos.y += 60;
    //         }
    //         this.camera.object.lookAt(pos);
    //     }
    // }

    animate() {
        const game = this;
        const dt = this.clock.getDelta();

        requestAnimationFrame(function () { game.animate(); });

        this.updateRemotePlayers(dt);

        this.controls.update();
        if (this.player.mixer != undefined && this.mode == this.modes.ACTIVE) { this.player.mixer.update(dt); }


        if (this.player.moveDir.length != 0) {
            this.player.move(dt, this);
            console.log(this.player.moveDir)
            var turn;
            if (this.player.moveDir.length === 2
                && this.player.moveDir.indexOf(0) !== -1
                && this.player.moveDir.indexOf(PI_3) !== -1) {
                console.log(PI_3, PI * 2)
                turn = (PI_3 + (PI * 2)) / 2
                console.log(turn)

            }
            else {
                var sum;
                for (var i = 0, sum = 0; i < this.player.moveDir.length; sum += this.player.moveDir[i++]);
                turn = sum / this.player.moveDir.length;

            }

            game.player.object.rotation.y = turn;

        }

        this.player.updateSocket();
        this.moveCam()
        this.renderer.render(this.scene, this.camera.object);
        if (this.stats != undefined) this.stats.update();
    }

    onError(error) {
        const msg = console.error(JSON.stringify(error));
        console.error(error.message);
    }

    onWindowResize() {
        this.camera.object.aspect = window.innerWidth / window.innerHeight;
        this.camera.object.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

var game = new Game();
