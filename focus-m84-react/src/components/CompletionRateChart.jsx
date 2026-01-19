import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import './Charts.css'

function CompletionRateChart({ stats }) {
    const data = [
        { name: 'Completadas', value: stats.completed, color: '#00ff88' },
        { name: 'Abandonadas', value: stats.failed, color: '#ff4444' }
    ]

    // Only show chart if there's data
    if (stats.completed === 0 && stats.failed === 0) {
        return (
            <div className="chart-empty">
                <p>Completa tu primera tarea para ver estadísticas</p>
            </div>
        )
    }

    return (
        <div className="chart-container">
            <h4>Tasa de Completación</h4>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <div className="chart-stat">
                <span className="stat-big">{stats.completionRate}%</span>
                <span className="stat-label">Tasa de Éxito</span>
            </div>
        </div>
    )
}

export default CompletionRateChart
