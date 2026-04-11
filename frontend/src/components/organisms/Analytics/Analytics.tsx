import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardStats } from '../../../types';

interface AnalyticsProps {
    dashSummary: DashboardStats | null;
}

export const Analytics = ({ dashSummary }: AnalyticsProps) => {
    if (!dashSummary) return null;

    const statusData = Object.entries(dashSummary.status_distribution).map(([status, count]) => ({
        status: status.replace(/_/g, ' '),
        count
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase', margin: 0 }}>Analytics Global</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '40px', borderRadius: '48px', border: '1px solid rgba(255, 255, 255, 0.05)', height: '400px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Histórico de Receita</p>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'white', margin: 0 }}>Faturamento Mensal (BRL)</h4>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={dashSummary.revenue_history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10, fontWeight: '900' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#475569', fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }} />
                            <Bar dataKey="revenue" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '40px', borderRadius: '48px', border: '1px solid rgba(255, 255, 255, 0.05)', height: '400px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <p style={{ fontSize: '10px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Status de Pedidos</p>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'white', margin: 0 }}>Distribuição de Entregas</h4>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={statusData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="status" type="category" tick={{ fill: '#475569', fontSize: 8, fontWeight: '900' }} axisLine={false} tickLine={false} width={100} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }} />
                            <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
