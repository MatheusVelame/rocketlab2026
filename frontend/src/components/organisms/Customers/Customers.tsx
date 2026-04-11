import { type ReactNode } from 'react';
import type { Consumidor } from '../../../types';

interface CustomersProps {
    clientes: Consumidor[];
    clientPage: number;
    totalClientPages: number;
    renderPagination: (current: number, total: number, onChange: (p: number) => void) => ReactNode;
    onPageChange: (p: number) => void;
}

export const Customers = ({
    clientes,
    clientPage,
    totalClientPages,
    renderPagination,
    onPageChange
}: CustomersProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase', margin: 0 }}>Consumidores</h3>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                <table style={{ width: '100%', textAlign: 'left', fontSize: '14px', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em' }}>
                        <tr>
                            <th style={{ padding: '24px' }}>ID</th>
                            <th style={{ padding: '24px' }}>Nome</th>
                            <th style={{ padding: '24px' }}>Localização</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: '#e2e8f0' }}>
                        {clientes.map((c) => (
                            <tr key={c.id_consumidor} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <td style={{ padding: '24px', fontFamily: 'monospace', fontSize: '10px', color: '#475569' }}>#{c.id_consumidor.substr(0, 16)}...</td>
                                <td style={{ padding: '24px', fontWeight: '700' }}>{c.nome_consumidor}</td>
                                <td style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                        <span style={{ fontWeight: '600' }}>{c.cidade}, {c.estado}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                {renderPagination(clientPage, totalClientPages, onPageChange)}
            </div>
        </div>
    );
};

export default Customers;
