import type { ReactNode, CSSProperties } from 'react';

interface TypographyProps {
    children: ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
    color?: string;
    weight?: 'normal' | 'bold' | '900' | '800';
    align?: 'left' | 'center' | 'right';
    className?: string;
    style?: CSSProperties;
    uppercase?: boolean;
}

export const Typography = ({
    children,
    variant = 'body',
    color,
    weight,
    align,
    className,
    style,
    uppercase
}: TypographyProps) => {
    const getBaseStyles = (): CSSProperties => {
        const styles: CSSProperties = {
            margin: 0,
            color: color || 'inherit',
            textAlign: align,
            textTransform: uppercase ? 'uppercase' : 'none',
            letterSpacing: uppercase ? '0.1em' : 'normal',
            lineHeight: 1.2,
            ...style
        };

        switch (variant) {
            case 'h1': return { ...styles, fontSize: '24px', fontWeight: weight || '900' };
            case 'h2': return { ...styles, fontSize: '20px', fontWeight: weight || '900' };
            case 'h3': return { ...styles, fontSize: '18px', fontWeight: weight || '800' };
            case 'h4': return { ...styles, fontSize: '14px', fontWeight: weight || '800' };
            case 'caption': return { ...styles, fontSize: '10px', fontWeight: weight || '900' };
            case 'label': return { ...styles, fontSize: '12px', fontWeight: weight || '800' };
            default: return { ...styles, fontSize: '14px', fontWeight: weight || '400' };
        }
    };

    const Tag = variant.startsWith('h') ? variant : 'p';

    return (
        // @ts-ignore
        <Tag className={className} style={getBaseStyles()}>
            {children}
        </Tag>
    );
};

export default Typography;
