import * as THREE from "three";

import { Time } from "../Time";
import { CoastlineGeometry } from "./CoastlineGeometry";
import { CoastlineMaterial } from "./CoastlineMaterial";

export class Globe {

    public readonly object: THREE.Group;

    private readonly radius = 1.0;

    private readonly material: CoastlineMaterial;

    private readonly geometries: THREE.BufferGeometry[] = [];

    private readonly points: THREE.Points;

    private readonly hitSphere: THREE.Mesh;

    public constructor() {

        this.object = new THREE.Group();
        this.material = new CoastlineMaterial();

        this.hitSphere = new THREE.Mesh(
            new THREE.SphereGeometry(
                this.radius,
                32,
                32
            ),
            new THREE.MeshBasicMaterial({
                visible: false
            })
        );

        this.object.add(
            this.hitSphere
        );

        this.points = new THREE.Points(
            new THREE.BufferGeometry(),
            this.material
        );

        this.object.add(
            this.points
        );

        void this.load();

    }

    private async load(): Promise<void> {

        const geometry = new CoastlineGeometry(
            this.radius
        );

        await geometry.load();

        this.geometries.push(
            geometry
        );

        this.points.geometry = geometry;

    }

    public get hitObject(): THREE.Object3D {
        return this.hitSphere;
    }

    public setInteraction(
        point: THREE.Vector3,
        velocity: THREE.Vector3
    ): void {

        //----------------------------------
        // World → Local
        //----------------------------------

        const localPoint = this.object.worldToLocal(
            point.clone()
        );

        const localEnd = this.object.worldToLocal(
            point.clone().add(
                velocity
            )
        );

        const localVelocity = localEnd.sub(
            localPoint
        );

        //----------------------------------
        // Shader uniforms
        //----------------------------------

        this.material.setInteraction(
            localPoint,
            localVelocity
        );

    }

    public update(
        time: Time
    ): void {

        this.material.setTime(
            time.elapsed
        );

        this.object.rotation.y +=
            time.delta * 0.12;

        this.object.rotation.x = Math.sin(
            performance.now() * 0.00015
        ) * 0.15;

        this.object.rotation.z +=
            time.delta * 0.08;

    }

    public dispose(): void {

        for (
            const geometry
            of this.geometries
        ) {
            geometry.dispose();
        }

        this.material.dispose();

    }

}