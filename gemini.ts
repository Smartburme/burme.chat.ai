import { GoogleGenAI } from "@google/genai";

interface GeminiRequest {
    type: 'chat' | 'text' | 'code' | 'image';
    payload: any;
}

interface Env {
    GEMINI_API_KEY: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
    try {
        const { type, payload } = await request.json() as GeminiRequest;
        const apiKey = env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key is not configured.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const ai = new GoogleGenAI({ apiKey });

        switch (type) {
            case 'chat': {
                const { history } = payload;
                const chat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    history: history.slice(0, -1), // History without the last user message
                });
                const lastMessage = history[history.length - 1].parts[0].text;
                const result = await chat.sendMessageStream({ message: lastMessage });

                const responseStream = new TransformStream();
                const writer = responseStream.writable.getWriter();
                const encoder = new TextEncoder();

                (async () => {
                    for await (const chunk of result) {
                        const text = chunk.text;
                        if (text) {
                            await writer.write(encoder.encode(text));
                        }
                    }
                    await writer.close();
                })();
                
                return new Response(responseStream.readable, {
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            }

            case 'text': {
                const { prompt } = payload;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { temperature: 0.7, topP: 1, topK: 1 }
                });
                return new Response(JSON.stringify({ text: response.text }), { headers: { 'Content-Type': 'application/json' }});
            }
            
            case 'code': {
                const { prompt } = payload;
                 const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        systemInstruction: "You are a world-class coding assistant. Provide clean, efficient, and well-documented code. When asked for code, provide only the code block in markdown format.",
                        temperature: 0.2,
                    }
                });
                return new Response(JSON.stringify({ text: response.text }), { headers: { 'Content-Type': 'application/json' }});
            }

            case 'image': {
                const { prompt, aspectRatio } = payload;
                const response = await ai.models.generateImages({
                    model: 'imagen-3.0-generate-002',
                    prompt,
                    config: { aspectRatio, numberOfImages: 1, outputMimeType: 'image/jpeg' }
                });
                return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' }});
            }

            default:
                return new Response(JSON.stringify({ error: 'Invalid API request type.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error: any) {
        console.error('Worker Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
