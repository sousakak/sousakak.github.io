import * as THREE from "three";

export function lonLatToVector3(
        radius: number,
        longitude: number,
        latitude: number
    ): THREE.Vector3 {
        const phi =
            THREE.MathUtils.degToRad(
                90 - latitude
            );

        const theta =
            THREE.MathUtils.degToRad(
                longitude + 180
            );

        const x =
            -radius *
            Math.sin(phi) *
            Math.cos(theta);

        const y =
            radius *
            Math.cos(phi);

        const z =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        return new THREE.Vector3(
            x,
            y,
            z
        );
    }