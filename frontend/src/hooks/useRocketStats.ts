import { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import type { DashboardStats, Consumidor } from '../types';

export const useRocketStats = (currentView: string) => {
    const [dashSummary, setDashSummary] = useState<DashboardStats | null>(null);
    const [clientes, setClientes] = useState<Consumidor[]>([]);
    const [clientPage, setClientPage] = useState(0);
    const [totalClientPages, setTotalClientPages] = useState(0);

    const PAGE_SIZE = 20;

    useEffect(() => {
        if (currentView === 'dashboard') loadDashboard();
        if (currentView === 'clientes') loadClientes();
    }, [currentView, clientPage]);

    const loadDashboard = async () => {
        try {
            const data = await productApi.getDashboardSummary();
            setDashSummary(data);
        } catch (error) { console.error(error); }
    };

    const loadClientes = async () => {
        try {
            const data = await productApi.listClientes('', clientPage * PAGE_SIZE);
            setClientes(data.items);
            setTotalClientPages(data.pages);
        } catch (error) { console.error(error); }
    };

    return {
        dashSummary,
        clientes,
        clientPage,
        setClientPage,
        totalClientPages
    };
};
