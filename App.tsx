
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/pages/AuthPage';
import MainLayout from './components/layout/MainLayout';
import ChatPage from './components/pages/ChatPage';
import TextGenPage from './components/pages/TextGenPage';
import ImageGenPage from './components/pages/ImageGenPage';
import CodePage from './components/pages/CodePage';
import AboutPage from './components/pages/AboutPage';
import Spinner from './components/ui/Spinner';

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="text-slate-200">
            <Routes>
                {!user ? (
                    <>
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="*" element={<Navigate to="/auth" replace />} />
                    </>
                ) : (
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Navigate to="/chat" replace />} />
                        <Route path="chat" element={<ChatPage />} />
                        <Route path="text-gen" element={<TextGenPage />} />
                        <Route path="image-gen" element={<ImageGenPage />} />
                        <Route path="codex" element={<CodePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="*" element={<Navigate to="/chat" replace />} />
                    </Route>
                )}
            </Routes>
        </div>
    );
}

export default App;
