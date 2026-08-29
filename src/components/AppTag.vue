<script setup lang="ts">
</script>

<template>
    <span class="tag">
        <slot />
    </span>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    .tag {
        display: inline-flex;
        align-items: center;

        padding: 2px map.get($scale, "space", "md");
        border-radius: map.get($scale, "radius", "full");
        border: 1px solid rgba(map.get($colors, "accent"), 0.4);

        background: rgba(map.get($colors, "accent"), 0.12);

        font-size: map.get($typography, "size", "sm");
        line-height: 1.6;
        color: map.get($colors, "accent");
        white-space: nowrap;
    }
</style>