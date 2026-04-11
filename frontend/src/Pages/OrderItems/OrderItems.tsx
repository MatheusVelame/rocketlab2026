import { useState, type ReactNode } from 'react';
import { DefaultTemplate } from '../../components/templates/DefaultTemplate';
import { OrderItems as OrderItemsOrganism } from '../../components/organisms/OrderItems';
import { OrderItemModal } from '../../components/organisms/OrderItemModal';
import { useRocketStats } from '../../hooks/useRocketStats';
import { productApi } from '../../services/api';
import type { PedidoItem, PedidoItemDetalhado } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

export const OrderItems = () => {
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        dataInicio: '',
        dataFim: ''
    });

    const {
        itensPedidos, page, setPage, totalPages
    } = useRocketStats('itens', search, filters);

    const [selectedDetails, setSelectedDetails] = useState<PedidoItemDetalhado | null>(null);

    const handleViewDetails = async (item: PedidoItem) => {
        try {
            const data = await productApi.getItemDetalhes(item.id_pedido, item.id_item);
            setSelectedDetails(data);
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar detalhes do item.');
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0);
    };

    const renderPagination = (current: number, total: number, onChange: (p: number) => void): ReactNode => {
        if (total <= 1) return null;
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(0, current - 2);
        let end = Math.min(total, start + maxVisible);
        if (end === total) start = Math.max(0, end - maxVisible);

        for (let i = start; i < end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onChange(i)}
                    style={{
                        width: '40px', height: '40px', borderRadius: '12px', fontSize: '12px', fontWeight: '900',
                        backgroundColor: i === current ? '#4f46e5' : 'rgba(255,255,255,0.05)',
                        color: i === current ? 'white' : '#64748b',
                        border: 'none', cursor: 'pointer', marginLeft: '4px'
                    }}
                >{i + 1}</button>
            );
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => onChange(current - 1)} disabled={current === 0} style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#64748b', border: 'none', cursor: current === 0 ? 'default' : 'pointer', opacity: current === 0 ? 0.2 : 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                {pages}
                <button onClick={() => onChange(current + 1)} disabled={current >= total - 1} style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#64748b', border: 'none', cursor: current >= total - 1 ? 'default' : 'pointer', opacity: current >= total - 1 ? 0.2 : 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                </button>
            </div>
        );
    };

    const filterIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
    );

    return (
        <DefaultTemplate
            search={search}
            onSearchChange={(val) => { setSearch(val); setPage(0); }}
            categories={[]}
            selectedCategory=""
            onCategorySelect={() => { }}
        >
            <div style={{ marginBottom: '24px', position: 'relative', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        padding: '12px 24px', borderRadius: '16px', backgroundColor: showFilters ? '#4f46e5' : 'rgba(255,255,255,0.05)',
                        color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        fontSize: '12px', fontWeight: '900', transition: 'all 0.3s'
                    }}
                >
                    {filterIcon}
                    FILTROS AVANÇADOS
                </button>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            style={{
                                position: 'absolute', top: '70px', left: 0, zIndex: 10, width: '100%', maxWidth: '600px',
                                backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', gap: '16px'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase' }}>Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    style={{
                                        width: '100%', backgroundColor: '#1e293b', color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)', padding: '12px',
                                        borderRadius: '12px', fontSize: '12px', outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="" style={{ backgroundColor: '#1e293b', color: 'white' }}>Todos</option>
                                    <option value="delivered" style={{ backgroundColor: '#1e293b', color: 'white' }}>Entregue</option>
                                    <option value="shipped" style={{ backgroundColor: '#1e293b', color: 'white' }}>Enviado</option>
                                    <option value="processing" style={{ backgroundColor: '#1e293b', color: 'white' }}>Processando</option>
                                    <option value="canceled" style={{ backgroundColor: '#1e293b', color: 'white' }}>Cancelado</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase' }}>De (Data)</label>
                                <input
                                    type="date"
                                    value={filters.dataInicio}
                                    onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                                    style={{
                                        width: '100%', backgroundColor: '#1e293b', color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)', padding: '12px',
                                        borderRadius: '12px', fontSize: '12px', outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase' }}>Até (Data)</label>
                                <input
                                    type="date"
                                    value={filters.dataFim}
                                    onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                                    style={{
                                        width: '100%', backgroundColor: '#1e293b', color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)', padding: '12px',
                                        borderRadius: '12px', fontSize: '12px', outline: 'none'
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {itensPedidos.length > 0 ? (
                <OrderItemsOrganism
                    itens={itensPedidos}
                    page={page}
                    totalPages={totalPages}
                    renderPagination={renderPagination}
                    onPageChange={setPage}
                    onViewDetails={handleViewDetails}
                />
            ) : (
                <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Nenhum item encontrado com os critérios selecionados.</p>
                    <button onClick={() => { setFilters({ status: '', dataInicio: '', dataFim: '' }); setSearch(''); }} style={{ marginTop: '16px', background: 'transparent', border: '1px solid #4f46e5', color: '#818cf8', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '12px' }}>Limpar Filtros</button>
                </div>
            )}

            <OrderItemModal
                details={selectedDetails}
                onClose={() => setSelectedDetails(null)}
            />
        </DefaultTemplate>
    );
};

export default OrderItems;
