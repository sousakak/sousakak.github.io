let ready = false;

const listeners = new Set<() => void>();

export function markReady(): void {

    ready = true;

    for ( const listener of listeners ) {
        listener();
    }

    listeners.clear();

}

export function onReady(
    callback: () => void
): () => void {

    if ( ready ) {
        callback();
        return () => {};
    }

    listeners.add( callback );

    return () => {
        listeners.delete( callback );
    };

}