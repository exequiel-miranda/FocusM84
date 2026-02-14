import { useState, useEffect } from 'react'
import { getQuitMessage, getSuccessMessage, getFocusMessage, getTimeMessage, getPauseMessage } from '../utils/motivation'
import { usePauseReasons } from '../hooks/useDatabase'
import './FocusMode.css'

function FocusMode({ task, onComplete, onFail }) {
    const [elapsedTime, setElapsedTime] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [showQuitModal, setShowQuitModal] = useState(false)
    const [showPauseModal, setShowPauseModal] = useState(false)
    const [showRewardModal, setShowRewardModal] = useState(false)
    const [pauseReason, setPauseReason] = useState('')
    const [customReason, setCustomReason] = useState('')
    const [motivationMessage, setMotivationMessage] = useState('')
    const [quitMessage, setQuitMessage] = useState('')
    const [pauseMotivation, setPauseMotivation] = useState('')

    const [sessionPauses, setSessionPauses] = useState([])
    const [pauseStartTime, setPauseStartTime] = useState(null)

    const { reasons, addReason } = usePauseReasons()

    useEffect(() => {
        // Set initial motivation message
        setMotivationMessage(getFocusMessage())

        // Timer effect
        let timerInterval
        if (!isPaused) {
            timerInterval = setInterval(() => {
                setElapsedTime(prev => prev + 1)
            }, 1000)
        }

        // Motivation message effect
        let motivationInterval
        if (!isPaused) {
            motivationInterval = setInterval(() => {
                const minutesElapsed = Math.floor(elapsedTime / 60)
                const minutesRemaining = task.estimatedTime - minutesElapsed

                if (minutesRemaining > 0) {
                    setMotivationMessage(getTimeMessage(minutesRemaining))
                } else {
                    setMotivationMessage(getFocusMessage())
                }
            }, 180000) // 3 minutes
        } else {
            // Update pause motivation every 30 seconds
            setPauseMotivation(getPauseMessage())
            motivationInterval = setInterval(() => {
                setPauseMotivation(getPauseMessage())
            }, 30000)
        }

        // Prevent accidental navigation
        const handleBeforeUnload = (e) => {
            e.preventDefault()
            e.returnValue = '¿Seguro que quieres salir? Perderás tu progreso.'
        }
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            if (timerInterval) clearInterval(timerInterval)
            if (motivationInterval) clearInterval(motivationInterval)
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [task.estimatedTime, elapsedTime, isPaused])

    const getProgress = () => {
        const estimatedSeconds = task.estimatedTime * 60
        return Math.min((elapsedTime / estimatedSeconds) * 100, 100)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const handleComplete = () => {
        if (task.reward) {
            setShowRewardModal(true)
        } else {
            finalizeCompletion()
        }
    }

    const finalizeCompletion = () => {
        const focusTimeMinutes = Math.ceil(elapsedTime / 60)
        onComplete(focusTimeMinutes, sessionPauses)
    }

    const handleQuitAttempt = () => {
        const progress = getProgress() / 100
        setQuitMessage(getQuitMessage(progress))
        setShowQuitModal(true)
    }

    const handleConfirmQuit = () => {
        const focusTimeMinutes = Math.ceil(elapsedTime / 60)
        onFail(focusTimeMinutes, sessionPauses)
    }

    const handleCancelQuit = () => {
        setShowQuitModal(false)
        setMotivationMessage("Buena decisión. Continúa trabajando.")
    }

    const handlePauseAttempt = () => {
        setShowPauseModal(true)
    }

    const handleConfirmPause = async () => {
        let selectedReason = pauseReason
        if (pauseReason === 'other' && customReason.trim()) {
            selectedReason = customReason.trim()
            await addReason(selectedReason)
        }

        if (!selectedReason || selectedReason === 'other') {
            alert('Por favor selecciona un motivo válido para la pausa.')
            return
        }

        setIsPaused(true)
        setPauseStartTime(new Date())
        setShowPauseModal(false)
    }

    const handleResume = () => {
        const now = new Date()
        const durationSeconds = Math.round((now - pauseStartTime) / 1000)

        const selectedReason = pauseReason === 'other' ? customReason.trim() : pauseReason
        setSessionPauses([...sessionPauses, {
            reason: selectedReason,
            duration: durationSeconds,
            timestamp: pauseStartTime
        }])

        setIsPaused(false)
        setPauseReason('')
        setCustomReason('')
        setPauseStartTime(null)
        setMotivationMessage("Modo Focus reanudado. No vuelvas a pausar.")
    }

    const progress = getProgress()

    return (
        <div className={`focus-mode ${isPaused ? 'paused' : ''}`}>
            {isPaused && (
                <div className="pause-overlay">
                    <div className="pause-alert">
                        <div className="pause-icon">⚠️</div>
                        <h1>EStado de Pausa "necesaria"</h1>
                        <p className="pause-reason-display">Motivo: {pauseReason === 'other' ? customReason : pauseReason}</p>
                        <div className="pause-motivation">{pauseMotivation}</div>
                        <button onClick={handleResume} className="btn btn-primary btn-large btn-resume">
                            REANUDAR AHORA
                        </button>
                    </div>
                </div>
            )}

            <div className="focus-container">
                <div className="current-task">
                    <h2>{task.name}</h2>
                    <p>Tiempo estimado: {task.estimatedTime} min</p>
                </div>

                <div className="timer-display">
                    <div className="timer">{formatTime(elapsedTime)}</div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: progress >= 100 ? 'var(--accent-success)' : progress >= 75 ? 'var(--accent-warning)' : 'var(--accent-primary)'
                            }}
                        />
                    </div>
                </div>

                <div className="focus-controls">
                    <button onClick={handleComplete} className="btn btn-success btn-large" disabled={isPaused}>
                        ✓ Tarea Completada
                    </button>
                    <button onClick={handlePauseAttempt} className="btn btn-secondary btn-large" disabled={isPaused}>
                        ⏸ Pausa Emergencia
                    </button>
                    <button onClick={handleQuitAttempt} className="btn btn-danger btn-large" disabled={isPaused}>
                        Abandonar (Cobarde)
                    </button>
                </div>

                <div className="focus-motivation harsh-message">
                    {isPaused ? "SISTEMA EN PAUSA - EL TIEMPO NO PERDONA" : motivationMessage}
                </div>
            </div>

            {showQuitModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>¿Seguro que quieres rendirte?</h2>
                        <p className="harsh-message">{quitMessage}</p>
                        <div className="modal-buttons">
                            <button onClick={handleConfirmQuit} className="btn btn-danger">
                                Sí, me rindo
                            </button>
                            <button onClick={handleCancelQuit} className="btn btn-primary">
                                No, seguiré trabajando
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPauseModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Pausa de Emergencia</h2>
                        <p>Solo pausa si es estrictamente necesario. Selecciona el motivo:</p>
                        <div className="reason-selector">
                            {reasons.map(r => (
                                <label key={r._id} className="reason-option">
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r.text}
                                        onChange={(e) => setPauseReason(e.target.value)}
                                        checked={pauseReason === r.text}
                                    />
                                    <span>{r.text}</span>
                                </label>
                            ))}
                            <label className="reason-option">
                                <input
                                    type="radio"
                                    name="reason"
                                    value="other"
                                    onChange={(e) => setPauseReason(e.target.value)}
                                    checked={pauseReason === 'other'}
                                />
                                <span>Otro (Se guardará)</span>
                            </label>
                        </div>

                        {pauseReason === 'other' && (
                            <input
                                type="text"
                                placeholder="Escribe el motivo..."
                                className="task-input"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                style={{ marginTop: '1rem' }}
                            />
                        )}

                        <div className="modal-buttons" style={{ marginTop: '1.5rem' }}>
                            <button onClick={handleConfirmPause} className="btn btn-danger">
                                Confirmar Pausa Necesaria
                            </button>
                            <button onClick={() => setShowPauseModal(false)} className="btn btn-secondary">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRewardModal && (
                <div className="modal">
                    <div className="modal-content reward-modal-content">
                        <h2>🎉 ¡Felicidades! 🎉</h2>
                        <p>Has completado la tarea <strong>"{task.name}"</strong>.</p>
                        <div className="reward-display">
                            <p>Tu recompensa desbloqueada:</p>
                            <h3>🎁 {task.reward} 🎁</h3>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={finalizeCompletion} className="btn btn-success btn-large">
                                ¡Reclamar Recompensa!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FocusMode
