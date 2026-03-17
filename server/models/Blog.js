const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt'],
      maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide blog content']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Tips', 'Tutorial', 'Feature', 'Update', 'Design', 'Other'],
      default: 'Other'
    },
    tags: {
      type: [String],
      default: []
    },
    featuredImage: {
      type: String,
      default: null
    },
    published: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date,
      default: null
    },
    views: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    seoTitle: {
      type: String,
      maxlength: [60, 'SEO title cannot be more than 60 characters']
    },
    seoDescription: {
      type: String,
      maxlength: [160, 'SEO description cannot be more than 160 characters']
    },
    seoKeywords: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate slug from title before saving
BlogSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  // Create slug from title
  this.slug = this.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with single hyphen
  
  // Set publishedAt if being published
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Index for better query performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ published: 1, publishedAt: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });

module.exports = mongoose.model('Blog', BlogSchema);
