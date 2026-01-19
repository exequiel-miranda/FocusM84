import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './Charts.css'

function TimeDistributionChart({ history }) {
    // Only show last 10 sessions
    const recentHistory = history.slice(-10).reverse()

    if (recentHistory.length === 0) {
        return (
            <div className="chart-empty">
                <p>Completa tareas para ver el historial de tiempo</p>
            </div>
        )
    }

    const data = recentHistory.map((session, index) => ({
        name: `#${recentHistory.length - index}`,
        estimado: session.estimatedTime,
        real: session.actualTime,
        taskName: session.task
    }))

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-task">{payload[0].payload.taskName}</p>
                    <p className="tooltip-time">Estimado: {payload[0].value} min</p>
                    <p className="tooltip-time">Real: {payload[1].value} min</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="chart-container">
            <h4>Tiempo Estimado vs Real</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="name" stroke="#a0a0a0" />
                    <YAxis stroke="#a0a0a0" label={{ value: 'Minutos', angle: -90, position: 'insideLeft', fill: '#a0a0a0' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="estimado" fill="#ffaa00" name="Tiempo Estimado" />
                    <Bar dataKey="real" fill="#00ff88" name="Tiempo Real" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TimeDistributionChart
