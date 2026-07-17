import{o as w}from"./ReadyState.D071cy0b.js";import{_ as A}from"./_plugin-vue_export-helper.DlAUqK2U.js";import{r as S,y as E,z as b,p as L,s as C,A as x,u as p,v as F}from"./runtime-core.esm-bundler.jFTBUuae.js";var y=`attribute vec2 aPosition;

void main() {\r
    gl_Position = vec4( aPosition, 0.0, 1.0 );\r
}`,T=`precision highp float;

uniform vec2 uResolution;\r
uniform float uProgress;\r
uniform float uSeed;\r
uniform vec3 uColor;\r
uniform vec3 uGlowColor;

float hash( vec2 p ) {\r
    return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) + uSeed ) * 43758.5453123 );\r
}

float noise( vec2 p ) {

    vec2 i = floor( p );\r
    vec2 f = fract( p );

    float a = hash( i );\r
    float b = hash( i + vec2( 1.0, 0.0 ) );\r
    float c = hash( i + vec2( 0.0, 1.0 ) );\r
    float d = hash( i + vec2( 1.0, 1.0 ) );

    vec2 u = f * f * ( 3.0 - 2.0 * f );

    return mix( a, b, u.x ) + ( c - a ) * u.y * ( 1.0 - u.x ) + ( d - b ) * u.x * u.y;

}

float fbm( vec2 p ) {

    float value = 0.0;\r
    float amplitude = 0.5;

    for ( int i = 0; i < 5; i++ ) {\r
        value += amplitude * noise( p );\r
        p *= 2.0;\r
        amplitude *= 0.5;\r
    }

    return value;

}

void main() {

    vec2 uv = gl_FragCoord.xy / uResolution;\r
    vec2 p = uv * vec2( uResolution.x / uResolution.y, 1.0 ) * 6.0;

    float n = fbm( p );

    float edgeWidth = 0.05;

    
    
    

    float covered = 1.0 - smoothstep( uProgress - edgeWidth, uProgress + edgeWidth, n );

    
    
    

    float rim = smoothstep( uProgress - edgeWidth, uProgress, n )\r
        - smoothstep( uProgress, uProgress + edgeWidth, n );

    vec3 color = uColor + uGlowColor * rim * 1.5;

    gl_FragColor = vec4( color, covered );

}`;const U=y,B=T;class I{gl;program;canvas;uniforms;constructor(t,o){this.canvas=t;const e=t.getContext("webgl",{alpha:!0,premultipliedAlpha:!1});if(!e)throw new Error("WebGL is not supported");this.gl=e;const r=this.compileShader(e.VERTEX_SHADER,U),n=this.compileShader(e.FRAGMENT_SHADER,B);this.program=this.linkProgram(r,n);const c=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,c),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const s=e.getAttribLocation(this.program,"aPosition");e.enableVertexAttribArray(s),e.vertexAttribPointer(s,2,e.FLOAT,!1,0,0),this.uniforms={resolution:e.getUniformLocation(this.program,"uResolution"),progress:e.getUniformLocation(this.program,"uProgress")},e.useProgram(this.program),e.uniform1f(e.getUniformLocation(this.program,"uSeed"),o),e.uniform3f(e.getUniformLocation(this.program,"uColor"),5/255,6/255,10/255),e.uniform3f(e.getUniformLocation(this.program,"uGlowColor"),168/255,85/255,247/255),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),this.resize()}compileShader(t,o){const e=this.gl,r=e.createShader(t);if(!r)throw new Error("Failed to create shader");if(e.shaderSource(r,o),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){const n=e.getShaderInfoLog(r);throw e.deleteShader(r),new Error(`Shader compile error: ${n}`)}return r}linkProgram(t,o){const e=this.gl,r=e.createProgram();if(!r)throw new Error("Failed to create program");if(e.attachShader(r,t),e.attachShader(r,o),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS)){const n=e.getProgramInfoLog(r);throw new Error(`Program link error: ${n}`)}return r}resize(){const t=this.gl,o=Math.min(window.devicePixelRatio,2),e=Math.floor(window.innerWidth*o),r=Math.floor(window.innerHeight*o);(this.canvas.width!==e||this.canvas.height!==r)&&(this.canvas.width=e,this.canvas.height=r),t.viewport(0,0,e,r),t.uniform2f(this.uniforms.resolution,e,r)}setProgress(t){const o=this.gl;o.useProgram(this.program),o.uniform1f(this.uniforms.progress,t),o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT),o.drawArrays(o.TRIANGLES,0,3)}dispose(){this.gl.deleteProgram(this.program),this.gl.getExtension("WEBGL_lose_context")?.loseContext()}}function v(i,t,o,e,r=n=>n){let n;const c=performance.now(),s=l=>{const u=l-c,d=Math.min(u/o,1);e(i+(t-i)*r(d)),d<1&&(n=requestAnimationFrame(s))};return n=requestAnimationFrame(s),()=>cancelAnimationFrame(n)}function _(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}const P=1400,m=900,O=L({__name:"AppLoadingScreen",setup(i,{expose:t}){t();const o=p(null),e=p(!1);let r=null,n=1,c=null,s=null;const l=a=>{n=a,r?.setProgress(a)},u=()=>{r?.resize(),r?.setProgress(n)},d=()=>{s?.(),s=v(n,0,P,l,_)},h=()=>new Promise(a=>{s?.(),s=v(n,1,m,l,_),window.setTimeout(a,m)}),f=a=>{const R=a.loader;a.loader=async()=>{await Promise.all([h(),R()])}};C(()=>{o.value&&(r=new I(o.value,Math.random()*1e3),l(1),e.value=!0,window.addEventListener("resize",u),document.addEventListener("astro:before-preparation",f),c=w(d))}),x(()=>{c?.(),s?.(),window.removeEventListener("resize",u),document.removeEventListener("astro:before-preparation",f),r?.dispose()});const g={canvasRef:o,isHydrated:e,get renderer(){return r},set renderer(a){r=a},get currentProgress(){return n},set currentProgress(a){n=a},get unsubscribeReady(){return c},set unsubscribeReady(a){c=a},get cancelAnimation(){return s},set cancelAnimation(a){s=a},REVEAL_DURATION:P,COVER_DURATION:m,setProgress:l,handleResize:u,reveal:d,cover:h,handleBeforePreparation:f};return Object.defineProperty(g,"__isScriptSetup",{enumerable:!1,value:!0}),g}}),M={ref:"canvasRef",class:"erosion-canvas"};function N(i,t,o,e,r,n){return F(),S("div",{class:b(["loading-screen",{"is-hydrated":e.isHydrated}])},[E("canvas",M,null,512)],2)}const D=A(O,[["render",N],["__scopeId","data-v-ea36c969"]]);export{D as default};
