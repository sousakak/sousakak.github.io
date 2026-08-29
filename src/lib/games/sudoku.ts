import { shuffleArray } from '../utils/random';

export interface SolveResult {
    isSuccess: boolean,
    boardResult: number[][]
};

export type Board = number[][];

function* getCol<T>(tbl: T[][]): Generator<[T[], number], void, unknown> {
    for (let i = 0; i < tbl[0].length; i++) {
        const columnData = tbl.map(r => r[i]);
        yield [columnData, i];
    }
}

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
    let updated = false;

    for ( const [ i, boardRow ] of board.entries() ) {
        for ( const [ j, boardCell ] of boardRow.entries() ) {
            if ( boardCell === 0 ) {
                const candidates = getCandidates( board, i, j );
                if ( candidates.length === 1 ) {
                    board[i][j] = candidates[0];
                    updated = true;
                }
            }
        }
    }
    return updated;
}

export function fillHiddenSingles( board: Board ): boolean {
    let updated = false;

    for ( const [ i, boardRow ] of board.entries() ) {
        let possibleCols: Record<number, number[]> = {};
        for ( const [ j, boardCell ] of boardRow.entries() ) {
            if ( boardCell === 0 ) {
                const candidates = getCandidates( board, i, j );
                candidates.forEach( num => {
                    possibleCols[num] = possibleCols[num]
                        ? [...possibleCols[num], j]
                        : [j];
                } );
            }
        }
        for ( const [ num, cols ] of Object.entries( possibleCols ) ) {
            if ( cols.length === 1 ) {
                board[i][possibleCols[+num][0]] = +num;
                updated = true;
            }
        }
    }

    for ( const [ boardCol, i ] of getCol( board ) ) {
        let possibleRows: Record<number, number[]> = {};
        for ( const [ j, boardCell ] of boardCol.entries() ) {
            if ( boardCell === 0 ) {
                const candidates = getCandidates( board, i, j );
                candidates.forEach( num => {
                    possibleRows[num] = possibleRows[num]
                        ? [...possibleRows[num], j]
                        : [j];
                } );
            }
        }
        for ( const [ num, rows ] of Object.entries( possibleRows ) ) {
            if ( rows.length === 1 ) {
                board[i][possibleRows[+num][0]] = +num;
                updated = true;
            }
        }
    }

    for ( let chunk = 0; chunk < 9; chunk++ ) {
        const [ boxC, boxR ] = [Math.floor(chunk % 3) * 3, Math.floor(chunk / 3) * 3];
        let possibleCells: Record<number, number[][]> = {};
        for ( let i = boxR; i < boxR + 3; i++ ) {
            for ( let j = boxC; j < boxC + 3; j++ ) {
                if ( board[i][j] === 0 ) {
                    const candidates = getCandidates( board, i, j );
                    candidates.forEach( num => {
                        possibleCells[num] = possibleCells[num]
                            ? [...possibleCells[num], [i, j]]
                            : [[i, j]];
                    } );
                }
            }
        }
        for ( const [ num, cells ] of Object.entries( possibleCells ) ) {
            if ( cells.length === 1 ) {
                board[cells[0][0]][cells[0][1]] = +num;
                updated = true;
            }
        }
    }

    return updated;
}