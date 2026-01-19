import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function PauseReasonsChart({ history }) {
    // Process history to count pause reasons
    const reasonCounts = {};

    history.forEach(session => {
        if (session.pauses && Array.isArray(session.pauses)) {
            session.pauses.forEach(pause => {
                const reason = pause.reason || 'Desconocido';
                reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
            });
        }
    });

    const data = Object.keys(reasonCounts)
        .map(reason => ({
            reason,
            count: reasonCounts[reason]
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Show top 5 reasons

    if (data.length === 0) {
        return (
            <div className="chart-container">
                <h3>Motivos de Pausa</h3>
                <p className="empty-chart-message">No hay datos de pausas aún.</p>
            </div>
        );
    }

    const totalLostSeconds = history.reduce((acc, session) => {
        if (!session.pauses) return acc;
        return acc + session.pauses.reduce((pa, p) => pa + (p.duration || 0), 0);
    }, 0);

    const formatSeconds = (seconds) => {
        if (seconds < 60) return `${seconds}s`
        const minutes = (seconds / 60).toFixed(1)
        if (minutes < 60) return `${minutes}m`
        const hours = (seconds / 3600).toFixed(1)
        return `${hours}h`
    }

    const COLORS = ['#FF4444', '#FF8800', '#FFCC00', '#00CC88', '#0088FF'];

    return (
        <div className="chart-container">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                <h3 style={{ margin: 0 }}>Motivos de Pausa más Recurrentes</h3>
                <div className="lost-time-badge" style={{
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--accent-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap'
                }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tiempo Perdido:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-danger)' }}>{formatSeconds(totalLostSeconds)}</span>
                </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#333" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="reason"
                            type="category"
                            tick={{ fill: '#888', fontSize: 12 }}
                            width={100}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default PauseReasonsChart;
