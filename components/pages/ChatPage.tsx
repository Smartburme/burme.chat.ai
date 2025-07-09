
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Content } from '../../types';
import { streamChat } from '../../services/geminiService';
import { SendIcon } from '../Icons';
import { useAuth } from '../../hooks/useAuth';

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            parts: [{ text: input }],
            timestamp: Date.now()
        };
        
        const currentHistory: Content[] = messages.map(msg => ({
            role: msg.role,
            parts: msg.parts
        }));

        setMessages(prev => [...prev, userMessage]);
        
        setIsLoading(true);
        setError(null);
        const currentInput = input;
        setInput('');

        try {
            const stream = await streamChat(currentHistory, currentInput);
            if (!stream) {
                throw new Error("Could not get response stream.");
            }

            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let modelResponse = '';
            
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }], timestamp: Date.now() }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                const chunkText = decoder.decode(value, { stream: true });
                modelResponse += chunkText;
                
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.parts = [{ text: modelResponse }];
                    }
                    return newMessages;
                });
            }
        } catch (err: any) {
            console.error(err);
            const errorMessage = `Sorry, something went wrong: ${err.message}`;
            setError(errorMessage);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'model' && lastMessage.parts[0].text === '') {
                    newMessages.pop();
                }
                return [...newMessages, { role: 'model', parts: [{ text: 'An error occurred.' }], timestamp: Date.now() }];
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full p-6 bg-slate-900">
            <h1 className="text-2xl font-bold text-white mb-4">Chat</h1>
            <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <img src="https://picsum.photos/40/40" alt="Model" className="w-10 h-10 rounded-full" />}
                        <div className={`max-w-xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                           <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                        </div>
                        {msg.role === 'user' && <img src={`https://i.pravatar.cc/40?u=${user?.uid}`} alt="User" className="w-10 h-10 rounded-full" />}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-4">
                        <img src="https://picsum.photos/40/40" alt="Model" className="w-10 h-10 rounded-full" />
                        <div className="max-w-xl p-4 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                {error && <p className="text-red-400 text-center">{error}</p>}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-6 flex items-center gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-full text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                    <SendIcon className="w-6 h-6" />
                </button>
            </form>
        </div>
    );
};

export default ChatPage;