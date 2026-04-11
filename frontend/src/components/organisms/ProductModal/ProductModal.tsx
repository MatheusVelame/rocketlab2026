import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import type { Produto, ProductAnalytics } from '../../../types';

interface ProductModalProps {
    product: Produto | null;
    analytics: ProductAnalytics | null;
    isEditing: boolean;
    isCreating: boolean;
    editForm: Partial<Produto>;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (id: string) => void;
    onSave: () => void;
    onFormChange: (form: Partial<Produto>) => void;
    getSmartInsight: (data: ProductAnalytics) => { text: string; type: string };
    availableCategories: string[];
}

export const ProductModal = ({
    product,
    analytics,
    isEditing,
    isCreating,
    editForm,
    onClose,
    onEdit,
    onDelete,
    onSave,
    onFormChange,
    getSmartInsight,
    availableCategories
}: ProductModalProps) => {
    const [catQuery, setCatQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editForm.categoria_produto) {
            setCatQuery(editForm.categoria_produto.replace(/_/g, ' '));
        } else {
            setCatQuery('');
        }
    }, [isEditing, isCreating, editForm.categoria_produto]);

    if (!product && !isCreating) return null;

    const filteredCats = availableCategories.filter(c =>
        c.toLowerCase().includes(catQuery.toLowerCase())
    ).slice(0, 5);

    const icons = {
        edit: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>,
        delete: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>,
        close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
        rocket: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" /><path d="M9 12H4s.5-1 1.4-2.1c.4-.5.8-1 1.2-1.3.3-.3.8-.5 1.3-.6h1.1L12 11Z" /><path d="M15 9V4s-1 .5-2.1 1.4c-.5.4-1 .8-1.3 1.2-.3.3-.5.8-.6 1.3V9l3 3Z" /></svg>,
        box: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
        star: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
        trending: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
        sales: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
        ruler: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.43 12.48-6-6a2 2 0 0 0-2.83 0l-8.66 8.64a2 2 0 0 0 0 2.83l6 6a2 2 0 0 0 2.83 0l8.66-8.64a2 2 0 0 0 0-2.83ZM7 10.5 8.5 12m1-3 1.5 1.5m1-3 1.5 1.5m1-3 1.5 1.5" /></svg>
    };

    const renderField = (label: string, field: keyof Produto, type: string = 'text') => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '8px' }}>{label}</label>
            <input
                type={type}
                value={editForm[field] || ''}
                onChange={e => onFormChange({ ...editForm, [field]: type === 'number' ? Number(e.target.value) : e.target.value })}
                style={{ width: '100%', backgroundColor: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', fontSize: '14px', color: 'white', outline: 'none', transition: 'all 0.3s' }}
            />
        </div>
    );

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(40px)'
        }} onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                style={{
                    position: 'relative', width: '100%', maxWidth: '1100px', maxHeight: '92vh', backgroundColor: '#0f172a', borderRadius: '56px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '56px', overflowY: 'auto'
                }}
                className="scrollbar-hide"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', border: 'none', cursor: 'pointer', color: '#64748b' }}> {icons.close} </button>

                {(isEditing || isCreating) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <h2 style={{ fontSize: '30px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.05em' }}>{isCreating ? 'Novo Produto' : 'Editando Produto'}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '48px', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                {renderField('Nome Comercial do Produto', 'nome_produto')}
                            </div>

                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '8px', display: 'block', marginBottom: '8px' }}>Categoria</label>
                                <input
                                    value={catQuery}
                                    onFocus={() => setShowSuggestions(true)}
                                    onChange={e => {
                                        setCatQuery(e.target.value);
                                        setShowSuggestions(true);
                                        onFormChange({ ...editForm, categoria_produto: e.target.value.toLowerCase().replace(/ /g, '_') });
                                    }}
                                    placeholder="Digite para buscar categoria..."
                                    style={{ width: '100%', backgroundColor: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', fontSize: '14px', color: 'white', outline: 'none' }}
                                />
                                <AnimatePresence>
                                    {showSuggestions && filteredCats.length > 0 && (
                                        <motion.div
                                            ref={suggestionsRef}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, backgroundColor: '#1e293b', borderRadius: '16px', marginTop: '8px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                                        >
                                            {filteredCats.map(cat => (
                                                <div
                                                    key={cat}
                                                    onClick={() => {
                                                        onFormChange({ ...editForm, categoria_produto: cat });
                                                        setCatQuery(cat.replace(/_/g, ' '));
                                                        setShowSuggestions(false);
                                                    }}
                                                    style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1', textTransform: 'capitalize' }}
                                                    className="hover-bg-indigo"
                                                >
                                                    {cat.replace(/_/g, ' ')}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {renderField('Peso (gramas)', 'peso_produto_gramas', 'number')}

                            <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
                                {renderField('Comprimento (cm)', 'comprimento_centimetros', 'number')}
                                {renderField('Altura (cm)', 'altura_centimetros', 'number')}
                                {renderField('Largura (cm)', 'largura_centimetros', 'number')}
                            </div>

                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', marginTop: '16px' }}>
                                <button
                                    onClick={onClose}
                                    style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: '900', padding: '24px', borderRadius: '24px', fontSize: '14px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={onSave}
                                    style={{ flex: 2, backgroundColor: '#4f46e5', color: 'white', fontWeight: '900', padding: '24px', borderRadius: '24px', fontSize: '14px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', transition: 'all 0.3s' }}
                                >
                                    Sincronizar Produto na Base
                                </button>
                            </div>
                        </div>
                    </div>
                ) : product && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '48px' }}>
                        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ aspectRatio: '1/1', borderRadius: '56px', overflow: 'hidden', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                                <img src={product.url_imagem} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            {analytics && (() => {
                                const insight = getSmartInsight(analytics);
                                return (
                                    <div style={{
                                        padding: '32px', borderRadius: '40px', border: '1px solid', transition: 'all 0.3s',
                                        backgroundColor: insight.type === 'danger' ? 'rgba(244,63,94,0.1)' : 'rgba(79,70,229,0.05)',
                                        borderColor: insight.type === 'danger' ? 'rgba(244,63,94,0.2)' : 'rgba(79,70,229,0.1)',
                                        color: insight.type === 'danger' ? '#fecdd3' : '#e0e7ff'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            {icons.rocket} Rocket Analysis
                                        </div>
                                        <p style={{ fontSize: '14px', fontWeight: '700', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>“{insight.text}”</p>
                                    </div>
                                );
                            })()}
                        </div>
                        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '40px', fontWeight: '900', color: 'white', fontStyle: 'italic', letterSpacing: '-0.05em', margin: '0 0 16px 0' }}>{product.nome_produto}</h2>
                                    <span style={{ backgroundColor: '#4f46e5', padding: '4px 16px', borderRadius: '9999px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'white' }}>{product.categoria_produto.replace(/_/g, ' ')}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={onEdit} style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: 'none', cursor: 'pointer', color: '#94a3b8' }}> {icons.edit} </button>
                                    <button onClick={() => onDelete(product.id_produto)} style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(244,63,94,0.1)', borderRadius: '16px', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer', color: '#f43f5e' }}> {icons.delete} </button>
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                    {[
                                        { l: 'Vendas', v: analytics?.performance.total_vendas || 0, i: icons.sales, c: '#818cf8' },
                                        { l: 'Ticket M.', v: `R$ ${Math.round(analytics?.performance.preco_medio || 0).toLocaleString()}`, i: icons.trending, c: '#10b981' },
                                        { l: 'Nota G.', v: analytics?.performance.avaliacao_media.toFixed(1) || '0.0', i: icons.star, c: '#f59e0b' },
                                        { l: 'Peso (g)', v: `${product.peso_produto_gramas}`, i: icons.box, c: '#c084fc' },
                                    ].map((s, i) => (
                                        <div key={i} style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                            <div style={{ color: s.c, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{s.i}</div>
                                            <p style={{ fontSize: '9px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', marginBottom: '4px', margin: 0 }}>{s.l}</p>
                                            <h4 style={{ fontSize: '18px', fontWeight: '900', color: 'white', margin: 0 }}>{s.v}</h4>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.3)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', padding: '32px', position: 'relative' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}> {icons.ruler} Logística </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                                                {[
                                                    { l: 'Comp.', v: product.comprimento_centimetros },
                                                    { l: 'Alt.', v: product.altura_centimetros },
                                                    { l: 'Larg.', v: product.largura_centimetros },
                                                ].map((d, i) => (
                                                    <div key={i} style={{ flex: 1 }}>
                                                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>{d.l}</p>
                                                        <p style={{ fontSize: '14px', fontWeight: '900', color: '#818cf8', margin: 0 }}>{d.v || 0}cm</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.3)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', padding: '32px', height: '192px', position: 'relative' }}>
                                            <span style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', fontSize: '8px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Radar DNA</span>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics?.performance ? [
                                                    { subject: 'Vendas', A: Math.min(analytics.performance.total_vendas * 5, 100) },
                                                    { subject: 'Receita', A: Math.min(analytics.performance.receita_total / 20, 100) },
                                                    { subject: 'Nota', A: Math.max(0, analytics.performance.avaliacao_media * 20) },
                                                    { subject: 'Freq.', A: Math.min(analytics.performance.total_avaliacoes * 5, 100) },
                                                ] : []}>
                                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 6, fontWeight: '900' }} />
                                                    <Radar name="P" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.3)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', padding: '32px', display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '350px' }}>
                                        <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', margin: 0 }}>Reviews Sugeridas</p>
                                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="scrollbar-hide">
                                            {analytics?.ultimas_avaliacoes.map((rev, i) => (
                                                <div key={i} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: '900', color: '#f59e0b' }}>
                                                        <div style={{ display: 'flex', gap: '2px' }}>{Array.from({ length: rev.avaliacao }).map((_, j) => <span key={j}>{icons.star}</span>)}</div>
                                                        <span style={{ color: '#475569', fontStyle: 'italic' }}>{new Date(rev.data_comentario).toLocaleDateString()}</span>
                                                    </div>
                                                    <p style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{rev.comentario || 'Sem comentário.'}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ProductModal;
