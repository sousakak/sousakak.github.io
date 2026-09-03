/// <reference lib="webworker" />
export {};

import { generatePuzzle, type DifficultySettings, type Tubes } from '../lib/games/colorsort';

export interface GenerateRequest {
    type: 'generate',
    requestId: number,
    settings: DifficultySettings,
};

export interface GenerateSuccessResponse {
    type: 'result',
    requestId: number,
    tubes: Tubes,
};

export interface GenerateErrorResponse {
    type: 'error',
    requestId: number,
    message: string,
};

export type GenerateResponse = GenerateSuccessResponse | GenerateErrorResponse;

self.onmessage = ( event: MessageEvent<GenerateRequest> ): void => {
    const { type, requestId, settings } = event.data;
    if ( type !== 'generate' ) return;

    try {
        const tubes = generatePuzzle( settings );

        const response: GenerateSuccessResponse = { type: 'result', requestId, tubes };
        self.postMessage( response );
    } catch ( error ) {
        const response: GenerateErrorResponse = {
            type: 'error',
            requestId,
            message: error instanceof Error ? error.message : '不明なエラーが発生しました。',
        };
        self.postMessage( response );
    }
};