<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue";

    import { onReady } from "../lib/three/ReadyState";
    import { ErosionRenderer } from "../lib/transition/ErosionRenderer";
    import { animateValue, easeInOutCubic } from "../lib/utils/tween";

    const canvasRef = ref<HTMLCanvasElement | null>( null );
    const isRemoved = ref( false );

    let renderer: ErosionRenderer | null = null;
    let currentProgress = 1;

    let unsubscribeReady: ( () => void ) | null = null;
    let cancelAnimation: ( () => void ) | null = null;

    const setProgress = ( progress: number ): void => {
        currentProgress = progress;
        renderer?.setProgress( progress );
    };

    const handleResize = (): void => {
        renderer?.resize();
        renderer?.setProgress( currentProgress );
    };

    const reveal = (): void => {

        cancelAnimation?.();

        cancelAnimation = animateValue(
            1,
            0,
            1400,
            setProgress,
            easeInOutCubic
        );

        window.setTimeout( () => {
            isRemoved.value = true;
        }, 1500 );

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

        window.addEventListener( "resize", handleResize );

        unsubscribeReady = onReady( reveal );

    } );

    onBeforeUnmount( () => {
        unsubscribeReady?.();
        cancelAnimation?.();
        window.removeEventListener( "resize", handleResize );
        renderer?.dispose();
    } );
</script>

<template>
    <div
        v-if="!isRemoved"
        class="loading-screen"
    >
        <canvas
            ref="canvasRef"
            class="erosion-canvas"
        />

        <!-- Contents displayed during the loading screen visible -->
    </div>
</template>

<style scoped lang="scss">
    .loading-screen {
        position: fixed;
        inset: 0;
        z-index: 100;

        pointer-events: none;
    }

    .erosion-canvas {
        position: absolute;
        inset: 0;

        width: 100%;
        height: 100%;
    }
</style>