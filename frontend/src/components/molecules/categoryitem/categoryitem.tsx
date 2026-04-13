import { Icon } from '../../atoms/icon/icon';
import { Typography } from '../../atoms/typography/typography';

interface CategoryItemProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export const CategoryItem = ({ label, isActive, onClick }: CategoryItemProps) => {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all text-left border-none cursor-pointer
                ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'bg-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'}
            `}
        >
            <Icon size={12} color={isActive ? '#6366f1' : 'currentColor'}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
            </Icon>
            <Typography variant="label" className="capitalize whitespace-nowrap overflow-hidden text-ellipsis font-bold tracking-tight">
                {label.replace(/_/g, ' ')}
            </Typography>
            {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-indigo-500" />}
        </button>
    );
};

export default CategoryItem;

