import * as THREE from "three";

export class Interaction {

    private readonly raycaster: THREE.Raycaster;

    private readonly mouse: THREE.Vector2;

    private readonly previousMouse: THREE.Vector2;

    public readonly velocity: THREE.Vector2;

    public intersection:
        THREE.Intersection |
        null = null;

    public constructor() {

        this.raycaster =
            new THREE.Raycaster();

        this.mouse =
            new THREE.Vector2();

        this.previousMouse =
            new THREE.Vector2();

        this.velocity =
            new THREE.Vector2();

        window.addEventListener(
            "pointermove",
            this.handlePointerMove
        );

    }

    private readonly handlePointerMove = (
        event: PointerEvent
    ): void => {

        this.mouse.set(
            event.clientX / window.innerWidth * 2 - 1,
            -( event.clientY / window.innerHeight ) * 2 + 1
        );

    };

    public update(
        camera: THREE.Camera,
        object: THREE.Object3D
    ): void {

        //----------------------------------
        // Mouse velocity
        //----------------------------------

        this.velocity.subVectors(
            this.mouse,
            this.previousMouse
        );

        this.previousMouse.copy(
            this.mouse
        );

        //----------------------------------
        // Raycast
        //----------------------------------

        this.raycaster.setFromCamera(
            this.mouse,
            camera
        );

        const intersections =
            this.raycaster.intersectObject(
                object,
                false
            );

        this.intersection = intersections.length > 0
            ? intersections[0]
            : null;
    }

    public dispose(): void {
        window.removeEventListener(
            "pointermove",
            this.handlePointerMove
        );
    }

}