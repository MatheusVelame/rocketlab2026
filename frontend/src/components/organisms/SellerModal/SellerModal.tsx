import { motion } from 'framer-motion';
import type { Vendedor } from '../../../types';

interface SellerModalProps {
    seller: Vendedor | null;
    onClose: () => void;
}

export const SellerModal = ({ seller, onClose }: SellerModalProps) => {
    if (!seller) return null;

    const icons = {
        close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
        map: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
        store: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>,
        hash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" /></svg>
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(40px)'
        }} onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                style={{
                    position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: '#0f172a', borderRadius: '48px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '48px'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', border: 'none', cursor: 'pointer', color: '#64748b' }}> {icons.close} </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '40px', backgroundColor: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                        {icons.store}
                    </div>

                    <div>
                        <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', fontStyle: 'italic', letterSpacing: '-0.05em', margin: '0 0 8px 0', textTransform: 'uppercase' }}>{seller.nome_vendedor}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#475569', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {icons.hash} {seller.id_vendedor}
                        </div>
                    </div>

                    <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '16px' }}>
                        <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.4)', padding: '24px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', margin: 0 }}>Cidade</p>
                            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>{seller.cidade}</h4>
                        </div>
                        <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.4)', padding: '24px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', margin: 0 }}>Estado</p>
                            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>{seller.estado}</h4>
                        </div>
                        <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(129, 140, 248, 0.05)', padding: '24px', borderRadius: '32px', border: '1px solid rgba(129, 140, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '10px', fontWeight: '900', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', margin: 0 }}>Prefixo CEP</p>
                                <h4 style={{ fontSize: '20px', fontWeight: '900', color: 'white', margin: 0 }}>{seller.prefixo_cep}</h4>
                            </div>
                            <div style={{ color: '#818cf8' }}>{icons.map}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SellerModal;
