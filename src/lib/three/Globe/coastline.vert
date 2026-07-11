uniform float uTime;
uniform vec3 uMouse;
uniform float uRadius;

varying vec3 vPosition;

void main() {

    vPosition = position;

    //----------------------------------
    // マウスとの距離
    //----------------------------------

    float dist = distance(
        position,
        uMouse
    );

    //----------------------------------
    // 影響度
    //----------------------------------

    float influence = smoothstep(
        uRadius,
        0.0,
        dist
    );

    //----------------------------------
    // 外側へ押し出す
    //----------------------------------

    vec3 transformed = position
        + normalize(position) * influence * 0.15;

    //----------------------------------

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(
            transformed,
            1.0
        );

    gl_PointSize =
        1.5;
}