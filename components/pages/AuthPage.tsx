import React, { useState } from 'react';
import { auth } from '../../services/firebase';
import Input from '../ui/Input';
import Button from '../ui/Button';

type AuthMode = 'login' | 'register' | 'reset';

const AuthPage: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'login') {
                await auth.signInWithEmailAndPassword(email, password);
            } else if (mode === 'register') {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                if (userCredential.user) {
                  await userCredential.user.updateProfile({ displayName: username });
                }
            } else if (mode === 'reset') {
                await auth.sendPasswordResetEmail(email);
                setMessage('Password reset email sent! Check your inbox.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const AuthForm = () => (
      <form onSubmit={handleAuthAction} className="space-y-4">
        {mode === 'register' && (
            <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        )}
        {mode !== 'reset' ? (
          <>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </>
        ) : (
             <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        )}
        <Button type="submit" disabled={loading} className="w-full justify-center">
            {loading ? 'Processing...' : (mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Password')}
        </Button>
      </form>
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl">
                <div className="text-center">
                     <img src="https://picsum.photos/80/80" alt="App Logo" className="rounded-full mx-auto mb-4"/>
                    <h2 className="text-3xl font-bold text-white">Welcome</h2>
                    <p className="text-slate-400">
                        {mode === 'login' ? 'Sign in to continue' : mode === 'register' ? 'Create a new account' : 'Reset your password'}
                    </p>
                </div>

                {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}
                {message && <p className="text-green-400 bg-green-900/50 p-3 rounded-lg text-center">{message}</p>}

                <AuthForm />

                <div className="text-sm text-center text-slate-400">
                    {mode === 'login' ? (
                        <p>
                            Don't have an account?{' '}
                            <button onClick={() => { setMode('register'); setError(null); }} className="font-medium text-blue-400 hover:text-blue-500">
                                Register
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button onClick={() => { setMode('login'); setError(null); }} className="font-medium text-blue-400 hover:text-blue-500">
                                Login
                            </button>
                        </p>
                    )}
                     <p className="mt-2">
                        Forgot your password?{' '}
                        <button onClick={() => { setMode('reset'); setError(null); }} className="font-medium text-blue-400 hover:text-blue-500">
                           Reset it
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
