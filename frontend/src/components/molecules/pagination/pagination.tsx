import { Icon } from '../../atoms/icon/icon';

interface PaginationProps {
    current: number;
    total: number;
    onChange: (page: number) => void;
}

export const Pagination = ({ current, total, onChange }: PaginationProps) => {
    if (total <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, current - 2);
    let end = Math.min(total, start + maxVisible);
    if (end === total) start = Math.max(0, end - maxVisible);

    for (let i = start; i < end; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onChange(i)}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '900',
                    transition: 'all 0.3s',
                    backgroundColor: i === current ? '#4f46e5' : 'rgba(255,255,255,0.05)',
                    color: i === current ? 'white' : '#64748b',
                    border: 'none',
                    cursor: 'pointer',
                    marginLeft: '4px'
                }}
            >
                {i + 1}
            </button>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
                onClick={() => onChange(current - 1)}
                disabled={current === 0}
                style={{
                    padding: '8px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#64748b',
                    border: 'none',
                    cursor: current === 0 ? 'default' : 'pointer',
                    opacity: current === 0 ? 0.2 : 1,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Icon size={16}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </Icon>
            </button>

            {pages}

            <button
                onClick={() => onChange(current + 1)}
                disabled={current >= total - 1}
                style={{
                    padding: '8px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#64748b',
                    border: 'none',
                    cursor: current >= total - 1 ? 'default' : 'pointer',
                    opacity: current >= total - 1 ? 0.2 : 1,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Icon size={16}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </Icon>
            </button>
        </div>
    );
};

export default Pagination;
