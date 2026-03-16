const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload image file
// @access  Private
router.post('/', auth, uploadImage);

module.exports = router;