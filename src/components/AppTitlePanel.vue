<script setup lang="ts">
    defineProps<{
        eyebrow?: string;
        title: string;
    }>();
</script>

<template>
    <section class="title-panel">
        <p
            v-if="eyebrow"
            class="eyebrow"
        >
            {{ eyebrow }}
        </p>

        <h2 class="title">
            {{ title }}
        </h2>

        <div
            v-if="$slots.default"
            class="body"
        >
            <slot />
        </div>
    </section>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    .title-panel {
        width: 100%;
        height: 100vh;
        flex-shrink: 0;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: map.get($scale, "space", "md");

        padding: 0 map.get($scale, "space", "xl");
        text-align: center;
    }

    .eyebrow {
        font-size: map.get($typography, "size", "sm");
        letter-spacing: map.get($typography, "letter-spacing", "wide");
        color: map.get($colors, "accent");
    }

    .title {
        font-size: map.get($typography, "size", "xl");
        color: map.get($colors, "text");
        font-weight: 400;
    }

    .body {
        max-width: 32em;
        font-size: map.get($typography, "size", "md");
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.65);
    }
</style>