import vertexShader from "./erosion.vert";
import fragmentShader from "./erosion.frag";

const VERTEX_SOURCE = vertexShader;

const FRAGMENT_SOURCE = fragmentShader;

export class ErosionRenderer {

    private readonly gl: WebGLRenderingContext;
    private readonly program: WebGLProgram;
    private readonly canvas: HTMLCanvasElement;

    private readonly uniforms: {
        resolution: WebGLUniformLocation | null;
        progress: WebGLUniformLocation | null;
    };

    public constructor(
        canvas: HTMLCanvasElement,
        seed: number
    ) {

        this.canvas = canvas;

        const gl = canvas.getContext( "webgl", {
            alpha: true,
            premultipliedAlpha: false
        } );

        if ( !gl ) {
            throw new Error( "WebGL is not supported" );
        }

        this.gl = gl;

        const vertexShader = this.compileShader( gl.VERTEX_SHADER, VERTEX_SOURCE );
        const fragmentShader = this.compileShader( gl.FRAGMENT_SHADER, FRAGMENT_SOURCE );

        this.program = this.linkProgram( vertexShader, fragmentShader );

        //----------------------------------
        // Triangle that covers whole screen （a hack to draw a full-screen quad）
        //----------------------------------

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                 3, -1,
                -1,  3
            ]),
            gl.STATIC_DRAW
        );

        const positionLocation = gl.getAttribLocation( this.program, "aPosition" );
        gl.enableVertexAttribArray( positionLocation );
        gl.vertexAttribPointer( positionLocation, 2, gl.FLOAT, false, 0, 0 );

        this.uniforms = {
            resolution: gl.getUniformLocation( this.program, "uResolution" ),
            progress: gl.getUniformLocation( this.program, "uProgress" )
        };

        gl.useProgram( this.program );

        gl.uniform1f(
            gl.getUniformLocation( this.program, "uSeed" ),
            seed
        );

        gl.uniform3f(
            gl.getUniformLocation( this.program, "uColor" ),
            5 / 255, 6 / 255, 10 / 255 // $colors.bg
        );

        gl.uniform3f(
            gl.getUniformLocation( this.program, "uGlowColor" ),
            168 / 255, 85 / 255, 247 / 255 // $colors.accent
        );

        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

        this.resize();

    }

    private compileShader(
        type: number,
        source: string
    ): WebGLShader {

        const gl = this.gl;
        const shader = gl.createShader( type );

        if ( !shader ) {
            throw new Error( "Failed to create shader" );
        }

        gl.shaderSource( shader, source );
        gl.compileShader( shader );

        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
            const info = gl.getShaderInfoLog( shader );
            gl.deleteShader( shader );
            throw new Error( `Shader compile error: ${ info }` );
        }

        return shader;

    }

    private linkProgram(
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader
    ): WebGLProgram {

        const gl = this.gl;
        const program = gl.createProgram();

        if ( !program ) {
            throw new Error( "Failed to create program" );
        }

        gl.attachShader( program, vertexShader );
        gl.attachShader( program, fragmentShader );
        gl.linkProgram( program );

        if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
            const info = gl.getProgramInfoLog( program );
            throw new Error( `Program link error: ${ info }` );
        }

        return program;

    }

    public resize(): void {

        const gl = this.gl;
        const dpr = Math.min( window.devicePixelRatio, 2 );

        const width = Math.floor( window.innerWidth * dpr );
        const height = Math.floor( window.innerHeight * dpr );

        if ( this.canvas.width !== width || this.canvas.height !== height ) {
            this.canvas.width = width;
            this.canvas.height = height;
        }

        gl.viewport( 0, 0, width, height );
        gl.uniform2f( this.uniforms.resolution, width, height );

    }

    public setProgress( progress: number ): void {

        const gl = this.gl;

        gl.useProgram( this.program );
        gl.uniform1f( this.uniforms.progress, progress );

        gl.clearColor( 0, 0, 0, 0 );
        gl.clear( gl.COLOR_BUFFER_BIT );

        gl.drawArrays( gl.TRIANGLES, 0, 3 );

    }

    public dispose(): void {

        this.gl.deleteProgram( this.program );

        // Explicitly release the context (preventing the WebGL context
        // from persisting through multiple page transitions)
        this.gl.getExtension( "WEBGL_lose_context" )?.loseContext();

    }

}