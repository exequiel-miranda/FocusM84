import { useState, useEffect } from 'react'
import { tasksAPI, statsAPI, historyAPI, reasonsAPI } from '../services/api'

// Hook for tasks with MongoDB backend
export function useTasks() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadTasks()
    }, [])

    const loadTasks = async () => {
        try {
            setLoading(true)
            const data = await tasksAPI.getAll()
            setTasks(data)
            setError(null)
        } catch (err) {
            console.error('Error loading tasks:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addTask = async (task) => {
        try {
            const newTask = await tasksAPI.create(task)
            setTasks([...tasks, newTask])
            return newTask
        } catch (err) {
            console.error('Error adding task:', err)
            setError(err.message)
            throw err
        }
    }

    const updateTask = async (id, updates) => {
        try {
            const updatedTask = await tasksAPI.update(id, updates)
            setTasks(tasks.map(t => t._id === id ? updatedTask : t))
            return updatedTask
        } catch (err) {
            console.error('Error updating task:', err)
            setError(err.message)
            throw err
        }
    }

    const deleteTask = async (id) => {
        try {
            await tasksAPI.delete(id)
            setTasks(tasks.filter(t => t._id !== id))
        } catch (err) {
            console.error('Error deleting task:', err)
            setError(err.message)
            throw err
        }
    }

    return { tasks, setTasks, loading, error, addTask, updateTask, deleteTask, reload: loadTasks }
}

// Hook for stats with MongoDB backend
export function useStats() {
    const [stats, setStats] = useState({
        completed: 0,
        failed: 0,
        totalFocusTime: 0,
        completionRate: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            setLoading(true)
            const data = await statsAPI.get()
            setStats(data)
            setError(null)
        } catch (err) {
            console.error('Error loading stats:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const updateStats = async (newStats) => {
        try {
            const updated = await statsAPI.update(newStats)
            setStats(updated)
            return updated
        } catch (err) {
            console.error('Error updating stats:', err)
            setError(err.message)
            throw err
        }
    }

    return { stats, loading, error, updateStats, reload: loadStats }
}

// Hook for history with MongoDB backend
export function useHistory() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        try {
            setLoading(true)
            const data = await historyAPI.getAll()
            setHistory(data)
            setError(null)
        } catch (err) {
            console.error('Error loading history:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addHistoryEntry = async (entry) => {
        try {
            const newEntry = await historyAPI.add(entry)
            setHistory([...history, newEntry])
            return newEntry
        } catch (err) {
            console.error('Error adding history entry:', err)
            setError(err.message)
            throw err
        }
    }

    return { history, loading, error, addHistoryEntry, reload: loadHistory }
}

// Hook for pause reasons with MongoDB backend
export function usePauseReasons() {
    const [reasons, setReasons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadReasons()
    }, [])

    const loadReasons = async () => {
        try {
            setLoading(true)
            const data = await reasonsAPI.getAll()
            setReasons(data)
            setError(null)
        } catch (err) {
            console.error('Error loading reasons:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addReason = async (text) => {
        try {
            const newReason = await reasonsAPI.add(text)
            setReasons([...reasons, newReason])
            return newReason
        } catch (err) {
            // If error is "already exists" (400), we just reload or ignore
            if (err.message === 'Este motivo ya existe') {
                return null;
            }
            throw err
        }
    }

    return { reasons, loading, error, addReason, reload: loadReasons }
}
