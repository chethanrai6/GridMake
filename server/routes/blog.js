const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getFeaturedBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyDrafts,
  getCategories
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getBlogs);
router.get('/featured/posts', getFeaturedBlogs);
router.get('/categories', getCategories);
router.get('/:slug', getBlogBySlug);

// Protected routes (authenticated users)
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.get('/author/drafts', protect, getMyDrafts);

module.exports = router;
