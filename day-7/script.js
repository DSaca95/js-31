const wave = document.getElementById("wave-bar");
const segments = wave.querySelectorAll("span");
let currentLevel = parseInt(localStorage.getItem("themeLevel")) || 0;

const getHeightByDistance = (distance) => {
  if (distance === 0) return "100%";
  if (distance === 1) return "75%";
  if (distance === 2) return "50%";
  return "20%";
};

const updateBars = (level) => {
  segments.forEach((bar) => {
    const barLevel = parseInt(bar.dataset.level);
    const distance = Math.abs(barLevel - level);
    bar.style.height = getHeightByDistance(distance);
    bar.classList.toggle("active", barLevel <= level);
  });

  document.documentElement.setAttribute("data-theme-level", level);
};

const setLevel = (level) => {
  currentLevel = level;
  updateBars(level);
  localStorage.setItem("themeLevel", level);
};

const restoreLevel = () => updateBars(currentLevel);

segments.forEach((bar) => {
  const level = parseInt(bar.dataset.level);
  bar.addEventListener("mouseenter", () => updateBars(level));
  bar.addEventListener("mouseleave", restoreLevel);
  bar.addEventListener("click", () => setLevel(level));
});

const debounce = (fn, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
};

const handleTouchMove = (e) => {
  const touch = e.touches[0];
  const rect = wave.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const segmentWidth = rect.width / segments.length;
  const index = Math.floor(x / segmentWidth);
  const level = Math.min(Math.max(index + 1, 1), segments.length);
  setLevel(level);
};

wave.addEventListener("touchmove", debounce(handleTouchMove, 100));

if (currentLevel) updateBars(currentLevel);