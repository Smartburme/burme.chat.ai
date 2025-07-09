
export type Role = 'user' | 'model';

export interface Part {
    text: string;
}

export interface Content {
    role: Role;
    parts: Part[];
}

export interface ChatMessage extends Content {
    timestamp: number;
}

export interface GeminiTextResponse {
   text: string;
}

export interface GeminiImageResponse {
    generatedImages: {
        image: {
            imageBytes: string;
        };
    }[];
}
