import * as THREE from "three";

export class CoastlineMaterial extends THREE.LineBasicMaterial {
    public constructor() {
        super({
            color: 0xffffff,

            transparent: true,

            opacity: 0.9
        });
    }
}