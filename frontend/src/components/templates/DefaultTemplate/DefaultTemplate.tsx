import { useState, type ReactNode } from 'react';
import { Sidebar } from '../../organisms/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

interface DefaultTemplateProps {
    children: ReactNode;
    search: string;
    onSearchChange: (val: string) => void;
    onAddNew?: () => void;
    categories: string[];
    selectedCategory: string;
    onCategorySelect: (cat: string) => void;
}

export const DefaultTemplate = ({
    children,
    search,
    onSearchChange,
    onAddNew,
    categories,
    selectedCategory,
    onCategorySelect
}: DefaultTemplateProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentView = location.pathname.replace('/', '') || 'estoque';

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const searchIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#020617', color: '#e2e8f0', overflow: 'hidden' }}>
            <Sidebar
                currentView={currentView}
                onViewChange={(view) => navigate(`/${view}`)}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
            />

            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateZ(0)', // Força aceleração de Hardware
                willChange: 'transform'
            }}>
                <header style={{ height: '80px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', backgroundColor: 'rgba(2, 6, 23, 0.4)', backdropFilter: 'blur(20px)', flexShrink: 0, zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'white', fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase', margin: 0 }}>{currentView}</h2>
                        <div style={{ height: '24px', width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        {currentView !== 'dashboard' && (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: '16px', color: '#475569', display: 'flex', alignItems: 'center' }}>{searchIcon}</span>
                                <input
                                    placeholder="Busca global..."
                                    style={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.5)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: '12px',
                                        padding: '10px 16px 10px 40px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: 'white',
                                        outline: 'none',
                                        width: '320px',
                                        transition: 'all 0.3s'
                                    }}
                                    value={search}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                    {currentView === 'estoque' && onAddNew && (
                        <button
                            onClick={onAddNew}
                            style={{
                                backgroundColor: '#4f46e5',
                                color: 'white',
                                fontWeight: '900',
                                padding: '10px 24px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)',
                                transition: 'all 0.3s'
                            }}
                        >
                            Novo Registro
                        </button>
                    )}
                </header>

                <section style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '40px',
                    WebkitOverflowScrolling: 'touch', // Scroll suave no iOS
                    scrollBehavior: 'smooth'
                }} className="scrollbar-hide">
                    {children}
                </section>
            </main>
        </div>
    );
};

export default DefaultTemplate;
