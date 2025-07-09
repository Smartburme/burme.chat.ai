
import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageGenPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setImageUrl('');

        try {
            const response = await generateImage(prompt, aspectRatio);
            if (response.generatedImages && response.generatedImages.length > 0) {
                 const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                 setImageUrl(`data:image/jpeg;base64,${base64ImageBytes}`);
            } else {
                 setError('The model did not return an image. Try a different prompt.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate image. The prompt may have been blocked.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-4">Image Generator</h1>
            <p className="text-slate-400 mb-6">Describe an image you want to create. Be as descriptive as possible for the best results.</p>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A photorealistic image of a majestic lion wearing a crown, sitting on a throne on Mars."
                    className="w-full h-24 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label htmlFor="aspect-ratio" className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
                        <select
                            id="aspect-ratio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                        </select>
                    </div>
                    <Button type="submit" disabled={isLoading || !prompt.trim()} className="self-end">
                        {isLoading ? 'Generating...' : 'Generate Image'}
                    </Button>
                </div>
            </form>

            <div className="flex-1 flex justify-center items-center bg-slate-800/50 rounded-lg overflow-hidden">
                {isLoading && <Spinner />}
                {error && <p className="text-red-400 p-4">{error}</p>}
                {imageUrl && !isLoading && (
                    <img src={imageUrl} alt={prompt} className="max-w-full max-h-full object-contain" />
                )}
                {!imageUrl && !isLoading && !error && (
                     <p className="text-slate-500">Your generated image will appear here</p>
                )}
            </div>
        </div>
    );
};

export default ImageGenPage;
