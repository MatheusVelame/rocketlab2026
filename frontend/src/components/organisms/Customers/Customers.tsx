import type { Consumidor } from '../../../types';

interface CustomersProps {
    clientes: Consumidor[];
    onViewDetails: (c: Consumidor) => void;
}

export const Customers = ({
    clientes,
    onViewDetails
}: CustomersProps) => {
    const icons = {
        details: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
        pin: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Desktop Table */}
            <div className="hidden lg:block bg-slate-900/40 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm border-collapse border-spacing-0">
                    <thead className="bg-white/5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        <tr>
                            <th className="p-6">ID</th>
                            <th className="p-6">Nome</th>
                            <th className="p-6">Localização</th>
                            <th className="p-6 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-200">
                        {clientes.map((c) => (
                            <tr key={c.id_consumidor} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="p-6 font-mono text-[10px] text-slate-600">#{c.id_consumidor.substr(0, 16)}...</td>
                                <td className="p-6 font-bold">{c.nome_consumidor}</td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs whitespace-nowrap">
                                        {icons.pin}
                                        <span className="font-semibold">{c.cidade}, {c.estado}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <button
                                        onClick={() => onViewDetails(c)}
                                        className="bg-white/5 border border-white/10 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex inline-flex items-center gap-2 transition-all hover:bg-white/10"
                                    >
                                        {icons.details} Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                {clientes.map((c) => (
                    <div key={c.id_consumidor} className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] text-slate-600">#{c.id_consumidor.substr(0, 8)}...</span>
                                <h4 className="font-bold text-lg text-white">{c.nome_consumidor}</h4>
                            </div>
                            <div className="px-2 py-1 bg-indigo-500/10 rounded flex items-center gap-1 text-[10px] text-indigo-300 font-bold uppercase">
                                {icons.pin} {c.estado}
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                            {c.cidade}
                        </p>
                        <button
                            onClick={() => onViewDetails(c)}
                            className="bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 w-full p-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2"
                        >
                            {icons.details} Ver Detalhes
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Customers;
