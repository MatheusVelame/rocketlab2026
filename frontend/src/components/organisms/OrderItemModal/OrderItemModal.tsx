import { motion } from 'framer-motion';
import type { PedidoItemDetalhado } from '../../../types';

interface OrderItemModalProps {
    details: PedidoItemDetalhado | null;
    onClose: () => void;
}

export const OrderItemModal = ({ details, onClose }: OrderItemModalProps) => {
    if (!details) return null;

    const icons = {
        close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
        box: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
        user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        store: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9 12 3l9 6v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22V12h6v10" /></svg>,
        clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Pendente';
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const isOnTime = details.entrega_no_prazo === 'SIM';

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(20px)' }} onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                style={{ position: 'relative', width: '100%', maxWidth: '900px', backgroundColor: '#0f172a', borderRadius: '48px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', padding: '56px' }}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icons.close}</button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'top' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '28px', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>{icons.box}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '900', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pedido #{details.item.id_pedido.substr(0, 12)}</span>
                                <div style={{ height: '4px', width: '4px', borderRadius: '50%', backgroundColor: '#334155' }} />
                                <div style={{
                                    padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase',
                                    backgroundColor: isOnTime ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                    color: isOnTime ? '#10b981' : '#f43f5e', border: '1px solid'
                                }}>
                                    {isOnTime ? 'No Prazo' : 'Atrasado'}
                                </div>
                            </div>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em' }}>{details.produto?.nome || `Item ${details.item.id_item}`}</h2>
                            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#64748b' }}>Status: <span style={{ color: '#94a3b8', fontWeight: '700' }}>{details.status_pedido.toUpperCase()}</span></p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        <div style={{ padding: '32px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Timeline Logística</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Data de Compra</span>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{formatDate(details.data_compra)}</span>
                                </div>
                                <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: '8px' }} />
                                <div>
                                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Data de Entrega</span>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{formatDate(details.data_entrega)}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '32px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Performance</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ color: '#f59e0b' }}>{icons.clock}</div>
                                    <div>
                                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Tempo de Entrega</span>
                                        <span style={{ fontSize: '18px', fontWeight: '900', color: 'white' }}>{details.tempo_entrega_dias?.toFixed(1) || '0.0'} dias</span>
                                    </div>
                                </div>
                                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                                <div>
                                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Diferença Estimada</span>
                                    <span style={{
                                        fontSize: '14px', fontWeight: '700',
                                        color: (details.diferenca_entrega_dias || 0) <= 0 ? '#10b981' : '#f43f5e'
                                    }}>
                                        {(details.diferenca_entrega_dias || 0) > 0 ? '+' : ''}
                                        {details.diferenca_entrega_dias?.toFixed(1) || '0.0'} dias
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ color: '#6366f1' }}>{icons.user}</div>
                                    <div>
                                        <span style={{ fontSize: '10px', color: '#475569', fontWeight: '900', textTransform: 'uppercase' }}>Consumidor</span>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'white', display: 'block' }}>{details.consumidor?.nome}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ color: '#10b981' }}>{icons.store}</div>
                                    <div>
                                        <span style={{ fontSize: '10px', color: '#475569', fontWeight: '900', textTransform: 'uppercase' }}>Vendedor</span>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'white', display: 'block' }}>{details.vendedor?.nome}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 48px', backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: '32px', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                        <div style={{ display: 'flex', gap: '48px' }}>
                            <div>
                                <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Valor Item</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>R$ {details.item.preco_BRL.toFixed(2)}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Frete</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>R$ {details.item.preco_frete.toFixed(2)}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Total Repassado</span>
                            <span style={{ fontSize: '32px', fontWeight: '900', color: '#10b981' }}>R$ {(details.item.preco_BRL + details.item.preco_frete).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
