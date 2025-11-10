let startTime = null;
let elapsed = 0;
let timerInterval = null;
let lastLap = 0;

const display = document.getElementById("display");
const startStopBtn = document.getElementById("startStop");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const lapsList = document.getElementById("laps");
const modeToggle = document.getElementById("modeToggle");
const exportBtn = document.getElementById("export");

const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const milliseconds = String(Math.floor(ms % 1000)).padStart(3, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
}

const updateDisplay = () => {
    const now = performance.now();
    elapsed = now - startTime;
    display.textContent = formatTime(elapsed);
};

const exportLaps = () => {
    const laps = Array.from(lapsList.querySelectorAll("li"))
        .map(li => li.textContent)
        .join("\n");
    const blob = new Blob([laps], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laps.txt";
    a.click();
    URL.revokeObjectURL(url);
};

startStopBtn.addEventListener('click', () => {
    if (!timerInterval) {
        startTime = performance.now() - elapsed;
        timerInterval = setInterval(updateDisplay, 10);
        startStopBtn.textContent = "Stop";
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        startStopBtn.textContent = "Start";
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsed = 0;
    display.textContent = "00:00.000";
    startStopBtn.textContent = "Start";
    lapsList.innerHTML = "";
});

lapBtn.addEventListener('click', () => {
    if (timerInterval) {
        const li = document.createElement("li");
        const diff = elapsed - lastLap;
        li.textContent = `${formatTime(elapsed)} (+${formatTime(diff)})`;
        lapsList.appendChild(li);
        lastLap = elapsed;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        startStopBtn.click();
    } else if (e.key.toLowerCase() === 'r') {
        resetBtn.click();
    } else if (e.key.toLowerCase() === 'l') {
        lapBtn.click();
    }
});

modeToggle.addEventListener('click', () => {
    document.body.classList.toggle("light");
});

exportBtn.addEventListener('click', exportLaps);