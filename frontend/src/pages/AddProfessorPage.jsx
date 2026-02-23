import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Building2, GraduationCap, User, AlertCircle, ChevronLeft, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const AddProfessorPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        university: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [professorId, setProfessorId] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const { data } = await api.post('/professors', formData);
            setProfessorId(data._id);
            setSuccess(true);
            setTimeout(() => navigate(`/professors/${data._id}`), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add professor. Please check your inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) return (
        <div className="max-w-xl mx-auto mt-20 animate-fade-in text-center">
            <div className="glass-card p-12">
                <div className="w-20 h-20 bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Professor Added!</h2>
                <p className="text-slate-400">Successfully added to our database. Redirecting to profile...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto animate-slide-up">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="glass-card p-10">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-700/50 pb-8">
                    <div className="w-14 h-14 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center">
                        <PlusCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Add a Professor</h1>
                        <p className="text-slate-400">Help students by adding a missing faculty member</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Professor Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                required
                                className="input-field pl-11"
                                placeholder="e.g. Dr. John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <User className="absolute left-3.5 top-2.5 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Department</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="department"
                                required
                                className="input-field pl-11"
                                placeholder="e.g. Computer Science"
                                value={formData.department}
                                onChange={handleChange}
                            />
                            <GraduationCap className="absolute left-3.5 top-2.5 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">University</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="university"
                                required
                                className="input-field pl-11"
                                placeholder="e.g. Harvard University"
                                value={formData.university}
                                onChange={handleChange}
                            />
                            <Building2 className="absolute left-3.5 top-2.5 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-4 mt-4 font-bold flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Add Professor'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProfessorPage;
