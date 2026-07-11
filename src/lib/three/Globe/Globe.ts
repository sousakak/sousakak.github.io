import * as THREE from "three";
import { Time } from "../Time";
import { CoastlineGeometry } from "../Globe/CoastlineGeometry";
import { CoastlineMaterial } from "../Globe/CoastlineMaterial";

export class Globe {
    public readonly object: THREE.Group;

    private readonly radius: number = 1.0;

    private readonly material: CoastlineMaterial;

    private readonly geometries: THREE.BufferGeometry[] = [];

    private readonly mouse = new THREE.Vector3();

    public constructor() {
        this.object = new THREE.Group();

        this.material =
            new CoastlineMaterial();

        void this.load();
    }

    private async load(): Promise<void> {
        const geometry =
            new CoastlineGeometry(
                this.radius
            );

        await geometry.load();

        this.geometries.push(
            geometry
        );

        const line =
            new THREE.Points(
                geometry,
                this.material
            );

        this.object.add(
            line
        );
    }

    public update(
        time: Time
    ): void {

        this.material.setTime(
            time.elapsed
        );

        this.material.setMouse(
            this.mouse
        );

        this.object.rotation.y +=
            time.delta * 0.12;

        this.object.rotation.x =
            Math.sin(
                performance.now() * 0.00015
            ) * 0.15;

        this.object.rotation.z +=
            time.delta * 0.08;
    }

    public setMouse(
        mouse: THREE.Vector3
    ): void {
        this.mouse.copy(
            mouse
        );
    }

    public dispose(): void {
        for (const geometry of this.geometries) {
            geometry.dispose();
        }

        this.material.dispose();
    }
}