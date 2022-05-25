const ASSET_PATH = "https://raw.githubusercontent.com/mgavillo/files/master/"


export class Player {
    constructor(game, local, id) {
        this.id = id
        this.local = local;
        this.game = game;
        this.moveDir = [];
        this.action = null;
        this.mixer = null;
        this.animations = this.game.animations;

        const loader = new THREE.FBXLoader();
        const player = this;
        loader.load(`${ASSET_PATH}test.fbx`, function (object) {

            object.mixer = new THREE.AnimationMixer(object);
            object.castShadow = true;
            player.mixer = object.mixer;
            player.root = object.mixer.getRoot();

            object.name = "Character";
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            player.object = new THREE.Object3D();
            player.object.add(object);
            if (player.deleted === undefined) game.scene.add(player.object);

            game.player.walk = object.animations[0];
            if (player.local) {
                game.initCameras();
                game.animations.walk = object.animations[0];
                if (player.initSocket !== undefined) player.initSocket();
                game.loadEnvironment(loader);
            } else {
                const geometry = new THREE.BoxGeometry(100, 300, 100);
                const material = new THREE.MeshBasicMaterial({ visible: false });
                const box = new THREE.Mesh(geometry, material);
                box.name = "Collider";
                box.position.set(0, 150, 0);
                player.object.add(box);
                player.collider = box;
                player.object.userData.id = player.id;
                player.object.userData.remotePlayer = true;
            }
            if (game.animations.walk !== undefined) player.action = "walk";

        }, null, this.onError);

    }

    set action(name) {
        if (!name) return
        if (this.actionName == name) return;
        console.log("set acttion name", name)
        const clip = (this.local) ? this.animations[name] : THREE.AnimationClip.parse(THREE.AnimationClip.toJSON(this.animations[name]));
        const action = this.mixer.clipAction(clip);
        let timeScale = 1;
        if (name == "push-button" || name == "gather-objects")
            action.loop = THREE.LoopOnce;
        this.actionName = name;
        this.mixer.stopAllAction();

        this.actionTime = Date.now();
        action
            .reset()
            .setEffectiveTimeScale(timeScale)
            .setEffectiveWeight(1)
            .fadeIn(0.5)
            .play();
    }

    get action() {
        return this.actionName;
    }

    update(dt) {
        if (!this.mixer) return
        this.mixer.update(dt);
        if (this.game.remoteData.length > 0) {
            let found = false;
            for (let player of this.game.remoteData) {
                if (player.id != this.id) continue;
                //Found the player
                this.object.position.set(player.x, player.y, player.z);
                const euler = new THREE.Euler(player.pb, player.heading, player.pb);
                this.object.quaternion.setFromEuler(euler);
                this.action = player.action;
                found = true;
            }
            if (!found) this.game.removePlayer(this.id);
        }
    }
}

export class PlayerLocal extends Player {
    constructor(game) {
        super(game, true);

        const player = this;
        const socket = io.connect("http://localhost:3000/");
        socket.on('setId', function (data) {
            player.id = data.id;
        });
        socket.on('remoteData', function (data) {
            game.remoteData = data;
        });
        socket.on('deletePlayer', function (id) {
            console.log("--------------delete players---------------")
            const players = game.remotePlayers.filter(function (player) {
                if (player.id == id) {
                    return player;
                }
            });
            game.remoteData = game.remoteData.filter(function(data){
                if(data.id == id)
                    return false
                else 
                    return true
            })
            console.log("players", players)
            if (players.length > 0) {

                let index = game.remotePlayers.indexOf(players[0]);
                if (index != -1) {
                    game.remotePlayers.splice(index, 1);
                    game.scene.remove(players[0].object);
                    // game.removePlayer(id)
                }
            }
            console.log("after", game.remoteData)
        });

        this.socket = socket;
    }

    initSocket() {
        console.log("init socket")
        this.socket.emit('init', {
            x: this.object.position.x,
            y: this.object.position.y,
            z: this.object.position.z,
            h: this.object.rotation.y,
            pb: this.object.rotation.x,
            action: "hidle"
        });
    }

    updateSocket() {
        if (this.socket !== undefined) {
            //console.log(`PlayerLocal.updateSocket - rotation(${this.object.rotation.x.toFixed(1)},${this.object.rotation.y.toFixed(1)},${this.object.rotation.z.toFixed(1)})`);
            this.socket.emit('update', {
                x: this.object.position.x,
                y: this.object.position.y,
                z: this.object.position.z,
                h: this.object.rotation.y,
                pb: this.object.rotation.x,
                action: this.actionName
            })
        }
    }

    blockedForward(pos, game) {
        let dir = new THREE.Vector3(this.moveDir.x, this.moveDir.y);
        // this.player.object.getWorldDirection(dir);
        // if (this.player.move.forward < 0) {
        //     console.log("negate")
        //     dir.negate();

        // }
        let raycaster = new THREE.Raycaster(pos, dir);
        if (game.environmentProxy != undefined) {
            const intersect = raycaster.intersectObject(game.environmentProxy);
            if (intersect.length > 0) {
                if (intersect[0].distance < 50)
                    return true;
            }
        }
        return false
    }

    blockedLeft(pos) {
        let dir = new THREE.Vector3();
        dir.set(-1, 0, 0);
        dir.applyMatrix4(this.object.matrix);
        dir.normalize();
        let raycaster = new THREE.Raycaster(pos, dir);

        let intersect = raycaster.intersectObject(this.environmentProxy);
        if (intersect.length > 0) {
            if (intersect[0].distance < 50)
                this.object.translateX(50 - intersect[0].distance);
        }
    }

    blockedRight(pos) {
        let dir = new THREE.Vector3();
        dir.set(1, 0, 0);
        dir.applyMatrix4(this.object.matrix);
        dir.normalize();
        let raycaster = new THREE.Raycaster(pos, dir);

        let intersect = raycaster.intersectObject(this.environmentProxy);
        if (intersect.length > 0) {
            if (intersect[0].distance < 50)
                this.object.translateX(intersect[0].distance - 50);
        }

    }

    bBoxFloor(game, pos, dt) {
        let dir = new THREE.Vector3();
        dir.set(0, -1, 0);
        pos.y += 200;
        let raycaster = new THREE.Raycaster(pos, dir);
        const gravity = 60;
        let intersect = raycaster.intersectObject(game.environmentProxy);
        if (intersect.length > 0) {
            const targetY = pos.y - intersect[0].distance;
            if (targetY > this.object.position.y) {
                //Going up
                this.object.position.y =
                    0.8 * this.object.position.y + 0.2 * targetY;
                this.velocityY = 0;
            } else if (targetY < this.object.position.y) {
                //Falling
                if (this.velocityY == undefined) this.velocityY = 0;
                this.velocityY += dt * gravity;
                this.object.position.y -= this.velocityY;
                if (this.object.position.y < targetY) {
                    this.velocityY = 0;
                    this.object.position.y = targetY;
                }
            }
        }
    }

    move(dt, game) {
        const pos = this.object.position.clone();
        pos.y += 60;
        let blocked = false;
        blocked = this.blockedForward(pos, game)


        if (!blocked) {
            const speed = this.actionName == "run" ? 200 : 100;
            // this.player.object.position.x += this.player.moveDir.x * dt * speed
            // this.player.object.position.z += this.player.moveDir.y * dt * speed
            this.object.translateZ(dt * speed);
        }
        if (game.environmentProxy != undefined) {
            // //cast left
            // this.blockedLeft(pos)
            // //cast right
            // this.blockedRight(pos)
            //cast down
            this.bBoxFloor(game, pos, dt)
        }

    }

}