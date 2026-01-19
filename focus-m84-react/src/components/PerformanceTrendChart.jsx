import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './Charts.css'

function PerformanceTrendChart({ history }) {
    if (history.length === 0) {
        return (
            <div className="chart-empty">
                <p>Completa más tareas para ver tu tendencia de rendimiento</p>
            </div>
        )
    }

    // Calculate rolling completion rate
    const data = []
    let completed = 0
    let failed = 0

    history.forEach((session, index) => {
        if (session.status === 'completed') {
            completed++
        } else {
            failed++
        }

        const total = completed + failed
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0

        // Only show every nth point to avoid overcrowding
        if (index % Math.max(1, Math.floor(history.length / 20)) === 0 || index === history.length - 1) {
            data.push({
                session: index + 1,
                rate: rate,
                completed: completed,
                failed: failed
            })
        }
    })

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-task">Sesión #{payload[0].payload.session}</p>
                    <p className="tooltip-time">Tasa: {payload[0].value}%</p>
                    <p className="tooltip-time">Completadas: {payload[0].payload.completed}</p>
                    <p className="tooltip-time">Abandonadas: {payload[0].payload.failed}</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="chart-container">
            <h4>Tendencia de Rendimiento</h4>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis
                        dataKey="session"
                        stroke="#a0a0a0"
                        label={{ value: 'Sesiones', position: 'insideBottom', offset: -5, fill: '#a0a0a0' }}
                    />
                    <YAxis
                        stroke="#a0a0a0"
                        domain={[0, 100]}
                        label={{ value: 'Tasa de Éxito (%)', angle: -90, position: 'insideLeft', fill: '#a0a0a0' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#00ff88"
                        strokeWidth={3}
                        name="Tasa de Éxito"
                        dot={{ fill: '#00ff88', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default PerformanceTrendChart
