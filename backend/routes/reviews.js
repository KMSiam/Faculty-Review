const express = require('express');
const { body } = require('express-validator');
const {
    createReview,
    getReviewsByProfessor,
    getMyReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/user/me', protect, getMyReviews);
router.get('/:professorId', getReviewsByProfessor);

router.post(
    '/',
    protect,
    [
        body('professorId').notEmpty().withMessage('Professor ID is required'),
        body('rating')
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5'),
        body('difficulty')
            .isInt({ min: 1, max: 5 })
            .withMessage('Difficulty must be between 1 and 5'),
        body('comment')
            .trim()
            .notEmpty()
            .withMessage('Comment is required')
            .isLength({ max: 1000 })
            .withMessage('Comment cannot exceed 1000 characters'),
    ],
    createReview
);

module.exports = router;
