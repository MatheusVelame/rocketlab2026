import { useState } from 'react';
import { DefaultTemplate } from '../../components/templates/DefaultTemplate';
import { OrderItems as OrderItemsOrganism } from '../../components/organisms/OrderItems';
import { OrderItemModal } from '../../components/organisms/OrderItemModal';
import { useRocketStats } from '../../hooks/useRocketStats';
import { productApi } from '../../services/api';
import type { PedidoItem, PedidoItemDetalhado } from '../../types';
import { Pagination } from '../../components/molecules/Pagination/Pagination';

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
            <div className="flex flex-col gap-8">
                <div className="relative w-full flex items-center gap-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`
                            px-6 py-3 rounded-2xl flex items-center gap-2 text-[10px] font-black tracking-widest transition-all
                            ${showFilters ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}
                        `}
                    >
                        {filterIcon}
                        FILTROS AVANÇADOS
                    </button>

                    {showFilters && (
                        <div
                            className="absolute top-16 left-0 z-20 w-full sm:max-w-xl bg-slate-900 rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col md:flex-row gap-4 animate-in fade-in duration-200"
                        >
                            <div className="flex-1">
                                <label className="block text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full bg-slate-800 text-white border border-white/5 p-3 rounded-xl text-xs outline-none focus:border-indigo-500/50 cursor-pointer"
                                >
                                    <option value="">Todos</option>
                                    <option value="delivered">Entregue</option>
                                    <option value="shipped">Enviado</option>
                                    <option value="processing">Processando</option>
                                    <option value="canceled">Cancelado</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">De (Data)</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-800 text-white border border-white/5 p-3 rounded-xl text-xs outline-none"
                                    value={filters.dataInicio}
                                    onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">Até (Data)</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-800 text-white border border-white/5 p-3 rounded-xl text-xs outline-none"
                                    value={filters.dataFim}
                                    onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {itensPedidos.length > 0 ? (
                    <>
                        <OrderItemsOrganism
                            itens={itensPedidos}
                            onViewDetails={handleViewDetails}
                        />

                        <div className="flex justify-center py-8">
                            <Pagination current={page} total={totalPages} onChange={setPage} />
                        </div>
                    </>
                ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center bg-white/[0.02] rounded-[32px] border border-dashed border-white/10">
                        <p className="text-slate-500 text-sm">Nenhum item encontrado com os critérios selecionados.</p>
                        <button
                            onClick={() => { setFilters({ status: '', dataInicio: '', dataFim: '' }); setSearch(''); }}
                            className="mt-4 bg-transparent border border-indigo-500 text-indigo-400 px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-indigo-500/10"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                )}

                <OrderItemModal
                    details={selectedDetails}
                    onClose={() => setSelectedDetails(null)}
                />
            </div>
        </DefaultTemplate>
    );
};


export default OrderItems;
