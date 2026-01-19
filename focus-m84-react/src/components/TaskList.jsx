import { useState } from 'react'
import './TaskList.css'

function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask, onStartFocus }) {
    const [taskName, setTaskName] = useState('')
    const [taskTime, setTaskTime] = useState('')
    const [editingId, setEditingId] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!taskName.trim()) {
            alert('Escribe el nombre de la tarea.')
            return
        }

        const time = parseInt(taskTime)
        if (!time || time < 1) {
            alert('Ingresa un tiempo estimado válido.')
            return
        }

        if (editingId) {
            // Update existing task
            onUpdateTask(editingId, { name: taskName, estimatedTime: time })
            setEditingId(null)
        } else {
            // Add new task
            if (tasks.length >= 20) {
                alert('Máximo 20 tareas permitidas.')
                return
            }
            onAddTask({ name: taskName, estimatedTime: time })
        }

        setTaskName('')
        setTaskTime('')
    }

    const handleEdit = (task) => {
        setTaskName(task.name)
        setTaskTime(task.estimatedTime.toString())
        setEditingId(task._id)
    }

    const handleCancelEdit = () => {
        setTaskName('')
        setTaskTime('')
        setEditingId(null)
    }

    return (
        <section className="task-section">
            <h2>Tus Tareas Pendientes</h2>
            <p className="subtitle">Agrega todas las tareas que necesites. Elige cuál iniciar.</p>

            <form className="task-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="¿Qué vas a hacer AHORA?"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    maxLength={100}
                    className="task-input"
                />
                <div className="time-input-group">
                    <input
                        type="number"
                        placeholder="Minutos estimados"
                        value={taskTime}
                        onChange={(e) => setTaskTime(e.target.value)}
                        min="1"
                        max="240"
                        className="time-input"
                    />
                    <span className="time-label">min</span>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary">
                        {editingId ? 'Actualizar Tarea' : 'Agregar Tarea'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="task-list">
                {tasks.length === 0 ? (
                    <p className="empty-message">No hay tareas. Agrega una para empezar.</p>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className="task-item">
                            <div className="task-info">
                                <div className="task-name">{task.name}</div>
                                <div className="task-time">{task.estimatedTime} minutos</div>
                            </div>
                            <div className="task-actions">
                                <button
                                    onClick={() => onStartFocus(task)}
                                    className="btn btn-primary btn-small"
                                    title="Iniciar esta tarea"
                                >
                                    ▶ Iniciar
                                </button>
                                <button
                                    onClick={() => handleEdit(task)}
                                    className="btn btn-secondary btn-small"
                                    title="Editar tarea"
                                >
                                    ✎ Editar
                                </button>
                                <button
                                    onClick={() => onDeleteTask(task._id)}
                                    className="btn btn-danger btn-small"
                                    title="Eliminar tarea"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {tasks.length > 0 && (
                <button
                    onClick={() => onStartFocus(tasks[0])}
                    className="btn btn-focus"
                >
                    Iniciar Primera Tarea ({tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'} pendientes)
                </button>
            )}
        </section>
    )
}

export default TaskList
