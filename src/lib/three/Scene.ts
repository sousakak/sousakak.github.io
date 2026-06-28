import * as THREE from "three";

import { CameraManager } from "./Camera";
import { Globe } from "./Globe";
import { Renderer } from "./Renderer";
import { Time } from "./Time";

export default class Scene {
    private readonly scene: THREE.Scene;

    private readonly cameraManager: CameraManager;

    private readonly renderer: Renderer;

    private readonly globe: Globe;

    private readonly time: Time;

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
            "resize",
            this.handleResize
        );

        this.time.dispose();

        this.renderer.dispose();

        this.scene.clear();
    }

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