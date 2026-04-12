import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import type { DashboardStats } from '../../../types';
import { motion } from 'framer-motion';

interface AnalyticsProps {
    dashSummary: DashboardStats | null;
}

export const Analytics = ({ dashSummary }: AnalyticsProps) => {
    if (!dashSummary) return null;

    const statusData = Object.entries(dashSummary.status_distribution).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '),
        quantidade: count
    }));

    const kpis = [
        { label: 'Faturamento Total', value: `R$ ${(dashSummary.total_revenue / 1000).toFixed(1)}k`, icon: '💰', color: '#4f46e5' },
        { label: 'Total de Pedidos', value: dashSummary.total_orders.toLocaleString(), icon: '📦', color: '#10b981' },
        { label: 'Ticket Médio', value: `R$ ${dashSummary.average_ticket.toFixed(2)}`, icon: '🎫', color: '#f59e0b' },
        { label: 'Total Clientes', value: dashSummary.total_customers.toLocaleString(), icon: '👥', color: '#ec4899' },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <p style={{ color: '#64748b', fontSize: '10px', fontWeight: '900', margin: '0 0 8px 0', textTransform: 'uppercase' }}>{label}</p>
                    <p style={{ color: 'white', fontSize: '14px', fontWeight: '800', margin: 0 }}>
                        {payload[0].name === 'revenue' ? `R$ ${payload[0].value.toLocaleString()}` : `${payload[0].value} unidades`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <p className="text-[10px] sm:text-[12px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Performance em Tempo Real</p>
                    <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase">Dashboard Analytics</h3>
                </div>
                <div className="px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <span className="text-[10px] font-black text-indigo-300 uppercase">Sincronizado: Hoje</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-900/40 p-6 rounded-[32px] border border-white/5 flex flex-col gap-3 relative overflow-hidden"
                    >
                        <div className="absolute top-[-10px] right-[-10px] text-4xl opacity-10">{kpi.icon}</div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</span>
                        <h2 className="text-2xl font-black text-white">{kpi.value}</h2>
                        <div className="w-10 h-1 rounded-full" style={{ backgroundColor: kpi.color }}></div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900/40 p-6 sm:p-10 rounded-[40px] border border-white/5 h-[350px] sm:h-[450px]"
                >
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fluxo Financeiro</p>
                            <h4 className="text-lg font-black text-white mt-1">Faturamento Mensal</h4>
                        </div>
                        <div className="text-xl">📈</div>
                    </div>
                    <ResponsiveContainer width="100%" height="70%">
                        <AreaChart data={dashSummary.revenue_history}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10, fontWeight: '900' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="revenue" name="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/40 p-6 sm:p-10 rounded-[40px] border border-white/5 h-[350px] sm:h-[450px]"
                >
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logística de Pedidos</p>
                            <h4 className="text-lg font-black text-white mt-1">Distribuição de Status</h4>
                        </div>
                        <div className="text-xl">📊</div>
                    </div>
                    <ResponsiveContainer width="100%" height="70%">
                        <BarChart data={statusData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="status" type="category" tick={{ fill: '#e2e8f0', fontSize: 10, fontWeight: '800' }} axisLine={false} tickLine={false} width={100} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="quantidade" name="quantidade" radius={[0, 12, 12, 0]}>
                                {statusData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#34d399'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>

    );
};

export default Analytics;
