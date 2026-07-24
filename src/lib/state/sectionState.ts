export interface SectionState {
    index: number;
    total: number;
}

let currentState: SectionState = {
    index: 0,
    total: 0
};

const listeners = new Set<( state: SectionState ) => void>();

export function setSectionState(
    state: SectionState
): void {

    currentState = state;

    for ( const listener of listeners ) {
        listener( state );
    }

}

export function subscribeSectionState(
    callback: ( state: SectionState ) => void
): () => void {

    callback( currentState );

    listeners.add( callback );

    return () => {
        listeners.delete( callback );
    };

}