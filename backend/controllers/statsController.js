const Professor = require('../models/Professor');
const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Get real-time stats (counts)
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res, next) => {
    try {
        const [professorCount, reviewCount, userCount] = await Promise.all([
            Professor.countDocuments({ isVerified: true }),
            Review.countDocuments(),
            User.countDocuments(),
        ]);

        res.json({
            professors: professorCount,
            reviews: reviewCount,
            students: userCount,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getStats };
