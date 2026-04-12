import { motion } from 'framer-motion';
import type { Vendedor } from '../../../types';

interface SellerModalProps {
    seller: Vendedor | null;
    onClose: () => void;
}

export const SellerModal = ({ seller, onClose }: SellerModalProps) => {
    if (!seller) return null;

    const icons = {
        close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
        map: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
        store: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>,
        hash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" /></svg>
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="relative w-full max-w-xl bg-slate-900 rounded-[48px] border border-white/10 shadow-2xl p-6 sm:p-12 overflow-y-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-500"> {icons.close} </button>

                <div className="flex flex-col gap-6 sm:gap-8 items-center text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[32px] sm:rounded-[40px] bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                        {icons.store}
                    </div>

                    <div className="max-w-full overflow-hidden">
                        <h2 className="text-xl sm:text-3xl font-black text-white italic tracking-tighter uppercase mb-2 line-clamp-2">{seller.nome_vendedor}</h2>
                        <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest break-all">
                            {icons.hash} {seller.id_vendedor}
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4">
                        <div className="bg-slate-950/40 p-5 sm:p-6 rounded-3xl border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Cidade</p>
                            <h4 className="text-sm sm:text-lg font-extrabold text-white">{seller.cidade}</h4>
                        </div>
                        <div className="bg-slate-950/40 p-5 sm:p-6 rounded-3xl border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Estado</p>
                            <h4 className="text-sm sm:text-lg font-extrabold text-white">{seller.estado}</h4>
                        </div>
                        <div className="sm:col-span-2 bg-indigo-500/5 p-5 sm:p-6 rounded-3xl border border-indigo-500/10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Prefixo CEP</p>
                                <h4 className="text-xl sm:text-2xl font-black text-white">{seller.prefixo_cep}</h4>
                            </div>
                            <div className="text-indigo-500">{icons.map}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SellerModal;
