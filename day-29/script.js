const input = document.getElementById("ttsInput");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const voiceFilter = document.getElementById("voiceFilter");
const voiceSelect = document.getElementById("voiceSelect");
const currentWord = document.getElementById("currentWord");

let utterance;
let voices = [];

const populateVoices = () => {
    voices = speechSynthesis.getVoices();
    renderVoices(voices);
};

const renderVoices = (list) => {
    const grouped = {};
    list.forEach(v => {
        const country = v.lang.split('-')[1] || v.lang;
        if (!grouped[country]) grouped[country] = [];
        grouped[country].push(v);
    });

    voiceSelect.innerHTML = Object.keys(grouped).map(country => {
        const options = grouped[country].map(v =>
            `<option value="${v.name}">${v.name} (${v.lang})</option>`
        ).join("");
        return `<optgroup label="${country}">${options}</optgroup>`;
    }).join("");
};

speakBtn.addEventListener("click", () => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    utterance = new SpeechSynthesisUtterance(input.value);
    const selectedVoice = voices.find(v => v.name === voiceSelect.value);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onboundary = (event) => {
        if (event.name === "word") {
            const word = input.value.substring(event.charIndex, event.charIndex + event.charLength);
            currentWord.textContent = word;
        }
    };

    speechSynthesis.speak(utterance);
});

voiceFilter.addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    const filtered = voices.filter(v =>
        v.name.toLowerCase().includes(query) || v.lang.toLowerCase().includes(query)
    );
    renderVoices(filtered);
});

speechSynthesis.onvoiceschanged = populateVoices;

pauseBtn.addEventListener("click", () => speechSynthesis.pause());
resumeBtn.addEventListener("click", () => speechSynthesis.resume());
stopBtn.addEventListener("click", () => speechSynthesis.cancel());