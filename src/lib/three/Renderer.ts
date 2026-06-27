import * as THREE from "three";

export class Renderer {
    private readonly renderer: THREE.WebGLRenderer;

    public constructor(
        canvas: HTMLCanvasElement
    ) {
        this.renderer =
            new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true
            });

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.setClearColor(
            0x000000,
            0
        );
    }

    public resize(): void {
        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }

    public render(
        scene: THREE.Scene,
        camera: THREE.Camera
    ): void {
        this.renderer.render(
            scene,
            camera
        );
    }

    public dispose(): void {
        this.renderer.dispose();
    }

    public get instance(): THREE.WebGLRenderer {
        return this.renderer;
    }
}