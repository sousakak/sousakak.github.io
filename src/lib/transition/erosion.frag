precision highp float;

uniform vec2 uResolution;
uniform float uProgress;
uniform float uSeed;
uniform vec3 uColor;
uniform vec3 uGlowColor;

vec2 hash( vec2 p ) {

    p = vec2(
        dot( p, vec2(127.1,311.7) ),
        dot( p, vec2(269.5,183.3) )
    );

    return normalize(
        fract( sin( p + uSeed ) * 43758.5453123 ) * 2.0 - 1.0
    );

}

float noise( vec2 p ) {

    vec2 i = floor( p );
    vec2 f = fract( p );

    vec2 u = f * f * ( 3.0 - 2.0 * f );

    float a = dot(hash( i ),f);
    float b = dot(hash( i + vec2(1.0,0.0) ),f - vec2(1.0,0.0));
    float c = dot(hash( i + vec2(0.0,1.0) ),f - vec2(0.0,1.0));
    float d = dot(hash( i + vec2(1.0,1.0) ),f - vec2(1.0,1.0));

    return mix(
        mix( a, b, u.x ),
        mix( c, d, u.x ),
        u.y
    ) * 0.5 + 0.5;

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
    vec2 p = uv * vec2( uResolution.x / uResolution.y, 1.0 ) * 10.0;

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