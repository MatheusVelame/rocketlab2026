import type { ReactNode } from 'react';
import { Icon } from '../../atoms/icon/icon';
import { Typography } from '../../atoms/typography/typography';

interface NavItemProps {
    label: string;
    icon: ReactNode;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: () => void;
}

export const NavItem = ({ label, icon, isActive, isCollapsed, onClick }: NavItemProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: isActive ? '#818cf8' : '#64748b',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginBottom: '4px',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
        >
            <Icon size={20}>{icon}</Icon>
            {!isCollapsed && (
                <Typography variant="body" weight="800">
                    {label}
                </Typography>
            )}
        </button>
    );
};

export default NavItem;
