interface NetworkPoint {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export class BackgroundNetworkRenderer {

    private readonly ctx: CanvasRenderingContext2D;
    private readonly canvas: HTMLCanvasElement;
    private readonly points: NetworkPoint[] = [];

    private readonly pointCount = 70;
    private readonly linkDistance = 130;

    private width = 0;
    private height = 0;

    private animationFrameId: number | null = null;
    private readonly startTime = performance.now();

    public constructor( canvas: HTMLCanvasElement ) {

        this.canvas = canvas;

        const ctx = canvas.getContext( "2d" );

        if ( !ctx ) {
            throw new Error( "2D canvas context is not supported" );
        }

        this.ctx = ctx;

        this.resize();
        this.seedPoints();
        this.startLoop();

    }

    private seedPoints(): void {

        this.points.length = 0;

        for ( let i = 0; i < this.pointCount; i += 1 ) {
            this.points.push( {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: ( Math.random() - 0.5 ) * 0.15,
                vy: ( Math.random() - 0.5 ) * 0.15
            } );
        }

    }

    public resize(): void {

        const dpr = Math.min( window.devicePixelRatio, 2 );

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = Math.floor( this.width * dpr );
        this.canvas.height = Math.floor( this.height * dpr );

        this.ctx.setTransform( dpr, 0, 0, dpr, 0, 0 );

        this.seedPoints();

    }

    private updatePoints(): void {

        for ( const point of this.points ) {

            point.x += point.vx;
            point.y += point.vy;

            if ( point.x < 0 || point.x > this.width ) {
                point.vx *= -1;
            }

            if ( point.y < 0 || point.y > this.height ) {
                point.vy *= -1;
            }

        }

    }

    private drawNetwork(): void {

        const ctx = this.ctx;

        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";

        for ( const point of this.points ) {
            ctx.beginPath();
            ctx.arc( point.x, point.y, 1.2, 0, Math.PI * 2 );
            ctx.fill();
        }

        for ( let i = 0; i < this.points.length; i += 1 ) {
            for ( let j = i + 1; j < this.points.length; j += 1 ) {

                const a = this.points[ i ];
                const b = this.points[ j ];

                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt( dx * dx + dy * dy );

                if ( distance > this.linkDistance ) {
                    continue;
                }

                const alpha = ( 1 - distance / this.linkDistance ) * 0.22;

                ctx.strokeStyle = `rgba(168, 85, 247, ${ alpha })`;
                ctx.lineWidth = 0.6;

                ctx.beginPath();
                ctx.moveTo( a.x, a.y );
                ctx.lineTo( b.x, b.y );
                ctx.stroke();

            }
        }

    }

    //----------------------------------
    // Two lines twisting as they flow to the right around the characters
    //----------------------------------

    private drawTwistingLines( time: number ): void {

        const ctx = this.ctx;

        const centerY = this.height / 2;
        const amplitude = 14;
        const wavelength = 90;
        const speed = 60;
        const segments = 90;

        for ( const offset of [ 0, Math.PI ] ) {

            ctx.beginPath();

            for ( let s = 0; s <= segments; s += 1 ) {

                const x = ( s / segments ) * this.width;
                const phase = ( x / wavelength ) - ( time * speed / wavelength ) + offset;
                const y = centerY + Math.sin( phase ) * amplitude;

                if ( s === 0 ) {
                    ctx.moveTo( x, y );
                }
                else {
                    ctx.lineTo( x, y );
                }

            }

            ctx.strokeStyle = "rgba(168, 85, 247, 0.55)";
            ctx.lineWidth = 1.2;
            ctx.shadowColor = "rgba(168, 85, 247, 0.9)";
            ctx.shadowBlur = 6;
            ctx.stroke();

        }

        ctx.shadowBlur = 0;

    }

    private startLoop(): void {

        const render = (): void => {

            const time = ( performance.now() - this.startTime ) / 1000;

            this.ctx.clearRect( 0, 0, this.width, this.height );

            this.updatePoints();
            this.drawNetwork();
            this.drawTwistingLines( time );

            this.animationFrameId = requestAnimationFrame( render );

        };

        this.animationFrameId = requestAnimationFrame( render );

    }

    public dispose(): void {

        if ( this.animationFrameId !== null ) {
            cancelAnimationFrame( this.animationFrameId );
        }

    }

}