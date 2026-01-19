// ==========================================
// Focus Engine - Deep Work Mode Controller
// ==========================================

const FocusEngine = {
    // State
    currentTask: null,
    timerInterval: null,
    startTime: null,
    elapsedTime: 0,
    isPaused: false,
    isActive: false,
    motivationInterval: null,

    // Initialize focus mode
    start(task) {
        this.currentTask = task;
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.isPaused = false;
        this.isActive = true;

        // Update UI
        this.updateFocusUI();

        // Start timer
        this.startTimer();

        // Start motivation messages
        this.startMotivationMessages();

        // Show focus mode
        this.showFocusMode();

        // Prevent accidental navigation
        this.enableNavigationWarning();
    },

    // Update focus UI
    updateFocusUI() {
        const taskNameEl = document.getElementById('focus-task-name');
        const taskTimeEl = document.getElementById('focus-task-time');

        if (taskNameEl && taskTimeEl) {
            taskNameEl.textContent = this.currentTask.name;
            taskTimeEl.textContent = `Tiempo estimado: ${this.currentTask.estimatedTime} min`;
        }
    },

    // Start timer
    startTimer() {
        this.updateTimer();

        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateTimer();
                this.updateProgress();
            }
        }, 1000);
    },

    // Update timer display
    updateTimer() {
        const timerEl = document.getElementById('timer');
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (timerEl) {
            timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    },

    // Update progress bar
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const estimatedMs = this.currentTask.estimatedTime * 60 * 1000;
        const progress = Math.min((this.elapsedTime / estimatedMs) * 100, 100);

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        // Change color based on progress
        if (progress >= 100) {
            progressFill.style.backgroundColor = 'var(--accent-success)';
        } else if (progress >= 75) {
            progressFill.style.backgroundColor = 'var(--accent-warning)';
        }
    },

    // Start motivation messages
    startMotivationMessages() {
        // Initial message
        this.showMotivationMessage(Motivation.getFocusMessage());

        // Update every 3 minutes
        this.motivationInterval = setInterval(() => {
            const minutesElapsed = Math.floor(this.elapsedTime / 60000);
            const minutesRemaining = this.currentTask.estimatedTime - minutesElapsed;

            if (minutesRemaining > 0) {
                this.showMotivationMessage(Motivation.getTimeMessage(minutesRemaining));
            } else {
                this.showMotivationMessage(Motivation.getFocusMessage());
            }
        }, 180000); // 3 minutes
    },

    // Show motivation message
    showMotivationMessage(message) {
        const motivationEl = document.getElementById('focus-motivation');
        if (motivationEl) {
            motivationEl.textContent = message;
            motivationEl.classList.add('pulse');
            setTimeout(() => {
                motivationEl.classList.remove('pulse');
            }, 2000);
        }
    },

    // Show focus mode
    showFocusMode() {
        const focusSection = document.getElementById('focus-mode-section');
        const taskSection = document.getElementById('task-input-section');
        const statsSection = document.getElementById('stats-section');

        if (focusSection) focusSection.classList.remove('hidden');
        if (taskSection) taskSection.classList.add('hidden');
        if (statsSection) statsSection.classList.add('hidden');
    },

    // Hide focus mode
    hideFocusMode() {
        const focusSection = document.getElementById('focus-mode-section');
        const taskSection = document.getElementById('task-input-section');
        const statsSection = document.getElementById('stats-section');

        if (focusSection) focusSection.classList.add('hidden');
        if (taskSection) taskSection.classList.remove('hidden');
        if (statsSection) statsSection.classList.remove('hidden');
    },

    // Complete task
    complete() {
        const focusTimeMinutes = Math.ceil(this.elapsedTime / 60000);

        // Update stats
        const stats = Storage.updateStats('completed', focusTimeMinutes);

        // Add to history
        Storage.addToHistory({
            task: this.currentTask.name,
            estimatedTime: this.currentTask.estimatedTime,
            actualTime: focusTimeMinutes,
            status: 'completed'
        });

        // Show success message
        this.showMotivationMessage(Motivation.getSuccessMessage());

        // Wait a moment then cleanup
        setTimeout(() => {
            this.cleanup();
        }, 2000);
    },

    // Attempt to quit
    attemptQuit() {
        const progress = this.getProgress();
        const quitMessage = Motivation.getQuitMessage(progress);

        // Show quit modal
        const modal = document.getElementById('quit-modal');
        const messageEl = document.getElementById('quit-message');

        if (modal && messageEl) {
            messageEl.textContent = quitMessage;
            modal.classList.remove('hidden');
        }
    },

    // Confirm quit
    confirmQuit() {
        // Update stats
        Storage.updateStats('failed', 0);

        // Add to history
        const focusTimeMinutes = Math.ceil(this.elapsedTime / 60000);
        Storage.addToHistory({
            task: this.currentTask.name,
            estimatedTime: this.currentTask.estimatedTime,
            actualTime: focusTimeMinutes,
            status: 'failed'
        });

        // Show failure message
        const headerMessage = document.getElementById('motivational-message');
        if (headerMessage) {
            headerMessage.textContent = Motivation.getFailureMessage();
        }

        // Cleanup
        this.cleanup();
    },

    // Cancel quit
    cancelQuit() {
        const modal = document.getElementById('quit-modal');
        if (modal) {
            modal.classList.add('hidden');
        }

        // Show encouraging message
        this.showMotivationMessage("Buena decisión. Continúa trabajando.");
    },

    // Get current progress (0-1)
    getProgress() {
        if (!this.currentTask || !this.currentTask.estimatedTime) return 0;
        const estimatedMs = this.currentTask.estimatedTime * 60 * 1000;
        return Math.min(this.elapsedTime / estimatedMs, 1);
    },

    // Cleanup
    cleanup() {
        // Clear intervals
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        if (this.motivationInterval) {
            clearInterval(this.motivationInterval);
            this.motivationInterval = null;
        }

        // Reset state
        this.currentTask = null;
        this.startTime = null;
        this.elapsedTime = 0;
        this.isPaused = false;
        this.isActive = false;

        // Hide modal
        const modal = document.getElementById('quit-modal');
        if (modal) {
            modal.classList.add('hidden');
        }

        // Disable navigation warning
        this.disableNavigationWarning();

        // Hide focus mode
        this.hideFocusMode();

        // Trigger app update
        if (window.App) {
            window.App.loadTasks();
            window.App.updateStats();
            window.App.updateHeaderMessage();
        }
    },

    // Enable navigation warning
    enableNavigationWarning() {
        window.onbeforeunload = () => {
            return "¿Seguro que quieres salir? Perderás tu progreso.";
        };
    },

    // Disable navigation warning
    disableNavigationWarning() {
        window.onbeforeunload = null;
    }
};
