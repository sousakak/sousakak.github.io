import * as THREE from "three";
import type {
    FeatureCollection,
    LineString,
    MultiLineString
} from "geojson";

import { lonLatToVector3 } from "../../utils/convertCoords";

export class CoastlineGeometry
    extends THREE.BufferGeometry {

    private readonly radius: number;

    public constructor( radius: number ) {
        super();
        this.radius = radius;
    }

    public async load(): Promise<void> {

        const response = await fetch(
            "/data/coastline.json"
        );

        const geoJson =
            await response.json() as FeatureCollection<
                LineString | MultiLineString
            >;

        this.build(
            geoJson
        );

    }

    private build(
        geoJson: FeatureCollection<
            LineString | MultiLineString
        >
    ): void {

        const positions: number[] = [];
        const tangents: number[] = [];
        const randoms: number[] = [];

        for ( const feature of geoJson.features ) {

            switch ( feature.geometry.type ) {

                case "LineString":
                    this.pushLine(
                        feature.geometry.coordinates,
                        positions,
                        tangents,
                        randoms
                    );
                    break;

                case "MultiLineString":
                    for (
                        const line
                        of feature.geometry.coordinates
                    ) {
                        this.pushLine(
                            line,
                            positions,
                            tangents,
                            randoms
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
            "tangent",
            new THREE.Float32BufferAttribute(
                tangents,
                3
            )
        );

        this.setAttribute(
            "random",
            new THREE.Float32BufferAttribute(
                randoms,
                3
            )
        );

    }

    private pushLine(
        coordinates: number[][],
        positions: number[],
        tangents: number[],
        randoms: number[]
    ): void {

        const points = coordinates.map(
            ([longitude, latitude]) =>
                lonLatToVector3(
                    this.radius,
                    longitude,
                    latitude
                )
        );

        for (
            let i = 0;
            i < points.length;
            i++
        ) {

            const point = points[i];

            positions.push(
                point.x,
                point.y,
                point.z
            );

            //----------------------------------
            // Tangent
            //----------------------------------

            let tangent: THREE.Vector3;

            if (i === 0) {
                tangent =
                    points[1]
                        .clone()
                        .sub(point);
            }
            else if ( i === points.length - 1 ) {
                tangent = point
                    .clone()
                    .sub(
                        points[i - 1]
                    );
            }
            else {
                tangent = points[i + 1]
                    .clone()
                    .sub(
                        points[i - 1]
                    );
            }

            tangent.normalize();

            tangents.push(
                tangent.x,
                tangent.y,
                tangent.z
            );

            //----------------------------------
            // Stable random
            //----------------------------------

            const longitude = coordinates[i][0];
            const latitude = coordinates[i][1];

            randoms.push(
                this.hash(
                    longitude,
                    latitude,
                    0.0
                ),
                this.hash(
                    longitude,
                    latitude,
                    1.0
                ),
                this.hash(
                    longitude,
                    latitude,
                    2.0
                )
            );

        }

    }

    private hash(
        longitude: number,
        latitude: number,
        seed: number
    ): number {

        const value = Math.sin(
            longitude * 127.1 +
            latitude * 311.7 +
            seed * 74.7
        ) * 43758.5453123;

        return (
            value -
            Math.floor(value)
        ) * 2.0 - 1.0;

    }

}