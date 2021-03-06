const {
    gui,
    webgl,
    assets
} = require('../../context');
const preact = require('preact')
const App = require('../../framework/App')
const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');
const animate = require('@jam3/gsap-promise');
const Landing = require('../../sections/Landing/Landing');
const Colour = require('colourjs');

// tell the preloader to include this asset
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading
//const gltfKey = assets.queue({
//const gltfKey = assets.queue({
//    url: 'assets/models/honeycomb.gltf'
//});


const StationKey = assets.queue({
    url: 'assets/Textures/Icons/Types/Station.svg'
});
const AsteroidKey = assets.queue({
    url: 'assets/Textures/Icons/Types/Asteroid.svg'
});
const HostileKey = assets.queue({
    url: 'assets/Textures/Icons/Types/Hostile.svg'
});
const OtherKey = assets.queue({
    url: 'assets/Textures/Icons/Types/Other.svg'
});
var SelectedPOI = null

const types = {
    Station: new THREE.TextureLoader().load(StationKey), function() {console.log("loaded")},
    Asteroid: new THREE.TextureLoader().load(AsteroidKey), function() {console.log("loaded")},
    Hostile: new THREE.TextureLoader().load(HostileKey), function() {console.log("loaded")},
    Other: new THREE.TextureLoader().load(OtherKey), function() {console.log("loaded")}
}

const POIS = require('../../../app/assets/JSON/POIS');



module.exports = class points extends THREE.Object3D {
    constructor() {
        super();
        //console.log(POIS.length)
        // now fetch the loaded resource
        // const gltf = assets.get(gltfKey);
        for (let i = 0; i < POIS.length; i++) {

            const AsteroidMat = new THREE.SpriteMaterial({
                map: GetSprite(POIS[i].type),
                color: new THREE.Color(POIS[i].color[0], POIS[i].color[1], POIS[i].color[2])
            });
            let Sprite = new THREE.Sprite(AsteroidMat);
            //console.log(POIS[i].position);
            Sprite.name = POIS[i].name;
            Sprite.isPOI = true;
            Sprite.data = POIS[i];
            Sprite.position.set(POIS[i].position.x, POIS[i].position.y, POIS[i].position.z);
            Sprite.scale.set(100, 100, 100);
            this.add(Sprite);

        }
        this.selectedPOI = ""
        this.maxScale = 50
        this.minScale = 1



        //console.log(this.children)

        if (gui) { // assume it can be falsey, e.g. if we strip dat-gui out of bundlee
            // attach dat.gui stuff here as usual

        }
    }

    onAppDidUpdate(oldProps, oldState, newProps, newState) {

    }

    animateIn(opt = {}) {

        animate.fromTo(this.rotation, 2.0, {
            x: -Math.PI / 4
        }, {
            ...opt,
            x: 0,
            ease: Expo.easeOut
        });
    }

    update(dt = 0, time = 0) {
        let amount = 10
        let scale = null;

        for(let i = 0; i < this.children.length; i++) {
            //console.log("e")
            let distance = this.children[i].position.distanceTo(webgl.camera.position);
            if(distance/amount >= this.maxScale){scale = this.maxScale}
            else if(distance/amount <= this.minScale){scale = this.minScale}
            else{scale = distance/amount}
            this.children[i].scale.set(scale,scale,scale);
            //console.log(this.selectedPOI)
        }
    }

    onTouchStart(ev, pos) {
        if (this.touchTime === 0) {
            this.touchTime = new Date().getTime();
            SingleClick(ev, pos, this);
        } else {
            if (((new Date().getTime()) - this.touchTime) < 200) {
                // double click occurred
                console.log("double clicked");
                DoubleClick(ev, pos, this);
                this.touchTime = 0;
            } else {
                // not a double click so set as a new first click
                this.touchTime = new Date().getTime();
               console.log( this.selectedPOI = SingleClick(ev, pos, this))

            }
        }
    }

    onTouchMove(ev, pos) {}

    onTouchEnd(ev, pos) {}
};

function DoubleClick(ev, pos, the) {
    const [x, y] = pos;
    //console.log('Touchstart / mousedown: (%d, %d)', x, y);

    // For example, raycasting is easy:
    const coords = new THREE.Vector2().set(
        pos[0] / webgl.width * 2 - 1,
        -pos[1] / webgl.height * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(coords, webgl.camera);
    const hits = raycaster.intersectObject(webgl.scene, true);
    let thisHit = null;
    if (hits.length > 0) {
        //console.log(hits[0].object)
        let moveTarget = hits[0].object.position;
        if (hits[0].object.isPOI) {
            //console.log("he");
            webgl.controls.target.set(moveTarget.x, moveTarget.y, moveTarget.z);
        }
    }
    console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit');

}

function SingleClick(ev, pos, the) {

    const [x, y] = pos;
    // For example, raycasting is easy:
    const coords = new THREE.Vector2().set(
        pos[0] / webgl.width * 2 - 1,
        -pos[1] / webgl.height * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(coords, webgl.camera);
    const hits = raycaster.intersectObject(webgl.scene, true);
    let thisHit = null;
    if (hits.length > 0) {
        //console.log(hits[0].object)
        let moveTarget = hits[0].object.position;
        if (hits[0].object.isPOI) {

            return(hits[0].object)

        }
    }
    console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit');
}

function DisplayInfo(POI) {
console.log(POI.Data)

}

function GetSprite(type){
if(type in types){
    //console.log(type)
    //return null
    return types[type]
}
}