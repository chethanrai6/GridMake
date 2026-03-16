import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPlusCircle } from 'react-icons/fi';
import { useProject } from '../../contexts/ProjectContext';
import ProjectCard from './ProjectCard';

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
          <div className="spinner"></div>
          <p className="text-center">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Projects</h1>
            <p className="dashboard-subtitle">Build, save, and export precision drawing grids.</p>
          </div>
          <button onClick={handleNewProject} className="btn btn-primary btn-icon">
            <FiPlusCircle aria-hidden="true" />
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <h3>No Projects Yet</h3>
            <p>Create your first project to start making custom grids for your images</p>
            <button onClick={handleNewProject} className="btn btn-primary btn-icon">
              <FiPlusCircle aria-hidden="true" />
              Create First Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onLoad={() => handleLoadProject(project._id)}
                onDelete={() => handleDeleteProject(project._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;