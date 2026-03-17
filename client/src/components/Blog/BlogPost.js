import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiEdit, FiTrash } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './BlogPost.css';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const response = await api.get(`/blog/${slug}`);
      setPost(response.data.data);
    } catch (error) {
      toast.error('Blog post not found');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/blog/${post._id}`);
      toast.success('Blog post deleted successfully');
      navigate('/blog');
    } catch (error) {
      toast.error('Failed to delete blog post');
    }
  };

  if (loading) {
    return <div className="blog-post-loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="blog-post-error">Post not found</div>;
  }

  const isAuthor = user && user._id === post.author;

  return (
    <div className="blog-post">
      <button className="back-button" onClick={() => navigate('/blog')}>
        <FiArrowLeft /> Back to Blog
      </button>

      <article className="post-content">
        {post.featuredImage && (
          <div className="post-featured-image">
            <img src={post.featuredImage} alt={post.title} />
          </div>
        )}

        <div className="post-header">
          <div className="post-meta-top">
            <span className="category">{post.category}</span>
            <span className="publish-date">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="views">{post.views} views</span>
          </div>

          <h1>{post.title}</h1>

          <div className="post-meta-bottom">
            <div>
              <span className="author-name">{post.authorName}</span>
            </div>
            {isAuthor && (
              <div className="post-actions">
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/blog/${post._id}/edit`)}
                >
                  <FiEdit /> Edit
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  <FiTrash /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="post-body">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index}>{paragraph}</p>
            )
          ))}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="tag"
                onClick={() => window.location.href = `/blog?search=${tag}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.seoDescription && (
          <div className="post-seo">
            <p className="seo-note">
              <strong>SEO:</strong> {post.seoDescription}
            </p>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;
