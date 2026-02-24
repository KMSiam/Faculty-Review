import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, Users, GraduationCap, MessageSquare, LayoutDashboard } from 'lucide-react';
import clsx from 'clsx';

const AdminNavbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Professors', path: '/admin?tab=professors', icon: GraduationCap },
        { name: 'Users', path: '/admin?tab=users', icon: Users },
        { name: 'Reports', path: '/admin?tab=reports', icon: MessageSquare },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-slate-900 border-b border-primary-500/30 shadow-2xl shadow-primary-500/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link to="/admin" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">
                                ADMIN<span className="text-primary-500">PANEL</span>
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                        location.pathname + location.search === link.path || (location.pathname === link.path && !location.search)
                                            ? "bg-primary-500/10 text-primary-400"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    )}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block h-6 w-px bg-slate-800 mx-2"></div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/5"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
