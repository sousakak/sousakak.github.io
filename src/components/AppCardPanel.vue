<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount } from "vue";

    export interface CardFlowItem {
        id: string | number;
        title: string;
        icon?: string;
        description?: string;
        href?: string;
    }

    const props = withDefaults(
        defineProps<{
            items: CardFlowItem[];
            title?: string;
            rows?: number;
            showSearch?: boolean;
            searchPlaceholder?: string;
        }>(),
        {
            rows: 3,
            showSearch: true,
            searchPlaceholder: "検索"
        }
    );

    const emit = defineEmits<{
        ( event: "search", query: string ): void;
        ( event: "select", item: CardFlowItem ): void;
    }>();

    const searchQuery = ref( "" );

    const handleSearchInput = (): void => {
        emit( "search", searchQuery.value );
    };

    const filteredItems = computed<CardFlowItem[]>( () => {

        const query = searchQuery.value
            .trim()
            .toLowerCase();

        if ( query === "" )  return props.items;

        return props.items.filter(
            ( item ) => item.title
                .toLowerCase()
                .includes( query )
        );

    } );

    const MIN_TRACK_ITEMS = 12;

    interface Row {
        items: CardFlowItem[];
        direction: "right" | "left";
    }

    const rowGroups = computed<Row[]>( () => {

        const rowCount = Math.max( 1, props.rows );

        const buckets: CardFlowItem[][] = Array.from(
            { length: rowCount },
            () => []
        );

        filteredItems.value.forEach( ( item, index ) => {
            buckets[ index % rowCount ].push( item );
        } );

        return buckets
            .filter( ( rowItems ) => rowItems.length > 0 )
            .map( ( rowItems, index ) => {

                const repeatCount = Math.max(
                    1,
                    Math.ceil( MIN_TRACK_ITEMS / rowItems.length )
                );

                const paddedItems: CardFlowItem[] = [];

                for ( let i = 0; i < repeatCount; i++ ) {
                    paddedItems.push( ...rowItems );
                }

                return {
                    items: paddedItems,
                    direction: ( index % 2 === 0 ) ? "right" : "left"
                };

            } );

    } );

    const rowDuration = (
        rowItems: CardFlowItem[]
    ): string => `${ Math.max( rowItems.length, 1 ) * 5 }s`;

    type ItemId = CardFlowItem["id"];

    const hoveredId = ref<ItemId | null>( null );
    const pinnedId = ref<ItemId | null>( null );

    const activeId = computed<ItemId | null>( () =>
        pinnedId.value ?? hoveredId.value
    );

    const activeItem = computed<CardFlowItem | null>( () => {
        if ( activeId.value === null ) return null;

        return filteredItems.value.find(
            ( item ) => item.id === activeId.value
        ) ?? null;
    } );

    const isRowPaused = (
        rowItems: CardFlowItem[]
    ): boolean => {

        if ( activeId.value === null ) return false;

        return rowItems.some(
            ( item ) => item.id === activeId.value
        );

    };

    const handleCardEnter = ( item: CardFlowItem ): void => {
        hoveredId.value = item.id;
    };

    const handleCardLeave = ( item: CardFlowItem ): void => {
        if ( hoveredId.value === item.id ) hoveredId.value = null;
    };

    const toggleCard = ( item: CardFlowItem ): void => {
        if ( pinnedId.value === item.id ) {
            pinnedId.value = null;
            return;
        }

        pinnedId.value = item.id;

        emit( "select", item );
    };

    const closePopup = (): void => {
        pinnedId.value = null;
        hoveredId.value = null;
    };

    const handleKeydown = ( event: KeyboardEvent ): void => {
        if ( event.key === "Escape" ) closePopup();
    };

    onMounted( () => {
        window.addEventListener(
            "keydown",
            handleKeydown
        );
    } );

    onBeforeUnmount( () => {
        window.removeEventListener(
            "keydown",
            handleKeydown
        );
    } );
</script>

<template>
    <section class="card-flow-panel">
        <div class="header">
            <h2
                v-if="title"
                class="panel-title"
            >
                {{ title }}
            </h2>

            <div
                v-if="showSearch"
                class="search"
            >
                <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    :placeholder="searchPlaceholder"
                    @input="handleSearchInput"
                />
            </div>
        </div>

        <div class="rows">
            <p
                v-if="filteredItems.length === 0"
                class="empty-message"
            >
                見つかりませんでした
            </p>

            <div
                v-for="( row, rowIndex ) in rowGroups"
                :key="rowIndex"
                class="row"
            >
                <div
                    class="track"
                    :class="[
                        `is-${ row.direction }`,
                        { 'is-paused': isRowPaused( row.items ) }
                    ]"
                    :style="{ '--marquee-duration': rowDuration( row.items ) }"
                >
                    <div
                        v-for="copyIndex in 2"
                        :key="copyIndex"
                        class="track-group"
                        :aria-hidden="copyIndex === 2 ? 'true' : undefined"
                    >
                        <button
                            v-for="( item, itemIndex ) in row.items"
                            :key="`${ copyIndex }-${ itemIndex }-${ item.id }`"
                            type="button"
                            class="card"
                            :class="{ 'is-active': activeId === item.id }"
                            :aria-pressed="pinnedId === item.id"
                            :tabindex="copyIndex === 2 ? -1 : 0"
                            @mouseenter="handleCardEnter( item )"
                            @mouseleave="handleCardLeave( item )"
                            @focus="handleCardEnter( item )"
                            @blur="handleCardLeave( item )"
                            @click="toggleCard( item )"
                        >
                            <span class="card-icon">
                                <img
                                    v-if="item.icon"
                                    :src="item.icon"
                                    :alt="item.title"
                                />
                                <span
                                    v-else
                                    class="card-icon-fallback"
                                >
                                    {{ item.title.charAt( 0 ) }}
                                </span>
                            </span>

                            <span class="card-title">
                                {{ item.title }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="popup">
            <div
                v-if="activeItem"
                class="popup-layer"
            >
                <div
                    class="popup-backdrop"
                    @click="closePopup"
                />

                <div
                    class="popup-card"
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        type="button"
                        class="popup-close"
                        aria-label="閉じる"
                        @click="closePopup"
                    >
                        ×
                    </button>

                    <span class="popup-icon">
                        <img
                            v-if="activeItem.icon"
                            :src="activeItem.icon"
                            :alt="activeItem.title"
                        />
                        <span
                            v-else
                            class="popup-icon-fallback"
                        >
                            {{ activeItem.title.charAt( 0 ) }}
                        </span>
                    </span>

                    <h3 class="popup-title">
                        {{ activeItem.title }}
                    </h3>

                    <p
                        v-if="activeItem.description"
                        class="popup-description"
                    >
                        {{ activeItem.description }}
                    </p>

                    <a
                        v-if="activeItem.href"
                        :href="activeItem.href"
                        class="popup-link"
                    >
                        詳細を見る
                    </a>
                </div>
            </div>
        </Transition>
    </section>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../styles/variables" as *;

    $header-clearance: 20px * 3;

    .card-flow-panel {
        position: relative;

        width: 100%;
        height: 100vh;
        flex-shrink: 0;

        display: flex;
        flex-direction: column;
        gap: map.get($scale, "space", "lg");

        padding: map.get($scale, "space", "xl");
        padding-top: $header-clearance + map.get($scale, "space", "md");
        padding-right: calc(#{map.get($scale, "space", "xl")} + 64px); // Prevent overlap with Indicator

        background: rgba(255, 255, 255, 0.025);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
    }

    //----------------------------------
    // Header
    //----------------------------------

    .header {
        flex-shrink: 0;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: map.get($scale, "space", "md");
    }

    .panel-title {
        font-size: map.get($typography, "size", "xl");
        font-weight: 400;
        color: map.get($colors, "text");
        text-align: center;
    }

    .search {
        width: 100%;

        display: flex;
        justify-content: center;
    }

    .search-input {
        width: 100%;
        max-width: 420px;

        padding: map.get($scale, "space", "md") map.get($scale, "space", "lg");

        font-size: map.get($typography, "size", "md");
        color: map.get($colors, "text");

        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: map.get($scale, "radius", "lg");

        transition: border-color map.get($motion, "duration", "fast") map.get($motion, "easing", "ease");

        &::placeholder {
            color: rgba(255, 255, 255, 0.35);
        }

        &:focus {
            outline: none;
            border-color: rgba(map.get($colors, "accent"), 0.6);
        }
    }

    //----------------------------------
    // Rows
    //----------------------------------

    .rows {
        position: relative;

        flex: 1;
        min-height: 0;

        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: map.get($scale, "space", "lg");
    }

    .empty-message {
        text-align: center;

        font-size: map.get($typography, "size", "md");
        color: rgba(255, 255, 255, 0.45);
    }

    .row {
        overflow: hidden;

        mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
        );
        -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
        );
    }

    .track {
        display: flex;
        width: max-content;
        gap: map.get($scale, "space", "md");

        animation-name: card-flow-left;
        animation-duration: var(--marquee-duration, 30s);
        animation-timing-function: linear;
        animation-iteration-count: infinite;

        &.is-right {
            animation-name: card-flow-right;
        }

        &.is-paused {
            animation-play-state: paused;
        }
    }

    .track-group {
        display: flex;
        flex-shrink: 0;
        gap: inherit;
    }

    @keyframes card-flow-left {

        from {
            transform: translateX(0);
        }

        to {
            transform: translateX(-50%);
        }

    }

    @keyframes card-flow-right {

        from {
            transform: translateX(-50%);
        }

        to {
            transform: translateX(0);
        }

    }

    //----------------------------------
    // Card
    //----------------------------------

    .card {
        flex-shrink: 0;

        display: flex;
        align-items: center;
        gap: map.get($scale, "space", "sm");

        width: 220px;
        padding: map.get($scale, "space", "sm") map.get($scale, "space", "md");

        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: map.get($scale, "radius", "lg");

        cursor: pointer;
        text-align: left;
        pointer-events: auto;

        transition:
            border-color map.get($motion, "duration", "fast") map.get($motion, "easing", "ease"),
            background-color map.get($motion, "duration", "fast") map.get($motion, "easing", "ease"),
            transform map.get($motion, "duration", "fast") map.get($motion, "easing", "ease");

        &:hover,
        &:focus-visible,
        &.is-active {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(map.get($colors, "accent"), 0.6);
            transform: translateY(-2px);
        }

        &:focus-visible {
            outline: none;
        }
    }

    .card-icon {
        flex-shrink: 0;

        width: 40px;
        height: 40px;
        border-radius: map.get($scale, "radius", "lg");

        overflow: hidden;

        display: flex;
        align-items: center;
        justify-content: center;

        background: rgba(map.get($colors, "accent"), 0.15);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .card-icon-fallback {
        font-size: map.get($typography, "size", "md");
        color: map.get($colors, "accent");
    }

    .card-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        font-size: map.get($typography, "size", "sm");
        color: map.get($colors, "text");
    }

    //----------------------------------
    // Popup
    //----------------------------------

    .popup-layer {
        position: absolute;
        inset: 0;
        z-index: map.get($z-index, "overlay");

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .popup-backdrop {
        position: absolute;
        inset: 0;

        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
    }

    .popup-card {
        position: relative;

        width: min(90vw, 420px);

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: map.get($scale, "space", "sm");
        text-align: center;

        padding: map.get($scale, "space", "xl");
        border-radius: map.get($scale, "radius", "lg");

        background: rgba(20, 20, 20, 0.85);
        border: 1px solid rgba(map.get($colors, "accent"), 0.35);
        box-shadow: 0 0 60px rgba(map.get($colors, "accent"), 0.15);
    }

    .popup-close {
        position: absolute;
        top: map.get($scale, "space", "sm");
        right: map.get($scale, "space", "sm");

        width: 28px;
        height: 28px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: map.get($typography, "size", "md");
        color: rgba(255, 255, 255, 0.6);

        background: transparent;
        border: none;
        cursor: pointer;

        &:hover {
            color: map.get($colors, "text");
        }
    }

    .popup-icon {
        width: 72px;
        height: 72px;
        border-radius: map.get($scale, "radius", "lg");

        overflow: hidden;

        display: flex;
        align-items: center;
        justify-content: center;

        background: rgba(map.get($colors, "accent"), 0.15);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .popup-icon-fallback {
        font-size: map.get($typography, "size", "xl");
        color: map.get($colors, "accent");
    }

    .popup-title {
        font-size: map.get($typography, "size", "lg");
        font-weight: 400;
        color: map.get($colors, "text");
    }

    .popup-description {
        max-width: 32em;

        font-size: map.get($typography, "size", "md");
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.75);

        white-space: pre-line;
    }

    .popup-link {
        margin-top: map.get($scale, "space", "sm");

        font-size: map.get($typography, "size", "sm");
        letter-spacing: map.get($typography, "letter-spacing", "wide");
        color: map.get($colors, "accent");
    }

    //----------------------------------
    // Popup transition
    //----------------------------------

    .popup-enter-active,
    .popup-leave-active {
        transition: opacity map.get($motion, "duration", "base") map.get($motion, "easing", "ease");
    }

    .popup-enter-from,
    .popup-leave-to {
        opacity: 0;
    }
</style>