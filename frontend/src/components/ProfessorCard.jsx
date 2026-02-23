import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { Building2, GraduationCap, Users } from 'lucide-react';

const ProfessorCard = ({ professor }) => {
    return (
        <Link
            to={`/professors/${professor._id}`}
            className="glass-card p-6 block hover:border-primary-500/50 transition-all hover:-translate-y-1 group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                        {professor.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>{professor.department}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary-400">{professor.avgRating.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Rating</div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <Building2 className="w-4 h-4" />
                <span>{professor.university}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <StarRating rating={professor.avgRating} />
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <Users className="w-3 h-3" />
                    <span>{professor.reviewCount} reviews</span>
                </div>
            </div>
        </Link>
    );
};

export default ProfessorCard;
