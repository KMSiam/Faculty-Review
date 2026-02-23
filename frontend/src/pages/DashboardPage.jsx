import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, Clock, MessageSquare, Star, GraduationCap, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyReviews = async () => {
            try {
                const { data } = await api.get('/reviews/user/me');
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyReviews();
    }, []);

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Profile Bar */}
            <div className="glass-card p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-2xl">
                    <User className="w-16 h-16" />
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-white">{user?.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary-500" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-accent-500" />
                            <span>{user?.university}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-500" />
                            <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl text-center min-w-[120px]">
                        <div className="text-3xl font-black text-white">{reviews.length}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Total Reviews</div>
                    </div>
                </div>
            </div>

            {/* Activities */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary-500" />
                    Your Submitted Reviews
                </h2>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="glass-card h-32 animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-600 transition-all">
                                    <div className="space-y-2">
                                        <Link
                                            to={`/professors/${review.professorId?._id}`}
                                            className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors flex items-center gap-2"
                                        >
                                            {review.professorId?.name}
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </Link>
                                        <div className="flex items-center gap-3 text-sm text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>{review.professorId?.department}</span>
                                            </div>
                                            <span>•</span>
                                            <span>{review.professorId?.university}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 text-primary-400 font-bold justify-center">
                                                <Star className="w-4 h-4 fill-primary-400" /> {review.rating}/5
                                            </div>
                                            <div className="text-[10px] text-slate-500 uppercase font-bold">Rating</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-slate-300 font-bold">{review.difficulty}/5</div>
                                            <div className="text-[10px] text-slate-500 uppercase font-bold">Difficulty</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-slate-500 text-xs font-medium">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] text-slate-500 uppercase font-bold">Date</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <p className="text-slate-500 mb-4">You haven't written any reviews yet.</p>
                                <Link to="/search" className="btn-primary inline-block">Find a Professor</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
