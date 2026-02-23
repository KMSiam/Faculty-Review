const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Professor = require('../models/Professor');

// @desc    Create a review for a professor
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { professorId, rating, difficulty, comment } = req.body;

        // Verify professor exists
        const professor = await Professor.findById(professorId);
        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }

        // Check if user already reviewed this professor
        const existingReview = await Review.findOne({
            professorId,
            userId: req.user._id,
        });
        if (existingReview) {
            return res.status(400).json({
                message: 'You have already reviewed this professor',
            });
        }

        const review = await Review.create({
            professorId,
            userId: req.user._id,
            rating,
            difficulty,
            comment,
        });

        // Update professor average rating and review count
        const allReviews = await Review.find({ professorId });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const totalDifficulty = allReviews.reduce((sum, r) => sum + r.difficulty, 0);
        const count = allReviews.length;

        professor.avgRating = Math.round((totalRating / count) * 10) / 10;
        professor.avgDifficulty = Math.round((totalDifficulty / count) * 10) / 10;
        professor.reviewCount = count;
        await professor.save();

        // Populate user info before returning
        const populatedReview = await Review.findById(review._id).populate(
            'userId',
            'name university'
        );

        res.status(201).json(populatedReview);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reviews for a professor
// @route   GET /api/reviews/:professorId
// @access  Public
const getReviewsByProfessor = async (req, res, next) => {
    try {
        const reviews = await Review.find({ professorId: req.params.professorId })
            .populate('userId', 'name university')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reviews by the current user
// @route   GET /api/reviews/user/me
// @access  Private
const getMyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ userId: req.user._id })
            .populate('professorId', 'name department university')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

module.exports = { createReview, getReviewsByProfessor, getMyReviews };
