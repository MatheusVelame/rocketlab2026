import axios from 'axios';
import type { Produto, ProductAnalytics } from '../types';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const productApi = {
    list: async (q?: string) => {
        const response = await api.get<Produto[]>('/produtos', { params: { q } });
        return response.data;
    },
    getOne: async (id: string) => {
        const response = await api.get<Produto>(`/produtos/${id}`);
        return response.data;
    },
    update: async (id: string, data: Partial<Produto>) => {
        const response = await api.patch<Produto>(`/produtos/${id}`, data);
        return response.data;
    },
    getAnalytics: async (id: string) => {
        const response = await api.get<ProductAnalytics>(`/produtos/${id}/analytics`);
        return response.data;
    }
};
