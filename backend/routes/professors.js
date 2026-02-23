const express = require('express');
const { body } = require('express-validator');
const {
    getProfessors,
    getProfessorById,
    createProfessor,
} = require('../controllers/professorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProfessors);
router.get('/:id', getProfessorById);

router.post(
    '/',
    protect,
    [
        body('name').trim().notEmpty().withMessage('Professor name is required'),
        body('department').trim().notEmpty().withMessage('Department is required'),
        body('university').trim().notEmpty().withMessage('University is required'),
    ],
    createProfessor
);

module.exports = router;
