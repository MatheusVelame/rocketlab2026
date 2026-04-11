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
    const navItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
        },
        {
            id: 'estoque',
            label: 'Estoque',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
        },
        {
            id: 'consumidores',
            label: 'Consumidores',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="19" cy="11" r="2" /></svg>
        },
        {
            id: 'vendedores',
            label: 'Vendedores',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M10 13l2 2 4-4" /></svg>
        }
    ];

    return (
        <motion.div
            animate={{ width: isCollapsed ? '80px' : '300px' }}
            style={{
                height: '100vh',
                backgroundColor: '#0f172a',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 50
            }}
        >
            <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between' }}>
                {!isCollapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '32px', backgroundColor: '#6366f1', borderRadius: '4px' }} />
                        <h1 style={{ fontSize: '18px', fontWeight: '900', color: 'white', letterSpacing: '-0.05em', textTransform: 'uppercase' }}>RocketStore</h1>
                    </div>
                )}
                <button
                    onClick={toggleCollapse}
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', padding: '8px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {isCollapsed ? <path d="m9 18 6-6-6-6" /> : <path d="m15 18-6-6 6-6" />}
                    </svg>
                </button>
            </div>

            <nav style={{ flex: 1, padding: '0 16px', marginTop: '24px' }}>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 16px',
                            backgroundColor: currentView === item.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            color: currentView === item.id ? '#818cf8' : '#64748b',
                            borderRadius: '16px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            marginBottom: '4px',
                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                        }}
                    >
                        {item.icon}
                        {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: '800' }}>{item.label}</span>}
                    </button>
                ))}

                {!isCollapsed && currentView === 'estoque' && (
                    <div style={{ marginTop: '32px' }}>
                        <p style={{ fontSize: '10px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 16px', marginBottom: '16px' }}>Categorias</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '400px', overflowY: 'auto' }} className="scrollbar-hide">
                            <CategoryItem
                                label="Todos os Itens"
                                active={selectedCategory === ''}
                                onClick={() => onCategorySelect('')}
                            />
                            {categories.map(cat => (
                                <CategoryItem
                                    key={cat}
                                    label={cat.replace(/_/g, ' ')}
                                    active={selectedCategory === cat}
                                    onClick={() => onCategorySelect(cat)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </motion.div>
    );
};

export default Sidebar;
