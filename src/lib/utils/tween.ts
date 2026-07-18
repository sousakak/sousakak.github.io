export function animateValue(
    from: number,
    to: number,
    duration: number,
    onUpdate: ( value: number ) => void,
    easing: ( t: number ) => number = ( t ) => t
): () => void {

    let frameId: number;
    const start = performance.now();

    const step = ( now: number ): void => {

        const elapsed = now - start;
        const t = Math.min( elapsed / duration, 1 );

        onUpdate(
            from + ( to - from ) * easing( t )
        );

        if ( t < 1 ) {
            frameId = requestAnimationFrame( step );
        }

    };

    frameId = requestAnimationFrame( step );

    return () => cancelAnimationFrame( frameId );

}

export function easeInOutCubic( t: number ): number {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow( -2 * t + 2, 3 ) / 2;
}