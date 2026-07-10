import * as THREE from "three";
import { Time } from "./Time";
import type {
    FeatureCollection,
    LineString,
    MultiLineString
} from "geojson";

export class Globe {
    public readonly object: THREE.Group;

    private readonly radius: number = 1.0;

    private readonly material: THREE.LineBasicMaterial;

    public constructor() {
        this.object = new THREE.Group();

        this.material =
            new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.9
            });

        void this.load();
    }

    private async load(): Promise<void> {
        const response =
            await fetch("/data/coastline.json");

        const geoJson =
            await response.json() as FeatureCollection<LineString | MultiLineString>;

        this.build(
            geoJson
        );
    }

    private build(
        geoJson: FeatureCollection<LineString | MultiLineString>
    ): void {
        for (const feature of geoJson.features) {
            const geometry =
                feature.geometry;

            switch (geometry.type) {
                case "LineString":
                    this.addLine(
                        geometry.coordinates as number[][]
                    );
                    break;

                case "MultiLineString":
                    for (const line of geometry.coordinates as number[][][]) {
                        this.addLine(line);
                    }
                    break;
            }
        }
    }

    private addLine(
        coordinates: number[][]
    ): void {
        const positions: number[] = [];

        for (const coordinate of coordinates) {
            const point =
                this.lonLatToVector3(
                    coordinate[0],
                    coordinate[1]
                );

            positions.push(
                point.x,
                point.y,
                point.z
            );
        }

        const geometry =
            new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                positions,
                3
            )
        );

        const line =
            new THREE.Line(
                geometry,
                this.material
            );

        this.object.add(line);
    }

    private lonLatToVector3(
        longitude: number,
        latitude: number
    ): THREE.Vector3 {
        const phi =
            THREE.MathUtils.degToRad(
                90 - latitude
            );

        const theta =
            THREE.MathUtils.degToRad(
                longitude + 180
            );

        const x =
            -this.radius *
            Math.sin(phi) *
            Math.cos(theta);

        const y =
            this.radius *
            Math.cos(phi);

        const z =
            this.radius *
            Math.sin(phi) *
            Math.sin(theta);

        return new THREE.Vector3(
            x,
            y,
            z
        );
    }

    public update(
        time: Time
    ): void {
        this.object.rotation.y +=
            time.delta * 0.12;

        this.object.rotation.x =
            Math.sin(
                performance.now() * 0.00015
            ) * 0.15;

        this.object.rotation.z +=
            time.delta * 0.08;
    }

    public dispose(): void {
        this.object.traverse((child) => {
            if (!(child instanceof THREE.Line)) {
                return;
            }

            child.geometry.dispose();
        });

        this.material.dispose();
    }
}