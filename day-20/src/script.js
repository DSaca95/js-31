import './style.css'

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("playBtn");
const downloadBtn = document.getElementById("downloadBtn");
const volumeSlider = document.getElementById("volumeSlider");
const progressBar = document.getElementById("progressBar");
const timeLabel = document.getElementById("timeLabel");
const viz = document.getElementById("viz");

let mediaRecorder, audioChunks = [];
let audioBlob, audioUrl;
let audioCtx, analyser, dataArray;
let animating = false;
let audio;
let recordStartTime;
let recordTimer;

const particles = [];
for (let i = 0; i < 120; i++) {
  const p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  const angle = Math.random() * 2 * Math.PI;
  const radius = Math.random() * 150;
  const cx = 200 + Math.cos(angle) * radius;
  const cy = 200 + Math.sin(angle) * radius;
  p.setAttribute("cx", cx);
  p.setAttribute("cy", cy);
  p.setAttribute("r", 4 + Math.random() * 6);
  p.classList.add("particle");
  p.style.fill = ["cyan","magenta","lime"][Math.floor(Math.random()*3)];
  p.style.opacity = 0.3;
  p.setAttribute("filter", "url(#blur)");
  viz.appendChild(p);
  particles.push(p);
  p.dataset.baseColor = p.style.fill;
}

const initStream = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.onstop = () => {
    audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    audioUrl = URL.createObjectURL(audioBlob);
    playBtn.disabled = false;
    downloadBtn.disabled = false;
  };

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);

  analyser.fftSize = 128;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  updateViz();
};

const updateViz = () => {
  if (!animating || !analyser) return;

  analyser.getByteFrequencyData(dataArray);
  
  const low = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
  const mid = dataArray.slice(10, 40).reduce((a, b) => a + b, 0) / 30;
  const high = dataArray.slice(40).reduce((a, b) => a + b, 0) / (dataArray.length - 40);

  const total = low + mid + high;
  let lowNorm = 0;
  let midNorm = 0;
  let highNorm = 0;

  if (total > 0) {
    lowNorm = low / total;
    midNorm = mid / total;
    highNorm = high / total;
  }

  particles.forEach((p, i) => {
    const baseR = 5 + (i % 10);

    const volume = total / 100;
    let pulse = volume * 2;

    let dominant = "low";
    let domVal = lowNorm;
    if (midNorm > domVal) { dominant = "mid"; domVal = midNorm; }
    if (highNorm > domVal) { dominant = "high"; domVal = highNorm; }

    if (dominant === "low") pulse *= 1.5;
    if (dominant === "mid") pulse *= 2.0;
    if (dominant === "high") pulse *= 2.5;

    p.setAttribute("r", baseR + pulse);

    let cx = (+p.getAttribute("cx") || 200);
    let cy = (+p.getAttribute("cy") || 200);
    cx += (Math.random() - 0.5) * pulse * (dominant === "high" ? 2 : 0.5);
    cy += (Math.random() - 0.5) * pulse * (dominant === "low" ? 0.5 : 1.5);
    p.setAttribute("cx", cx);
    p.setAttribute("cy", cy);

    const origColor = p.dataset.baseColor;
    let [r,g,b] = [0,0,0];
    if (origColor === "cyan") [r,g,b] = [0,255,255];
    if (origColor === "magenta") [r,g,b] = [255,0,255];
    if (origColor === "lime") [r,g,b] = [0,255,0];

    r = Math.min(255, r + (dominant === "high" ? 255 * highNorm : 50 * highNorm));
    g = Math.min(255, g + (dominant === "mid" ? 255 * midNorm : 50 * midNorm));
    b = Math.min(255, b + (dominant === "low" ? 255 * lowNorm : 50 * lowNorm));

    p.style.fill = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    p.style.opacity = 0.3 + pulse / 20;
  });

  requestAnimationFrame(updateViz);
}

startBtn.onclick = async () => {
  audioChunks = [];
  await initStream();
  mediaRecorder.start();
  animating = true;
  updateViz();
  startBtn.disabled = true;
  stopBtn.disabled = false;

  recordStartTime = Date.now();
  recordTimer = setInterval(() => {
    const elapsed = (Date.now() - recordStartTime) / 1000;
    const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
    const s = Math.floor(elapsed % 60).toString().padStart(2, "0");
    timeLabel.textContent = `${m}:${s} / REC...`;
  }, 500);
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  animating = false;

  clearInterval(recordTimer);
  timeLabel.textContent = "00:00 / 00:00";

  particles.forEach((p, i) => {
    const baseR = 5 + (i % 10);
    p.setAttribute("r", baseR);
    p.style.opacity = 0.3;
  });

  startBtn.disabled = false;
  stopBtn.disabled = true;
};

playBtn.onclick = () => {
  if (!audioUrl) return;
  const audio = new Audio(audioUrl);

  audio.volume =volumeSlider.value;
  volumeSlider.oninput = () => {
    audio.volume = volumeSlider.value;
  };

  audio.ontimeupdate = () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;

    const formatTime = t => {
      const m = Math.floor(t / 60).toString().padStart(2, "0");
      const s = Math.floor(t % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    };

    timeLabel.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  };

  audio.onloadedmetadata = () => {
    progressBar.max = 100;
  };

  animating = true;
  updateViz();
  audio.play();

  audio.onended = () => {
    animating = false;
    particles.forEach((p, i) => {
      const baseR = 5 + (i % 10);
      p.setAttribute("r", baseR);
      p.style.opacity = 0.3;
    });
    progressBar.value = 0;
    timeLabel.textContent = "00:00 / 00:00";
  };
};

downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.href = audioUrl;
  link.download = `recording-${Date.now()}.webm`;
  link.click();
};
