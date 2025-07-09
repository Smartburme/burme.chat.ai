
import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const TextGenPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult('');

        try {
            const response = await generateText(prompt);
            setResult(response.text);
        } catch (err) {
            console.error(err);
            setError('Failed to generate text. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-4">Text Generator</h1>
            <p className="text-slate-400 mb-6">Enter a prompt and let the AI write for you. Great for ideas, drafts, and summaries.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Write a short story about a robot who discovers music."
                    className="w-full h-32 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !prompt.trim()}>
                    {isLoading ? 'Generating...' : 'Generate Text'}
                </Button>
            </form>

            <div className="mt-8 flex-1 overflow-y-auto">
                {isLoading && (
                    <div className="flex justify-center items-center h-full">
                        <Spinner />
                    </div>
                )}
                {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
                {result && (
                    <div className="p-6 bg-slate-800 rounded-lg whitespace-pre-wrap">
                        <h2 className="text-lg font-semibold text-white mb-2">Result:</h2>
                        <p className="text-slate-300 leading-relaxed">{result}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextGenPage;
