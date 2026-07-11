import * as THREE from "three";
import { lonLatToVector3 } from "../../utils/convertCoords";
import type {
    FeatureCollection,
    LineString,
    MultiLineString
} from "geojson";

export class CoastlineGeometry extends THREE.BufferGeometry {

    private readonly radius: number;

    public constructor(
        radius: number
    ) {
        super();

        this.radius = radius;
    }

    public async load(): Promise<void> {
        const response =
            await fetch("/data/coastline.json");

        const geoJson =
            await response.json() as FeatureCollection<
                LineString |
                MultiLineString
            >;

        this.build( geoJson );
    }

    private build(
        geoJson: FeatureCollection<
            LineString |
            MultiLineString
        >
    ): void {

        const positions: number[] = [];
        const randoms: number[] = [];

        for (
            const feature
            of geoJson.features
        ) {

            const geometry =
                feature.geometry;

            switch (
                geometry.type
            ) {

                case "LineString":
                    this.pushLine(
                        positions,
                        randoms,
                        geometry.coordinates
                    );
                    break;

                case "MultiLineString":
                    for (
                        const line
                        of geometry.coordinates
                    ) {

                        this.pushLine(
                            positions,
                            randoms,
                            line
                        );

                    }
                    break;

            }

        }

        this.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                positions,
                3
            )
        );

        this.setAttribute(
            "randomDirection",
            new THREE.Float32BufferAttribute(
                randoms,
                3
            )
        );

    }

    private pushLine(
        positions: number[],
        randoms: number[],
        coordinates: number[][]
    ): void {

        for ( const coordinate of coordinates ) {

            const point =
                lonLatToVector3(
                    this.radius,
                    coordinate[0],
                    coordinate[1]
                );

            positions.push(
                point.x,
                point.y,
                point.z
            );

            //----------------------------------
            // Random direction
            //----------------------------------

            const direction =
                new THREE.Vector3(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ).normalize();

            randoms.push(
                direction.x,
                direction.y,
                direction.z
            );

        }

    }

}