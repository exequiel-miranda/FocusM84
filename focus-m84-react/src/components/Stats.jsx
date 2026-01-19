import CompletionRateChart from './CompletionRateChart'
import TimeDistributionChart from './TimeDistributionChart'
import PerformanceTrendChart from './PerformanceTrendChart'
import PauseReasonsChart from './PauseReasonsChart'
import './Stats.css'

function Stats({ stats, history }) {
    const formatTime = (minutes) => {
        const hours = (minutes / 60).toFixed(1)
        return `${hours}h`
    }

    const calculateTotalLostTime = () => {
        let totalSeconds = 0
        history.forEach(session => {
            if (session.pauses && Array.isArray(session.pauses)) {
                session.pauses.forEach(pause => {
                    totalSeconds += pause.duration || 0
                })
            }
        })
        return totalSeconds
    }

    const totalLostSeconds = calculateTotalLostTime()

    const formatSeconds = (seconds) => {
        if (seconds < 60) return `${seconds}s`
        const minutes = (seconds / 60).toFixed(1)
        if (minutes < 60) return `${minutes}m`
        const hours = (seconds / 3600).toFixed(1)
        return `${hours}h`
    }

    return (
        <>
            <section className="stats-section">
                <h3>Tu Rendimiento</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-value">{stats.completed}</span>
                        <span className="stat-label">Completadas</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.failed}</span>
                        <span className="stat-label">Abandonadas</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.completionRate}%</span>
                        <span className="stat-label">Tasa de Éxito</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{formatTime(stats.totalFocusTime)}</span>
                        <span className="stat-label">Tiempo Enfocado</span>
                    </div>
                    <div className="stat-card" style={{ borderColor: 'var(--accent-danger)' }}>
                        <span className="stat-value" style={{ color: 'var(--accent-danger)' }}>{formatSeconds(totalLostSeconds)}</span>
                        <span className="stat-label">Tiempo Perdido</span>
                    </div>
                </div>
            </section>

            <section className="charts-section">
                <h3>Análisis Visual</h3>
                <div className="charts-grid">
                    <CompletionRateChart stats={stats} />
                    <TimeDistributionChart history={history} />
                    <PauseReasonsChart history={history} />
                </div>
                <PerformanceTrendChart history={history} />
            </section>
        </>
    )
}

export default Stats
