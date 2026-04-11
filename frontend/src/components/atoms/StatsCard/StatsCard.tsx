import { type ReactNode } from 'react';

interface StatsCardProps {
    label: string;
    value: string | number | undefined;
    icon: ReactNode;
    color?: string;
}

export const StatsCard = ({ label, value, icon, color = '#6366f1' }: StatsCardProps) => {
    return (
        <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            padding: '20px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'all 0.3s'
        }}>
            <div style={{ backgroundColor: `${color}10`, padding: '12px', borderRadius: '16px', color }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'white', margin: 0 }}>{value ?? '--'}</h3>
            </div>
        </div>
    );
};

export default StatsCard;
