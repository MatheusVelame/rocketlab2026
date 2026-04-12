import { motion } from 'framer-motion';
import { CategoryItem } from '../../molecules/CategoryItem';
import { NavItem } from '../../molecules/NavItem/NavItem';
import { Icon } from '../../atoms/Icon/Icon';
import { Typography } from '../../atoms/Typography/Typography';

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
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
        },
        {
            id: 'estoque',
            label: 'Estoque',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
        },
        {
            id: 'consumidores',
            label: 'Consumidores',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="19" cy="11" r="2" /></svg>
        },
        {
            id: 'vendedores',
            label: 'Vendedores',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M10 13l2 2 4-4" /></svg>
        },
        {
            id: 'itens',
            label: 'Itens Pedidos',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
        }
    ];

    return (
        <motion.div
            animate={{ width: isCollapsed ? '80px' : '300px' }}
            className="h-screen bg-slate-900 border-r border-white/5 flex flex-col relative z-50 shrink-0"
        >
            <div className={`p-8 px-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-indigo-500 rounded-sm" />
                        <Typography variant="h2" color="white" uppercase>RocketStore</Typography>
                    </div>
                )}
                <button
                    onClick={toggleCollapse}
                    className="bg-white/5 border-none text-slate-500 p-2 rounded-xl cursor-pointer transition-all hover:bg-white/10"
                >
                    <Icon size={20}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {isCollapsed ? <path d="m9 18 6-6-6-6" /> : <path d="m15 18-6-6 6-6" />}
                        </svg>
                    </Icon>
                </button>
            </div>

            <nav className="flex-1 px-4 mt-6">
                <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.id}
                            label={item.label}
                            icon={item.icon}
                            isActive={currentView === item.id}
                            isCollapsed={isCollapsed}
                            onClick={() => onViewChange(item.id)}
                        />
                    ))}
                </div>

                {!isCollapsed && currentView === 'estoque' && (
                    <div className="mt-8 flex flex-col gap-4">
                        <Typography variant="caption" color="#475569" className="px-4" uppercase>
                            Categorias
                        </Typography>
                        <div className="flex flex-col gap-1 max-h-[350px] overflow-y-auto scrollbar-hide border border-white/5 bg-white/[0.02] rounded-3xl p-2 mx-1">
                            <CategoryItem
                                label="Todos os Itens"
                                isActive={selectedCategory === ''}
                                onClick={() => onCategorySelect('')}
                            />
                            {categories.map(cat => (
                                <CategoryItem
                                    key={cat}
                                    label={cat.replace(/_/g, ' ')}
                                    isActive={selectedCategory === cat}
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

