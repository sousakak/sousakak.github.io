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
            depthTest: true,
            uniforms: {
                uTime: {
                    value: 0
                },
                uMouse: {
                    value: new THREE.Vector3()
                },
                uVelocity: {
                    value: new THREE.Vector2()
                },
                uRadius: {
                    value: 0.30
                },
                uScatter: {
                    value: 0.12
                },
                uPointSize: {
                    value: 1.5
                },
                uColor: {
                    value: new THREE.Color(
                        0xffffff
                    )
                },
                uOpacity: {
                    value: 0.9
                }
            }
        });

    }

    public setTime(
        elapsed: number
    ): void {
        this.uniforms.uTime.value = elapsed;
    }

    public setInteraction(
        point: THREE.Vector3,
        velocity: THREE.Vector2
    ): void {

        ( this.uniforms.uMouse.value as THREE.Vector3 )
            .copy( point );
        ( this.uniforms.uVelocity.value as THREE.Vector2 )
            .copy( velocity );

    }

}