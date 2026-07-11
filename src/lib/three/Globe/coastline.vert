uniform float uTime;
uniform vec3 uMouse;
uniform float uRadius;

float random(
    vec2 st
) {

    return fract(
        sin(
            dot(
                st,
                vec2(
                    12.9898,
                    78.233
                )
            )
        ) * 43758.5453123
    );

}

void main() {

    //----------------------------------
    // Mouse influence
    //----------------------------------

    float dist = distance(
        position,
        uMouse
    );

    float influence = smoothstep(
        uRadius,
        0.0,
        dist
    );

    //----------------------------------
    // Sphere normal vector
    //----------------------------------

    vec3 normal = normalize( position );

    //----------------------------------
    // Build tangent basis
    //----------------------------------

    vec3 helper = abs( normal.y ) > 0.99
        ? vec3(
            1.0,
            0.0,
            0.0
        )
        : vec3(
            0.0,
            1.0,
            0.0
        );

    vec3 tangent = normalize(
        cross(
            helper,
            normal
        )
    );

    vec3 bitangent = normalize(
        cross(
            normal,
            tangent
        )
    );

    //----------------------------------
    // Random angle
    //----------------------------------

    float angle = random( position.xy ) * 6.28318530718;

    //----------------------------------
    // Tangent direction
    //----------------------------------

    vec3 tangentDirection = tangent * cos(angle)
        + bitangent * sin(angle);

    //----------------------------------
    // Slightly outward
    //----------------------------------

    vec3 direction = normalize(
        tangentDirection + normal * 0.25
    );

    //----------------------------------
    // Displacement and transformation
    //----------------------------------

    vec3 transformed = position
        + direction * influence * 0.15;

    gl_Position = projectionMatrix * modelViewMatrix
        * vec4(
            transformed,
            1.0
        );

    gl_PointSize = 1.5;

}