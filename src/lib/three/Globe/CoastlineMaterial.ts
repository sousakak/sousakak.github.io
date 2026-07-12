import * as THREE from "three";

import vertexShader from "./coastline.vert";
import fragmentShader from "./coastline.frag";

export class CoastlineMaterial
    extends THREE.ShaderMaterial {

    public constructor() {

        super({

            vertexShader,
            fragmentShader,

            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending, // 追加

            uniforms: {
                uTime: {
                    value: 0
                },
                uMouse: {
                    value: new THREE.Vector3()
                },
                uVelocity: {
                    value: new THREE.Vector3()
                },
                uRadius: {
                    value: 0.30
                },
                uScatter: {
                    value: 0.05
                },
                uPointSize: {
                    value: 0.02
                },
                uColor: {
                    value: new THREE.Color(0xffffff)
                },
                uGlowColor: {
                    value: new THREE.Color(0xa855f7)
                },
                uGlowIntensity: {
                    value: 2.5
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
        this.uniforms.uTime.value = time;
    }

    public setInteraction(
        mouse: THREE.Vector3,
        velocity: THREE.Vector3
    ): void {

        ( this.uniforms.uMouse.value as THREE.Vector3 )
            .copy( mouse );
        ( this.uniforms.uVelocity.value as THREE.Vector3 )
            .copy( velocity );

    }

}