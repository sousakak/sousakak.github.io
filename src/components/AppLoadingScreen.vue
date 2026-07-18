<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import type { TransitionBeforePreparationEvent } from "astro:transitions/client";

    import { onReady } from "../lib/three/ReadyState";
    import { ErosionRenderer } from "../lib/transition/ErosionRenderer";
    import { animateValue, easeInOutCubic } from "../lib/utils/tween";

    const canvasRef = ref<HTMLCanvasElement | null>( null );
    const isHydrated = ref( false );

    let renderer: ErosionRenderer | null = null;
    let currentProgress = 1;

    let unsubscribeReady: ( () => void ) | null = null;
    let cancelAnimation: ( () => void ) | null = null;

    const REVEAL_DURATION = 1400;
    const COVER_DURATION = 900;

    const setProgress = ( progress: number ): void => {
        currentProgress = progress;
        renderer?.setProgress( progress );
    };

    const handleResize = (): void => {
        renderer?.resize();
        renderer?.setProgress( currentProgress );
    };

    //----------------------------------
    // Transition from loading screen to page content (progress: 1 → 0)
    //----------------------------------

    const reveal = (): void => {

        cancelAnimation?.();

        cancelAnimation = animateValue(
            currentProgress,
            0,
            REVEAL_DURATION,
            setProgress,
            easeInOutCubic
        );

    };

    //----------------------------------
    // Transition from page content to loading screen (progress: 0 → 1)
    //----------------------------------

    const cover = (): Promise<void> => {

        return new Promise( ( resolve ) => {

            cancelAnimation?.();

            cancelAnimation = animateValue(
                currentProgress,
                1,
                COVER_DURATION,
                setProgress,
                easeInOutCubic
            );

            window.setTimeout( resolve, COVER_DURATION );

        } );

    };

    //----------------------------------
    // Detect the click on link to start navigation
    //----------------------------------

    const handleBeforePreparation = (
        event: TransitionBeforePreparationEvent
    ): void => {

        const originalLoader = event.loader;

        event.loader = async () => {

            //----------------------------------
            // Run the fade-in animation in parallel with the actual page load
            // (Wait for the swap until whichever one takes longer is finished)
            //----------------------------------

            await Promise.all([
                cover(),
                originalLoader()
            ]);

        };

    };

    onMounted( () => {

        if ( !canvasRef.value ) {
            return;
        }

        renderer = new ErosionRenderer(
            canvasRef.value,
            Math.random() * 1000
        );

        setProgress( 1 );

        isHydrated.value = true;

        window.addEventListener( "resize", handleResize );

        document.addEventListener(
            "astro:before-preparation",
            handleBeforePreparation
        );

        unsubscribeReady = onReady( reveal );

    });

    onBeforeUnmount( () => {
        unsubscribeReady?.();
        cancelAnimation?.();
        window.removeEventListener( "resize", handleResize );
        document.removeEventListener(
            "astro:before-preparation",
            handleBeforePreparation
        );
        renderer?.dispose();
    } );
</script>

<template>
    <div
        class="loading-screen"
        :class="{ 'is-hydrated': isHydrated }"
    >
        <canvas
            ref="canvasRef"
            class="erosion-canvas"
        />
    </div>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    .loading-screen {
        position: fixed;
        inset: 0;
        z-index: map.get($z-index, "loading");

        background: map.get($colors, "bg");

        pointer-events: none;

        &.is-hydrated {
            background: transparent;
        }
    }

    .erosion-canvas {
        position: absolute;
        inset: 0;

        width: 100%;
        height: 100%;
    }
</style>