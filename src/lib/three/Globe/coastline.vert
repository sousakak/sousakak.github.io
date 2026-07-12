attribute vec3 tangent;
attribute vec3 random;

uniform float uTime;
uniform vec3 uMouse;
uniform vec3 uVelocity;
uniform float uRadius;
uniform float uScatter;
uniform float uPointSize;

varying float vInfluence;

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

    vInfluence = influence;

    //----------------------------------
    // Tangent direction
    //----------------------------------

    vec3 tangentDirection =
        normalize(
            tangent
        );

    //----------------------------------
    // Mouse velocity
    //----------------------------------

    vec3 velocityDirection =
        vec3( 0.0 );

    float velocityLength =
        length(
            uVelocity
        );

    if (
        velocityLength > 0.00001
    ) {
        velocityDirection = uVelocity / velocityLength;
    }

    //----------------------------------
    // Random jitter
    //----------------------------------

    vec3 randomDirection = normalize( random );

    //----------------------------------
    // Final offset
    //----------------------------------

    vec3 offset =
        tangentDirection * influence * uScatter
        + velocityDirection * influence * 0.03
        + randomDirection * influence * 0.02;

    vec3 transformed = position + offset;

    gl_Position = projectionMatrix
        * modelViewMatrix
        * vec4( transformed, 1.0 );

    gl_PointSize = uPointSize;

}