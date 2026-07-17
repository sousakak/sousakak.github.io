precision highp float;

uniform vec2 uResolution;
uniform float uProgress;
uniform float uSeed;
uniform vec3 uColor;
uniform vec3 uGlowColor;

float hash( vec2 p ) {
    return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) + uSeed ) * 43758.5453123 );
}

float noise( vec2 p ) {

    vec2 i = floor( p );
    vec2 f = fract( p );

    float a = hash( i );
    float b = hash( i + vec2( 1.0, 0.0 ) );
    float c = hash( i + vec2( 0.0, 1.0 ) );
    float d = hash( i + vec2( 1.0, 1.0 ) );

    vec2 u = f * f * ( 3.0 - 2.0 * f );

    return mix( a, b, u.x ) + ( c - a ) * u.y * ( 1.0 - u.x ) + ( d - b ) * u.x * u.y;

}

float fbm( vec2 p ) {

    float value = 0.0;
    float amplitude = 0.5;

    for ( int i = 0; i < 5; i++ ) {
        value += amplitude * noise( p );
        p *= 2.0;
        amplitude *= 0.5;
    }

    return value;

}

void main() {

    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 p = uv * vec2( uResolution.x / uResolution.y, 1.0 ) * 6.0;

    float n = fbm( p );

    float edgeWidth = 0.05;
    float haloWidth = 0.16;

    //----------------------------------
    // Color the area which is n < uProgress as "already filled"
    //----------------------------------

    float covered = 1.0 - smoothstep( uProgress - edgeWidth, uProgress + edgeWidth, n );

    //----------------------------------
    // Rim core (concentrated and strong)
    //----------------------------------

    float rimCore = smoothstep( uProgress - edgeWidth, uProgress, n )
        - smoothstep( uProgress, uProgress + edgeWidth, n );

    //----------------------------------
    // Blur of rim (spread and soft)
    //----------------------------------

    float rimHalo = smoothstep( uProgress - haloWidth, uProgress, n )
        - smoothstep( uProgress, uProgress + haloWidth, n );

    float glow = rimCore * 1.1 + rimHalo * 0.9;

    vec3 color = uColor + uGlowColor * glow;

    float alpha = clamp( covered + rimCore * 0.9 + rimHalo * 0.35, 0.0, 1.0 );

    gl_FragColor = vec4( color, alpha );

}