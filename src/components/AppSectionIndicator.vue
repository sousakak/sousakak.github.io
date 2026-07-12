<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue";

    interface SectionChangeDetail {
        index: number;
        total: number;
    }

    const currentIndex = ref( 0 );
    const total = ref( 0 );

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
            v-for="index in total"
            :key="index"
            class="indicator-line"
            :class="{ 'is-active': index - 1 === currentIndex }"
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
        gap: 12px;
        transform: translateY(-50%);
    }

    .indicator-line {
        width: 20px;
        height: 2px;
        background: #ffffff;
        opacity: 0.25;

        transition: opacity 0.3s ease, width 0.3s ease;

        &.is-active {
            width: 30px;
            opacity: 1;
        }
    }
</style>