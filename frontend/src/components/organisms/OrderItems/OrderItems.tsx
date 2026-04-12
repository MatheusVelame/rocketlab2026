import { motion } from 'framer-motion';
import type { PedidoItem } from '../../../types';

interface OrderItemsProps {
    itens: PedidoItem[];
    onViewDetails: (item: PedidoItem) => void;
}

export const OrderItems = ({
    itens, onViewDetails
}: OrderItemsProps) => {

    const getStatusStyle = (status?: string) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('delivered') || s.includes('entregue')) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500', color: 'text-emerald-500', label: 'Entregue' };
        if (s.includes('shipped') || s.includes('enviado')) return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-500', color: 'text-blue-500', label: 'Enviado' };
        if (s.includes('canceled') || s.includes('cancelado')) return { bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500', color: 'text-red-500', label: 'Cancelado' };
        if (s.includes('processing') || s.includes('processando')) return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-500', color: 'text-amber-500', label: 'Processando' };
        return { bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-500', color: 'text-slate-500', label: status || 'Pendente' };
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Desktop Table */}
            <div className="hidden xl:block bg-slate-900/40 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-white/5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        <tr>
                            <th className="p-6">Pedido / ID</th>
                            <th className="p-6">Produto Vinculado</th>
                            <th className="p-6">Status Atual</th>
                            <th className="p-6">Financeiro</th>
                            <th className="p-6">Valor Total</th>
                            <th className="p-6 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-200">
                        {itens.map((item, idx) => {
                            const status = getStatusStyle(item.status_pedido);
                            return (
                                <motion.tr
                                    key={`${item.id_pedido}-${item.id_item}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                                    onClick={() => onViewDetails(item)}
                                >
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-indigo-500 mb-1">#{item.id_pedido.substr(0, 8)}</span>
                                            <span className="text-[10px] text-slate-500">Item: {item.id_item}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white max-w-[200px] truncate">
                                                {item.nome_produto || item.id_produto.substr(0, 16) + '...'}
                                            </span>
                                            <span className="text-[10px] text-slate-600">SKU: {item.id_produto.substr(0, 8).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${status.bg} ${status.border}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col text-[11px]">
                                            <span className="text-slate-400">Item: R$ {item.preco_BRL.toFixed(2)}</span>
                                            <span className="text-slate-500 whitespace-nowrap">Frete: R$ {item.preco_frete.toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm font-black text-emerald-500 whitespace-nowrap">R$ {(item.preco_BRL + item.preco_frete).toFixed(2)}</span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-indigo-500/20 transition-all uppercase">Analisar</button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:hidden gap-4">
                {itens.map((item, idx) => {
                    const status = getStatusStyle(item.status_pedido);
                    return (
                        <motion.div
                            key={`${item.id_pedido}-${item.id_item}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => onViewDetails(item)}
                            className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 flex flex-col gap-4 cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-indigo-500">#{item.id_pedido.substr(0, 8)}</span>
                                <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg border ${status.bg} ${status.border}`}>
                                    <span className={`text-[9px] font-black uppercase tracking-wider ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm line-clamp-1">{item.nome_produto || 'Produto sem nome'}</h4>
                                <span className="text-[10px] text-slate-500">SKU: {item.id_produto.substr(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5 items-center">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-slate-500 uppercase font-black">Subtotal</span>
                                    <span className="text-xs text-slate-200">R$ {item.preco_BRL.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[9px] text-slate-500 uppercase font-black">Frete</span>
                                    <span className="text-xs text-slate-200">R$ {item.preco_frete.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-slate-500 uppercase font-black">Total</span>
                                    <span className="text-lg font-black text-emerald-500">R$ {(item.preco_BRL + item.preco_frete).toFixed(2)}</span>
                                </div>
                                <button className="bg-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black text-white">DETALHES</button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

