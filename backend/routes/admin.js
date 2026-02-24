const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllProfessors,
    toggleProfessorVerification,
    updateProfessor,
    deleteProfessor,
    getAllUsers,
    toggleUserStatus
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

// All routes here are protected and admin-only
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);

// Professor management
router.get('/professors', getAllProfessors);
router.patch('/professors/:id/verify', toggleProfessorVerification);
router.put('/professors/:id', updateProfessor);
router.delete('/professors/:id', deleteProfessor);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);

module.exports = router;
