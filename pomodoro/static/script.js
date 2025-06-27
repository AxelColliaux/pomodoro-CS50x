document.addEventListener('DOMContentLoaded', function() {
    const minutesTimer = document.querySelector('.minutes');
    const secondesTimer = document.querySelector('.seconds');
    const startBtn = document.querySelector('.start');
    const pauseBtn = document.querySelector('.pause');
    const resetBtn = document.querySelector('.reset');
    const modeLabel = document.querySelector('.mode-label');
    const saveBtn = document.querySelector('.save-settings');
    const workTimeInput = document.querySelector('.work-time');
    const breakTimeInput = document.querySelector('.break-time');
    const alertMessage = document.querySelector('.alert-message');
    const savingMessage = document.querySelector('.saving-message')
    const settings = document.querySelector('.settings');
    const settingsLabel = document.querySelector('.settings-label');

    let workTime = parseInt(workTimeInput.value);
    let breakTime = parseInt(breakTimeInput.value);
    let isWorkMode = true;
    let isRunning = false;
    let isPaused = false;
    let isVisibleSettings = false;
    let minutes = workTime;
    let seconds = 0;
    let totalPauseTime = 0;
    let timer;
    let startTime = null;
    let pauseStartTime = null;

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    saveBtn.addEventListener('click', saveSettings);
    settingsLabel.addEventListener('click', showSettings);

    function updateDisplay() {
        minutesTimer.textContent = minutes.toString().padStart(2, '0');
        secondesTimer.textContent = seconds.toString().padStart(2, '0');

        modeLabel.textContent = isWorkMode ? "Focus" : "Break";
        updateButtonStates();
    }

    function updateButtonStates() {
        if (isRunning) {
            startBtn.textContent = "Start"
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
        } else if (isPaused) {
            startBtn.textContent = "Resume"
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
        } else {
            startBtn.textContent = "Start"
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = true;
        }
    }

    function startTimer() {

        if (isPaused) {
            const pauseDuration = (new Date() - pauseStartTime) / 1000;
            totalPauseTime += pauseDuration;
            pauseStartTime = null;
            isPaused = false;
        } else if (!isRunning && !isPaused) {
            startTime = new Date();
            totalPauseTime = 0;
        }

        isRunning = true;
        updateButtonStates();

        timer = setInterval(function() {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timer);
                    isRunning = false;

                    if (isWorkMode) {
                        saveSession(true);
                    }

                    isWorkMode = !isWorkMode;
                    minutes = isWorkMode ? workTime : breakTime;

                    updateDisplay();

                    return;
                }
                minutes--;
                seconds = 59;
            } else {
                seconds--;
            }

            updateDisplay();
        }, 1000)

    }

    function pauseTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            isPaused = true;
            pauseStartTime = new Date();
            updateDisplay()
        }
    }

    function resetTimer() {
        clearInterval(timer);

        if ((isRunning || isPaused) && startTime) {
            if (isWorkMode) {
                saveSession(false);
            }
        }

        isRunning = false;
        isPaused = false
        isWorkMode = true;
        minutes = workTime;
        seconds = 0;
        startTime = null;
        pauseStartTime = null;
        totalPauseTime = 0;
        updateDisplay();
    }

    function saveSettings() {
        if (isRunning) {
            showAlert("Please stop the pomodoro before change settings", "danger");
            return;
        }

        const newWorkTime = parseInt(workTimeInput.value);
        const newBreakTime = parseInt(breakTimeInput.value);

        if (newWorkTime < 1 || newBreakTime < 1) {
            showAlert("Work time and break time must be set to 1 minute minimum", "danger");
            return;
        }

        workTime = newWorkTime;
        breakTime = newBreakTime;

        showAlert("Settings saved successfully", "success");

        setTimeout(hideAlert, 5000);

        resetTimer();
    }

    function saveSession(completed) {
        if (!startTime) return;
        const endTime = new Date();
        const durationSeconds = Math.floor((endTime - startTime) / 1000) - totalPauseTime;

        if (durationSeconds < 60) {
            return;
        }

        const sessionData = {
            duration: durationSeconds,
            planned_duration: workTime * 60,
            completed: completed
        };

        fetch('/save_session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Session saved !')
                    showSavingMessage("Your session has been save to your account", "success")
                    setTimeout(() => {
                        hideSavingMessage()
                    }, 5000);
                } else {
                    console.error("Error saving session: ", data.message)
                }
            })
            .catch(error => {
                console.error("Error saving session: ", error)
            })

        startTime = null;
    }

    function showAlert(message, type = "danger") {
        alertMessage.textContent = message;
        alertMessage.classList.remove("d-none");
        alertMessage.classList.remove("alert-danger", "alert-success", "alert-warning", "alert-info");
        alertMessage.classList.add(`alert-${type}`);
    }

    function showSavingMessage(message, type) {
        savingMessage.textContent = message;
        savingMessage.classList.remove("d-none");
        savingMessage.classList.add(`text-${type}`);
    }

    function hideAlert() {
        alertMessage.classList.add("d-none");
    }

    function hideSavingMessage() {
        savingMessage.classList.add("d-none");
    }

    function showSettings() {
        settings.classList.toggle("d-none");
        isVisibleSettings = !isVisibleSettings;
    }

    updateDisplay();
})
