import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GraduationCap, Building2, Star, MessageSquare, AlertCircle, PlusCircle, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';

const ProfessorProfilePage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [professor, setProfessor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profRes, reviewsRes] = await Promise.all([
                    api.get(`/professors/${id}`),
                    api.get(`/reviews/${id}`)
                ]);
                setProfessor(profRes.data);
                setReviews(reviewsRes.data);
                document.title = `${profRes.data.name} | FacultyReview`;
            } catch (err) {
                setError('Professor not found or server error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error || !professor) return (
        <div className="glass-card p-12 text-center max-w-2xl mx-auto mt-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Oops! {error}</h2>
            <Link to="/search" className="btn-primary inline-block mt-6">Back to Search</Link>
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Header Info */}
            <div className="glass-card p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-500/10 to-transparent -z-10"></div>

                <div className="space-y-4">
                    <div className="inline-flex items-center px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-primary-400 uppercase tracking-widest border border-slate-700">
                        Professor Profile
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white flex items-center gap-3">
                        {professor.name}
                        {professor.isVerified && (
                            <CheckCircle2 className="w-8 h-8 text-primary-500 fill-primary-500/10" />
                        )}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary-500" />
                            <span className="font-medium">{professor.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-accent-500" />
                            <span className="font-medium">{professor.university}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 px-8 py-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                    <div className="text-center">
                        <div className="text-4xl font-black text-primary-400 mb-1">{professor.avgRating.toFixed(1)}</div>
                        <StarRating rating={professor.avgRating} />
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Average Rating</div>
                    </div>
                    <div className="w-px h-16 bg-slate-700"></div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-accent-400 mb-1">{professor.avgDifficulty.toFixed(1)}</div>
                        <div className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-tighter">Difficulty</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">out of 5.0</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary-400" />
                    <h2 className="text-3xl font-bold text-white">Student Reviews</h2>
                    <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-sm font-bold">
                        {professor.reviewCount}
                    </span>
                </div>

                {user ? (
                    <Link to={`/professors/${professor._id}/review`} className="btn-primary flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" /> Write a Review
                    </Link>
                ) : (
                    <Link to="/login" className="btn-outline text-sm">Login to rate</Link>
                )}
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 gap-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                    ))
                ) : (
                    <div className="glass-card p-16 text-center">
                        <p className="text-slate-500 text-lg italic mb-6">This professor doesn't have any reviews yet.</p>
                        {user && (
                            <Link to={`/professors/${professor._id}/review`} className="btn-primary">
                                Be the first to write a review
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfessorProfilePage;
