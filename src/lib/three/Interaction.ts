import * as THREE from "three";

export class Interaction {

    private readonly raycaster: THREE.Raycaster;

    private readonly mouse: THREE.Vector2;

    private readonly previousMouse: THREE.Vector2;

    public readonly point: THREE.Vector3;

    public readonly velocity: THREE.Vector2;

    public constructor() {

        this.raycaster =
            new THREE.Raycaster();

        this.mouse =
            new THREE.Vector2();

        this.previousMouse =
            new THREE.Vector2();

        this.point =
            new THREE.Vector3();

        this.velocity =
            new THREE.Vector2();

        window.addEventListener(
            "pointermove",
            this.handlePointerMove
        );

    }

    private readonly handlePointerMove =
        (
            event: PointerEvent
        ): void => {

            this.mouse.set(

                event.clientX
                / window.innerWidth
                * 2 - 1,

                -(
                    event.clientY
                    / window.innerHeight
                ) * 2 + 1

            );

        };

    public update(
        camera: THREE.Camera,
        object: THREE.Object3D
    ): void {

        this.velocity.subVectors(
            this.mouse,
            this.previousMouse
        );

        this.previousMouse.copy(
            this.mouse
        );

        this.raycaster.setFromCamera(
            this.mouse,
            camera
        );

        const intersects =
            this.raycaster.intersectObject(
                object,
                true
            );

        if (
            intersects.length === 0
        ) {
            return;
        }

        this.point.copy(
            intersects[0].point
        );

    }

    public dispose(): void {

        window.removeEventListener(
            "pointermove",
            this.handlePointerMove
        );

    }

}