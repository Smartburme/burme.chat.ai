import { Content, GeminiTextResponse, GeminiImageResponse } from '../types';

async function callWorkerApi(type: 'text' | 'code' | 'image', payload: any) {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred' }));
        throw new Error(errorData.error || 'Failed to communicate with the API.');
    }
    
    return response.json();
}

async function streamChatFromWorker(history: Content[]): Promise<ReadableStream<Uint8Array> | null> {
     const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'chat', payload: { history } }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred' }));
        throw new Error(errorData.error || 'Failed to communicate with the API.');
    }
    return response.body;
}

export const streamChat = async (history: Content[], message: string): Promise<ReadableStream<Uint8Array> | null> => {
    const newHistoryEntry: Content = { role: 'user', parts: [{ text: message }] };
    const fullHistory = [...history, newHistoryEntry];
    
    return streamChatFromWorker(fullHistory);
};

export const generateText = async (prompt: string): Promise<GeminiTextResponse> => {
    return callWorkerApi('text', { prompt });
};

export const generateCode = async (prompt: string): Promise<GeminiTextResponse> => {
    return callWorkerApi('code', { prompt });
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<GeminiImageResponse> => {
    return callWorkerApi('image', { prompt, aspectRatio });
};
