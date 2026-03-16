import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { projectService } from '../services/projects';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    try {
      const project = await projectService.createProject(projectData);
      setProjects(prev => [project, ...prev]);
      return { success: true, project };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create project' 
      };
    }
  }, []);

  const updateProject = useCallback(async (projectId, updates) => {
    try {
      const project = await projectService.updateProject(projectId, updates);
      setProjects(prev => 
        prev.map(p => p._id === projectId ? project : p)
      );
      if (currentProject?._id === projectId) {
        setCurrentProject(project);
      }
      return { success: true, project };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update project' 
      };
    }
  }, [currentProject]);

  const deleteProject = useCallback(async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      if (currentProject?._id === projectId) {
        setCurrentProject(null);
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete project' 
      };
    }
  }, [currentProject]);

  const getProject = useCallback(async (projectId) => {
    try {
      const project = await projectService.getProject(projectId);
      setCurrentProject(project);
      return { success: true, project };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load project' 
      };
    }
  }, []);

  const value = useMemo(() => ({
    projects,
    currentProject,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    setCurrentProject
  }), [
    projects,
    currentProject,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject
  ]);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};