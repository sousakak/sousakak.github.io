export type Color = string;
export type Tube = Color[];
export type Tubes = Tube[];

export interface PourMove {
    from: number,
    to: number,
};

export interface DifficultySettings {
    colorCount: number,
    capacity: number,
    emptyTubes: number,
};

export const COLOR_PALETTE: Color[] = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#a855f7', // purple
    '#ec4899', // pink
    '#84cc16', // lime
    '#14b8a6', // teal
    '#f43f5e', // rose
    '#8b5cf6', // violet
];

const SOLVE_STATE_LIMIT = 300000;

export function topColor( tube: Tube ): Color | null {
    return tube.length === 0 ? null : tube[tube.length - 1];
}

export function topRunLength( tube: Tube ): number {
    if ( tube.length === 0 ) return 0;

    const color = topColor( tube );
    let count = 0;
    for ( let i = tube.length - 1; i >= 0; i-- ) {
        if ( tube[i] !== color ) break;
        count++;
    }
    return count;
}

export function canPour( tubes: Tubes, from: number, to: number, capacity: number ): boolean {
    if ( from === to ) return false;

    const fromTube = tubes[from];
    const toTube = tubes[to];
    if ( !fromTube || !toTube ) return false;
    if ( fromTube.length === 0 ) return false;
    if ( toTube.length >= capacity ) return false;

    const fromColor = topColor( fromTube );
    const toColor = topColor( toTube );

    return toColor === null || toColor === fromColor;
}

export function pourAmount( tubes: Tubes, from: number, to: number, capacity: number ): number {
    if ( !canPour( tubes, from, to, capacity ) ) return 0;
    return Math.min( topRunLength( tubes[from] ), capacity - tubes[to].length );
}

export function pour( tubes: Tubes, from: number, to: number, capacity: number ): Tubes | null {
    const amount = pourAmount( tubes, from, to, capacity );
    if ( amount === 0 ) return null;

    const tubesCopy = tubes.map( tube => [ ...tube ] );
    const color = topColor( tubesCopy[from] )!;

    for ( let i = 0; i < amount; i++ ) {
        tubesCopy[from].pop();
        tubesCopy[to].push( color );
    }

    return tubesCopy;
}

export function isTubeSorted( tube: Tube, capacity: number ): boolean {
    if ( tube.length === 0 ) return true;
    if ( tube.length !== capacity ) return false;
    return tube.every( color => color === tube[0] );
}

export function isSolved( tubes: Tubes, capacity: number ): boolean {
    return tubes.every( tube => isTubeSorted( tube, capacity ) );
}

function serialize( tubes: Tubes ): string {
    return tubes.map( tube => tube.join( ',' ) ).join( '|' );
}

function isMeaninglessMove( tubes: Tubes, from: number, to: number, capacity: number ): boolean {
    return isTubeSorted( tubes[from], capacity )
        && tubes[from].length === capacity
        && tubes[to].length === 0;
}

export function solve( tubes: Tubes, capacity: number ): PourMove[] | null {
    const startState = tubes.map( tube => [ ...tube ] );
    if ( isSolved( startState, capacity ) ) return [];

    const visited = new Set<string>( [ serialize( startState ) ] );
    const queue: { state: Tubes, path: PourMove[] }[] = [ { state: startState, path: [] } ];
    let head = 0;

    let explored = 0;

    while ( head < queue.length ) {
        const { state, path } = queue[ head ];
        head++;

        for ( let from = 0; from < state.length; from++ ) {
            for ( let to = 0; to < state.length; to++ ) {
                if ( !canPour( state, from, to, capacity ) ) continue;
                if ( isMeaninglessMove( state, from, to, capacity ) ) continue;

                const nextState = pour( state, from, to, capacity );
                if ( !nextState ) continue;

                const key = serialize( nextState );
                if ( visited.has( key ) ) continue;

                const nextPath = [ ...path, { from, to } ];
                if ( isSolved( nextState, capacity ) ) return nextPath;

                visited.add( key );
                queue.push( { state: nextState, path: nextPath } );

                explored++;
                if ( explored > SOLVE_STATE_LIMIT ) return null;
            }
        }
    }

    return null;
}

function pickRandom<T>( items: T[] ): T {
    return items[ Math.floor( Math.random() * items.length ) ];
}

const MAX_SCRAMBLE_RETRIES = 5;

// Start with all test tubes in a uniform state (all the same color or empty),
// then shuffle them using "reverse playback." One move in "reverse play"
// consists of stacking a continuous block of the same color
// (1 to a certain number of consecutive test tubes) from the top of test tube B
// onto another test tube A, regardless of the color of the contents in A.
// Since this means that the move "pouring that block back from A to B as is"
// is always a valid move, the resulting state is guaranteed by the game’s design
// to be solvable without the need for search or verification.
function scramble( tubes: Tubes, capacity: number, steps: number ): void {
    const tubeCount = tubes.length;
    let performed = 0;
    let stalled = 0;

    while ( performed < steps && stalled < steps * 20 ) {
        const nonEmpty = tubes
            .map( ( tube, index ) => ( { tube, index } ) )
            .filter( ( { tube } ) => tube.length > 0 );

        const { tube: fromTube, index: b } = pickRandom( nonEmpty );
        const color = topColor( fromTube )!;
        const maxAmount = topRunLength( fromTube );
        const amount = 1 + Math.floor( Math.random() * maxAmount );

        const candidates = Array.from( { length: tubeCount }, ( _, i ) => i )
            .filter( i => i !== b && tubes[i].length + amount <= capacity );

        if ( candidates.length === 0 ) {
            stalled++;
            continue;
        }

        const a = pickRandom( candidates );

        for ( let i = 0; i < amount; i++ ) {
            tubes[b].pop();
            tubes[a].push( color );
        }

        performed++;
        stalled = 0;
    }
}

export function generatePuzzle( settings: DifficultySettings ): Tubes {
    const { colorCount, capacity, emptyTubes } = settings;

    if ( colorCount > COLOR_PALETTE.length ) {
        throw new Error( `colorCountはパレットの最大数(${ COLOR_PALETTE.length })以下にしてください。` );
    }

    const colors = COLOR_PALETTE.slice( 0, colorCount );
    const scrambleSteps = Math.max( 60, colorCount * capacity * 4 );

    for ( let attempt = 0; attempt < MAX_SCRAMBLE_RETRIES; attempt++ ) {
        // 揃った状態から開始する
        const tubes: Tubes = colors.map( color => Array( capacity ).fill( color ) );
        for ( let t = 0; t < emptyTubes; t++ ) tubes.push( [] );

        scramble( tubes, capacity, scrambleSteps );

        if ( !isSolved( tubes, capacity ) ) return tubes;
    }

    throw new Error( 'パズルの生成に失敗しました。colorCount/capacity/emptyTubesを見直してください。' );
}