<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from "vue";

    import Scene from "../lib/three/Scene";

    const canvas = ref<HTMLCanvasElement | null>(null);

    let scene: Scene | null = null;

    onMounted(() => {
        if (!canvas.value) {
            return;
        }

        scene = new Scene(canvas.value);
        scene.start();
    });

    onUnmounted(() => {
        scene?.dispose();
    });
</script>

<template>
    <canvas
        ref="canvas"
        class="background-canvas"
    />
</template>

<style scoped lang="scss">
    .background-canvas {
        position: fixed;
        inset: 0;

        width: 100%;
        height: 100%;

        pointer-events: none;
        z-index: -1;
    }
</style>