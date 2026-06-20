<script setup lang="ts">
    const emitHover = (state: boolean) => {
        window.dispatchEvent(
            new CustomEvent("menu-hover", {
                detail: state
            })
        );
    };

    const handleClick = (): void => {
        window.dispatchEvent(
            new CustomEvent("menu-click")
        );
    };
</script>

<template>
    <nav class="menu">
        <a
            href="/"
            class="menu-item"
            @mouseenter="emitHover(true)"
            @mouseleave="emitHover(false)"
            @click="handleClick"
        >
            home
        </a>

        <a
            href="/about"
            class="menu-item"
            @mouseenter="emitHover(true)"
            @mouseleave="emitHover(false)"
            @click="handleClick"
        >
            about
        </a>

        <a
            href="/projects"
            class="menu-item"
            @mouseenter="emitHover(true)"
            @mouseleave="emitHover(false)"
            @click="handleClick"
        >
            projects
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