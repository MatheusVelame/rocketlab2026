import type { ReactNode, CSSProperties } from 'react';

interface IconProps {
    children: ReactNode;
    size?: number | string;
    color?: string;
    className?: string;
    style?: CSSProperties;
}

export const Icon = ({ children, size = 20, color = 'currentColor', className, style }: IconProps) => {
    return (
        <div
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
                color: color,
                ...style
            }}
        >
            {children}
        </div>
    );
};

export default Icon;
