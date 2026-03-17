import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FiPlusCircle,
  FiGrid,
  FiArrowRight,
  FiZap,
  FiUploadCloud,
  FiCheckCircle,
} from 'react-icons/fi';
import { useProject } from '../../contexts/ProjectContext';
import ProjectCard from './ProjectCard';

/* ─── Empty State Visual ─────────────────────────────────── */
function EmptyStateVisual() {
  return (
    <div className="empty-visual" aria-hidden="true">
      <div className="empty-visual-content">
        <svg className="empty-grid-illustration" viewBox="0 0 280 220" xmlns="http://www.w3.org/2000/svg">
          {/* Background card */}
          <rect x="20" y="40" width="240" height="160" rx="12" fill="rgba(255,255,255,0.8)" stroke="rgba(13,107,176,0.15)" strokeWidth="1.5" />

          {/* Grid lines */}
          {[80, 140, 200].map((x, i) => (
            <line
              key={`v${i}`}
              x1={x}
              y1="60"
              x2={x}
              y2="180"
              stroke="rgba(13,107,176,0.3)"
              strokeWidth="1.2"
            />
          ))}
          {[90, 130, 170].map((y, i) => (
            <line
              key={`h${i}`}
              x1="40"
              y1={y}
              x2="260"
              y2={y}
              stroke="rgba(13,107,176,0.3)"
              strokeWidth="1.2"
            />
          ))}

          {/* Image placeholder */}
          <circle cx="150" cy="105" r="22" fill="rgba(15,157,140,0.15)" />
          <path
            d="M140 95 L160 115 M160 95 L140 115"
            stroke="rgba(15,157,140,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Floating badges */}
          <rect x="45" y="195" width="60" height="22" rx="11" fill="rgba(13,107,176,0.1)" stroke="rgba(13,107,176,0.25)" strokeWidth="1" />
          <text x="75" y="209" textAnchor="middle" fontSize="11" fontWeight="600" fill="rgba(13,107,176,0.6)">
            4×3 grid
          </text>

          <rect x="175" y="195" width="70" height="22" rx="11" fill="rgba(15,157,140,0.1)" stroke="rgba(15,157,140,0.25)" strokeWidth="1" />
          <text x="210" y="209" textAnchor="middle" fontSize="11" fontWeight="600" fill="rgba(15,157,140,0.6)">
            Ready
          </text>
        </svg>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, loading, fetchProjects, deleteProject } = useProject();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleNewProject = () => {
    navigate('/editor');
  };

  const handleLoadProject = (projectId) => {
    navigate(`/editor/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const result = await deleteProject(projectId);
      if (result.success) {
        toast.success('Project deleted successfully');
      } else {
        toast.error(result.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Background blobs */}
      <div className="dashboard-blob dashboard-blob-1" aria-hidden="true" />
      <div className="dashboard-blob dashboard-blob-2" aria-hidden="true" />

      <div className="container">
        {/* Header section */}
        <div className="dashboard-header-modern">
          <div className="dashboard-header-content">
            <span className="dashboard-eyebrow">
              <FiGrid /> Your Grid Projects
            </span>
            <h1 className="dashboard-heading">Create & Organize</h1>
            <p className="dashboard-subheading">
              Build precision grids, save projects to the cloud, and download high-resolution images for your artwork
            </p>

            {projects.length > 0 && (
              <button onClick={handleNewProject} className="btn btn-primary btn-icon btn-lg dashboard-btn-new">
                <FiPlusCircle /> Start New Project
              </button>
            )}
          </div>

          <div className="dashboard-stats" aria-hidden="true">
            <div className="stat-card">
              <span className="stat-icon"><FiZap /></span>
              <span className="stat-label">Quick Setup</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon"><FiUploadCloud /></span>
              <span className="stat-label">{projects.length} Projects</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon"><FiCheckCircle /></span>
              <span className="stat-label">Cloud Saved</span>
            </div>
          </div>
        </div>

        {/* Projects section */}
        {projects.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-container">
              <div className="empty-visual-side">
                <EmptyStateVisual />
              </div>
              <div className="empty-content-side">
                <span className="empty-badge">
                  <FiGrid /> Getting started
                </span>
                <h2 className="empty-heading">Create Your First Project</h2>
                <p className="empty-description">
                  Upload an image, apply a custom grid overlay, and start drawing with precision. Your
                  project will be saved to the cloud for easy access anytime.
                </p>

                <ul className="empty-benefits">
                  <li>
                    <FiCheckCircle className="benefit-icon" />
                    <span>Upload any image format</span>
                  </li>
                  <li>
                    <FiCheckCircle className="benefit-icon" />
                    <span>Customize grid size & colors</span>
                  </li>
                  <li>
                    <FiCheckCircle className="benefit-icon" />
                    <span>Export as high-res PNG</span>
                  </li>
                  <li>
                    <FiCheckCircle className="benefit-icon" />
                    <span>Access anywhere, anytime</span>
                  </li>
                </ul>

                <button onClick={handleNewProject} className="btn btn-primary btn-lg empty-btn-cta">
                  <FiPlusCircle /> Create First Project
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="projects-header">
              <div>
                <h2 className="projects-title">Your Projects ({projects.length})</h2>
                <p className="projects-subtitle">Manage and edit your saved grid projects</p>
              </div>
              <button onClick={handleNewProject} className="btn btn-primary btn-icon btn-sm">
                <FiPlusCircle /> New Project
              </button>
            </div>
            <div className="projects-grid">
              {projects.map((project, idx) => (
                <div key={project._id} className="project-card-wrapper" style={{ animationDelay: `${idx * 40}ms` }}>
                  <ProjectCard
                    project={project}
                    onLoad={() => handleLoadProject(project._id)}
                    onDelete={() => handleDeleteProject(project._id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;