const Blog = require('../models/Blog');

// @desc    Get all published blog posts with pagination
// @route   GET /api/blog
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || null;

    // Build filter
    const filter = { published: true };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    // Get total count for pagination
    const total = await Blog.countDocuments(filter);

    // Get paginated results
    const blogs = await Blog.find(filter)
      .select('title slug excerpt featuredImage category tags publishedAt authorName views featured')
      .sort({ featured: -1, publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    res.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
};

// @desc    Get featured blogs (max 5)
// @route   GET /api/blog/featured
// @access  Public
const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true, featured: true })
      .select('title slug excerpt featuredImage category publishedAt authorName views')
      .sort({ publishedAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured blogs',
      error: error.message
    });
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Only return published posts to public
    if (!blog.published && req.user?._id.toString() !== blog.author.toString()) {
      return res.status(403).json({
        success: false,
        message: 'This blog post is not published'
      });
    }

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error.message
    });
  }
};

// @desc    Create new blog post (Admin only)
// @route   POST /api/blog
// @access  Private (Admin)
const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, featuredImage, published, featured, seoTitle, seoDescription, seoKeywords } = req.body;

    // Validate required fields
    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, excerpt, and content'
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');

    // Check if slug already exists
    const slugCheck = await Blog.findOne({ slug });

    if (slugCheck) {
      return res.status(400).json({
        success: false,
        message: 'A blog post with this title already exists'
      });
    }

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      author: req.user._id,
      authorName: req.user.name || req.user.email,
      category: category || 'Other',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      featuredImage: featuredImage || null,
      published: published || false,
      featured: featured || false,
      publishedAt: published ? new Date() : null,
      seoTitle: seoTitle || title,
      seoDescription,
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : (seoKeywords ? seoKeywords.split(',').map(k => k.trim()) : [])
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
};

// @desc    Update blog post (Author only)
// @route   PUT /api/blog/:id
// @access  Private
const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check authorization - only author or admin can edit
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog post'
      });
    }

    // Update fields
    const { title, excerpt, content, category, tags, featuredImage, published, featured, seoTitle, seoDescription, seoKeywords } = req.body;

    if (title) blog.title = title;
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;
    if (published !== undefined) blog.published = published;
    if (featured !== undefined) blog.featured = featured;
    if (seoTitle) blog.seoTitle = seoTitle;
    if (seoDescription) blog.seoDescription = seoDescription;
    if (seoKeywords) blog.seoKeywords = seoKeywords;

    blog = await blog.save();

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message
    });
  }
};

// @desc    Delete blog post (Author only)
// @route   DELETE /api/blog/:id
// @access  Private
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check authorization
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog post'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message
    });
  }
};

// @desc    Get my draft blogs (Author)
// @route   GET /api/blog/my/drafts
// @access  Private
const getMyDrafts = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user._id,
      published: false
    })
      .select('title slug excerpt category publishedAt createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drafts',
      error: error.message
    });
  }
};

// @desc    Get blog categories
// @route   GET /api/blog/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { published: true });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

module.exports = {
  getBlogs,
  getFeaturedBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyDrafts,
  getCategories
};
