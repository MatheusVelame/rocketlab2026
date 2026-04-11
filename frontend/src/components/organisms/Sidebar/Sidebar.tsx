import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryItem } from '../../molecules/CategoryItem';

interface SidebarProps {
    currentView: string;
    onViewChange: (view: string) => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
    categories: string[];
    selectedCategory: string;
    onCategorySelect: (cat: string) => void;
}

export const Sidebar = ({
    currentView,
    onViewChange,
    isCollapsed,
    toggleCollapse,
    categories,
    selectedCategory,
    onCategorySelect
}: SidebarProps) => {
    const [catSearch, setCatSearch] = useState('');

    const filteredCategories = categories.filter(cat =>
        cat.toLowerCase().includes(catSearch.toLowerCase())
    );

    const icons = {
        estoque: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
        clientes: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
        dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>,
        toggle: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
    };

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 280 }}
            style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50,
                backdropFilter: 'blur(40px)',
                flexShrink: 0,
                overflow: 'hidden',
                height: '100%'
            }}
        >
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', flexShrink: 0 }}>
                {!isCollapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontStyle: 'italic' }}>R</div>
                        <span style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '-0.05em', color: 'white', textTransform: 'uppercase' }}>Rocket</span>
                    </div>
                )}
                <button
                    onClick={toggleCollapse}
                    style={{
                        padding: '8px',
                        borderRadius: '12px',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        border: 'none',
                        backgroundColor: isCollapsed ? '#4f46e5' : 'transparent',
                        color: isCollapsed ? 'white' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: isCollapsed ? 'rotate(180deg)' : 'none'
                    }}
                >
                    {icons.toggle}
                </button>
            </div>

            <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                {[
                    { id: 'estoque', label: 'Estoque', icon: icons.estoque },
                    { id: 'clientes', label: 'Clientes', icon: icons.clientes },
                    { id: 'dashboard', label: 'Analytics', icon: icons.dashboard },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '14px',
                            borderRadius: '16px',
                            fontSize: '14px',
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            border: 'none',
                            marginBottom: '6px',
                            backgroundColor: currentView === item.id ? '#4f46e5' : 'transparent',
                            color: currentView === item.id ? 'white' : '#94a3b8',
                            boxShadow: currentView === item.id ? '0 10px 15px -3px rgba(79, 70, 229, 0.4)' : 'none'
                        }}
                    >
                        <span style={{ flexShrink: 0, margin: isCollapsed ? '0 auto' : '0', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                        {!isCollapsed && <span style={{ fontWeight: '700', whiteSpace: 'nowrap' }}>{item.label}</span>}
                    </button>
                ))}

                <AnimatePresence>
                    {!isCollapsed && currentView === 'estoque' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: '16px' }}>
                                <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Categorias</p>
                                {selectedCategory && (
                                    <button
                                        onClick={() => onCategorySelect('')}
                                        style={{ fontSize: '10px', color: '#f43f5e', fontWeight: '900', backgroundColor: 'rgba(244, 63, 94, 0.05)', border: 'none', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}
                                    >
                                        Limpar
                                    </button>
                                )}
                            </div>

                            <div style={{ padding: '0 12px', marginBottom: '16px' }}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ position: 'absolute', left: '12px', color: '#334155', fontSize: '12px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                    </span>
                                    <input
                                        placeholder="Pesquisar..."
                                        value={catSearch}
                                        onChange={(e) => setCatSearch(e.target.value)}
                                        style={{
                                            width: '100%',
                                            backgroundColor: 'rgba(2, 6, 23, 0.5)',
                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                            borderRadius: '12px',
                                            padding: '8px 12px 8px 32px',
                                            fontSize: '10px',
                                            color: 'white',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '16px', margin: '0 4px 16px 4px', border: '1px solid rgba(255,255,255,0.05)' }} className="scrollbar-hide">
                                <CategoryItem
                                    label="Todas"
                                    isActive={selectedCategory === ''}
                                    onClick={() => onCategorySelect('')}
                                />
                                {filteredCategories.map(cat => (
                                    <CategoryItem
                                        key={cat}
                                        label={cat}
                                        isActive={selectedCategory === cat}
                                        onClick={() => onCategorySelect(cat)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, backgroundColor: 'rgba(2, 6, 23, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#1e293b', overflow: 'hidden' }}>
                        <img src="https://api.dicebear.com/7.x/shapes/svg?seed=Admin" alt="User" style={{ width: '100%', height: '100%' }} />
                    </div>
                    {!isCollapsed && <p style={{ fontSize: '10px', fontWeight: '900', color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Manager Root</p>}
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
