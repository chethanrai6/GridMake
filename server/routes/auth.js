const express = require('express');
const { signup, login, getMe } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', validateSignup, signup);

// @route   POST /api/auth/login  
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

module.exports = router;