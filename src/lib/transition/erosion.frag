precision highp float;

uniform vec2 uResolution;
uniform float uProgress;
uniform float uSeed;
uniform vec3 uColor;
uniform vec3 uGlowColor;

vec3 mod289( vec3 x ) {
    return x - floor( x * (1.0 / 289.0) ) * 289.0;
}

vec2 mod289( vec2 x ) {
    return x - floor( x * (1.0 / 289.0) ) * 289.0;
}

vec3 permute( vec3 x ) {
    return mod289( ( x * 34.0 + 1.0 ) * x );
}

float snoise( vec2 v ) {

    const vec4 C = vec4(
        0.211324865405187,
        0.366025403784439,
       -0.577350269189626,
        0.024390243902439
    );

    vec2 i = floor(
        v + dot(v,C.yy)
    );

    vec2 x0 = v - i + dot(i,C.xx);

    vec2 i1 = ( x0.x > x0.y )
        ? vec2( 1.0,0.0 )
        : vec2( 0.0, 1.0 );

    vec4 x12 = x0.xyxy + C.xxzz;

    x12.xy -= i1;

    i = mod289( i );

    vec3 p = permute(
        permute(
            i.y +
            vec3(0.0,i1.y,1.0)
        ) +
        i.x +
        vec3(0.0,i1.x,1.0)
    );

    vec3 m = max(
            0.5 -
            vec3(
                dot(x0,x0),
                dot(x12.xy,x12.xy),
                dot(x12.zw,x12.zw)
            ),
            0.0
        );

    m *= m;
    m *= m;

    vec3 x = 2.0 * fract(
        p * C.www + uSeed * 0.001
    ) - 1.0;

    vec3 h = abs( x ) - 0.5;

    vec3 ox = floor(x + 0.5);

    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 *
        ( a0 * a0 + h * h );

    vec3 g;

    g.x =
        a0.x * x0.x +
        h.x * x0.y;

    g.y =
        a0.y * x12.x +
        h.y * x12.y;

    g.z =
        a0.z * x12.z +
        h.z * x12.w;

    return 130.0 * dot( m,g);

}

float fbm( vec2 p ) {

    float value = 0.0;
    float amplitude = 0.5;

    for ( int i = 0; i < 5; i++ ) {
        value += amplitude * (
            snoise( p ) * 0.5 + 0.5
        );
        p *= 2.02;
        amplitude *= 0.52;
    }

    return value;

}

void main() {

    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 p = uv * vec2( uResolution.x / uResolution.y, 1.0 ) * 2.5;

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