import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../services/api';
import './Blog.css';

const BlogPage = () => {
  const [blogs, setBlog] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await api.get('/blog/featured/posts');
      setFeatured(response.data.data);
    } catch (error) {
      console.error('Failed to fetch featured blogs:', error);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blog', {
        params: {
          search,
          category: category || undefined,
          page,
          limit: 10
        }
      });
      setBlog(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/blog/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Grid Maker Blog</h1>
        <p>Tips, tutorials, and updates about creating perfect grids</p>
      </div>

      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="featured-section">
          <h2>Featured Posts</h2>
          <div className="featured-grid">
            {featured.map((post) => (
              <div
                key={post._id}
                className="featured-card"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                {post.featuredImage && (
                  <div className="featured-image">
                    <img src={post.featuredImage} alt={post.title} />
                  </div>
                )}
                <div className="featured-content">
                  <span className="badge">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="post-meta">
                    <span className="author">{post.authorName}</span>
                    <span className="date">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="views">{post.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <section className="blog-controls">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-control">
          <FiFilter />
          <select value={category} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="blog-grid">
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <p>No blog posts found</p>
            <button onClick={() => window.location.reload()}>
              Reset Filters
            </button>
          </div>
        ) : (
          blogs.map((post) => (
            <div
              key={post._id}
              className="blog-card"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              {post.featuredImage && (
                <div className="blog-image">
                  <img src={post.featuredImage} alt={post.title} />
                </div>
              )}
              <div className="blog-info">
                <span className="category-badge">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-footer">
                  <span className="author">{post.authorName}</span>
                  <span className="date">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                className={pageNum === page ? 'active' : ''}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
