import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquareIcon, FileTextIcon, ImageIcon, CodeIcon, InfoIcon, LogOutIcon } from '../Icons';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/auth');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const navItems = [
        { to: "/chat", icon: MessageSquareIcon, label: "Chat" },
        { to: "/text-gen", icon: FileTextIcon, label: "Text Gen" },
        { to: "/image-gen", icon: ImageIcon, label: "Image Gen" },
        { to: "/codex", icon: CodeIcon, label: "Codex" },
        { to: "/about", icon: InfoIcon, label: "About" },
    ];

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`;

    return (
        <aside className="w-64 flex-shrink-0 bg-slate-800 p-4 flex flex-col justify-between">
            <div>
                <div className="flex items-center mb-8">
                     <img src="https://picsum.photos/40/40" alt="App Logo" className="rounded-full mr-3"/>
                    <h1 className="text-xl font-bold text-white">Gemini App</h1>
                </div>
                <nav className="space-y-2">
                    {navItems.map(item => (
                        <NavLink key={item.to} to={item.to} className={getNavLinkClass}>
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center mb-4">
                     <img src={`https://i.pravatar.cc/40?u=${user?.uid}`} alt="User Avatar" className="w-10 h-10 rounded-full mr-3"/>
                    <div className="text-sm">
                        <p className="font-semibold text-white truncate">{user?.displayName || 'User'}</p>
                        <p className="text-slate-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
                >
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
