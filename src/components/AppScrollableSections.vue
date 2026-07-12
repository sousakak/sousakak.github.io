<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue";

    const props = withDefaults(
        defineProps<{
            duration?: number;
        }>(),
        {
            duration: 800
        }
    );

    const trackRef = ref<HTMLElement | null>( null );
    const currentIndex = ref( 0 );
    const total = ref( 0 );
    const isAnimating = ref( false );

    const getPanelElements = (
        track: HTMLElement
    ): Element[] => {

        const children = Array.from( track.children );

        if (
            children.length === 1 &&
            children[0].tagName.toLowerCase() === "astro-slot"
        ) {
            return Array.from( children[0].children );
        }

        return children;

    };

    const emitChange = (): void => {
        window.dispatchEvent(
            new CustomEvent( "section-change", {
                detail: {
                    index: currentIndex.value,
                    total: total.value
                }
            } )
        );
    };

    const goTo = ( index: number ): void => {

        const clamped = Math.max(
            0,
            Math.min( total.value - 1, index )
        );

        if ( clamped === currentIndex.value ) {
            return;
        }

        currentIndex.value = clamped;
        isAnimating.value = true;

        emitChange();

        window.setTimeout( () => {
            isAnimating.value = false;
        }, props.duration );

    };

    const handleWheel = ( event: WheelEvent ): void => {

        event.preventDefault();

        if ( isAnimating.value ) {
            return;
        }

        if ( event.deltaY > 0 ) {
            goTo( currentIndex.value + 1 );
        }
        else if ( event.deltaY < 0 ) {
            goTo( currentIndex.value - 1 );
        }

    };

    onMounted( () => {

        if ( trackRef.value ) {
            total.value = getPanelElements( trackRef.value ).length;
        }

        emitChange();

        window.addEventListener(
            "wheel",
            handleWheel,
            { passive: false }
        );

    } );

    onBeforeUnmount( () => {
        window.removeEventListener(
            "wheel",
            handleWheel
        );
    } );
</script>

<template>
    <div class="sections">
        <div
            ref="trackRef"
            class="sections-track"
            :style="{
                transform: `translateY(-${ currentIndex * 100 }vh)`,
                transitionDuration: `${ duration }ms`
            }"
        >
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
    .sections {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .sections-track {
        display: flex;
        flex-direction: column;

        transition-property: transform;
        transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1);

        :deep(astro-slot) {
            display: contents;
        }
    }
</style>