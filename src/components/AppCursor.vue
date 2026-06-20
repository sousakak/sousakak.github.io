<script setup lang="ts">
    import { ref, onMounted, onUnmounted, computed } from 'vue';

    const targetX = ref<number>(0);
    const targetY = ref<number>(0);

    const x = ref<number>(0);
    const y = ref<number>(0);

    const isHoveringMenu = ref<boolean>(false);
    const isActivePress = ref<boolean>(false);

    const handleMouseMove = (e: MouseEvent): void => {
        targetX.value = e.clientX;
        targetY.value = e.clientY;
    };

    const animate = (): void => {
        x.value += (targetX.value - x.value) * 0.12;
        y.value += (targetY.value - y.value) * 0.12;

        requestAnimationFrame(animate);
    };

    const handleMenuHover = (e: Event): void => {
        const custom = e as CustomEvent<boolean>;
        isHoveringMenu.value = custom.detail;
    };

    const handleActiveStart = (): void => {
        isActivePress.value = true;
    };

    const handleActiveEnd = (): void => {
        isActivePress.value = false;
    };

    const cursorStyle = computed(() => {
        let scale = 1;
        let opacity = 1;

        if (isHoveringMenu.value) {
            scale = 2;
            opacity = 0.5;
        }

        if (isActivePress.value) {
            scale = 3;
            opacity = 0;
        }

        return {
            transform: `translate(${x.value}px, ${y.value}px) translate(-50%, -50%) scale(${scale})`,
            opacity
        };
    });

    onMounted(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("menu-hover", handleMenuHover);

        window.addEventListener("pointerdown", handleActiveStart);
        window.addEventListener("pointerup", handleActiveEnd);
        window.addEventListener("pointercancel", handleActiveEnd);

        requestAnimationFrame(animate);
    });

    onUnmounted(() => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("menu-hover", handleMenuHover);

        window.removeEventListener("pointerdown", handleActiveStart);
        window.removeEventListener("pointerup", handleActiveEnd);
        window.removeEventListener("pointercancel", handleActiveEnd);
    });
</script>

<template>
    <div
        class="cursor"
        :style="cursorStyle"
    />
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    .cursor {
        position: fixed;
        top: 0;
        left: 0;

        width: 20px;
        height: 20px;

        border: 1px solid map.get($colors, "cursor");
        border-radius: map.get($scale, "radius", "full");

        pointer-events: none;

        transition: opacity 0.2s ease;
    }
</style>