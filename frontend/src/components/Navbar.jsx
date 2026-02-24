import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, LogOut, Menu, X, PlusCircle, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setMobileMenuOpen(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                                FacultyReview
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search professors or universities..."
                                className="w-full bg-dark-800 border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                        </form>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/add-professor" className="text-slate-300 hover:text-white flex items-center gap-1 text-sm font-medium">
                                    <PlusCircle className="w-4 h-4" /> Add Professor
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="text-primary-400 hover:text-primary-300 flex items-center gap-1 text-sm font-bold">
                                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                                    </Link>
                                )}
                                <Link to="/dashboard" className="text-slate-300 hover:text-white flex items-center gap-1 text-sm font-medium">
                                    <User className="w-4 h-4" /> Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-slate-300 hover:text-red-400 flex items-center gap-1 text-sm font-medium transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium">Login</Link>
                                <Link to="/signup" className="btn-primary py-1.5 px-4 text-sm">Sign Up</Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white hover:text-primary-400"
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-dark-900 border-b border-slate-800 px-4 pt-2 pb-6 animate-fade-in">
                    <form onSubmit={handleSearch} className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-dark-800 border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </form>
                    <div className="flex flex-col space-y-4">
                        {user ? (
                            <>
                                <Link to="/add-professor" onClick={() => setMobileMenuOpen(false)} className="text-slate-300">Add Professor</Link>
                                {isAdmin && (
                                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-primary-400 font-bold">Admin Panel</Link>
                                )}
                                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-slate-300">Dashboard</Link>
                                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-red-400">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-slate-300">Login</Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
