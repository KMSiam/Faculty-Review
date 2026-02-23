const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Professor name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [100, 'Department cannot exceed 100 characters'],
    },
    university: {
        type: String,
        required: [true, 'University is required'],
        trim: true,
        maxlength: [150, 'University cannot exceed 150 characters'],
    },
    avgRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    avgDifficulty: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Text index for search
professorSchema.index({ name: 'text', university: 'text', department: 'text' });

module.exports = mongoose.model('Professor', professorSchema);
