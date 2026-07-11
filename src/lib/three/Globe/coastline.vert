uniform float uTime;
uniform vec3 uMouse;

varying vec3 vPosition;

void main() {
    vPosition = position;

    vec3 transformed = position;

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(
            transformed,
            1.0
        );

    gl_PointSize = 1.5;
}