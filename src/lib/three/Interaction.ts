import * as THREE from "three";

export class Interaction {

    private readonly raycaster: THREE.Raycaster;

    private readonly mouse: THREE.Vector2;

    private readonly previousPoint: THREE.Vector3;

    public readonly point: THREE.Vector3;

    public readonly velocity: THREE.Vector3;

    public readonly smoothedVelocity: THREE.Vector3;

    private readonly smoothing = 0.18;

    public constructor() {

        this.raycaster =
            new THREE.Raycaster();

        this.mouse =
            new THREE.Vector2();

        this.previousPoint =
            new THREE.Vector3();

        this.point =
            new THREE.Vector3();

        this.velocity =
            new THREE.Vector3();

        this.smoothedVelocity =
            new THREE.Vector3();

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

        this.raycaster.setFromCamera(
            this.mouse,
            camera
        );

        const intersects =
            this.raycaster.intersectObject(
                object,
                false
            );

        if (
            intersects.length === 0
        ) {
            return;
        }

        const hit = intersects[0].point;

        //----------------------------------
        // Raw velocity
        //----------------------------------

        this.velocity
            .copy( hit )
            .sub(
                this.previousPoint
            );

        //----------------------------------
        // Smoothed velocity
        //----------------------------------

        this.smoothedVelocity.lerp(
            this.velocity,
            this.smoothing
        );

        //----------------------------------
        // Store current point
        //----------------------------------

        this.previousPoint.copy(
            hit
        );

        this.point.copy(
            hit
        );

    }

    public dispose(): void {
        window.removeEventListener(
            "pointermove",
            this.handlePointerMove
        );
    }

}