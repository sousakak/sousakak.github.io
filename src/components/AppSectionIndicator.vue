<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount } from "vue";

    interface SectionChangeDetail {
        index: number;
        total: number;
    }

    const maxSlots = 10;

    const currentIndex = ref( 0 );
    const total = ref( 0 );

    type SlotState = "ghost" | "inactive" | "active";

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

    const handleSectionChange = ( event: Event ): void => {
        const detail = ( event as CustomEvent<SectionChangeDetail> ).detail;
        currentIndex.value = detail.index;
        total.value = detail.total;
    };

    onMounted( () => {
        window.addEventListener(
            "section-change",
            handleSectionChange
        );
    } );

    onBeforeUnmount( () => {
        window.removeEventListener(
            "section-change",
            handleSectionChange
        );
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
    .indicator {
        position: fixed;
        top: 50%;
        right: 24px;
        z-index: 10;

        display: flex;
        flex-direction: column;
        gap: 10px;
        transform: translateY(-50%);
    }

    .indicator-line {
        display: block;
        background: #ffffff;
        border-radius: 1px;

        transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease;

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