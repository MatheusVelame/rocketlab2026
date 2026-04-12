import { useState } from 'react';
import { DefaultTemplate } from '../../components/templates/DefaultTemplate';
import { Customers as CustomersOrganism } from '../../components/organisms/Customers';
import { CustomerModal } from '../../components/organisms/CustomerModal';
import { useRocketStats } from '../../hooks/useRocketStats';
import type { Consumidor } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Pagination } from '../../components/molecules/Pagination/Pagination';

export const Customers = () => {
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        estado: '',
        cidade: ''
    });

    const {
        clientes, page, setPage, totalPages
    } = useRocketStats('consumidores', search, filters);

    const [selectedCustomer, setSelectedCustomer] = useState<Consumidor | null>(null);

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
                        FILTROS REGIONAIS
                    </button>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-16 left-0 z-20 w-full max-w-sm bg-slate-900 rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col sm:flex-row gap-4"
                            >
                                <div className="flex-1">
                                    <label className="block text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">Estado (UF)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: SP"
                                        className="w-full bg-slate-800 text-white border border-white/5 p-3 rounded-xl text-xs outline-none focus:border-indigo-500/50 transition-all"
                                        value={filters.estado}
                                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                                    />
                                </div>
                                <div className="flex-[2]">
                                    <label className="block text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">Cidade</label>
                                    <input
                                        type="text"
                                        placeholder="Buscar cidade..."
                                        className="w-full bg-slate-800 text-white border border-white/5 p-3 rounded-xl text-xs outline-none focus:border-indigo-500/50 transition-all"
                                        value={filters.cidade}
                                        onChange={(e) => handleFilterChange('cidade', e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <CustomersOrganism
                    clientes={clientes}
                    onViewDetails={setSelectedCustomer}
                />

                <div className="flex justify-center py-8">
                    <Pagination current={page} total={totalPages} onChange={setPage} />
                </div>

                <CustomerModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            </div>
        </DefaultTemplate>
    );
};


export default Customers;
