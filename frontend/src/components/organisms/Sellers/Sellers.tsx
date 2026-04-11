import { type ReactNode } from 'react';
import type { Vendedor } from '../../../types';

interface SellersProps {
    vendedores: Vendedor[];
    page: number;
    totalPages: number;
    renderPagination: (current: number, total: number, onChange: (p: number) => void) => ReactNode;
    onPageChange: (p: number) => void;
    onViewDetails: (v: Vendedor) => void;
}

export const Sellers = ({
    vendedores,
    page,
    totalPages,
    renderPagination,
    onPageChange,
    onViewDetails
}: SellersProps) => {
    const icons = {
        details: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
        pin: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase', margin: 0 }}>Vendedores</h3>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                <table style={{ width: '100%', textAlign: 'left', fontSize: '14px', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em' }}>
                        <tr>
                            <th style={{ padding: '24px' }}>ID</th>
                            <th style={{ padding: '24px' }}>Nome</th>
                            <th style={{ padding: '24px' }}>Sede / Localização</th>
                            <th style={{ padding: '24px', textAlign: 'center' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: '#e2e8f0' }}>
                        {vendedores.map((v) => (
                            <tr key={v.id_vendedor} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <td style={{ padding: '24px', fontFamily: 'monospace', fontSize: '10px', color: '#475569' }}>#{v.id_vendedor.substr(0, 16)}...</td>
                                <td style={{ padding: '24px', fontWeight: '700' }}>{v.nome_vendedor}</td>
                                <td style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                        {icons.pin}
                                        <span style={{ fontWeight: '600' }}>{v.cidade}, {v.estado}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '24px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => onViewDetails(v)}
                                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#818cf8', padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
                                    >
                                        {icons.details} Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                {renderPagination(page, totalPages, onPageChange)}
            </div>
        </div>
    );
};

export default Sellers;
