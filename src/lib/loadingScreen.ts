import type {
    TransitionBeforePreparationEvent,
    TransitionBeforeSwapEvent
} from "astro:transitions/client";

import { onReady } from "./three/ReadyState";
import { animateValue, easeInOutCubic } from "./utils/tween";

const BLUR_AMOUNT = 12;
const EDGE_SOFTNESS = 140;
const REVEAL_DURATION = 900;
const COVER_DURATION = 700;

let currentProgress = 1;
let maxRadius = 1000;

let cancelAnimation: ( () => void ) | null = null;
let unsubscribeReady: ( () => void ) | null = null;

const getElement = (): HTMLElement | null => {
    return document.querySelector<HTMLElement>( "[data-loading-screen]" );
};

const updateMaxRadius = (): void => {
    maxRadius = Math.sqrt(
        window.innerWidth ** 2 + window.innerHeight ** 2
    ) / 2;
};

const buildGradient = ( progress: number ): string => {

    const sharpRadius = ( 1 - progress ) * maxRadius;
    const softness = EDGE_SOFTNESS * ( 1 - progress );

    return `radial-gradient(circle at center, transparent 0px, transparent ${ sharpRadius }px, black ${ sharpRadius + softness }px, black 100%)`;

};

const applyStyle = (
    element: HTMLElement,
    progress: number
): void => {

    const gradient = buildGradient( progress );

    element.style.setProperty( "mask-image", gradient );
    element.style.setProperty( "-webkit-mask-image", gradient );
    element.style.setProperty( "backdrop-filter", `blur(${ BLUR_AMOUNT }px)` );
    element.style.setProperty( "-webkit-backdrop-filter", `blur(${ BLUR_AMOUNT }px)` );

};

const setProgress = ( value: number ): void => {

    const clamped = Math.min( Math.max( value, 0 ), 1 );

    currentProgress = clamped;

    const element = getElement();

    if ( !element ) return;

    void console.log( 'progress: ' + currentProgress );

    applyStyle( element, clamped );

};

const animateProgress = ( to: number, duration: number ): Promise<void> => {
    return new Promise( ( resolve ) => {
        cancelAnimation?.();
        cancelAnimation = animateValue(
            currentProgress,
            to,
            duration,
            setProgress,
            easeInOutCubic
        );
        window.setTimeout( resolve, duration );
    });
};

const reveal = (): void => {
    void animateProgress( 0, REVEAL_DURATION );
};

const handlePageLoad = (): void => {

    console.log( 'page-load: ' + currentProgress );

    updateMaxRadius();

    const element = getElement();

    if ( element ) {
        applyStyle( element, currentProgress );
    }

    unsubscribeReady?.();
    unsubscribeReady = onReady( reveal );

};

const handleBeforePreparation = (
    event: TransitionBeforePreparationEvent
): void => {

    console.log( 'before-preparation: ' + currentProgress );

    const originalLoader = event.loader;

    event.loader = async () => {
        await Promise.all([
            animateProgress( 1, COVER_DURATION ),
            originalLoader()
        ]);
    };

};

const handleBeforeSwap = (
    event: TransitionBeforeSwapEvent
): void => {

    console.log( 'before-swap: ' + currentProgress );

    const incoming = event.newDocument.querySelector<HTMLElement>(
        "[data-loading-screen]"
    );

    if ( incoming ) {
        applyStyle( incoming, currentProgress );
    }

};

const handleResize = (): void => {
    updateMaxRadius();
    setProgress( currentProgress );
};

updateMaxRadius();
setProgress( currentProgress );

window.addEventListener( "resize", handleResize );
document.addEventListener( "astro:before-preparation", handleBeforePreparation );
document.addEventListener( "astro:before-swap", handleBeforeSwap );
document.addEventListener( "astro:page-load", handlePageLoad );