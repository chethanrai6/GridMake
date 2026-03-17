import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiSave, FiX, FiUpload, FiImage } from 'react-icons/fi';
import api from '../../services/api';
import './BlogEditor.css';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const contentTextareaRef = useRef(null);
  const featuredImageInputRef = useRef(null);
  const contentImageInputRef = useRef(null);

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

  const fetchPost = useCallback(async () => {
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
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id, fetchPost]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('blogImage', file);

      const response = await api.post('/upload/blog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setForm(prev => ({
          ...prev,
          featuredImage: response.data.data.url
        }));
        toast.success('Featured image uploaded successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload featured image');
    } finally {
      setUploading(false);
      if (featuredImageInputRef.current) {
        featuredImageInputRef.current.value = '';
      }
    }
  };

  const handleContentImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('blogImage', file);

      const response = await api.post('/upload/blog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        // Insert markdown image syntax at cursor position
        const imageMarkdown = `![${file.name}](${response.data.data.url})`;
        const textarea = contentTextareaRef.current;
        
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newContent = 
            form.content.substring(0, start) + 
            '\n' + imageMarkdown + '\n' + 
            form.content.substring(end);
          
          setForm(prev => ({
            ...prev,
            content: newContent
          }));
          
          // Reset cursor position after update
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + imageMarkdown.length + 2, start + imageMarkdown.length + 2);
          }, 0);
        }
        
        toast.success('Image inserted into content');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (contentImageInputRef.current) {
        contentImageInputRef.current.value = '';
      }
    }
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

        {/* Content with Image Upload */}
        <div className="form-group">
          <div className="label-with-button">
            <label>Content</label>
            <button
              type="button"
              className="btn-insert-image"
              disabled={uploading}
              onClick={() => contentImageInputRef.current?.click()}
            >
              <FiImage /> {uploading ? 'Uploading...' : 'Insert Image'}
            </button>
            <input
              ref={contentImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleContentImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          <textarea
            ref={contentTextareaRef}
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Full blog post content (Use 'Insert Image' button to add images)"
            rows="15"
            required
          />
          <small style={{ color: '#666', marginTop: '5px' }}>
            💡 Tip: Click 'Insert Image' to upload images. They'll be inserted as markdown: ![alt text](image-url)
          </small>
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
          <label>Featured Image</label>
          <div className="featured-image-upload">
            <div className="image-input-group">
              <input
                ref={featuredImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn-upload"
                disabled={uploading}
                onClick={() => featuredImageInputRef.current?.click()}
              >
                <FiUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <span className="or-text">or paste URL:</span>
              <input
                type="url"
                name="featuredImage"
                value={form.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {form.featuredImage && (
              <div className="featured-image-preview">
                <img src={form.featuredImage} alt="Featured" style={{ maxWidth: '200px', borderRadius: '4px' }} />
              </div>
            )}
          </div>
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
