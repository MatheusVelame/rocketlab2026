import { motion } from 'framer-motion';
import type { PedidoItemDetalhado } from '../../../types';

interface OrderItemModalProps {
    details: PedidoItemDetalhado | null;
    onClose: () => void;
}

export const OrderItemModal = ({ details, onClose }: OrderItemModalProps) => {
    if (!details) return null;

    const icons = {
        close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
        box: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
        user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        store: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9 12 3l9 6v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22V12h6v10" /></svg>,
        clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Pendente';
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const isOnTime = details.entrega_no_prazo === 'SIM';

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-4xl bg-slate-900 rounded-[48px] border border-white/10 shadow-2xl p-6 sm:p-12 overflow-y-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-500"> {icons.close} </button>

                <div className="flex flex-col gap-8 sm:gap-12">
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start text-center sm:text-left">
                        <div className="w-20 h-20 rounded-[28px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0 uppercase tracking-widest">
                            {icons.box}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest break-all">Pedido #{details.item.id_pedido.substr(0, 12)}</span>
                                <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-700" />
                                <div className={`
                                    px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border
                                    ${isOnTime ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}
                                `}>
                                    {isOnTime ? 'No Prazo' : 'Atrasado'}
                                </div>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight break-words">{details.produto?.nome || `Item ${details.item.id_item}`}</h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Status: <span className="text-slate-300 font-bold uppercase tracking-wider">{details.status_pedido}</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="p-6 sm:p-8 bg-white/[0.02] rounded-[32px] border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Timeline Logística</p>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <span className="text-[11px] text-slate-500 block mb-1">Data de Compra</span>
                                    <span className="text-sm font-bold text-white tracking-tight">{formatDate(details.data_compra)}</span>
                                </div>
                                <div className="w-px h-5 bg-white/5 ml-2" />
                                <div>
                                    <span className="text-[11px] text-slate-500 block mb-1">Data de Entrega</span>
                                    <span className="text-sm font-bold text-white tracking-tight">{formatDate(details.data_entrega)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 bg-white/[0.02] rounded-[32px] border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Performance</p>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-amber-500 bg-amber-500/10 p-2 rounded-lg">{icons.clock}</div>
                                    <div>
                                        <span className="text-[11px] text-slate-500 block">Tempo de Entrega</span>
                                        <span className="text-xl font-black text-white">{details.tempo_entrega_dias?.toFixed(1) || '0.0'} dias</span>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div>
                                    <span className="text-[11px] text-slate-500 block mb-1">Diferença Estimada</span>
                                    <span className={`text-sm font-bold ${(details.diferenca_entrega_dias || 0) <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {(details.diferenca_entrega_dias || 0) > 0 ? '+' : ''}
                                        {details.diferenca_entrega_dias?.toFixed(1) || '0.0'} dias
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="p-5 sm:p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                                <div className="flex gap-4 items-center">
                                    <div className="text-indigo-500 bg-indigo-500/10 p-2 rounded-lg">{icons.user}</div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Consumidor</span>
                                        <span className="text-xs font-bold text-white block truncate">{details.consumidor?.nome}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 sm:p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                                <div className="flex gap-4 items-center">
                                    <div className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">{icons.store}</div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Vendedor</span>
                                        <span className="text-xs font-bold text-white block truncate">{details.vendedor?.nome}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between p-6 sm:p-8 lg:px-12 bg-indigo-500/5 rounded-[32px] border border-indigo-500/10">
                        <div className="flex gap-8 sm:gap-12">
                            <div>
                                <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest block mb-2">Valor Item</span>
                                <span className="text-xl sm:text-2xl font-black text-white">R$ {details.item.preco_BRL.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest block mb-2">Frete</span>
                                <span className="text-xl sm:text-2xl font-black text-white">R$ {details.item.preco_frete.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="lg:text-right border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                            <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest block mb-1">Total Repassado</span>
                            <span className="text-3xl sm:text-4xl font-black text-emerald-500">R$ {(details.item.preco_BRL + details.item.preco_frete).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
