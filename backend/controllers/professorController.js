const { validationResult } = require('express-validator');
const Professor = require('../models/Professor');

// @desc    Get all professors (with optional search)
// @route   GET /api/professors?q=&university=
// @access  Public
const getProfessors = async (req, res, next) => {
    try {
        const { q, university, limit, minReviews } = req.query;
        const filter = {};

        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { department: { $regex: q, $options: 'i' } },
                { university: { $regex: q, $options: 'i' } },
            ];
        }

        if (university) {
            filter.university = { $regex: university, $options: 'i' };
        }

        if (minReviews) {
            filter.reviewCount = { $gte: parseInt(minReviews) };
        }

        const professors = await Professor.find(filter)
            .sort({ avgRating: -1, reviewCount: -1 })
            .limit(limit ? parseInt(limit) : 50);

        res.json(professors);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single professor by ID
// @route   GET /api/professors/:id
// @access  Public
const getProfessorById = async (req, res, next) => {
    try {
        const professor = await Professor.findById(req.params.id);
        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }
        res.json(professor);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new professor
// @route   POST /api/professors
// @access  Private
const createProfessor = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { name, department, university } = req.body;

        const professor = await Professor.create({ name, department, university });
        res.status(201).json(professor);
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfessors, getProfessorById, createProfessor };
