import * as THREE from "three";

export class Time {
    private readonly timer: THREE.Timer;

    public constructor() {
        this.timer = new THREE.Timer();

        this.timer.connect(document);
    }

    public update(): void {
        this.timer.update();
    }

    public dispose(): void {
        this.timer.dispose();
    }

    public get delta(): number {
        return this.timer.getDelta();
    }

    public get elapsed(): number {
        return this.timer.getElapsed();
    }
}