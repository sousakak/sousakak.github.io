/// <reference lib="webworker" />
export {};

import { generatePuzzle, solve, type DifficultySettings, type Tubes } from '../lib/games/colorsort';

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

export interface CheckRequest {
    type: 'check',
    requestId: number,
    tubes: Tubes,
    capacity: number,
};

export interface CheckResponse {
    type: 'checkResult',
    requestId: number,
    solvable: boolean,
};

export type WorkerRequest = GenerateRequest | CheckRequest;
export type GenerateResponse = GenerateSuccessResponse | GenerateErrorResponse;
export type WorkerResponse = GenerateResponse | CheckResponse;

self.onmessage = ( event: MessageEvent<WorkerRequest> ): void => {
    const request = event.data;

    if ( request.type === 'generate' ) {
        try {
            const tubes = generatePuzzle( request.settings );

            const response: GenerateSuccessResponse = { type: 'result', requestId: request.requestId, tubes };
            self.postMessage( response );
        } catch ( error ) {
            const response: GenerateErrorResponse = {
                type: 'error',
                requestId: request.requestId,
                message: error instanceof Error ? error.message : '不明なエラーが発生しました。',
            };
            self.postMessage( response );
        }
        return;
    }

    if ( request.type === 'check' ) {
        const solvable = solve( request.tubes, request.capacity ) !== null;

        const response: CheckResponse = { type: 'checkResult', requestId: request.requestId, solvable };
        self.postMessage( response );
        return;
    }
};