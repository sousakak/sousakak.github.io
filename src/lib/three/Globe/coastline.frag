uniform vec3 uColor;
uniform float uOpacity;

varying vec3 vPosition;

void main() {
    gl_FragColor = vec4(
        uColor,
        uOpacity
    );
}
