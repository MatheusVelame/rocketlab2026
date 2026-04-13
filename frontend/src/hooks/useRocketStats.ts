import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../services/api';
import type { DashboardStats, Consumidor, Vendedor, PedidoItem } from '../types';

export const useRocketStats = (currentView: string, search: string = '', filters: any = {}) => {
    const [dashSummary, setDashSummary] = useState<DashboardStats | null>(null);
    const [clientes, setClientes] = useState<Consumidor[]>([]);
    const [vendedores, setVendedores] = useState<Vendedor[]>([]);
    const [itensPedidos, setItensPedidos] = useState<PedidoItem[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const PAGE_SIZE = 20;

    const loadDashboard = useCallback(async () => {
        try {
            const data = await productApi.getDashboardSummary();
            setDashSummary(data);
        } catch (error) { console.error(error); }
    }, []);

    const loadClientes = useCallback(async () => {
        try {
            const data = await productApi.listClientes(search, page * PAGE_SIZE, filters.estado, filters.cidade);
            setClientes(data.items);
            setTotalPages(data.pages);
        } catch (error) { console.error(error); }
    }, [page, search, filters.estado, filters.cidade]);

    const loadVendedores = useCallback(async () => {
        try {
            const data = await productApi.listVendedores(search, page * PAGE_SIZE, filters.estado, filters.cidade);
            setVendedores(data.items);
            setTotalPages(data.pages);
        } catch (error) { console.error(error); }
    }, [page, search, filters.estado, filters.cidade]);

    const loadItensPedidos = useCallback(async () => {
        try {
            const data = await productApi.listItensPedidos(
                search, page * PAGE_SIZE, filters.status, filters.dataInicio, filters.dataFim
            );
            setItensPedidos(data.items);
            setTotalPages(data.pages);
        } catch (error) { console.error(error); }
    }, [page, search, filters.status, filters.dataInicio, filters.dataFim]);

    useEffect(() => {
        if (currentView === 'dashboard') loadDashboard();
        if (currentView === 'consumidores') loadClientes();
        if (currentView === 'vendedores') loadVendedores();
        if (currentView === 'itens') loadItensPedidos();
    }, [currentView, page, search, loadDashboard, loadClientes, loadVendedores, loadItensPedidos]);

    return {
        dashSummary,
        clientes,
        vendedores,
        itensPedidos,
        page,
        setPage,
        totalPages
    };
};
