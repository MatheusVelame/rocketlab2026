import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Produto } from '../../../types';
import { Typography } from '../../atoms/Typography/Typography';

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
            className="bg-slate-900/40 rounded-[32px] border border-white/5 p-4 cursor-pointer transition-all hover:bg-slate-900/60 will-change-transform"
            style={{ contentVisibility: 'auto' } as any}
        >
            <div className="aspect-square rounded-[24px] overflow-hidden mb-4 bg-slate-950 border border-white/5">
                <img
                    src={produto.url_imagem}
                    alt={produto.nome_produto}
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="px-2">
                <div className="flex items-center justify-between mb-1">
                    <Typography variant="caption" color="#6366f1" uppercase>
                        {produto.categoria_produto.replace(/_/g, ' ')}
                    </Typography>
                    <Typography variant="caption" color="#475569">
                        {produto.peso_produto_gramas}g
                    </Typography>
                </div>
                <Typography variant="h4" color="white" weight="800">
                    {produto.nome_produto}
                </Typography>
            </div>
        </motion.div>
    );
});


export default ProductCard;

