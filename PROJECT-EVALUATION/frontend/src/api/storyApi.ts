import api from './axios';
import type { Story, CreateStoryRequest, UpdateStoryRequest } from '../types';

export const storyApi = {
    getProjectStories: async (projectId: string | number): Promise<Story[]> => {
        const response = await api.get(`/projects/${projectId}/stories`);
        return response.data;
    },
    getStory: async (projectId: string | number, storyId: string | number): Promise<Story> => {
        const response = await api.get(`/projects/${projectId}/stories/${storyId}`);
        return response.data;
    },
    createStory: async (projectId: string | number, storyData: CreateStoryRequest): Promise<Story> => {
        const response = await api.post(`/projects/${projectId}/stories`, storyData);
        return response.data;
    },
    updateStory: async (projectId: string | number, storyId: string | number, storyData: UpdateStoryRequest): Promise<Story> => {
        const response = await api.put(`/projects/${projectId}/stories/${storyId}`, storyData);
        return response.data;
    },
    deleteStory: async (projectId: string | number, storyId: string | number): Promise<void> => {
        await api.delete(`/projects/${projectId}/stories/${storyId}`);
    }
};
