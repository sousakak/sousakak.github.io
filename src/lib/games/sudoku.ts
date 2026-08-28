import { shuffleArray } from '../utils/random'

interface SolveResult {
    isSuccess: boolean,
    boardResult: number[][]
}

type Board = number[][]

export function solve( board: Board ): SolveResult {
    let boardCopy = structuredClone( board );

    while ( true ) {
        let updated = false;

        if (fillNakedSingles( boardCopy )) updated = true;
        if (fillHiddenSingles( boardCopy )) updated = true;

        if ( !updated ) break;
    }

    for ( const [ i, boardRow ] of boardCopy.entries() ) {
        for ( const [ j, boardCell ] of boardRow.entries() ) {
            if ( boardCell == 0 ) {
                let candidates: number[] = shuffleArray( getCandidates( boardCopy, i, j ) );
                candidates.forEach( ( num: number ) => {
                    boardCopy[i][j] = num;

                    const { isSuccess, boardResult } = solve( boardCopy );
                    if ( isSuccess ) return { isSuccess: true, boardResult: boardResult };
                    boardCopy[i][j] = 0;
                } );
                return { isSuccess: false, boardResult: board };
            }
        }
    }

    return { isSuccess: true, boardResult: boardCopy };
}

function getCandidates( board: Board, row: number, col: number ): number[] {
    if ( board[row][col] != 0 ) return [];
    let candidates = Array.from({ length: 9 }, ( _, i ) => i + 1);
    candidates = candidates.filter( (num, i) => {
        return !(
            board[i].includes( num )
            && board.map( row => row[i] ).includes( num )
        );
    } );
    const [ boxC, boxR ] = [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3];
    for ( let i = boxC; i < boxC + 3; i++ ) {
        for ( let j = boxR; j < boxR + 3; j++ ) {
            const candIndex = candidates.indexOf( board[i][j] );
            if ( candIndex === -1 ) continue;
            candidates = candidates.splice( candIndex, 1 );
        }
    }

    return candidates;
}

export function fillNakedSingles( board: Board ): boolean {
    return false
}

export function fillHiddenSingles( board: Board ): boolean {
    return false
}