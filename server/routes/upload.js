const express = require('express');
const { uploadImage, uploadBlogImage } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload image file
// @access  Private
router.post('/', auth, uploadImage);

// @route   POST /api/upload/blog
// @desc    Upload blog image (featured or in-content)
// @access  Private
router.post('/blog', auth, uploadBlogImage);

module.exports = router;