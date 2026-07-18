import{o as P}from"./ReadyState.D071cy0b.js";import{_ as R}from"./_plugin-vue_export-helper.DlAUqK2U.js";import{r as A,y as S,z as E,p as y,s as C,A as L,u as p,v as b}from"./runtime-core.esm-bundler.jFTBUuae.js";var F=`attribute vec2 aPosition;

void main() {\r
    gl_Position = vec4( aPosition, 0.0, 1.0 );\r
}`,z=`precision highp float;

uniform vec2 uResolution;\r
uniform float uProgress;\r
uniform float uSeed;\r
uniform vec3 uColor;\r
uniform vec3 uGlowColor;

vec3 mod289( vec3 x ) {\r
    return x - floor( x * (1.0 / 289.0) ) * 289.0;\r
}

vec2 mod289( vec2 x ) {\r
    return x - floor( x * (1.0 / 289.0) ) * 289.0;\r
}

vec3 permute( vec3 x ) {\r
    return mod289( ( x * 34.0 + 1.0 ) * x );\r
}

float snoise( vec2 v ) {

    const vec4 C = vec4(\r
        0.211324865405187,\r
        0.366025403784439,\r
       -0.577350269189626,\r
        0.024390243902439\r
    );

    vec2 i = floor(\r
        v + dot(v,C.yy)\r
    );

    vec2 x0 = v - i + dot(i,C.xx);

    vec2 i1 = ( x0.x > x0.y )\r
        ? vec2( 1.0,0.0 )\r
        : vec2( 0.0, 1.0 );

    vec4 x12 = x0.xyxy + C.xxzz;

    x12.xy -= i1;

    i = mod289( i );

    vec3 p = permute(\r
        permute(\r
            i.y +\r
            vec3(0.0,i1.y,1.0)\r
        ) +\r
        i.x +\r
        vec3(0.0,i1.x,1.0)\r
    );

    vec3 m = max(\r
            0.5 -\r
            vec3(\r
                dot(x0,x0),\r
                dot(x12.xy,x12.xy),\r
                dot(x12.zw,x12.zw)\r
            ),\r
            0.0\r
        );

    m *= m;\r
    m *= m;

    vec3 x = 2.0 * fract(\r
        p * C.www + uSeed * 0.001\r
    ) - 1.0;

    vec3 h = abs( x ) - 0.5;

    vec3 ox = floor(x + 0.5);

    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 *\r
        ( a0 * a0 + h * h );

    vec3 g;

    g.x =\r
        a0.x * x0.x +\r
        h.x * x0.y;

    g.y =\r
        a0.y * x12.x +\r
        h.y * x12.y;

    g.z =\r
        a0.z * x12.z +\r
        h.z * x12.w;

    return 130.0 * dot( m,g);

}

float fbm( vec2 p ) {

    float value = 0.0;\r
    float amplitude = 0.5;

    for ( int i = 0; i < 5; i++ ) {\r
        value += amplitude * (\r
            snoise( p ) * 0.5 + 0.5\r
        );\r
        p *= 2.02;\r
        amplitude *= 0.52;\r
    }

    return value;

}

void main() {

    vec2 uv = gl_FragCoord.xy / uResolution;\r
    vec2 p = uv * vec2( uResolution.x / uResolution.y, 1.0 ) * 2.5;

    float n = fbm( p );

    float edgeWidth = 0.05;\r
    float haloWidth = 0.16;

    
    
    

    float covered = 1.0 - smoothstep( uProgress - edgeWidth, uProgress + edgeWidth, n );

    
    
    

    float rimCore = smoothstep( uProgress - edgeWidth, uProgress, n )\r
        - smoothstep( uProgress, uProgress + edgeWidth, n );

    
    
    

    float rimHalo = smoothstep( uProgress - haloWidth, uProgress, n )\r
        - smoothstep( uProgress, uProgress + haloWidth, n );

    float glow = rimCore * 1.1 + rimHalo * 0.9;

    vec3 color = uColor + uGlowColor * glow;

    float alpha = clamp( covered + rimCore * 0.9 + rimHalo * 0.35, 0.0, 1.0 );

    gl_FragColor = vec4( color, alpha );

}`;const T=F,U=z;class B{gl;program;canvas;uniforms;constructor(t,n){this.canvas=t;const r=t.getContext("webgl",{alpha:!0,premultipliedAlpha:!1});if(!r)throw new Error("WebGL is not supported");this.gl=r;const e=this.compileShader(r.VERTEX_SHADER,T),o=this.compileShader(r.FRAGMENT_SHADER,U);this.program=this.linkProgram(e,o);const c=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,c),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);const s=r.getAttribLocation(this.program,"aPosition");r.enableVertexAttribArray(s),r.vertexAttribPointer(s,2,r.FLOAT,!1,0,0),this.uniforms={resolution:r.getUniformLocation(this.program,"uResolution"),progress:r.getUniformLocation(this.program,"uProgress")},r.useProgram(this.program),r.uniform1f(r.getUniformLocation(this.program,"uSeed"),n),r.uniform3f(r.getUniformLocation(this.program,"uColor"),5/255,6/255,10/255),r.uniform3f(r.getUniformLocation(this.program,"uGlowColor"),168/255,85/255,247/255),r.enable(r.BLEND),r.blendFunc(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA),this.resize()}compileShader(t,n){const r=this.gl,e=r.createShader(t);if(!e)throw new Error("Failed to create shader");if(r.shaderSource(e,n),r.compileShader(e),!r.getShaderParameter(e,r.COMPILE_STATUS)){const o=r.getShaderInfoLog(e);throw r.deleteShader(e),new Error(`Shader compile error: ${o}`)}return e}linkProgram(t,n){const r=this.gl,e=r.createProgram();if(!e)throw new Error("Failed to create program");if(r.attachShader(e,t),r.attachShader(e,n),r.linkProgram(e),!r.getProgramParameter(e,r.LINK_STATUS)){const o=r.getProgramInfoLog(e);throw new Error(`Program link error: ${o}`)}return e}resize(){const t=this.gl,n=Math.min(window.devicePixelRatio,2),r=Math.floor(window.innerWidth*n),e=Math.floor(window.innerHeight*n);(this.canvas.width!==r||this.canvas.height!==e)&&(this.canvas.width=r,this.canvas.height=e),t.viewport(0,0,r,e),t.uniform2f(this.uniforms.resolution,r,e)}setProgress(t){const n=this.gl;n.useProgram(this.program),n.uniform1f(this.uniforms.progress,t),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.TRIANGLES,0,3)}dispose(){this.gl.deleteProgram(this.program),this.gl.getExtension("WEBGL_lose_context")?.loseContext()}}function v(i,t,n,r,e=o=>o){let o;const c=performance.now(),s=l=>{const u=l-c,d=Math.min(u/n,1);r(i+(t-i)*e(d)),d<1&&(o=requestAnimationFrame(s))};return o=requestAnimationFrame(s),()=>cancelAnimationFrame(o)}function x(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}const _=1400,g=900,I=y({__name:"AppLoadingScreen",setup(i,{expose:t}){t();const n=p(null),r=p(!1);let e=null,o=1,c=null,s=null;const l=a=>{o=a,e?.setProgress(a)},u=()=>{e?.resize(),e?.setProgress(o)},d=()=>{s?.(),s=v(o,0,_,l,x)},h=()=>new Promise(a=>{s?.(),s=v(o,1,g,l,x),window.setTimeout(a,g)}),m=a=>{const w=a.loader;a.loader=async()=>{await Promise.all([h(),w()])}};C(()=>{n.value&&(e=new B(n.value,Math.random()*1e3),l(1),r.value=!0,window.addEventListener("resize",u),document.addEventListener("astro:before-preparation",m),c=P(d))}),L(()=>{c?.(),s?.(),window.removeEventListener("resize",u),document.removeEventListener("astro:before-preparation",m),e?.dispose()});const f={canvasRef:n,isHydrated:r,get renderer(){return e},set renderer(a){e=a},get currentProgress(){return o},set currentProgress(a){o=a},get unsubscribeReady(){return c},set unsubscribeReady(a){c=a},get cancelAnimation(){return s},set cancelAnimation(a){s=a},REVEAL_DURATION:_,COVER_DURATION:g,setProgress:l,handleResize:u,reveal:d,cover:h,handleBeforePreparation:m};return Object.defineProperty(f,"__isScriptSetup",{enumerable:!1,value:!0}),f}}),O={ref:"canvasRef",class:"erosion-canvas"};function W(i,t,n,r,e,o){return b(),A("div",{class:E(["loading-screen",{"is-hydrated":r.isHydrated}])},[S("canvas",O,null,512)],2)}const G=R(I,[["render",W],["__scopeId","data-v-ea36c969"]]);export{G as default};
