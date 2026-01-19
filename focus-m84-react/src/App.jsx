import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import FocusMode from './components/FocusMode'
import Stats from './components/Stats'
import { useTasks, useStats, useHistory } from './hooks/useDatabase'
import { getHarshMessage, getPerformanceMessage } from './utils/motivation'
import './App.css'

function App() {
  const { tasks, addTask: dbAddTask, updateTask: dbUpdateTask, deleteTask: dbDeleteTask, loading: tasksLoading } = useTasks()
  const { stats, updateStats: dbUpdateStats, loading: statsLoading } = useStats()
  const { history, addHistoryEntry: dbAddHistory, loading: historyLoading } = useHistory()

  const [currentTask, setCurrentTask] = useState(null)
  const [motivationalMessage, setMotivationalMessage] = useState('')

  useEffect(() => {
    if (statsLoading) return
    // Update motivational message based on stats
    if (stats.completed === 0 && stats.failed === 0) {
      setMotivationalMessage(getHarshMessage())
    } else {
      setMotivationalMessage(getPerformanceMessage(stats))
    }
  }, [stats, statsLoading])

  const addTask = async (task) => {
    try {
      await dbAddTask(task)
    } catch (err) {
      alert('Error al agregar tarea: ' + err.message)
    }
  }

  const updateTask = async (taskId, updatedTask) => {
    try {
      await dbUpdateTask(taskId, updatedTask)
    } catch (err) {
      alert('Error al actualizar tarea: ' + err.message)
    }
  }

  const deleteTask = async (taskId) => {
    if (window.confirm('¿Eliminar esta tarea?')) {
      try {
        await dbDeleteTask(taskId)
      } catch (err) {
        alert('Error al eliminar tarea: ' + err.message)
      }
    }
  }

  const startFocus = (task) => {
    setCurrentTask(task)
  }

  const completeTask = async (focusTimeMinutes, pauses = []) => {
    const newStats = {
      ...stats,
      completed: stats.completed + 1,
      totalFocusTime: stats.totalFocusTime + focusTimeMinutes
    }
    const total = newStats.completed + newStats.failed
    newStats.completionRate = total > 0 ? Math.round((newStats.completed / total) * 100) : 0

    try {
      await dbUpdateStats(newStats)
      await dbAddHistory({
        task: currentTask.name,
        estimatedTime: currentTask.estimatedTime,
        actualTime: focusTimeMinutes,
        status: 'completed',
        pauses: pauses
      })
      // Delete task from DB since it's completed
      if (currentTask._id) {
        await dbDeleteTask(currentTask._id)
      }
    } catch (err) {
      console.error('Error completing task:', err)
    }

    setCurrentTask(null)
  }

  const failTask = async (focusTimeMinutes, pauses = []) => {
    const newStats = {
      ...stats,
      failed: stats.failed + 1
    }
    const total = newStats.completed + newStats.failed
    newStats.completionRate = total > 0 ? Math.round((newStats.completed / total) * 100) : 0

    try {
      await dbUpdateStats(newStats)
      await dbAddHistory({
        task: currentTask.name,
        estimatedTime: currentTask.estimatedTime,
        actualTime: focusTimeMinutes,
        status: 'failed',
        pauses: pauses
      })
    } catch (err) {
      console.error('Error failing task:', err)
    }

    setCurrentTask(null)
  }

  const isLoading = tasksLoading || statsLoading || historyLoading

  if (isLoading && !currentTask) {
    return (
      <div className="app loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pulse">Conectando con MongoDB...</div>
      </div>
    )
  }

  return (
    <div className="app">
      {!currentTask ? (
        <>
          <header className="header">
            <h1>Focus M84</h1>
            <p className="motivational-message">{motivationalMessage}</p>
          </header>

          <main className="main-content">
            <TaskList
              tasks={tasks}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onStartFocus={startFocus}
            />

            <Stats stats={stats} history={history} />
          </main>
        </>
      ) : (
        <FocusMode
          task={currentTask}
          onComplete={completeTask}
          onFail={failTask}
        />
      )}
    </div>
  )
}

export default App
