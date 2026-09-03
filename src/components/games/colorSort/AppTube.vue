<script setup lang="ts">
    const props = defineProps<{
        colors: string[]; // index 0 = 一番下、末尾 = 一番上
        capacity: number;
        selected?: boolean;
        disabled?: boolean;
    }>();

    defineEmits<{
        ( event: 'select' ): void;
    }>();

    const SLOT_HEIGHT = 30;

    function colorAt( slotIndex: number ): string | undefined {
        return props.colors[ props.capacity - slotIndex ];
    }
</script>

<template>
    <button
        type="button"
        class="tube"
        :class="{ 'is-selected': selected }"
        :disabled="disabled"
        :style="{ height: `${ capacity * SLOT_HEIGHT }px` }"
        @click="$emit( 'select' )"
    >
        <span
            v-for="slotIndex in capacity"
            :key="slotIndex"
            class="slot"
            :style="colorAt( slotIndex ) ? { backgroundColor: colorAt( slotIndex ) } : undefined"
        />
    </button>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../../../styles/variables" as *;

    .tube {
        flex-shrink: 0;

        display: flex;
        flex-direction: column;
        width: 56px;

        padding: 4px;
        gap: 2px;

        background: rgba(255, 255, 255, 0.03);
        border: 2px solid rgba(255, 255, 255, 0.15);
        border-top: none;
        border-radius: 0 0 map.get($scale, "radius", "lg") map.get($scale, "radius", "lg");

        cursor: pointer;

        transition:
            border-color map.get($motion, "duration", "fast") map.get($motion, "easing", "ease"),
            transform map.get($motion, "duration", "fast") map.get($motion, "easing", "ease"),
            box-shadow map.get($motion, "duration", "fast") map.get($motion, "easing", "ease");

        &:disabled {
            cursor: default;
        }

        &.is-selected {
            border-color: rgba(map.get($colors, "accent"), 0.8);
            transform: translateY(-10px);
            box-shadow: 0 0 16px rgba(map.get($colors, "accent"), 0.4);
        }
    }

    .slot {
        flex: 1;
        border-radius: map.get($scale, "radius", "sm");
        background: transparent;
        transition: background-color map.get($motion, "duration", "fast") map.get($motion, "easing", "ease");
    }
</style>