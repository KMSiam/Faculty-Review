const User = require('../models/User');
const Professor = require('../models/Professor');
const Review = require('../models/Review');

// @desc    Get all stats for admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        const [totalUsers, totalProfessors, totalReviews] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            Professor.countDocuments(),
            Review.countDocuments()
        ]);

        res.json({
            stats: {
                totalUsers,
                totalProfessors,
                totalReviews
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all professors for management
// @route   GET /api/admin/professors
// @access  Private/Admin
const getAllProfessors = async (req, res, next) => {
    try {
        const professors = await Professor.find().sort({ createdAt: -1 });
        res.json(professors);
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle professor verification status
// @route   PATCH /api/admin/professors/:id/verify
// @access  Private/Admin
const toggleProfessorVerification = async (req, res, next) => {
    try {
        const professor = await Professor.findById(req.params.id);
        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }

        professor.isVerified = !professor.isVerified;
        await professor.save();

        res.json({
            message: `Professor ${professor.isVerified ? 'verified' : 'unverified'} successfully`,
            isVerified: professor.isVerified
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update professor details
// @route   PUT /api/admin/professors/:id
// @access  Private/Admin
const updateProfessor = async (req, res, next) => {
    try {
        const { name, department, university } = req.body;
        const professor = await Professor.findById(req.params.id);

        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }

        professor.name = name || professor.name;
        professor.department = department || professor.department;
        professor.university = university || professor.university;

        await professor.save();
        res.json(professor);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a professor and their reviews
// @route   DELETE /api/admin/professors/:id
// @access  Private/Admin
const deleteProfessor = async (req, res, next) => {
    try {
        const professor = await Professor.findById(req.params.id);
        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }

        // Delete all reviews associated with this professor
        await Review.deleteMany({ professorId: req.params.id });

        // Delete the professor
        await professor.deleteOne();

        res.json({ message: 'Professor and all associated reviews deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users (students)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'student' }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle user status (ban/unban)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot ban an admin user' });
        }

        user.status = user.status === 'banned' ? 'active' : 'banned';
        await user.save();

        res.json({
            message: `User ${user.status === 'banned' ? 'banned' : 'unbanned'} successfully`,
            status: user.status
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getAllProfessors,
    toggleProfessorVerification,
    updateProfessor,
    deleteProfessor,
    getAllUsers,
    toggleUserStatus
};
