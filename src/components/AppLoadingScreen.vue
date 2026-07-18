<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import type { TransitionBeforePreparationEvent } from "astro:transitions/client";

    import { onReady } from "../lib/three/ReadyState";
    import { ErosionRenderer } from "../lib/transition/ErosionRenderer";
    import { BackgroundNetworkRenderer } from "../lib/transition/BackgroundNetworkRenderer";
    import { animateValue, easeInOutCubic } from "../lib/utils/tween";

    const erosionCanvasRef = ref<HTMLCanvasElement | null>( null );
    const networkCanvasRef = ref<HTMLCanvasElement | null>( null );

    const isHydrated = ref( false );
    const coverProgress = ref( 1 );

    const letters = "Loading".split( "" );
    const phase = ref<"entering" | "exiting">( "entering" );
    const cycleId = ref( 0 );

    let erosion: ErosionRenderer | null = null;
    let network: BackgroundNetworkRenderer | null = null;

    let currentCoverProgress = 1;
    let cancelCoverAnimation: ( () => void ) | null = null;

    let unsubscribeReady: ( () => void ) | null = null;
    let isReadyFlag = false;
    let loopToken = 0;

    const REVEAL_DURATION = 1400;
    const COVER_DURATION = 900;

    const LETTER_STAGGER_ENTER = 70;
    const LETTER_STAGGER_EXIT = 60;
    const LETTER_ANIMATION_DURATION = 700;

    const ENTER_TOTAL = LETTER_ANIMATION_DURATION + letters.length * LETTER_STAGGER_ENTER;
    const HOLD_DURATION = 700;
    const EXIT_TOTAL = LETTER_ANIMATION_DURATION + letters.length * LETTER_STAGGER_EXIT;

    const setCoverProgress = ( value: number ): void => {
        currentCoverProgress = value;
        coverProgress.value = value;
        erosion?.setProgress( value );
    };

    const handleResize = (): void => {
        erosion?.resize();
        erosion?.setProgress( currentCoverProgress );
        network?.resize();
    };

    const wait = ( ms: number ): Promise<void> => {
        return new Promise( ( resolve ) => window.setTimeout( resolve, ms ) );
    };

    const animateCover = ( to: number, duration: number ): Promise<void> => {
        return new Promise( ( resolve ) => {
            cancelCoverAnimation?.();
            cancelCoverAnimation = animateValue(
                currentCoverProgress,
                to,
                duration,
                setCoverProgress,
                easeInOutCubic
            );
            window.setTimeout( resolve, duration );
        } );
    };

    //----------------------------------
    // Loop the process of entering, pausing until ready.
    //----------------------------------

    const runTextLoop = async ( token: number ): Promise<void> => {

        while ( true ) {

            cycleId.value += 1;
            phase.value = "entering";

            await wait( ENTER_TOTAL );

            if ( token !== loopToken ) {
                return;
            }

            await wait( HOLD_DURATION );

            if ( token !== loopToken ) {
                return;
            }

            if ( isReadyFlag ) {
                break;
            }

            phase.value = "exiting";

            await wait( EXIT_TOTAL );

            if ( token !== loopToken ) {
                return;
            }

        }

        phase.value = "exiting";

        await wait( EXIT_TOTAL );

        if ( token !== loopToken ) {
            return;
        }

        await animateCover( 0, REVEAL_DURATION );

    };

    const beginLoadingCycle = (): void => {

        isReadyFlag = false;
        loopToken += 1;

        const token = loopToken;

        unsubscribeReady?.();
        unsubscribeReady = onReady( () => {
            isReadyFlag = true;
        } );

        void runTextLoop( token );

    };

    const handleBeforePreparation = (
        event: TransitionBeforePreparationEvent
    ): void => {

        const originalLoader = event.loader;

        event.loader = async () => {

            beginLoadingCycle();

            await Promise.all([
                animateCover( 1, COVER_DURATION ),
                originalLoader()
            ]);

        };

    };

    onMounted( () => {

        if ( !erosionCanvasRef.value || !networkCanvasRef.value ) {
            return;
        }

        erosion = new ErosionRenderer(
            erosionCanvasRef.value,
            Math.random() * 1000
        );

        network = new BackgroundNetworkRenderer(
            networkCanvasRef.value
        );

        setCoverProgress( 1 );

        isHydrated.value = true;

        window.addEventListener( "resize", handleResize );

        document.addEventListener(
            "astro:before-preparation",
            handleBeforePreparation
        );

        beginLoadingCycle();

    } );

    onBeforeUnmount( () => {
        unsubscribeReady?.();
        cancelCoverAnimation?.();
        window.removeEventListener( "resize", handleResize );
        document.removeEventListener(
            "astro:before-preparation",
            handleBeforePreparation
        );
        erosion?.dispose();
        network?.dispose();
    } );
</script>

<template>
    <div
        class="loading-screen"
        :class="{ 'is-hydrated': isHydrated }"
    >
        <canvas
            ref="erosionCanvasRef"
            class="erosion-canvas"
        />

        <canvas
            ref="networkCanvasRef"
            class="network-canvas"
            :style="{ opacity: coverProgress }"
        />

        <div
            :key="cycleId"
            class="loading-text"
            :class="phase"
            :style="{ opacity: coverProgress }"
        >
            <span
                v-for="( letter, index ) in letters"
                :key="index"
                class="letter"
                :style="{ '--i': index }"
            >{{ letter }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    .loading-screen {
        position: fixed;
        inset: 0;
        z-index: 100;

        background: map.get($colors, "bg");

        pointer-events: none;

        &.is-hydrated {
            background: transparent;
        }
    }

    .erosion-canvas,
    .network-canvas {
        position: absolute;
        inset: 0;

        width: 100%;
        height: 100%;
    }

    .loading-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: flex;
        perspective: 600px;

        font-size: map.get($typography, "size", "xl");
        letter-spacing: map.get($typography, "letter-spacing", "wide");
        color: map.get($colors, "text");
    }

    .letter {
        display: inline-block;
        transform-style: preserve-3d;

        opacity: 0;
        filter: brightness(0.3);
        transform: rotateY(100deg) translateX(-16px);

        text-shadow: 0 0 12px rgba(168, 85, 247, 0.7);
    }

    .loading-text.entering .letter {
        animation: letter-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: calc(var(--i) * 70ms);
    }

    .loading-text.exiting .letter {
        animation: letter-exit 0.7s cubic-bezier(0.55, 0, 0.85, 0.35) forwards;
        animation-delay: calc(var(--i) * 60ms);
    }

    @keyframes letter-enter {
        0% {
            opacity: 0;
            filter: brightness(0.2);
            transform: rotateY(100deg) translateX(-16px);
        }

        55% {
            opacity: 1;
            filter: brightness(1.8);
        }

        100% {
            opacity: 1;
            filter: brightness(1);
            transform: rotateY(0deg) translateX(0);
        }
    }

    @keyframes letter-exit {
        0% {
            opacity: 1;
            filter: brightness(1);
            transform: rotateY(0deg) translateX(0);
        }

        45% {
            filter: brightness(1.8);
        }

        100% {
            opacity: 0;
            filter: brightness(0.2);
            transform: rotateY(-100deg) translateX(16px);
        }
    }
</style>