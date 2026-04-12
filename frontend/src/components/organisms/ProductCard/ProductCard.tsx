import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Produto } from '../../../types';

interface ProductCardProps {
    produto: Produto;
    onClick: () => void;
    onMouseEnter?: () => void;
}

export const ProductCard = memo(({ produto, onClick, onMouseEnter }: ProductCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            style={{
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderRadius: '32px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                willChange: 'transform',
                contentVisibility: 'auto'
            }}
        >
            <div style={{ aspectRatio: '1/1', borderRadius: '24px', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#020617', border: '1px solid rgba(255,155,255,0.05)' }}>
                <img
                    src={produto.url_imagem}
                    alt={produto.nome_produto}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div style={{ padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '9px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {produto.categoria_produto.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontSize: '10px', color: '#475569', fontWeight: '900' }}>
                        {produto.peso_produto_gramas}g
                    </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'white', marginTop: '4px', lineHeight: 1.2 }}>
                    {produto.nome_produto}
                </h4>
            </div>
        </motion.div>
    );
});

export default ProductCard;
