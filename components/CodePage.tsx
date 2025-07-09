
import React, { useState } from 'react';
import { generateCode } from '../../services/geminiService';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const CodePage: React.FC = () => {
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
            const response = await generateCode(prompt);
            // Clean up markdown ```language and ``` markers
            const cleanedCode = response.text.replace(/^```(?:\w+\n)?/, '').replace(/```$/, '');
            setResult(cleanedCode);
        } catch (err) {
            console.error(err);
            setError('Failed to generate code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-4">Codex</h1>
            <p className="text-slate-400 mb-6">Your AI pair programmer. Ask for functions, classes, or entire scripts.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Write a python function to check if a number is prime."
                    className="w-full h-32 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !prompt.trim()}>
                    {isLoading ? 'Generating...' : 'Generate Code'}
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
                    <div className="bg-slate-950 rounded-lg overflow-hidden">
                       <div className="bg-slate-800 px-4 py-2 text-slate-300 text-sm flex justify-between items-center">
                          <span>Generated Code</span>
                          <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs hover:text-white">Copy</button>
                       </div>
                       <pre className="p-4 overflow-x-auto">
                          <code className="text-sm font-mono text-slate-200">{result}</code>
                       </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodePage;
