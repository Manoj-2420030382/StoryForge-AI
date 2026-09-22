import api from './axios';
import type { AIPipelineResponse } from '../types';

export interface RefineStoryRequest {
    storyId: number;
    title: string;
    description: string;
    acceptanceCriteria: string;
}

export const aiApi = {
    refineStory: async (storyData: RefineStoryRequest): Promise<AIPipelineResponse> => {
        // Our Java AI Orchestrator service expects the endpoint POST /api/ai/refine
        const response = await api.post('/ai/refine', storyData);
        return response.data;
    }
};
