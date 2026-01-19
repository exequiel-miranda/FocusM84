// ==========================================
// Storage Manager - localStorage wrapper
// ==========================================

const Storage = {
    // Keys
    KEYS: {
        TASKS: 'focus_m84_tasks',
        STATS: 'focus_m84_stats',
        HISTORY: 'focus_m84_history',
        SETTINGS: 'focus_m84_settings'
    },

    // Get tasks
    getTasks() {
        const tasks = localStorage.getItem(this.KEYS.TASKS);
        return tasks ? JSON.parse(tasks) : [];
    },

    // Save tasks
    saveTasks(tasks) {
        localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
    },

    // Get stats
    getStats() {
        const stats = localStorage.getItem(this.KEYS.STATS);
        return stats ? JSON.parse(stats) : {
            completed: 0,
            failed: 0,
            totalFocusTime: 0, // in minutes
            completionRate: 0
        };
    },

    // Save stats
    saveStats(stats) {
        // Calculate completion rate
        const total = stats.completed + stats.failed;
        stats.completionRate = total > 0 ? Math.round((stats.completed / total) * 100) : 0;
        localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
    },

    // Update stats
    updateStats(type, focusTime = 0) {
        const stats = this.getStats();
        
        if (type === 'completed') {
            stats.completed++;
            stats.totalFocusTime += focusTime;
        } else if (type === 'failed') {
            stats.failed++;
        }
        
        this.saveStats(stats);
        return stats;
    },

    // Get history
    getHistory() {
        const history = localStorage.getItem(this.KEYS.HISTORY);
        return history ? JSON.parse(history) : [];
    },

    // Add to history
    addToHistory(entry) {
        const history = this.getHistory();
        history.unshift({
            ...entry,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 entries
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
    },

    // Get settings
    getSettings() {
        const settings = localStorage.getItem(this.KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : {
            harshMode: true,
            soundEnabled: false
        };
    },

    // Save settings
    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    // Clear all data
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};
