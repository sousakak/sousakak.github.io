import * as THREE from "three";

import { Time } from "../Time";
import { CoastlineGeometry } from "./CoastlineGeometry";
import { CoastlineMaterial } from "./CoastlineMaterial";

export class Globe {

    public readonly object: THREE.Group;

    private readonly radius: number = 1.0;

    private readonly material: CoastlineMaterial;

    private geometry: CoastlineGeometry | null = null;

    private points: THREE.Points | null = null;

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

        this.object.add( this.hitSphere );

        void this.load();

    }

    private async load(): Promise<void> {

        this.geometry = new CoastlineGeometry(
            this.radius
        );

        await this.geometry.load();

        this.points = new THREE.Points(
            this.geometry,
            this.material
        );

        this.object.add( this.points );

    }

    public get hitObject(): THREE.Object3D {
        return this.hitSphere;
    }

    public setInteraction(
        intersection: THREE.Intersection | null,
        velocity: THREE.Vector2
    ): void {

        if (
            intersection === null ||
            this.points === null
        ) {
            return;
        }

        //----------------------------------
        // World to Points local
        //----------------------------------

        const localPoint =
            this.points.worldToLocal(
                intersection.point.clone()
            );

        this.material.setInteraction(
            localPoint,
            velocity
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

        this.object.rotation.x =
            Math.sin(
                performance.now()
                * 0.00015
            ) * 0.15;

        this.object.rotation.z +=
            time.delta * 0.08;

    }

    public dispose(): void {

        this.geometry?.dispose();
        this.material.dispose();

    }

}