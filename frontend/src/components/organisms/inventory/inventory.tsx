import { memo } from 'react';
import { StatsCard } from '../../molecules/statscard/statscard';
import { ProductCard } from '../../molecules/productcard/productcard';
import { Pagination } from '../../molecules/pagination/pagination';
import { Typography } from '../../atoms/typography/typography';
import { Icon } from '../../atoms/icon/icon';
import type { Produto, GlobalStats } from '../../../types';

interface InventoryProps {
    produtos: Produto[];
    globalStats: GlobalStats;
    page: number;
    totalPages: number;
    selectedCategory: string;
    onProductClick: (p: Produto) => void;
    onProductMouseEnter?: (p: Produto) => void;
    onPageChange: (p: number) => void;
}

export const Inventory = memo(({
    produtos,
    globalStats,
    page,
    totalPages,
    selectedCategory,
    onProductClick,
    onProductMouseEnter,
    onPageChange
}: InventoryProps) => {
    const icons = {
        revenue: <Icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="m17 5-5-3-5 3" /><path d="m17 19-5 3-5-3" /><path d="M22 17h-1a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1" /><path d="M2 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2" /></svg></Icon>,
        sales: <Icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg></Icon>,
        ticket: <Icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-2.6.81l-4.04 7.6a1.86 1.86 0 0 0 .69 2.51l1.58.85c.67.36 1.13.98 1.25 1.72.12.74-.1 1.49-.6 2.06l-1.06 1.23a1.88 1.88 0 0 0 .3 2.65l6.3 5.4c.73.63 1.84.53 2.45-.22l1.06-1.29a1.94 1.94 0 0 1 2.14-.68c.76.22 1.45.08 2.03-.39l1.58-.85a1.86 1.86 0 0 0 .69-2.51l-4.04-7.6a1.93 1.93 0 0 0-2.6-.81L12.7 7.23M7 5l1.5 1.5M4 8l1.5 1.5" /></svg></Icon>,
        items: <Icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg></Icon>
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard label="Faturamento" value={`R$ ${globalStats.total_receita.toLocaleString()}`} icon={icons.revenue} color="#6366f1" />
                <StatsCard label="Volume Vendas" value={globalStats.total_vendas.toLocaleString()} icon={icons.sales} color="#10b981" />
                <StatsCard label="Venda Média" value={`R$ ${globalStats.ticket_medio.toFixed(2)}`} icon={icons.ticket} color="#f59e0b" />
                <StatsCard label="Produtos Únicos" value={globalStats.total_produtos.toLocaleString()} icon={icons.items} color="#8b5cf6" />
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Typography variant="h1" style={{ fontStyle: 'italic', letterSpacing: '-0.05em' }} uppercase>
                        {selectedCategory ? selectedCategory.replace(/_/g, ' ') : 'Todos os Itens'}
                    </Typography>
                    <Typography variant="caption" color="#475569" uppercase>
                        Página {page + 1} de {totalPages}
                    </Typography>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {produtos.map(p => (
                        <ProductCard
                            key={p.id_produto}
                            produto={p}
                            onClick={() => onProductClick(p)}
                            onMouseEnter={() => onProductMouseEnter?.(p)}
                        />
                    ))}
                </div>


                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                    <Pagination current={page} total={totalPages} onChange={onPageChange} />
                </div>
            </div>
        </div>
    );
});

export default Inventory;

