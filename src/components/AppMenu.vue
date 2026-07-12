<script setup lang="ts">
    interface MenuItem {
        label: string;
        href: string;
    }

    defineProps<{
        items: MenuItem[];
    }>();

    const emitHover = (state: boolean): void => {
        window.dispatchEvent(
            new CustomEvent("menu-hover", {
                detail: state
            })
        );
    };

    const emitPressStart = (): void => {
        window.dispatchEvent(
            new CustomEvent("menu-press-start")
        );
    };

    const emitPressEnd = (): void => {
        window.dispatchEvent(
            new CustomEvent("menu-press-end")
        );
    };
</script>

<template>
    <nav class="menu">
        <a
            v-for="item in items"
            :key="item.href"
            :href="item.href"
            class="menu-item"
            @mouseenter="emitHover(true)"
            @mouseleave="emitHover(false)"
            @pointerdown="emitPressStart"
            @pointerup="emitPressEnd"
            @pointerleave="emitPressEnd"
            @pointercancel="emitPressEnd"
        >
            {{ item.label }}
        </a>
    </nav>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    .menu {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10;

        display: flex;
        gap: 24px;
        align-items: center;
    }

    .menu-item {
        color: map.get($colors, "text");
        text-decoration: none;
        font-size: 14px;
        letter-spacing: 0.05em;

        transition: color 0.2s ease, transform 0.2s ease;

        &::after {
            content: "";
            display: block;
            height: 1px;
            background: map.get($colors, "accent");
            transform: scaleX(0);
            transition: transform 0.2s ease;
        }

        &:hover {
            color: map.get($colors, "accent");
            transform: translateY(-2px);

            &::after {
                transform: scaleX(1);
            }
        }
    }
</style>