
import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="p-8 text-slate-300">
            <h1 className="text-4xl font-bold text-white mb-6">About This Application</h1>
            
            <div className="max-w-3xl space-y-6 leading-relaxed">
                <p>
                    This is a demonstration application showcasing the power and versatility of Google's Gemini API integrated into a modern web frontend. It's built as a Single-Page Application (SPA) using React and TypeScript, providing a seamless and responsive user experience.
                </p>

                <div className="p-6 bg-slate-800/50 rounded-lg">
                    <h2 className="text-2xl font-semibold text-white mb-3">Core Technologies</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>React 18:</strong> For building a dynamic and component-based user interface.</li>
                        <li><strong>TypeScript:</strong> For robust, type-safe code.</li>
                        <li><strong>Google Gemini API:</strong> The AI powerhouse for all generative features.
                            <ul className="list-['-_'] list-inside ml-6 mt-1 text-slate-400">
                                <li><span className="font-mono text-xs text-sky-300">gemini-2.5-flash:</span> Used for fast and high-quality chat, text, and code generation.</li>
                                <li><span className="font-mono text-xs text-sky-300">imagen-3.0-generate-002:</span> Used for creating stunning images from text prompts.</li>
                            </ul>
                        </li>
                        <li><strong>Firebase Authentication:</strong> For secure and easy user management.</li>
                        <li><strong>Tailwind CSS:</strong> For a utility-first approach to styling, enabling a beautiful and consistent design without custom CSS files.</li>
                        <li><strong>React Router:</strong> For client-side routing within the single-page application structure.</li>
                    </ul>
                </div>
                
                <h2 className="text-2xl font-semibold text-white mb-3 pt-4">Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-800 rounded-lg">
                        <h3 className="font-bold text-lg text-white">Conversational Chat</h3>
                        <p className="text-sm text-slate-400">Engage in dynamic, streaming conversations with the AI.</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                        <h3 className="font-bold text-lg text-white">Text Generation</h3>
                        <p className="text-sm text-slate-400">Generate creative text, from stories to summaries.</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                        <h3 className="font-bold text-lg text-white">Image Generation</h3>
                        <p className="text-sm text-slate-400">Bring your ideas to life with AI-powered image creation.</p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                        <h3 className="font-bold text-lg text-white">Code Generation (Codex)</h3>
                        <p className="text-sm text-slate-400">Get assistance with writing code in various languages.</p>
                    </div>
                </div>

                <p className="pt-4 border-t border-slate-700">
                    The "floating site" aesthetic is achieved through the use of layered elements, shadows, and a dark, modern color palette, creating a user interface that is both functional and visually appealing.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
