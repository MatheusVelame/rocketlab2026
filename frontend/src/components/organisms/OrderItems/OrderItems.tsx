import { motion } from 'framer-motion';
import type { PedidoItem } from '../../../types';
import type { ReactNode } from 'react';

interface OrderItemsProps {
    itens: PedidoItem[];
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    renderPagination: (current: number, total: number, onChange: (p: number) => void) => ReactNode;
    onViewDetails: (item: PedidoItem) => void;
}

export const OrderItems = ({
    itens, page, totalPages, onPageChange, renderPagination, onViewDetails
}: OrderItemsProps) => {

    const getStatusStyle = (status?: string) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('delivered') || s.includes('entregue')) return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Entregue' };
        if (s.includes('shipped') || s.includes('enviado')) return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Enviado' };
        if (s.includes('canceled') || s.includes('cancelado')) return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Cancelado' };
        if (s.includes('processing') || s.includes('processando')) return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'Processando' };
        return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', label: status || 'Pendente' };
    };

    return (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pedido / ID</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Produto Vinculado</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status Atual</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Financeiro</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Valor Total</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {itens.map((item, idx) => {
                        const status = getStatusStyle(item.status_pedido);
                        return (
                            <motion.tr
                                key={`${item.id_pedido}-${item.id_item}`}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', cursor: 'pointer' }}
                                onClick={() => onViewDetails(item)}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                            >
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '900', color: '#4f46e5', marginBottom: '4px' }}>#{item.id_pedido.substr(0, 8)}</span>
                                        <span style={{ fontSize: '10px', color: '#64748b' }}>Item Seq: {item.id_item}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '12px', color: 'white', fontWeight: '700', letterSpacing: '-0.01em' }}>
                                            {item.nome_produto || item.id_produto.substr(0, 16) + '...'}
                                        </span>
                                        <span style={{ fontSize: '10px', color: '#475569' }}>SKU: {item.id_produto.substr(0, 8).toUpperCase()}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
                                        borderRadius: '12px', backgroundColor: status.bg, border: `1px solid ${status.color}20`
                                    }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: status.color }} />
                                        <span style={{ fontSize: '10px', fontWeight: '900', color: status.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {status.label}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Item: R$ {item.preco_BRL.toFixed(2)}</span>
                                        <span style={{ fontSize: '10px', color: '#64748b' }}>Frete: R$ {item.preco_frete.toFixed(2)}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <span style={{ fontSize: '15px', fontWeight: '900', color: '#10b981' }}>R$ {(item.preco_BRL + item.preco_frete).toFixed(2)}</span>
                                </td>
                                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                    <button
                                        style={{
                                            padding: '10px 20px', borderRadius: '14px', background: 'rgba(79, 70, 229, 0.1)', color: '#818cf8',
                                            border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '900'
                                        }}
                                    >ANALISAR</button>
                                </td>
                            </motion.tr>
                        );
                    })}
                </tbody>
            </table>
            <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                {renderPagination(page, totalPages, onPageChange)}
            </div>
        </div>
    );
};
