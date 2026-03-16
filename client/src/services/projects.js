import api from './api';

export const projectService = {
  async getProjects() {
    const response = await api.get('/projects');
    return response.data.data;
  },

  async getProject(projectId) {
    const response = await api.get(`/projects/${projectId}`);
    return response.data.data.project;
  },

  async createProject(projectData) {
    const response = await api.post('/projects', projectData);
    return response.data.data.project;
  },

  async updateProject(projectId, updates) {
    const response = await api.put(`/projects/${projectId}`, updates);
    return response.data.data.project;
  },

  async deleteProject(projectId) {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  }
};