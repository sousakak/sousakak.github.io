<script setup lang="ts">
    import { ref, onMounted, onUnmounted, computed } from 'vue';

    const targetX = ref<number>(0);
    const targetY = ref<number>(0);

    const x = ref<number>(0);
    const y = ref<number>(0);

    const isHoveringMenu = ref<boolean>(false);
    const isActivePress = ref<boolean>(false);

    const pressProgress = ref<number>(0);

    let animationFrameId: number | null = null;

    const handleMouseMove = (e: MouseEvent): void => {
        targetX.value = e.clientX;
        targetY.value = e.clientY;
    };

    const animate = (): void => {
        x.value += (targetX.value - x.value) * 0.12;
        y.value += (targetY.value - y.value) * 0.12;

        const targetPress = isActivePress.value ? 1 : 0;
        pressProgress.value += (targetPress - pressProgress.value) * 0.22;

        animationFrameId = window.requestAnimationFrame(animate);
    };

    const handleMenuHover = (e: Event): void => {
        const custom = e as CustomEvent<boolean>;
        isHoveringMenu.value = custom.detail;
    };

    const handleMenuPressStart = (): void => {
        isActivePress.value = true;
    };

    const handleMenuPressEnd = (): void => {
        isActivePress.value = false;
    };

    const cursorStyle = computed(() => {
        const hoverScale = isHoveringMenu.value ? 2 : 1;
        const scale = hoverScale + pressProgress.value;
        const opacity = 1 - pressProgress.value;

        return {
            transform: `translate(${x.value}px, ${y.value}px) translate(-50%, -50%) scale(${scale})`,
            opacity
        };
    });

    onMounted(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("menu-hover", handleMenuHover);
        window.addEventListener("menu-press-start", handleMenuPressStart);
        window.addEventListener("menu-press-end", handleMenuPressEnd);

        animationFrameId = window.requestAnimationFrame(animate);
    });

    onUnmounted(() => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("menu-hover", handleMenuHover);
        window.removeEventListener("menu-press-start", handleMenuPressStart);
        window.removeEventListener("menu-press-end", handleMenuPressEnd);

        if (animationFrameId !== null) {
            window.cancelAnimationFrame(animationFrameId);
        }
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
    }
</style>