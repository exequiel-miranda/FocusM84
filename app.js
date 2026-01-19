// ==========================================
// Main Application Controller
// ==========================================

const App = {
    tasks: [],
    maxTasks: 20, // Increased limit for more control
    editingTaskId: null,

    // Initialize app
    init() {
        this.loadTasks();
        this.updateStats();
        this.updateHeaderMessage();
        this.bindEvents();
    },

    // Bind event listeners
    bindEvents() {
        // Add task button
        const addTaskBtn = document.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => this.addTask());
        }

        // Enter key on task name input
        const taskNameInput = document.getElementById('task-name');
        if (taskNameInput) {
            taskNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTask();
                }
            });
        }

        // Start focus button
        const startFocusBtn = document.getElementById('start-focus-btn');
        if (startFocusBtn) {
            startFocusBtn.addEventListener('click', () => this.startFocus());
        }

        // Complete task button
        const completeTaskBtn = document.getElementById('complete-task-btn');
        if (completeTaskBtn) {
            completeTaskBtn.addEventListener('click', () => FocusEngine.complete());
        }

        // Quit focus button
        const quitFocusBtn = document.getElementById('quit-focus-btn');
        if (quitFocusBtn) {
            quitFocusBtn.addEventListener('click', () => FocusEngine.attemptQuit());
        }

        // Quit modal buttons
        const confirmQuitBtn = document.getElementById('confirm-quit-btn');
        const cancelQuitBtn = document.getElementById('cancel-quit-btn');

        if (confirmQuitBtn) {
            confirmQuitBtn.addEventListener('click', () => FocusEngine.confirmQuit());
        }

        if (cancelQuitBtn) {
            cancelQuitBtn.addEventListener('click', () => FocusEngine.cancelQuit());
        }
    },

    // Load tasks from storage
    loadTasks() {
        this.tasks = Storage.getTasks();
        this.renderTasks();
        this.updateStartButton();
    },

    // Add new task
    addTask() {
        const nameInput = document.getElementById('task-name');
        const timeInput = document.getElementById('task-time');

        if (!nameInput || !timeInput) return;

        const name = nameInput.value.trim();
        const time = parseInt(timeInput.value);

        // Validation
        if (!name) {
            this.showError('Escribe el nombre de la tarea.');
            nameInput.focus();
            return;
        }

        if (!time || time < 1) {
            this.showError('Ingresa un tiempo estimado válido.');
            timeInput.focus();
            return;
        }

        if (this.tasks.length >= this.maxTasks) {
            this.showError(`Máximo ${this.maxTasks} tareas permitidas.`);
            return;
        }

        // Create task
        const task = {
            id: Date.now(),
            name: name,
            estimatedTime: time,
            createdAt: new Date().toISOString()
        };

        // Add to tasks
        this.tasks.push(task);
        Storage.saveTasks(this.tasks);

        // Clear inputs
        nameInput.value = '';
        timeInput.value = '';
        nameInput.focus();

        // Update UI
        this.renderTasks();
        this.updateStartButton();
    },

    // Delete task
    deleteTask(taskId) {
        if (confirm('¿Eliminar esta tarea?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            Storage.saveTasks(this.tasks);
            this.renderTasks();
            this.updateStartButton();
        }
    },

    // Edit task
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const nameInput = document.getElementById('task-name');
        const timeInput = document.getElementById('task-time');
        const addBtn = document.getElementById('add-task-btn');

        if (nameInput && timeInput && addBtn) {
            nameInput.value = task.name;
            timeInput.value = task.estimatedTime;
            this.editingTaskId = taskId;
            addBtn.textContent = 'Actualizar Tarea';
            nameInput.focus();
            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    // Update task
    updateTask(taskId, name, time) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.name = name;
            task.estimatedTime = time;
            Storage.saveTasks(this.tasks);
            this.renderTasks();
            this.updateStartButton();
        }
    },

    // Cancel edit
    cancelEdit() {
        this.editingTaskId = null;
        const nameInput = document.getElementById('task-name');
        const timeInput = document.getElementById('task-time');
        const addBtn = document.getElementById('add-task-btn');

        if (nameInput) nameInput.value = '';
        if (timeInput) timeInput.value = '';
        if (addBtn) addBtn.textContent = 'Agregar Tarea';
    },

    // Render tasks
    renderTasks() {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;

        if (this.tasks.length === 0) {
            taskList.innerHTML = '<p class="subtitle" style="text-align: center; margin-top: 2rem;">No hay tareas. Agrega una para empezar.</p>';
            return;
        }

        taskList.innerHTML = this.tasks.map((task, index) => `
            <div class="task-item" data-id="${task.id}">
                <div class="task-info">
                    <div class="task-name">${this.escapeHtml(task.name)}</div>
                    <div class="task-time">${task.estimatedTime} minutos</div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-primary btn-small" onclick="App.startFocusWithTask(${task.id})" title="Iniciar esta tarea">
                        ▶ Iniciar
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="App.editTask(${task.id})" title="Editar tarea">
                        ✎ Editar
                    </button>
                    <button class="btn btn-danger btn-small" onclick="App.deleteTask(${task.id})" title="Eliminar tarea">
                        ✕
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Update start button state
    updateStartButton() {
        const startBtn = document.getElementById('start-focus-btn');
        if (!startBtn) return;

        if (this.tasks.length > 0) {
            startBtn.disabled = false;
            startBtn.textContent = `Iniciar Primera Tarea (${this.tasks.length} ${this.tasks.length === 1 ? 'tarea' : 'tareas'} pendientes)`;
        } else {
            startBtn.disabled = true;
            startBtn.textContent = 'No hay tareas';
        }
    },

    // Start focus with specific task
    startFocusWithTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) {
            this.showError('Tarea no encontrada.');
            return;
        }

        // Remove task from list
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        Storage.saveTasks(this.tasks);

        // Start focus engine
        FocusEngine.start(task);
    },

    // Start focus mode
    startFocus() {
        if (this.tasks.length === 0) {
            this.showError('No hay tareas para completar.');
            return;
        }

        // Get first task
        const task = this.tasks[0];

        // Remove from list
        this.tasks.shift();
        Storage.saveTasks(this.tasks);

        // Start focus engine
        FocusEngine.start(task);
    },

    // Update stats display
    updateStats() {
        const stats = Storage.getStats();

        const completedEl = document.getElementById('completed-count');
        const failedEl = document.getElementById('failed-count');
        const rateEl = document.getElementById('completion-rate');
        const timeEl = document.getElementById('focus-time');

        if (completedEl) completedEl.textContent = stats.completed;
        if (failedEl) failedEl.textContent = stats.failed;
        if (rateEl) rateEl.textContent = `${stats.completionRate}%`;
        if (timeEl) {
            const hours = (stats.totalFocusTime / 60).toFixed(1);
            timeEl.textContent = `${hours}h`;
        }
    },

    // Update header message
    updateHeaderMessage() {
        const messageEl = document.getElementById('motivational-message');
        if (!messageEl) return;

        const stats = Storage.getStats();

        if (stats.completed === 0 && stats.failed === 0) {
            messageEl.textContent = Motivation.getHarshMessage();
        } else {
            messageEl.textContent = Motivation.getPerformanceMessage(stats);
        }
    },

    // Show error message
    showError(message) {
        const messageEl = document.getElementById('motivational-message');
        if (messageEl) {
            const originalMessage = messageEl.textContent;
            messageEl.textContent = message;
            messageEl.style.color = 'var(--accent-danger)';

            // Shake animation
            const header = document.getElementById('header');
            if (header) {
                header.classList.add('shake');
                setTimeout(() => {
                    header.classList.remove('shake');
                }, 500);
            }

            // Restore after 3 seconds
            setTimeout(() => {
                messageEl.textContent = originalMessage;
                messageEl.style.color = '';
            }, 3000);
        }
    },

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Make App available globally for FocusEngine
window.App = App;
