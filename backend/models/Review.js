const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    professorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
        required: [true, 'Professor ID is required'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    difficulty: {
        type: Number,
        required: [true, 'Difficulty is required'],
        min: [1, 'Difficulty must be at least 1'],
        max: [5, 'Difficulty cannot exceed 5'],
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure one review per user per professor
reviewSchema.index({ professorId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
