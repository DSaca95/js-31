const previewBox = document.querySelector(".preview-box");
const durationControl = document.getElementById("durationControl");
const shadowControl = document.getElementById("shadowControl");
const blurControl = document.getElementById("blurControl");
const pulseControl = document.getElementById("pulseControl");
const cssCode = document.getElementById("cssCode");
const buttons = document.querySelectorAll(".controls button");
const themeToggle = document.getElementById("themeToggle");
const lab = document.querySelector(".effects-lab");
const fillTypeRadios = document.querySelectorAll('input[name="fillType"]');
const gradientTypeRadios = document.querySelectorAll('input[name="gradientType"]');
const startColor = document.getElementById("startColor");
const endColor = document.getElementById("endColor");

const effectDefinitions = {
    "effect-hover-scale": `.effect-hover-scale:hover {\n  transform: scale(1.1);\n}`,
    "effect-hover-rotate": `.effect-hover-rotate:hover {\n  transform: rotate(5deg);\n}`,
    "effect-shadow": `.effect-shadow {\n  box-shadow: 0 8px 16px rgba(0,0,0,0.25);\n}`,
    "effect-glow": `.effect-glow {\n  box-shadow: 0 0 12px rgba(255,149,0,0.8);\n}`,
    "effect-filter-gray": `.effect-filter-gray:hover {\n  filter: grayscale(100%);\n}`,
    "effect-animate-pulse": `.effect-animate-pulse {\n  animation: pulse 1.5s infinite;\n}`

};

themeToggle.addEventListener('click', () => {
    const current = lab.getAttribute("data-theme");
    lab.setAttribute("data-theme", current === "dark" ? "light" : "dark");
})

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const effect = btn.dataset.effect;
        previewBox.classList.toggle(effect);
        btn.classList.toggle("active");
        updateCssCode();
    });
});

durationControl.addEventListener("input", () => {
    const duration = durationControl.value;
    previewBox.style.transitionDuration = duration + "s";
    updateCssCode();
});

shadowControl.addEventListener("input", () => {
    previewBox.style.setProperty("--shadow-strength", shadowControl.value + "px");
    updateCssCode();
});

blurControl.addEventListener("input", () => {
    previewBox.style.setProperty("--blur-amount", blurControl.value + "px");
    updateCssCode();
});

pulseControl.addEventListener("input", () => {
    previewBox.style.setProperty("--pulse-speed", pulseControl.value + "s");
    updateCssCode();
});

const updateFill = () => {
    const fillType = document.querySelector('input[name="fillType"]:checked').value;
    const gradientType = document.querySelector('input[name="gradientType"]:checked').value;
    const start = startColor.value;
    const end = endColor.value;

    if (fillType === "solid") {
        previewBox.style.background= start;
    } else {
        if (gradientType === "linear") {
            previewBox.style.background = `linear-gradient(135deg, ${start}, ${end})`;
        } else {
            previewBox.style.background = `radial-gradient(circle, ${start}, ${end})`;
        }
    }
    updateCssCode();
}

fillTypeRadios.forEach(r => r.addEventListener('change', updateFill));
gradientTypeRadios.forEach(r => r.addEventListener('change', updateFill));
startColor.addEventListener('input', updateFill);
endColor.addEventListener('input', updateFill);

const updateCssCode = () => {
    const duration = durationControl.value;
    const shadow = shadowControl.value;
    const blur = blurControl.value;
    const pulse = pulseControl.value;

    let cssText = `.preview-box {\n`;
    cssText += `  transition: transform ${duration}s ease,\n`;
    cssText += `              filter ${duration}s ease,\n`;
    cssText += `              box-shadow ${duration}s ease;\n`;
    cssText += `    --shadow-strength: ${shadow}px;\n`;
    cssText += `    --blur-amount: ${blur}px\n;`
    cssText += `    --pulse-speed: ${pulse}s;\n`;
    cssText += `}\n\n`;
    
    previewBox.classList.forEach(cls => {
        if (effectDefinitions[cls]) {
          cssText += effectDefinitions[cls] + "\n\n";
        }
      });
    
      cssCode.textContent = cssText;
}

updateCssCode();