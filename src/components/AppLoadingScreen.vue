<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue";

    import { onReady } from "../lib/three/ReadyState";

    const isReady = ref( false );
    const isRemoved = ref( false );

    let unsubscribe: ( () => void ) | null = null;

    const handleReady = (): void => {

        isReady.value = true;

        window.setTimeout( () => {
            isRemoved.value = true;
        }, 1200 );

    };

    onMounted( () => {
        unsubscribe = onReady( handleReady );
    } );

    onBeforeUnmount( () => {
        unsubscribe?.();
    } );
</script>

<template>
    <div
        v-if="!isRemoved"
        class="loading-screen"
        :class="{ 'is-ready': isReady }"
    >
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
    }
</style>