import * as THREE from "three";
import vertexShader from "./coastline.vert";
import fragmentShader from "./coastline.frag";

export class CoastlineMaterial extends THREE.ShaderMaterial {
    public constructor() {
        super({
            vertexShader,
            fragmentShader,

            transparent: true,
            depthWrite: false,

            uniforms: {
                uTime: {
                    value: 0
                },

                uMouse: {
                    value: new THREE.Vector3()
                },

                uRadius: {
                    value: 0.3
                },

                uColor: {
                    value: new THREE.Color(0xffffff)
                },

                uOpacity: {
                    value: 0.9
                }
            }
        });
    }

    public setTime(
        time: number
    ): void {
        this.uniforms.uTime.value =
            time;
    }

    public setMouse(
        mouse: THREE.Vector3
    ): void {
        (this.uniforms.uMouse.value as THREE.Vector3)
            .copy(mouse);
    }
}