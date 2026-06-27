import * as THREE from "three";

import { CameraManager } from "./camera";
import { Globe } from "./globe";

export default class Scene {
    private readonly canvas: HTMLCanvasElement;

    private readonly scene: THREE.Scene;
    private readonly cameraManager: CameraManager;
    private readonly renderer: THREE.WebGLRenderer;

    private readonly globe: Globe;

    private readonly clock: THREE.Clock;

    private animationFrameId: number | null = null;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.scene = new THREE.Scene();

        this.cameraManager = new CameraManager();

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.setClearColor(0x000000, 0);

        this.globe = new Globe();

        this.scene.add(
            this.globe.object
        );

        this.clock = new THREE.Clock();

        window.addEventListener(
            "resize",
            this.handleResize
        );
    }

    public start(): void {
        this.render();
    }

    public dispose(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }

        window.removeEventListener(
            "resize",
            this.handleResize
        );

        this.renderer.dispose();

        this.scene.clear();
    }

    private readonly handleResize = (): void => {
        this.cameraManager.resize();

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    };

    private readonly render = (): void => {
        this.animationFrameId =
            requestAnimationFrame(this.render);

        const delta =
            this.clock.getDelta();

        this.globe.update(delta);

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
        return this.renderer;
    }
}