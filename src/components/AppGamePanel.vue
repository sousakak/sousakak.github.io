<script setup lang="ts">
    import AppTag from "./AppTag.vue";

    defineProps<{
        tags?: string[];
        title?: string;
    }>();
</script>

<template>
    <section class="game-panel">
        <div
            v-if="title || tags?.length || $slots.controls"
            class="game-panel-header"
        >
            <div
                v-if="title || tags?.length"
                class="game-panel-heading"
            >
                <div
                    v-if="tags?.length"
                    class="tags"
                >
                    <AppTag
                        v-for="tag in tags"
                        :key="tag"
                    >
                        {{ tag }}
                    </AppTag>
                </div>

                <h2
                    v-if="title"
                    class="title"
                >
                    {{ title }}
                </h2>
            </div>

            <div
                v-if="$slots.controls"
                class="controls"
            >
                <slot name="controls" />
            </div>
        </div>

        <div class="game-panel-body">
            <slot />
        </div>
    </section>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    .game-panel {
        width: 100%;
        height: 100vh;
        flex-shrink: 0;

        display: flex;
        flex-direction: column;

        padding: map.get($scale, "space", "xl");
    }

    .game-panel-header {
        flex-shrink: 0;

        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: map.get($scale, "space", "lg");
        flex-wrap: wrap;

        margin-right: map.get($scale, "space", "xl"); // Prevent overlap with Indicator
        margin-bottom: map.get($scale, "space", "lg");
    }

    .game-panel-heading {
        display: flex;
        flex-direction: column;
        gap: map.get($scale, "space", "sm");
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: map.get($scale, "space", "sm");
    }

    .title {
        font-size: map.get($typography, "size", "lg");
        color: map.get($colors, "text");
        font-weight: 400;
    }

    .controls {
        flex-shrink: 0;

        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: map.get($scale, "space", "sm");
    }

    .game-panel-body {
        flex: 1;
        min-height: 0; // required for overflow to work normally on the children of flex

        display: flex;
        align-items: center;
        justify-content: center;

        margin-right: map.get($scale, "space", "xl"); // Prevent overlap with Indicator

        // In the main area for games, width: 100%; height: 100%; can widen the game area
        // within the entire area inside panel. If not specified, the content will be aligned to center
    }
</style>