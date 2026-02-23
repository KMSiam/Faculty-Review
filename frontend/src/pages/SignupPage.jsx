import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, Mail, Lock, User, Building, AlertCircle, Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Sign Up | FacultyReview';
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await register(formData);
            addToast('Account created successfully!', 'success');
            navigate('/');
        } catch (err) {
            if (!err.response) {
                setError('Network error: Is the backend server running?');
            } else {
                setError(err.response.data?.message || 'Something went wrong. Please try again.');
            }
            addToast(err.response?.data?.message || 'Registration failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 animate-slide-up">
            <div className="glass-card p-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 text-accent-500 mb-4">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Join the Community</h1>
                    <p className="text-slate-400 mt-2">Start sharing your academic experiences</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                required
                                className="input-field pl-11"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <User className="absolute left-3.5 top-2.5 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                required
                                className="input-field pl-11"
                                placeholder="name@university.edu"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Mail className="absolute left-3.5 top-2.5 w-5 h-5 text-slate-500" />
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
                                placeholder="University Name"
                                value={formData.university}
                                onChange={handleChange}
                            />
                            <Building className="absolute left-3.5 top-2.5 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                minLength="6"
                                className="input-field pl-11 pr-11"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <Lock className="absolute left-3.5 top-2.5 w-5 h-5 text-slate-500" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-3 mt-4 disabled:opacity-50 flex items-center justify-center gap-2 shadow-accent-500/20"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
