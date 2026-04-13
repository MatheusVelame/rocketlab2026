import { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import type { Produto, GlobalStats } from '../types';

export const useInventory = (currentView: string) => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);

    const PAGE_SIZE = 20;

    useEffect(() => {
        if (currentView === 'estoque') {
            loadProducts();
            loadGlobalStats();
            loadCategories();
        }
    }, [currentView, search, page, selectedCategory]);

    const loadProducts = async () => {
        try {
            const data = await productApi.list(search, page * PAGE_SIZE, selectedCategory);
            setProdutos(data.items);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const loadGlobalStats = async () => {
        try {
            const data = await productApi.getGlobalStats();
            setGlobalStats(data);
        } catch (error) {
            console.error('Error loading global stats:', error);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await productApi.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    return {
        produtos,
        setProdutos,
        categories,
        selectedCategory,
        setSelectedCategory,
        search,
        setSearch,
        page,
        setPage,
        totalPages,
        globalStats,
        loadProducts,
        loadGlobalStats
    };
};
