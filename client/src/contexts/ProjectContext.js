import React, { createContext, useCallback, useContext, useMemo, useState, useRef } from 'react';
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
  
  // Simple undo/redo using a useRef to avoid closure issues
  const historyRef = useRef([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
      // Initialize history when loading a project
      if (project?.gridSettings) {
        historyRef.current = [JSON.parse(JSON.stringify(project.gridSettings))];
        setHistoryIndex(0);
      }
      return { success: true, project };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to load project' 
      };
    }
  }, []);

  // Update grid settings with history tracking
  const updateGridSettings = (newSettings) => {
    setCurrentProject(prev => {
      if (!prev) return prev;
      
      const updated = {
        ...prev,
        gridSettings: { ...prev.gridSettings, ...newSettings }
      };

      // Update history using ref to avoid closure issues
      historyRef.current = historyRef.current.slice(0, historyIndex + 1);
      historyRef.current.push(JSON.parse(JSON.stringify(updated.gridSettings)));
      setHistoryIndex(historyRef.current.length - 1);

      return updated;
    });
  };

  // Undo function
  const undo = () => {
    if (historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    const previousSettings = historyRef.current[newIndex];
    
    setCurrentProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        gridSettings: JSON.parse(JSON.stringify(previousSettings))
      };
    });
    
    setHistoryIndex(newIndex);
  };

  // Redo function
  const redo = () => {
    if (historyIndex >= historyRef.current.length - 1) return;
    
    const newIndex = historyIndex + 1;
    const nextSettings = historyRef.current[newIndex];
    
    setCurrentProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        gridSettings: JSON.parse(JSON.stringify(nextSettings))
      };
    });
    
    setHistoryIndex(newIndex);
  };

  // Check if undo/redo is available
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < historyRef.current.length - 1;

  // Initialize a new project with default grid settings
  const initializeNewProject = useCallback((defaultSettings) => {
    const newProj = {
      _id: null,
      name: '',
      imagePath: null,
      gridSettings: defaultSettings
    };
    setCurrentProject(newProj);
    historyRef.current = [JSON.parse(JSON.stringify(defaultSettings))];
    setHistoryIndex(0);
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
    setCurrentProject,
    initializeNewProject,
    // New undo/redo methods
    updateGridSettings,
    undo,
    redo,
    canUndo,
    canRedo
  }), [
    projects,
    currentProject,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    initializeNewProject,
    canUndo,
    canRedo
  ]);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};