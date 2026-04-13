import { type ReactNode } from 'react';
import { Typography } from '../../atoms/typography/typography';
import { Icon } from '../../atoms/icon/icon';

interface StatsCardProps {
    label: string;
    value: string | number | undefined;
    icon: ReactNode;
    color?: string;
}

export const StatsCard = ({ label, value, icon, color = '#6366f1' }: StatsCardProps) => {
    return (
        <div className="bg-slate-900/40 p-5 rounded-[24px] border border-white/5 flex items-center gap-4 transition-all hover:bg-slate-900/60">
            <Icon color={color} size={44} className="rounded-2xl p-3" style={{ backgroundColor: `${color}10` }}>
                {icon}
            </Icon>
            <div className="flex flex-col">
                <Typography variant="caption" color="#64748b" uppercase>
                    {label}
                </Typography>
                <Typography variant="h3" color="white">
                    {value ?? '--'}
                </Typography>
            </div>
        </div>
    );
};


export default StatsCard;

