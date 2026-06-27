import * as THREE from "three";

export class Globe {
    public readonly object: THREE.LineSegments;

    constructor() {
        const geometry = new THREE.SphereGeometry(
            1,
            32,
            32
        );

        const wireframe = new THREE.WireframeGeometry(
            geometry
        );

        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.35
        });

        this.object = new THREE.LineSegments(
            wireframe,
            material
        );
    }

    public update(delta: number): void {
        this.object.rotation.y += delta * 0.15;
        this.object.rotation.x += delta * 0.03;
    }
}