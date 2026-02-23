import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import api from '../utils/api';
import ProfessorCard from '../components/ProfessorCard';

const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const university = searchParams.get('university') || '';

    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(query);
    const [universityInput, setUniversityInput] = useState(university);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/professors?q=${query}&university=${university}`);
                setProfessors(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query, university]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: searchInput, university: universityInput });
    };

    const clearFilters = () => {
        setSearchInput('');
        setUniversityInput('');
        setSearchParams({});
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-4xl font-bold text-white">
                    {query || university ? 'Search Results' : 'Browse Professors'}
                </h1>
                <p className="text-slate-400">
                    {professors.length} professors found
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-6 sticky top-24">
                        <div className="flex items-center gap-2 mb-6">
                            <SlidersHorizontal className="w-5 h-5 text-primary-500" />
                            <h2 className="text-lg font-bold text-white">Filters</h2>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Professor Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="input-field text-sm"
                                        placeholder="e.g. Smith"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                    {searchInput && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchInput('')}
                                            className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">University</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="input-field text-sm"
                                        placeholder="e.g. Stanford"
                                        value={universityInput}
                                        onChange={(e) => setUniversityInput(e.target.value)}
                                    />
                                    {universityInput && (
                                        <button
                                            type="button"
                                            onClick={() => setUniversityInput('')}
                                            className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button type="submit" className="btn-primary w-full text-sm py-2.5">
                                    Apply Filters
                                </button>
                                {(query || university) && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </aside>

                {/* Main Results Grid */}
                <main className="lg:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="glass-card h-52 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {professors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {professors.map((prof) => (
                                        <ProfessorCard key={prof._id} professor={prof} />
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-12 text-center space-y-4">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 text-slate-500">
                                        <Search className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">No Professors Found</h3>
                                        <p className="text-slate-400 mt-2">
                                            We couldn't find any professors matching your criteria.
                                        </p>
                                    </div>
                                    <Link to="/add-professor" className="btn-primary inline-block">
                                        Add a New Professor
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchResultsPage;
