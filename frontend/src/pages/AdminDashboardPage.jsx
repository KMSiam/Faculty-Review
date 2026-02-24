import React, { useState, useEffect } from 'react';
import {
    Users,
    MessageSquare,
    GraduationCap,
    CheckCircle2,
    Trash2,
    Edit,
    X,
    AlertCircle,
    ShieldCheck,
    Search,
    Flag,
    CheckCircle
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import clsx from 'clsx';

const AdminDashboardPage = () => {
    const { addToast } = useToast();
    const [stats, setStats] = useState(null);
    const [professors, setProfessors] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');
    const [editingProfessor, setEditingProfessor] = useState(null);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        document.title = 'Admin Dashboard | FacultyReview';
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, profRes, usersRes, reportsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/professors'),
                api.get('/admin/users'),
                api.get('/admin/reports')
            ]);
            setStats(statsRes.data.stats);
            setProfessors(profRes.data);
            setUsers(usersRes.data);
            setReports(reportsRes.data);
        } catch (error) {
            addToast('Failed to fetch admin data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyProfessor = async (id) => {
        try {
            const { data } = await api.patch(`/admin/professors/${id}/verify`);
            setProfessors(professors.map(p => p._id === id ? { ...p, isVerified: data.isVerified } : p));
            addToast(data.message, 'success');
        } catch (error) {
            addToast('Verification toggle failed', 'error');
        }
    };

    const handleDeleteProfessor = async (id) => {
        if (!window.confirm('Are you sure? This will delete the professor and ALL their reviews.')) return;
        try {
            await api.delete(`/admin/professors/${id}`);
            setProfessors(professors.filter(p => p._id !== id));
            addToast('Professor deleted', 'success');
        } catch (error) {
            addToast('Deletion failed', 'error');
        }
    };

    const handleUpdateProfessor = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            department: formData.get('department'),
            university: formData.get('university')
        };

        try {
            const res = await api.put(`/admin/professors/${editingProfessor._id}`, data);
            setProfessors(professors.map(p => p._id === editingProfessor._id ? res.data : p));
            setEditingProfessor(null);
            addToast('Professor updated successfully', 'success');
        } catch (error) {
            addToast('Update failed', 'error');
        }
    };

    const handleToggleUserStatus = async (id) => {
        try {
            const { data } = await api.patch(`/admin/users/${id}/status`);
            setUsers(users.map(u => u._id === id ? { ...u, status: data.status } : u));
            addToast(data.message, 'success');
        } catch (error) {
            addToast('User status toggle failed', 'error');
        }
    };

    const handleDismissReport = async (id) => {
        try {
            await api.patch(`/admin/reviews/${id}/dismiss`);
            setReports(reports.filter(r => r._id !== id));
            addToast('Reports dismissed', 'success');
        } catch (error) {
            addToast('Dismiss failed', 'error');
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            setReports(reports.filter(r => r._id !== id));
            addToast('Review deleted', 'success');
        } catch (error) {
            addToast('Deletion failed', 'error');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                        <ShieldCheck className="w-10 h-10 text-primary-500" />
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2">Manage platform content and verify users</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl w-fit border border-slate-800">
                {['stats', 'professors', 'users', 'reports'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                            "px-6 py-2.5 rounded-lg text-sm font-bold transition-all capitalize flex items-center gap-2",
                            activeTab === tab
                                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        {tab === 'reports' && reports.length > 0 && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Stats Tab */}
            {activeTab === 'stats' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                    <div className="glass-card p-8 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-white">{stats.totalUsers}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Total Students</div>
                    </div>
                    <div className="glass-card p-8 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-accent-500/10 text-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-white">{stats.totalProfessors}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Total Professors</div>
                    </div>
                    <div className="glass-card p-8 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-white">{stats.totalReviews}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Total Reviews</div>
                    </div>
                    <div className="glass-card p-8 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Flag className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-white">{stats.reportedReviews}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Reported Reviews</div>
                    </div>
                </div>
            )}

            {/* Professors Tab */}
            {activeTab === 'professors' && (
                <div className="glass-card overflow-hidden animate-slide-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">University</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {professors.map((prof) => (
                                    <tr key={prof._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white flex items-center gap-2">
                                                {prof.name}
                                                {prof.isVerified && <CheckCircle2 className="w-4 h-4 text-primary-500" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{prof.department}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{prof.university}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleVerifyProfessor(prof._id)}
                                                className={clsx(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                                    prof.isVerified
                                                        ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                                        : "bg-slate-800 text-slate-500 border border-slate-700 hover:text-white"
                                                )}
                                            >
                                                {prof.isVerified ? 'Verified' : 'Verify'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingProfessor(prof)}
                                                    className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProfessor(prof._id)}
                                                    className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="glass-card overflow-hidden animate-slide-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{user.name}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{user.email}</td>
                                        <td className="px-6 py-4 text-sm uppercase tracking-widest font-bold">
                                            <span className={user.status === 'banned' ? 'text-red-500' : 'text-green-500'}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleToggleUserStatus(user._id)}
                                                className={clsx(
                                                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                    user.status === 'banned'
                                                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                        : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                                )}
                                            >
                                                {user.status === 'banned' ? 'Unban User' : 'Ban User'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
                <div className="space-y-4 animate-slide-up">
                    {reports.length === 0 ? (
                        <div className="glass-card p-20 text-center">
                            <CheckCircle className="w-16 h-16 text-green-500/20 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">All Clear!</h3>
                            <p className="text-slate-500">No reviews have been reported yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {reports.map((report) => (
                                <div key={report._id} className="glass-card p-6 border-l-4 border-red-500">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-red-500/10 text-red-500 rounded">
                                                    {report.reports?.length} Reports
                                                </span>
                                                <span className="text-slate-500 text-xs">
                                                    Target: <span className="text-white font-bold">{report.professorId?.name}</span>
                                                </span>
                                            </div>
                                            <p className="text-slate-300 italic mb-4">"{report.comment}"</p>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                                <span>By: {report.userId?.name}</span>
                                                <span>Rating: {report.rating}/5</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDismissReport(report._id)}
                                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
                                            >
                                                Dismiss
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(report._id)}
                                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                                            >
                                                Delete Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {editingProfessor && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditingProfessor(null)}></div>
                    <div className="glass-card w-full max-w-md p-8 relative animate-scale-in">
                        <button
                            onClick={() => setEditingProfessor(null)}
                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h3 className="text-2xl font-bold text-white mb-6">Edit Professor</h3>
                        <form onSubmit={handleUpdateProfessor} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    name="name"
                                    required
                                    defaultValue={editingProfessor.name}
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Department</label>
                                <input
                                    name="department"
                                    required
                                    defaultValue={editingProfessor.department}
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">University</label>
                                <input
                                    name="university"
                                    required
                                    defaultValue={editingProfessor.university}
                                    className="input-field"
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full py-3 mt-4">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
