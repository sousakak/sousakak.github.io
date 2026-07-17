<script setup lang="ts">
    defineProps<{
        title?: string;
    }>();
</script>

<template>
    <section class="content-panel">
        <div class="card">
            <div class="card-inner">
                <h3
                    v-if="title"
                    class="card-title"
                >
                    {{ title }}
                </h3>

                <div class="card-body">
                    <slot />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    .content-panel {
        width: 100%;
        height: 100vh;
        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: map.get($scale, "space", "xl");
    }

    .card {
        position: relative;

        width: calc(100% - map.get($scale, "space", "xl"));
        max-width: 560px;
        height: min(60vh, 480px);

        border-radius: map.get($scale, "radius", "lg");
        margin-right: map.get($scale, "space", "xl"); // Prevent overlap with Indicator

        overflow: hidden;
    }

    .card::before {
        content: "";
        position: absolute;
        inset: 0;

        padding: 1px;
        border-radius: inherit;

        background: linear-gradient(
            155deg,
            rgba(map.get($colors, "accent"), 0.55) 0%,
            rgba(map.get($colors, "accent"), 0.08) 35%,
            rgba(255, 255, 255, 0.06) 60%,
            transparent 85%
        );

        -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
        mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;

        box-shadow: 0 0 60px rgba(map.get($colors, "accent"), 0.12);

        pointer-events: none;
    }

    .card-inner {
        position: relative;

        height: 100%;

        border-radius: inherit;

        padding: map.get($scale, "space", "xl");

        background: rgba(255, 255, 255, 0.025);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);

        display: flex;
        flex-direction: column;
    }

    .card-title {
        flex-shrink: 0;

        margin-bottom: map.get($scale, "space", "md");

        font-size: map.get($typography, "size", "lg");
        font-weight: 400;
        color: map.get($colors, "text");
    }

    .card-body {
        flex: 1;
        overflow-y: auto;

        white-space: pre-line;

        font-size: map.get($typography, "size", "md");
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.75);
    }
</style>