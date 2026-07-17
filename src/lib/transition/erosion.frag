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

    //----------------------------------
    // n < uProgress の領域を「侵食済み」として塗る
    //----------------------------------

    float covered = 1.0 - smoothstep( uProgress - edgeWidth, uProgress + edgeWidth, n );

    //----------------------------------
    // しきい値付近だけを光らせる（侵食の縁）
    //----------------------------------

    float rim = smoothstep( uProgress - edgeWidth, uProgress, n )
        - smoothstep( uProgress, uProgress + edgeWidth, n );

    vec3 color = uColor + uGlowColor * rim * 1.5;

    gl_FragColor = vec4( color, covered );

}