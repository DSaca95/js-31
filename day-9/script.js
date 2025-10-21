const fill = document.getElementById("progress-fill");
const label = document.getElementById("progress-label");
const incrementBtn = document.getElementById("increment");
const decrementBtn = document.getElementById("decrement");
const resetBtn = document.getElementById("reset");
const emojiConfetti = document.getElementById("emoji-confetti");

const wave1 = document.querySelector('.wave-1');
const wave2 = document.querySelector('.wave-2');
const wave3 = document.querySelector('.wave-3');

let progress = 0;

document.addEventListener("DOMContentLoaded", () => {
    const updateProgress = () => {
        fill.style.width = `${progress}%`;
        label.textContent = progress === 100 ? "✅ Done!" : `${progress}%`;
    
        wave1.style.opacity = progress > 0 ? 1 : 0;
        wave2.style.opacity = progress > 33 ? 1 : 0;
        wave3.style.opacity = progress > 66 ? 1 : 0;

        let bg;
        if (progress === 0) {
            bg = getCSSVar('--progress-color-low');
            fill.classList.remove('full');
        } else if (progress === 100) {
            bg = getCSSVar('--progress-color-full');
            fill.classList.add('full');
            triggerEmojiConfetti();
        } else if (progress > 66) {
            bg = getCSSVar('--progress-color-high');
            fill.classList.remove('full');
        } else if (progress > 33) {
            bg = getCSSVar('--progress-color-mid');
            fill.classList.remove('full');
        } else {
            bg = getCSSVar('--progress-color-low');
            fill.classList.remove('full');
        }
        
        label.style.color = getContrastColor(bg);
        fill.style.background = bg;
    };

    const triggerEmojiConfetti = () => {
        const emojis = ["🎉", "✨", "✅", "💎", "🌟", "🦖", "⚡️", "🎊",];

        for (let i = 0; i < 12; i++) {
            const emoji = document.createElement("div");
            emoji.classList.add("emoji");
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = `${Math.random() * 90 + 5}%`;
            emoji.style.top = "0";
            emojiConfetti.appendChild(emoji);

            setTimeout(() => {
                emoji.remove();
            }, 1500);
        }
    };

    const getContrastColor = (bgColor) => {
        const hex = bgColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? "var(--text-color-dark)" : "var(--text-color-light)";
    };

    const getCSSVar = (name) => {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    };

    incrementBtn.addEventListener("click", () => {
        progress = Math.min(progress + 10, 100);
        updateProgress();
    });

    decrementBtn.addEventListener("click", () => {
        progress = Math.max(progress - 10, 0);
        updateProgress();
    });

    resetBtn.addEventListener("click", () => {
        progress = 0;
        updateProgress();
    });

    updateProgress();
});