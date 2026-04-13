import { useState, type ReactNode } from 'react';
import { Sidebar } from '../../organisms/sidebar';
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

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const searchIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
    const menuIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>;

    return (
        <div className="flex h-screen bg-[#020617] text-[#e2e8f0] overflow-hidden relative">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-[50] transition-transform duration-300 lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar
                    currentView={currentView}
                    onViewChange={(view) => {
                        navigate(`/${view}`);
                        setIsSidebarOpen(false);
                    }}
                    isCollapsed={isSidebarCollapsed}
                    toggleCollapse={() => {
                        if (window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                        } else {
                            setIsSidebarCollapsed(!isSidebarCollapsed);
                        }
                    }}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={onCategorySelect}
                />
            </div>

            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 sm:px-10 bg-[#020617]/40 backdrop-blur-xl flex-shrink-0 z-10 gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                            onClick={() => {
                                setIsSidebarOpen(true);
                                setIsSidebarCollapsed(false);
                            }}
                        >
                            {menuIcon}
                        </button>
                        <h2 className="hidden sm:block text-xl font-black text-white italic uppercase tracking-tighter margin-0 whitespace-nowrap">{currentView}</h2>
                        <div className="hidden sm:block h-6 w-[1px] bg-white/10" />

                        {currentView !== 'dashboard' && (
                            <div className="relative flex items-center flex-1 max-w-xs sm:max-w-md">
                                <span className="absolute left-4 text-slate-500 flex items-center">{searchIcon}</span>
                                <input
                                    placeholder="Busca..."
                                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-indigo-500/50 transition-all"
                                    value={search}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {currentView === 'estoque' && onAddNew && (
                        <button
                            onClick={onAddNew}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2 px-4 sm:px-6 rounded-xl text-[10px] sm:text-xs border-none cursor-pointer shadow-lg shadow-indigo-500/20 transition-all whitespace-nowrap"
                        >
                            <span className="hidden sm:inline">Novo Registro</span>
                            <span className="sm:hidden">+</span>
                        </button>
                    )}
                </header>

                <section className="flex-1 overflow-y-auto p-4 sm:p-10 scrollbar-hide scroll-smooth">
                    {children}
                </section>
            </main>
        </div>
    );
};


export default DefaultTemplate;
