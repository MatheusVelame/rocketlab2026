import { type ReactNode } from 'react';
import { DefaultTemplate } from '../../components/templates/DefaultTemplate';
import { Customers as CustomersOrganism } from '../../components/organisms/Customers';
import { useRocketStats } from '../../hooks/useRocketStats';

export const Customers = () => {
    const {
        clientes, clientPage, setClientPage, totalClientPages
    } = useRocketStats('clientes');

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

        const chevronLeft = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
        const chevronRight = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                    onClick={() => onChange(current - 1)}
                    disabled={current === 0}
                    style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#64748b', border: 'none', cursor: current === 0 ? 'default' : 'pointer', opacity: current === 0 ? 0.2 : 1, display: 'flex', alignItems: 'center' }}
                >
                    {chevronLeft}
                </button>
                {pages}
                <button
                    onClick={() => onChange(current + 1)}
                    disabled={current >= total - 1}
                    style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#64748b', border: 'none', cursor: current >= total - 1 ? 'default' : 'pointer', opacity: current >= total - 1 ? 0.2 : 1, display: 'flex', alignItems: 'center' }}
                >
                    {chevronRight}
                </button>
            </div>
        );
    };

    return (
        <DefaultTemplate
            search=""
            onSearchChange={() => { }}
            categories={[]}
            selectedCategory=""
            onCategorySelect={() => { }}
        >
            <CustomersOrganism
                clientes={clientes}
                clientPage={clientPage}
                totalClientPages={totalClientPages}
                renderPagination={renderPagination}
                onPageChange={setClientPage}
            />
        </DefaultTemplate>
    );
};

export default Customers;
