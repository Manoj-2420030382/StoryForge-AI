import api from './axios';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types';

export const projectApi = {
    getProjects: async (): Promise<Project[]> => {
        const response = await api.get('/projects');
        return response.data;
    },
    getProject: async (projectId: string | number): Promise<Project> => {
        const response = await api.get(`/projects/${projectId}`);
        return response.data;
    },
    createProject: async (projectData: CreateProjectRequest): Promise<Project> => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },
    updateProject: async (projectId: string | number, projectData: UpdateProjectRequest): Promise<Project> => {
        const response = await api.put(`/projects/${projectId}`, projectData);
        return response.data;
    },
    deleteProject: async (projectId: string | number): Promise<void> => {
        await api.delete(`/projects/${projectId}`);
    },
    exportProjectDocx: async (projectId: string | number): Promise<Blob> => {
        const response = await api.get(`/projects/${projectId}/export/docx`, {
            responseType: 'blob'
        });
        return response.data;
    }
};
