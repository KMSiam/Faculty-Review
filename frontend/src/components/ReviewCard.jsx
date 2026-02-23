import React, { useState } from 'react';
import { User, Calendar, Award, ThumbsUp } from 'lucide-react';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import clsx from 'clsx';

const ReviewCard = ({ review }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [helpfulCount, setHelpfulCount] = useState(review.helpfulVotes?.length || 0);
    const [isHelpful, setIsHelpful] = useState(review.helpfulVotes?.includes(user?._id));
    const [isVoting, setIsVoting] = useState(false);

    const date = new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleHelpfulToggle = async () => {
        if (!user) {
            addToast('Please login to mark reviews as helpful', 'error');
            return;
        }

        if (isVoting) return;

        try {
            setIsVoting(true);
            const { data } = await api.patch(`/reviews/${review._id}/helpful`);
            setHelpfulCount(data.helpfulCount);
            setIsHelpful(data.isHelpful);
        } catch (error) {
            console.error('Error toggling helpful:', error);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="glass-card p-8 animate-fade-in relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 -translate-y-12 translate-x-12 rounded-full group-hover:bg-primary-500/10 transition-colors"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">{review.userId?.name || 'Anonymous Student'}</h4>
                        <p className="text-xs text-slate-500">{review.userId?.university || 'University Student'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-tighter mb-1">Rating</div>
                        <StarRating rating={review.rating} />
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-tighter mb-1">Difficulty</div>
                        <div className="text-sm font-bold text-accent-400">{review.difficulty}/5</div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <p className="text-slate-300 leading-relaxed text-lg italic">
                    "{review.comment}"
                </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-between items-center text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{date}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleHelpfulToggle}
                        disabled={isVoting}
                        className={clsx(
                            "flex items-center gap-1.5 transition-all active:scale-95",
                            isHelpful ? "text-primary-400 font-bold" : "hover:text-primary-400"
                        )}
                    >
                        <ThumbsUp className={clsx("w-4 h-4", isHelpful && "fill-primary-400")} />
                        Helpful ({helpfulCount})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
