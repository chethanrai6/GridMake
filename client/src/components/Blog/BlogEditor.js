import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiSave, FiX } from 'react-icons/fi';
import api from '../../services/api';
import './BlogEditor.css';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Other',
    tags: '',
    featuredImage: '',
    published: false,
    featured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const categories = ['Tips', 'Tutorial', 'Feature', 'Update', 'Design', 'Other'];

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/blog/${id}`);
      const post = response.data.data;
      setForm({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags.join(', '),
        featuredImage: post.featuredImage || '',
        published: post.published,
        featured: post.featured || false,
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || '',
        seoKeywords: post.seoKeywords.join(', ')
      });
    } catch (error) {
      toast.error('Failed to load post');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        seoKeywords: form.seoKeywords.split(',').map(kw => kw.trim()).filter(kw => kw)
      };

      if (id) {
        await api.put(`/blog/${id}`, payload);
        toast.success('Blog post updated successfully');
      } else {
        const response = await api.post('/blog', payload);
        toast.success('Blog post created successfully');
        navigate(`/blog/${response.data.data.slug}`);
        return;
      }

      setForm(prev => ({ ...prev, ...payload }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="editor-loading">Loading post...</div>;
  }

  return (
    <div className="blog-editor">
      <div className="editor-header">
        <h1>{id ? 'Edit Blog Post' : 'Create Blog Post'}</h1>
        <button
          className="btn-close"
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          <FiX /> Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Blog post title"
            required
          />
        </div>

        {/* Excerpt */}
        <div className="form-group">
          <label>Excerpt</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            placeholder="Brief summary (shown in listings)"
            rows="3"
            required
          />
        </div>

        {/* Content */}
        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Full blog post content"
            rows="15"
            required
          />
        </div>

        {/* Category & Tags */}
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="grid, design, tutorial"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div className="form-group">
          <label>Featured Image URL</label>
          <input
            type="url"
            name="featuredImage"
            value={form.featuredImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* SEO Fields */}
        <div className="seo-section">
          <h3>SEO Settings</h3>
          
          <div className="form-group">
            <label>SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              placeholder="Page title for search engines"
              maxLength="60"
            />
            <span className="char-count">{form.seoTitle.length}/60</span>
          </div>

          <div className="form-group">
            <label>SEO Description</label>
            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              placeholder="Page description for search engines"
              maxLength="160"
              rows="3"
            />
            <span className="char-count">{form.seoDescription.length}/160</span>
          </div>

          <div className="form-group">
            <label>SEO Keywords (comma-separated)</label>
            <input
              type="text"
              name="seoKeywords"
              value={form.seoKeywords}
              onChange={handleChange}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>

        {/* Publish Settings */}
        <div className="publish-section">
          <h3>Publish Settings</h3>
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              id="published"
            />
            <label htmlFor="published">Publish this post</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              id="featured"
            />
            <label htmlFor="featured">Feature this post</label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Save Post'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
