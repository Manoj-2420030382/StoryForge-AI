import api from './axios';
import type { AuthResponse } from '../types';

export const authApi = {
    login: async (credentials: any): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData: any): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    }
};
