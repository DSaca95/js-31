let time = 60;
let remaining = time;
let interval = null;
let body;
let soundToggle;
let themeSwitch;
let slider;
let input;
let ringFill;

const ding = new Audio("./src/notification.wav");
const FULL_CIRCLE = 2 * Math.PI * 120;

const loadSettings = () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
    if (themeSwitch) {
        themeSwitch.checked = savedTheme === "dark";
    }

    const savedSound = localStorage.getItem("soundEnabled");
    if (savedSound !== null) {
        soundToggle.checked = savedSound === "true";
    }

    const savedTime = parseInt(localStorage.getItem("customTime"));
    const savedRemaining = parseInt(localStorage.getItem("remainingTime"));
    const wasRunning = localStorage.getItem("isRunning") === "true";

    if (!isNaN(savedTime) && savedTime >= 1 && savedTime <= 60) {
        slider.value = savedTime;
        input.value = savedTime;
        time = savedTime * 60;
        remaining = time;
    }
    
    if (!isNaN(savedRemaining) && savedRemaining > 0 && savedRemaining <= time) {
        remaining = savedRemaining;
    } else {
        remaining = time;
    }

    if (wasRunning && remaining > 0) {
        startTimer();
    }

}

const bindEvents = () => {
    themeSwitch.addEventListener("change", () => {
        const theme = themeSwitch.checked ? "dark" : "light";
        applyTheme(theme);
        localStorage.setItem("theme", theme);
    })
    
    soundToggle.addEventListener("change", () => {
    localStorage.setItem("soundEnabled", soundToggle.checked);
    })

    slider.addEventListener("input", () => {
        input.value = slider.value;
        updateTime(slider.value);
    })
    
    input.addEventListener("change", () => {
        slider.value = input.value;
        updateTime(input.value);
    })

    document.getElementById("start").addEventListener("click", startTimer);
    document.getElementById("pause").addEventListener("click", pauseTimer);
    document.getElementById("reset").addEventListener("click", resetTimer);

    document.querySelectorAll(".preset-buttons button").forEach(btn => {
        btn.addEventListener("click", () => {
            const minutes = parseInt(btn.dataset.minutes);
            if (!isNaN(minutes)) {
                time = minutes * 60;
                remaining = time;
                updateDisplay();
                updateArc();
            }
        })
    });

};

const updateTime = (value) => {
    const minutes = parseInt(value);
    if (!isNaN(minutes) && minutes >= 1 && minutes <= 60) {
        time = minutes * 60;
        remaining = time;
        localStorage.setItem("customTime", minutes);
        updateDisplay();
        updateArc();
    }
}

const updateDisplay = () => {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    document.getElementById("timer")
    .textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    localStorage.setItem("remainingTime", remaining);
    updateArc();
    updateColor();
}

const startTimer = () => {
    if (interval) return;
    localStorage.setItem("isRunning", "true");
    interval = setInterval(() => {
    if (remaining > 0) {
        remaining--;
        updateDisplay();
    } else {
        clearInterval(interval);
        interval = null;
        localStorage.setItem("isRunning", "false");
    }
    }, 1000);
    updateDisplay();
}

const pauseTimer = () => {
    clearInterval(interval);
    interval = null;
    localStorage.setItem("isRunning", "false");
}

const resetTimer = () => {
    pauseTimer();
    remaining = time;
    localStorage.setItem("remainingTime", remaining);
    updateDisplay();
}

const toggleBtn = document.getElementById("toggle-theme");

const applyTheme = (theme) => {
    body.className = theme;
    localStorage.setItem("theme", theme);
}

const updateArc = () => {
    if (!ringFill) return;
    const progress = (time - remaining) / time;
    const offset = FULL_CIRCLE * (1 - progress);
    ringFill.style.strokeDashoffset = offset;
}

const updateColor = () => {
    const progress = remaining / time;
    if (progress > 0.6) {
        ringFill.style.stroke = "#2a9d8f";
    } else if (progress > 0.33) {
        ringFill.style.stroke = "#f4a261";
    } else {
        ringFill.style.stroke = "#e63946";
    }

    if (remaining === 0 && soundToggle.checked) {
        ringFill.classList.add("finished");
        ding.play();
        setTimeout(() => ringFill.classList.remove("finished"), 500);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    body = document.body;
    soundToggle = document.getElementById("sound-toggle");
    themeSwitch = document.getElementById("theme-switch");
    slider = document.getElementById("time-slider");
    input = document.getElementById("custom-time");
    ringFill = document.querySelector(".ring-fill");

    loadSettings();
    bindEvents();
    updateDisplay();
});