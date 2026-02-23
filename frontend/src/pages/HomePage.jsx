import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Award, Clock } from 'lucide-react';
import api from '../utils/api';
import ProfessorCard from '../components/ProfessorCard';

const HomePage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [topProfessors, setTopProfessors] = useState([]);
    const [stats, setStats] = useState({ professors: 0, reviews: 0, students: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profRes, statsRes] = await Promise.all([
                    api.get('/professors?limit=3'),
                    api.get('/stats')
                ]);
                setTopProfessors(profRes.data.slice(0, 3));
                setStats(statsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="space-y-16 animate-fade-in">
            {/* Hero Section */}
            <section className="text-center py-12 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Find the <span className="text-primary-500">Right</span> Professor.
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Review your professors, share your experience, and help fellow students make better choices.
                    </p>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="max-w-2xl mx-auto relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search by professor name, department, or university..."
                            className="w-full bg-dark-800 border-none rounded-2xl py-4 pl-14 pr-4 text-lg focus:ring-0 focus:outline-none shadow-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-2 px-6"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap justify-center gap-8 pt-8 text-slate-500">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        <span>Verified Reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-accent-500" />
                        <span>Top Rated Faculty</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-500" />
                        <span>Real-time Updates</span>
                    </div>
                </div>
            </section>

            {/* Featured/Top Professors */}
            <section className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Top Rated Professors</h2>
                        <p className="text-slate-400">Based on recent student feedback</p>
                    </div>
                    <Link to="/search" className="text-primary-400 hover:text-primary-300 font-medium">
                        View all →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass-card h-48 animate-pulse bg-slate-800/20"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topProfessors.map((prof) => (
                            <ProfessorCard key={prof._id} professor={prof} />
                        ))}
                        {topProfessors.length === 0 && (
                            <div className="col-span-3 text-center py-12 glass-card">
                                <p className="text-slate-500 italic">No professors added yet. Be the first to add one!</p>
                                <Link to="/add-professor" className="text-primary-400 hover:underline mt-2 inline-block">Add Professor</Link>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Real-time Stats Section */}
            <section className="glass-card p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-10"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-accent-500 rounded-full blur-[100px] opacity-10"></div>

                <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
                    <div className="space-y-1">
                        <div className="text-4xl font-black text-white transition-all duration-500 tabular-nums">
                            {loading ? '...' : stats.students.toLocaleString()}{stats.students > 1000 ? '+' : ''}
                        </div>
                        <div className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Active Students</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-4xl font-black text-primary-500 transition-all duration-500 tabular-nums">
                            {loading ? '...' : stats.professors.toLocaleString()}{stats.professors > 500 ? '+' : ''}
                        </div>
                        <div className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Verified Faculty</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-4xl font-black text-accent-500 transition-all duration-500 tabular-nums">
                            {loading ? '...' : stats.reviews.toLocaleString()}{stats.reviews > 1000 ? '+' : ''}
                        </div>
                        <div className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Total Reviews</div>
                    </div>
                </div>

                {/* Live Pulse Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Updates</span>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
