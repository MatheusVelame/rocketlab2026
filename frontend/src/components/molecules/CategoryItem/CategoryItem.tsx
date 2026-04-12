import { Icon } from '../../atoms/Icon/Icon';
import { Typography } from '../../atoms/Typography/Typography';

interface CategoryItemProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export const CategoryItem = ({ label, isActive, onClick }: CategoryItemProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                transition: 'all 0.3s',
                textAlign: 'left',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                color: isActive ? '#818cf8' : '#64748b'
            }}
        >
            <Icon size={12} color={isActive ? '#4f46e5' : '#475569'}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
            </Icon>
            <Typography variant="label" style={{ textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {label.replace(/_/g, ' ')}
            </Typography>
            {isActive && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#4f46e5' }} />}
        </button>
    );
};

export default CategoryItem;

