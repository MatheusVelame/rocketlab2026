import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../services/api';
import type { DashboardStats, Consumidor, Vendedor } from '../types';

export const useRocketStats = (currentView: string) => {
    const [dashSummary, setDashSummary] = useState<DashboardStats | null>(null);
    const [clientes, setClientes] = useState<Consumidor[]>([]);
    const [vendedores, setVendedores] = useState<Vendedor[]>([]);
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
            const data = await productApi.listClientes('', page * PAGE_SIZE);
            setClientes(data.items);
            setTotalPages(data.pages);
        } catch (error) { console.error(error); }
    }, [page]);

    const loadVendedores = useCallback(async () => {
        try {
            const data = await productApi.listVendedores('', page * PAGE_SIZE);
            setVendedores(data.items);
            setTotalPages(data.pages);
        } catch (error) { console.error(error); }
    }, [page]);

    useEffect(() => {
        if (currentView === 'dashboard') loadDashboard();
        if (currentView === 'consumidores') loadClientes();
        if (currentView === 'vendedores') loadVendedores();
    }, [currentView, page, loadDashboard, loadClientes, loadVendedores]);

    return {
        dashSummary,
        clientes,
        vendedores,
        page,
        setPage,
        totalPages
    };
};
