import axios from 'axios';
import type { Produto, ProductAnalytics, GlobalStats, PaginatedResponse, Consumidor, Vendedor, DashboardStats, PedidoItem, PedidoItemDetalhado } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const productApi = {
    list: async (q?: string, skip: number = 0, categoria?: string) => {
        const response = await api.get<PaginatedResponse<Produto>>('/produtos', { params: { q, skip, categoria } });
        return response.data;
    },
    getCategories: async () => {
        const response = await api.get<string[]>('/produtos/categorias');
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
    create: async (data: Produto) => {
        const response = await api.post<Produto>('/produtos', data);
        return response.data;
    },
    delete: async (id: string) => {
        await api.delete(`/produtos/${id}`);
    },
    getAnalytics: async (id: string) => {
        const response = await api.get<ProductAnalytics>(`/produtos/${id}/analytics`);
        return response.data;
    },
    getGlobalStats: async () => {
        const response = await api.get<GlobalStats>('/produtos/stats/global');
        return response.data;
    },
    listClientes: async (q?: string, skip: number = 0, estado?: string, cidade?: string) => {
        const response = await api.get<PaginatedResponse<Consumidor>>('/clientes', {
            params: { q, skip, estado, cidade }
        });
        return response.data;
    },
    getCliente: async (id: string) => {
        const response = await api.get<Consumidor>(`/clientes/${id}`);
        return response.data;
    },
    listVendedores: async (q?: string, skip: number = 0, estado?: string, cidade?: string) => {
        const response = await api.get<PaginatedResponse<Vendedor>>('/vendedores', {
            params: { q, skip, estado, cidade }
        });
        return response.data;
    },
    getVendedor: async (id: string) => {
        const response = await api.get<Vendedor>(`/vendedores/${id}`);
        return response.data;
    },
    listItensPedidos: async (q?: string, skip: number = 0, status?: string, dataInicio?: string, dataFim?: string) => {
        const response = await api.get<PaginatedResponse<PedidoItem>>('/itens-pedidos', {
            params: { q, skip, status, data_inicio: dataInicio, data_fim: dataFim }
        });
        return response.data;
    },
    getItemDetalhes: async (idPedido: string, idItem: number) => {
        const response = await api.get<PedidoItemDetalhado>(`/itens-pedidos/${idPedido}/${idItem}/detalhes`);
        return response.data;
    },
    getDashboardSummary: async () => {
        const response = await api.get<DashboardStats>('/dashboard');
        return response.data;
    }
};
