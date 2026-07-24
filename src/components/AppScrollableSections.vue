<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import { setSectionState } from "../lib/state/sectionState";

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

    type IndicatorPhase = "idle" | "leaving" | "growing" | "hidden";

    const indicatorPhase = ref<IndicatorPhase>( "hidden" );
    const INDICATOR_GROW_DURATION = 500;

    let indicatorTimeoutId: number | null = null;

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
        setSectionState( {
            index: currentIndex.value,
            total: total.value
        } );
    };

    const runIndicatorCycle = ( destinationIsLast: boolean ): void => {

        if ( indicatorTimeoutId !== null ) {
            window.clearTimeout( indicatorTimeoutId );
            indicatorTimeoutId = null;
        }

        indicatorPhase.value = "leaving";

        indicatorTimeoutId = window.setTimeout( () => {

            if ( destinationIsLast ) {
                indicatorPhase.value = "hidden";
                return;
            }

            indicatorPhase.value = "growing";

            indicatorTimeoutId = window.setTimeout( () => {
                indicatorPhase.value = "idle";
            }, INDICATOR_GROW_DURATION );

        }, props.duration );

    };

    const goTo = ( index: number ): void => {

        const clamped = Math.max(
            0,
            Math.min( total.value - 1, index )
        );

        if ( clamped === currentIndex.value ) {
            return;
        }

        runIndicatorCycle( clamped === total.value - 1 );

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

        indicatorPhase.value = total.value > 1 ? "idle" : "hidden";

        emitChange();

        window.addEventListener(
            "wheel",
            handleWheel,
            { passive: false }
        );

    } );

    onBeforeUnmount( () => {

        if ( indicatorTimeoutId !== null ) {
            window.clearTimeout( indicatorTimeoutId );
        }

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
    @use "sass:map";
    @use "../styles/variables" as *;

    $body-width: calc(100vw - map.get($scale, "space", "xl") - 2 * map.get($scale, "space", "lg"));

    $grow-duration: 0.5s;

    .sections {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .sections-track {
        position: relative;
        z-index: 1;

        display: flex;
        flex-direction: column;

        transition-property: transform;
        transition-timing-function: map.get($motion, "easing", "swing");

        :deep(astro-slot) {
            display: contents;
        }
    }

    .scroll-indicator {
        position: absolute;
        left: calc(($body-width - 11em) / 2);
        bottom: 8%;
        width: 11em;
        z-index: 0;

        background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.6) 10%,
            rgba(0, 0, 0, 0.6) 90%,
            rgba(0, 0, 0, 0) 100%
        );

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: map.get($scale, "space", "sm");

        pointer-events: none;
    }

    .scroll-indicator-line {
        display: block;
        width: 1px;
        height: calc((100vh - min(60vh, 480px)) / 2 - 100vh * 0.08 - 1lh);

        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 100%
        );

        transform-origin: top center;
        transform: translateY(0) scaleY(1);
    }

    .scroll-indicator-text {
        font-size: map.get($typography, "size", "sm");
        letter-spacing: map.get($typography, "letter-spacing", "wide");
        color: rgba(255, 255, 255, 0.6);

        opacity: 1;
        transition: opacity map.get($motion, "duration", "fast") map.get($motion, "easing", "ease");
    }

    .scroll-indicator.is-leaving {

        .scroll-indicator-text {
            opacity: 0;
        }

        .scroll-indicator-line {
            transform: translateY(-140px) scaleY(1);
            transition: transform v-bind('`${ props.duration }ms`') map.get($motion, "easing", "swing");
        }

    }

    .scroll-indicator.is-growing .scroll-indicator-line {
        animation: indicator-grow #{$grow-duration} map.get($motion, "easing", "swing") forwards;
    }

    .scroll-indicator.is-hidden {

        .scroll-indicator-line,
        .scroll-indicator-text {
            opacity: 0;
        }

        .scroll-indicator-line {
            transform: translateY(-140px);
        }

    }

    @keyframes indicator-grow {

        from {
            transform: translateY(-140px) scaleY(0);
        }

        to {
            transform: translateY(0) scaleY(1);
        }

    }
</style>