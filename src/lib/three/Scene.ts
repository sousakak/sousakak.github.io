import * as THREE from "three";

import { CameraManager } from "./Camera";
import { Globe } from "./Globe/Globe";
import { Renderer } from "./Renderer";
import { Time } from "./Time";

export default class Scene {
    private readonly scene: THREE.Scene;

    private readonly cameraManager: CameraManager;

    private readonly renderer: Renderer;

    private readonly globe: Globe;

    private readonly time: Time;

    private readonly mouse = new THREE.Vector2();

    private readonly raycaster = new THREE.Raycaster();

    private animationFrameId: number | null = null;

    public constructor(
        canvas: HTMLCanvasElement
    ) {
        this.scene =
            new THREE.Scene();

        this.cameraManager =
            new CameraManager();

        this.renderer =
            new Renderer(canvas);

        this.globe =
            new Globe();

        this.scene.add(
            this.globe.object
        );

        this.time =
            new Time();

        window.addEventListener(
            "pointermove",
            this.handlePointerMove
        );

        window.addEventListener(
            "resize",
            this.handleResize
        );
    }

    public start(): void {
        this.render();
    }

    public dispose(): void {
        if (
            this.animationFrameId !== null
        ) {
            cancelAnimationFrame(
                this.animationFrameId
            );
        }

        window.removeEventListener(
            "pointermove",
            this.handlePointerMove
        );

        window.removeEventListener(
            "resize",
            this.handleResize
        );

        this.time.dispose();

        this.renderer.dispose();

        this.scene.clear();
    }

    private readonly handlePointerMove =
    (
        event: PointerEvent
    ): void => {

        this.mouse.set(

            event.clientX /
            window.innerWidth * 2 - 1,

            -(
                event.clientY /
                window.innerHeight
            ) * 2 + 1

        );

        this.raycaster.setFromCamera(
            this.mouse,
            this.cameraManager.camera
        );

        const intersects =
            this.raycaster.intersectObject(
                this.globe.hitObject,
                false
            );

        if (
            intersects.length === 0
        ) {
            return;
        }

        this.globe.setMouse(
            intersects[0].point
        );

    };

    private readonly handleResize =
        (): void => {
            this.cameraManager.resize();

            this.renderer.resize();
        };

    private readonly render =
        (): void => {
            this.animationFrameId =
                requestAnimationFrame(
                    this.render
                );

            this.time.update();

            this.globe.update(
                this.time
            );

            this.renderer.render(
                this.scene,
                this.cameraManager.camera
            );
        };

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.cameraManager.camera;
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer.instance;
    }
}