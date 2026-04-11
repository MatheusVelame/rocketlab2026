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
    return (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pedido / Identificação</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Produto Vinculado</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preço Item</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Custo Frete</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Valor Total</th>
                        <th style={{ padding: '24px', color: '#64748b', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {itens.map((item, idx) => (
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '10px', color: '#64748b' }}>Item Seq: {item.id_item}</span>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '20px 24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>{item.id_produto.substr(0, 16)}...</span>
                                    <span style={{ fontSize: '10px', color: '#475569' }}>Origem: {item.id_vendedor.substr(0, 8)}</span>
                                </div>
                            </td>
                            <td style={{ padding: '20px 24px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8' }}>R$ {item.preco_BRL.toFixed(2)}</span>
                            </td>
                            <td style={{ padding: '20px 24px' }}>
                                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '700' }}>R$ {item.preco_frete.toFixed(2)}</span>
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
                    ))}
                </tbody>
            </table>
            <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                {renderPagination(page, totalPages, onPageChange)}
            </div>
        </div>
    );
};
