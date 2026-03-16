import React from 'react';
import { FiEdit3, FiImage, FiTrash2 } from 'react-icons/fi';
import { resolveAssetUrl } from '../../services/api';

const ProjectCard = ({ project, onLoad, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="project-card">
      <div className="project-thumbnail">
        {project.imagePath ? (
          <img 
            src={resolveAssetUrl(project.imagePath)}
            alt={project.name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div className={`project-fallback ${project.imagePath ? 'hidden' : ''}`}>
          <FiImage aria-hidden="true" />
          No Image
        </div>
      </div>

      <div className="project-info">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-date">
          Created: {formatDate(project.createdAt)}
        </p>

        <div className="project-actions">
          <button onClick={onLoad} className="btn btn-primary btn-icon">
            <FiEdit3 aria-hidden="true" />
            Load
          </button>
          <button onClick={onDelete} className="btn btn-danger btn-icon">
            <FiTrash2 aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;