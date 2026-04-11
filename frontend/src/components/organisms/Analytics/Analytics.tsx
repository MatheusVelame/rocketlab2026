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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <p style={{ fontSize: '12px', fontWeight: '900', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 8px 0' }}>Performance em Tempo Real</p>
                    <h3 style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase', margin: 0 }}>Dashboard Analytics</h3>
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                    <span style={{ fontSize: '10px', fontWeight: '900', color: '#818cf8', textTransform: 'uppercase' }}>Sincronizado: Hoje</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '24px', borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: '12px',
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '40px', opacity: 0.1 }}>{kpi.icon}</div>
                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{kpi.label}</span>
                        <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'white', margin: 0 }}>{kpi.value}</h2>
                        <div style={{ width: '40px', height: '4px', backgroundColor: kpi.color, borderRadius: '2px' }}></div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '40px', borderRadius: '48px', border: '1px solid rgba(255, 255, 255, 0.05)', height: '450px' }}
                >
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Fluxo Financeiro</p>
                            <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'white', margin: '4px 0 0 0' }}>Faturamento Mensal</h4>
                        </div>
                        <div style={{ fontSize: '20px' }}>📈</div>
                    </div>
                    <ResponsiveContainer width="100%" height="75%">
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
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '40px', borderRadius: '48px', border: '1px solid rgba(255, 255, 255, 0.05)', height: '450px' }}
                >
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Logística de Pedidos</p>
                            <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'white', margin: '4px 0 0 0' }}>Distribuição de Status</h4>
                        </div>
                        <div style={{ fontSize: '20px' }}>📊</div>
                    </div>
                    <ResponsiveContainer width="100%" height="75%">
                        <BarChart data={statusData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="status" type="category" tick={{ fill: '#e2e8f0', fontSize: 10, fontWeight: '800' }} axisLine={false} tickLine={false} width={120} />
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
