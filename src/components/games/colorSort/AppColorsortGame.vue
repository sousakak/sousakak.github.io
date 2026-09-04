<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted } from 'vue';
    import AppGamePanel from '../../AppGamePanel.vue';
    import AppTube from './AppTube.vue';
    import {
        pour,
        isSolved,
        type Tubes,
        type DifficultySettings,
    } from '../../../lib/games/colorsort';
    import type {
        GenerateRequest,
        GenerateResponse,
        CheckRequest,
        CheckResponse,
        WorkerResponse,
    } from '../../../workers/colorsortWorker.ts';

    type Difficulty = 'easy' | 'normal' | 'hard' | 'arduous';

    const DIFFICULTY_LABELS: Record<Difficulty, string> = {
        easy: '簡単',
        normal: '普通',
        hard: '困難',
        arduous: '災難'
    };

    const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
        easy:   { colorCount: 4, capacity: 4, tubeCount: 6 },
        normal: { colorCount: 6, capacity: 4, tubeCount: 9 },
        hard:   { colorCount: 8, capacity: 5, tubeCount: 12 },
        arduous: { colorCount: 12, capacity: 8, tubeCount: 15 },
    };

    const difficulty = ref<Difficulty>( 'easy' );
    const capacity = computed( () => DIFFICULTY_SETTINGS[ difficulty.value ].capacity );

    // Never generate random numbers on the server, as this can cause hydration mismatches.
    // Render with the initial value left blank, and generate it after mounting (on the client only).
    const tubes = ref<Tubes>( [] );
    const selectedIndex = ref<number | null>( null );
    const moveCount = ref( 0 );
    const generating = ref( false );
    const checking = ref( false );
    const stuck = ref( false );
    const errorMessage = ref<string | null>( null );

    const solved = computed( () => tubes.value.length > 0 && isSolved( tubes.value, capacity.value ) );
    const gameOver = computed( () => solved.value || stuck.value );

    let worker: Worker | null = null;
    let latestGenerateRequestId = 0;
    let latestCheckRequestId = 0;

    function newGame( nextDifficulty: Difficulty = difficulty.value ): void {
        if ( generating.value || !worker ) return;

        difficulty.value = nextDifficulty;
        selectedIndex.value = null;
        errorMessage.value = null;
        stuck.value = false;
        checking.value = false;
        generating.value = true;

        latestGenerateRequestId++;
        const request: GenerateRequest = {
            type: 'generate',
            requestId: latestGenerateRequestId,
            settings: DIFFICULTY_SETTINGS[ nextDifficulty ],
        };
        worker.postMessage( request );
    }

    function checkSolvable(): void {
        if ( !worker ) return;

        latestCheckRequestId++;
        checking.value = true;

        // Since `tubes.value` is a reactive Vue proxy, calling `postMessage` directly on it
        // will result in a "Proxy object could not be cloned" error.
        // Convert it to a plain array before sending it.
        const plainTubes: Tubes = tubes.value.map( tube => [ ...tube ] );

        const request: CheckRequest = {
            type: 'check',
            requestId: latestCheckRequestId,
            tubes: plainTubes,
            capacity: capacity.value,
        };
        worker.postMessage( request );
    }

    onMounted( () => {
        worker = new Worker( new URL( '../../../workers/colorsortWorker.ts', import.meta.url ), { type: 'module' } );

        worker.onmessage = ( event: MessageEvent<WorkerResponse> ) => {
            const data = event.data;

            if ( data.type === 'result' || data.type === 'error' ) {
                if ( data.requestId !== latestGenerateRequestId ) return;

                if ( data.type === 'result' ) {
                    tubes.value = data.tubes;
                    moveCount.value = 0;
                } else {
                    errorMessage.value = data.message;
                }

                generating.value = false;
                return;
            }

            if ( data.type === 'checkResult' ) {
                if ( data.requestId !== latestCheckRequestId ) return;

                if ( !data.solvable ) stuck.value = true;
                checking.value = false;
            }
        };

        worker.onerror = () => {
            errorMessage.value = 'An error occurred while generating the puzzle.';
            generating.value = false;
        };

        newGame();
    } );

    onUnmounted( () => {
        worker?.terminate();
        worker = null;
    } );

    function selectTube( index: number ): void {
        if ( generating.value || checking.value || gameOver.value ) return;

        if ( selectedIndex.value === null ) {
            if ( tubes.value[ index ].length > 0 ) selectedIndex.value = index;
            return;
        }

        if ( selectedIndex.value === index ) {
            selectedIndex.value = null;
            return;
        }

        const result = pour( tubes.value, selectedIndex.value, index, capacity.value );

        if ( result ) {
            tubes.value = result;
            moveCount.value++;
            selectedIndex.value = null;
            checkSolvable();
            return;
        }

        selectedIndex.value = tubes.value[ index ].length > 0 ? index : null;
    }
</script>

<template>
    <AppGamePanel
        title="カラーソート"
        :tags="[ 'パズル', '2D' ]"
    >
        <template #controls>
            <div class="difficulty-group">
                <button
                    v-for="( label, key ) in DIFFICULTY_LABELS"
                    :key="key"
                    type="button"
                    class="difficulty-button"
                    :class="{ 'is-active': difficulty === key }"
                    :disabled="generating"
                    @click="newGame( key as Difficulty )"
                >
                    {{ label }}
                </button>
            </div>

            <button
                type="button"
                class="reset-button"
                :disabled="generating"
                @click="newGame()"
            >
                もう一度
            </button>
        </template>

        <div class="board">
            <p
                v-if="generating"
                class="status-message"
            >
                生成中…
            </p>

            <template v-else-if="errorMessage">
                <p class="status-message is-error">
                    {{ errorMessage }}
                </p>
            </template>

            <p
                v-else-if="tubes.length === 0"
                class="status-message"
            >
                生成中…
            </p>

            <template v-else>
                <p class="move-count">
                    {{ moveCount }}手
                </p>

                <div class="tubes">
                    <AppTube
                        v-for="( tube, index ) in tubes"
                        :key="index"
                        :colors="tube"
                        :capacity="capacity"
                        :selected="selectedIndex === index"
                        :disabled="gameOver || checking"
                        @select="selectTube( index )"
                    />
                </div>

                <p
                    v-if="solved"
                    class="solved-message"
                >
                    クリア！ 🎉
                </p>

                <p
                    v-else-if="stuck"
                    class="stuck-message"
                >
                    詰みました… 😢
                </p>
            </template>
        </div>
    </AppGamePanel>
</template>

<style scoped lang="scss">
    @use "sass:map";
    @use "../../../styles/variables" as *;

    .difficulty-group {
        display: flex;
        gap: map.get($scale, "space", "sm");
    }

    .difficulty-button,
    .reset-button {
        padding: map.get($scale, "space", "sm") map.get($scale, "space", "lg");
        border-radius: map.get($scale, "radius", "full");
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.03);
        color: map.get($colors, "text");
        cursor: pointer;

        transition:
            border-color map.get($motion, "duration", "fast") map.get($motion, "easing", "ease"),
            background-color map.get($motion, "duration", "fast") map.get($motion, "easing", "ease");

        &:hover {
            background: rgba(255, 255, 255, 0.06);
        }

        &:disabled {
            opacity: 0.5;
            cursor: default;
            pointer-events: none;
        }
    }

    .difficulty-button.is-active {
        border-color: rgba(map.get($colors, "accent"), 0.7);
        background: rgba(map.get($colors, "accent"), 0.15);
        color: map.get($colors, "accent");
    }

    .board {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: map.get($scale, "space", "lg");
    }

    .move-count {
        font-size: map.get($typography, "size", "sm");
        color: rgba(255, 255, 255, 0.6);
    }

    .status-message {
        font-size: map.get($typography, "size", "sm");
        color: rgba(255, 255, 255, 0.6);
    }

    .status-message.is-error {
        color: #f87171;
    }

    .tubes {
        display: flex;
        align-items: flex-end;
        flex-wrap: wrap;
        justify-content: center;
        gap: map.get($scale, "space", "md");
    }

    .solved-message {
        font-size: map.get($typography, "size", "lg");
        color: map.get($colors, "accent");
    }

    .stuck-message {
        font-size: map.get($typography, "size", "lg");
        color: #f87171;
    }
</style>