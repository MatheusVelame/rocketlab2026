import { useState, useCallback, useRef } from 'react';
import { DefaultTemplate } from '../../components/templates/DefaultTemplate';
import { Inventory as InventoryOrganism } from '../../components/organisms/Inventory';
import { ProductModal } from '../../components/organisms/ProductModal';
import { useInventory } from '../../hooks/useInventory';
import { productApi } from '../../services/api';
import { getSmartInsight } from '../../utils/insights';
import type { Produto, ProductAnalytics } from '../../types';

export const Inventory = () => {
    const {
        produtos, categories, selectedCategory, setSelectedCategory,
        search, setSearch, page, setPage, totalPages, globalStats, loadProducts, loadGlobalStats
    } = useInventory('estoque');

    const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
    const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Produto>>({});

    // Cache simples em memória para evitar requests repetidos
    const analyticsCache = useRef<Record<string, ProductAnalytics>>({});
    // Controle de requests em andamento para evitar duplicidade
    const pendingRequests = useRef<Record<string, Promise<ProductAnalytics>>>({});

    const fetchAnalytics = useCallback(async (productId: string) => {
        // 1. Verificar Cache
        if (analyticsCache.current[productId]) {
            return analyticsCache.current[productId];
        }

        // 2. Verificar se já existe um request para este ID
        if (pendingRequests.current[productId]) {
            return pendingRequests.current[productId];
        }

        // 3. Fazer o Request
        const request = productApi.getAnalytics(productId);
        pendingRequests.current[productId] = request;

        try {
            const data = await request;
            analyticsCache.current[productId] = data;
            return data;
        } finally {
            delete pendingRequests.current[productId];
        }
    }, []);

    const handleProductMouseEnter = useCallback((product: Produto) => {
        // Inicia a busca silenciosamente no hover
        fetchAnalytics(product.id_produto).catch(() => { });
    }, [fetchAnalytics]);

    const handleProductClick = async (product: Produto) => {
        setSelectedProduct(product);

        // Se já tiver no cache, seta imediatamente (Instantâneo!)
        if (analyticsCache.current[product.id_produto]) {
            setProductAnalytics(analyticsCache.current[product.id_produto]);
            return;
        }

        // Caso contrário, limpa o estado anterior e busca (com a vantagem do request talvez já estar em andamento pelo hover)
        setProductAnalytics(null);
        try {
            const data = await fetchAnalytics(product.id_produto);
            setProductAnalytics(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            if (isCreating) {
                await productApi.create(editForm as Produto);
                setIsCreating(false);
            } else if (selectedProduct) {
                const updated = await productApi.update(selectedProduct.id_produto, editForm);
                // Invalida cache após update
                delete analyticsCache.current[selectedProduct.id_produto];
                setSelectedProduct(updated);
                setIsEditing(false);
            }
            loadProducts();
            loadGlobalStats();
        } catch (error) { alert('Erro ao salvar: id já existe ou dados inválidos.'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir este produto?')) return;
        try {
            await productApi.delete(id);
            delete analyticsCache.current[id];
            setSelectedProduct(null);
            loadProducts();
            loadGlobalStats();
        } catch (error) { console.error(error); }
    };

    if (!globalStats) return null;

    return (
        <DefaultTemplate
            search={search}
            onSearchChange={(val) => { setSearch(val); setPage(0); }}
            onAddNew={() => { setIsCreating(true); setEditForm({ id_produto: Math.random().toString(36).substr(2, 9), peso_produto_gramas: 0, comprimento_centimetros: 0, altura_centimetros: 0, largura_centimetros: 0 }); }}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
        >
            <InventoryOrganism
                produtos={produtos}
                globalStats={globalStats}
                page={page}
                totalPages={totalPages}
                selectedCategory={selectedCategory}
                onProductClick={handleProductClick}
                onProductMouseEnter={handleProductMouseEnter}
                onPageChange={setPage}
            />

            <ProductModal
                product={selectedProduct}
                analytics={productAnalytics}
                isEditing={isEditing}
                isCreating={isCreating}
                editForm={editForm}
                onClose={() => { setSelectedProduct(null); setIsEditing(false); setIsCreating(false); }}
                onEdit={() => { setIsEditing(true); setEditForm(selectedProduct!); }}
                onDelete={handleDelete}
                onSave={handleSave}
                onFormChange={setEditForm}
                getSmartInsight={getSmartInsight}
                availableCategories={categories}
            />
        </DefaultTemplate>
    );
};

export default Inventory;

