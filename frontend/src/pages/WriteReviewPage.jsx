import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, AlertCircle, Send, CheckCircle2, ChevronLeft } from 'lucide-react';
import api from '../utils/api';
import StarRating from '../components/StarRating';

const WriteReviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [professor, setProfessor] = useState(null);
    const [formData, setFormData] = useState({
        rating: 0,
        difficulty: 0,
        comment: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfessor = async () => {
            try {
                const { data } = await api.get(`/professors/${id}`);
                setProfessor(data);
            } catch (err) {
                setError('Could not find professor details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfessor();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) return setError('Please select a rating');
        if (formData.difficulty === 0) return setError('Please select difficulty level');

        setError('');
        setIsSubmitting(true);
        try {
            await api.post('/reviews', { ...formData, professorId: id });
            setSuccess(true);
            setTimeout(() => navigate(`/professors/${id}`), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post review. You might have already reviewed this professor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (success) return (
        <div className="max-w-xl mx-auto mt-20 animate-fade-in text-center">
            <div className="glass-card p-12">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Review Submitted!</h2>
                <p className="text-slate-400">Thanks for sharing your feedback. Redirecting you to professor profile...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto animate-slide-up">
            <Link to={`/professors/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Professor Profile
            </Link>

            <div className="glass-card p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 text-slate-800 rotate-12 -z-10 group-hover:scale-110 transition-transform">
                    <Send className="w-32 h-32 opacity-10" />
                </div>

                <div className="mb-8 border-b border-slate-700/50 pb-8">
                    <h1 className="text-3xl font-extrabold text-white">Rate Professor {professor?.name}</h1>
                    <p className="text-slate-400 mt-2">{professor?.department} • {professor?.university}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-lg font-bold text-white block">Overall Rating</label>
                            <p className="text-sm text-slate-500 mb-4">How would you rate this professor overall?</p>
                            <StarRating
                                rating={formData.rating}
                                interactive
                                onRatingChange={(val) => setFormData({ ...formData, rating: val })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-lg font-bold text-white block">Difficulty Level</label>
                            <p className="text-sm text-slate-500 mb-4">How hard was it to get a good grade?</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, difficulty: num })}
                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${formData.difficulty === num
                                                ? 'bg-accent-500 text-white scale-110 shadow-lg shadow-accent-500/20'
                                                : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-lg font-bold text-white block">Your Review</label>
                        <p className="text-sm text-slate-500 mb-4">Share your honest experience (teaching style, grading, workload, etc.)</p>
                        <textarea
                            required
                            rows="6"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                            placeholder="What should other students know about this professor?"
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send className="w-5 h-5" /> Post My Review
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WriteReviewPage;
