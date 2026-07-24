<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount } from "vue";
    import { subscribeSectionState } from "../lib/state/sectionState";

    const maxSlots = 10;

    const currentIndex = ref( 0 );
    const total = ref( 0 );

    type SlotState = "ghost" | "inactive" | "active";

    let unsubscribe: ( () => void ) | null = null;

    const slots = computed<SlotState[]>( () => {

        return Array.from(
            { length: maxSlots },
            ( _, index ) => {

                if ( index >= total.value ) {
                    return "ghost";
                }

                return index === currentIndex.value
                    ? "active"
                    : "inactive";

            }
        );

    } );

    onMounted( () => {
        unsubscribe = subscribeSectionState( ( state ) => {
            currentIndex.value = state.index;
            total.value = state.total;
        } );
    } );

    onBeforeUnmount( () => {
        unsubscribe?.();
    } );
</script>

<template>
    <div
        v-if="total > 1"
        class="indicator"
    >
        <span
            v-for="( state, index ) in slots"
            :key="index"
            class="indicator-line"
            :class="`is-${ state }`"
        />
    </div>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    .indicator {
        position: fixed;
        top: 50%;
        right: map.get($scale, "space", "lg");
        z-index: map.get($z-index, "overlay");

        display: flex;
        flex-direction: column;
        gap: 10px;
        transform: translateY(-50%);
    }

    .indicator-line {
        display: block;
        background: map.get($colors, "text");
        border-radius: 1px;

        transition:
            opacity map.get($motion, "duration", "base") map.get($motion, "easing", "ease"),
            width map.get($motion, "duration", "base") map.get($motion, "easing", "ease"),
            height map.get($motion, "duration", "base") map.get($motion, "easing", "ease");

        &.is-ghost {
            width: 8px;
            height: 1px;
            opacity: 0.27;
        }

        &.is-inactive {
            width: 20px;
            height: 2px;
            opacity: 0.45;
        }

        &.is-active {
            width: 32px;
            height: 2px;
            opacity: 1;
        }
    }
</style>