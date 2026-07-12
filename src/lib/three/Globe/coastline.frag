uniform vec3 uColor;
uniform float uOpacity;
uniform vec3 uGlowColor;
uniform float uGlowIntensity;

varying float vInfluence;

void main() {

    vec2 uv = gl_PointCoord - vec2( 0.5 );
    float dist = length( uv );

    //----------------------------------
    // The basic round points
    //----------------------------------

    float core = smoothstep( 0.5, 0.2, dist );

    //----------------------------------
    // The glow as gradient spreading outward
    //----------------------------------

    float halo = smoothstep( 0.5, 0.0, dist );

    //----------------------------------
    // The color and intensity blending
    //----------------------------------

    vec3 color = mix(
        uColor,
        uGlowColor,
        vInfluence
    );

    float glow = halo * vInfluence * uGlowIntensity;

    float alpha = core * uOpacity + glow;

    gl_FragColor = vec4( color * ( 1.0 + glow ), alpha );

}