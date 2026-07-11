import * as THREE from "three";
import vertexShader from "./coastline.vert";
import fragmentShader from "./coastline.frag";

/*
const vertexShader = `uniform float uTime;
uniform vec3 uMouse;

varying vec3 vPosition;

void main() {
    vPosition = position;

    vec3 transformed = position;

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(
            transformed,
            1.0
        );
}`
const fragmentShader = `uniform vec3 uColor;
uniform float uOpacity;

varying vec3 vPosition;

void main() {
    gl_FragColor = vec4(
        uColor,
        uOpacity
    );
}`;
*/

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
        this.uniforms.uMouse.value
            .copy(mouse);
    }
}