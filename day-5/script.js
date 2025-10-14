const CHAR_SETS = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{};:,.<>?/|"
};

const lengthRange = document.getElementById("length-range");
const lengthInput = document.getElementById("length-number");

const lowercaseInput = document.getElementById("lowercase");
const uppercaseInput = document.getElementById("uppercase");
const numbersInput = document.getElementById("numbers");
const symbolsInput = document.getElementById("symbols");

const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const toggleBtn = document.getElementById("theme-toggle");
const testBtn = document.getElementById("test-password");

const pwOutput = document.getElementById("password-output");

const getSelectedOptions = () => ({
    lowercase: lowercaseInput.checked,
    uppercase: uppercaseInput.checked,
    numbers: numbersInput.checked,
    symbols: symbolsInput.checked
});

const generatePassword = (length, options) => {
    const activeSets = Object.entries(CHAR_SETS)
        .filter(([key]) => options[key])
        .map(([_, chars]) => chars);

    if (activeSets.length === 0 || length < activeSets.length) return "";

    const allChars = activeSets.join("");
    const password = [];

    activeSets.forEach(set => {
        password.push(set[Math.floor(Math.random() * set.length)]);
    });

    for (let i = password.length; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    return password.sort(() => Math.random() - 0.5).join("");
};

const updateStrengthIndicator = (label, color, level, score = null) => {
    const strengthEl = document.getElementById("strength-indicator");
    const bars = document.querySelectorAll(".strength-bar .bar");

    strengthEl.textContent = label;
    strengthEl.style.color = color;

    bars.forEach(bar => {
        bar.classList.remove("active", "very-weak", "weak", "medium", "strong", "very-strong");
    });

    if (score !== null) {
        const levels = ["very-weak", "weak", "medium", "strong", "very-strong"];
        bars.forEach((bar, i) => {
          if (i <= score) {
            bar.classList.add("active", levels[score]);
          }
        });
      } else {
        if (level === "weak") {
            bars[0].classList.add("active", "weak");
        } else if (level === "medium") {
            bars[0].classList.add("active", "medium");
            bars[1].classList.add("active", "medium");
        } else if (level === "strong") {
            bars.forEach(bar => bar.classList.add("active", "strong"));
        }
    }
};

const evaluateStrength = (password) => {
    let hasLower = false;
    let hasUpper = false;
    let hasNumber = false;
    let hasSymbol = false;

    for (let char of password) {
        const code = char.charCodeAt(0);
        if (code >= 97 && code <= 122) hasLower = true;
        else if (code >= 65 && code <= 90) hasUpper = true;
        else if (code >= 48 && code <= 57) hasNumber = true;
        else hasSymbol = true;
    }

    const score = 
        (password.length >= 8 ? 1 : 0) +
        (hasLower ? 1 : 0) +
        (hasUpper ? 1 : 0) +
        (hasNumber ? 1 : 0) +
        (hasSymbol ? 1 : 0);

    if (score <= 2) return { label: "Weak", color: "#e74c3c", level: "weak" };
    if (score === 3) return { label: "Medium", color: "#f39c12", level: "medium" };
    return { label: "Strong", color: "#2ecc71", level: "strong" };
};

const syncLength = () => {
    const length = parseInt(lengthInput.value);
    const options = getSelectedOptions();
    const password = generatePassword(length, options);
    pwOutput.textContent = password;

    const strength = evaluateStrength(password);
    updateStrengthIndicator(strength.label, strength.color, strength.level);
};

const testingPassword = () => {
    testBtn.addEventListener("click", () => {
        const password = pwOutput.textContent;
        if (!password) return showToast("There isn't password!");

        const result = zxcvbn(password);


        const level = ["Very Weak", "Weak", "Middle", "Strong", "Very Strong"];
        const color = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"];
        const feedback = result.feedback.warning || result.feedback.suggestions.join(", ") || "No issue detected.";

    showToast(`Strength: ${level[result.score]} - ${feedback}`);
    updateStrengthIndicator(level[result.score], color[result.score], null, result.score);
    });
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => showToast("Copied!"))
        .catch(() => showToast("Copy failed"));
};

const showToast = (message) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.classList.add("toast");

    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
};

const syncPair = (rangeEl, numberEl, callback) => {
    rangeEl.addEventListener("input", () => {
        numberEl.value = rangeEl.value;
        callback();
    });
    numberEl.addEventListener("input", () => {
        rangeEl.value = numberEl.value;
        callback();
    });
};

const toggleTheme = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
};

const loadTheme = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        toggleBtn.textContent = "Light Mode";
    }
};

window.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    testingPassword();

    copyBtn.addEventListener("click", () => {
        const password = pwOutput.textContent;
        if (password) copyToClipboard(password);
    });

    const typeInputs = [lowercaseInput, uppercaseInput, numbersInput, symbolsInput];
    typeInputs.forEach(input => input.addEventListener("change", syncLength));
    syncPair(lengthRange, lengthInput, syncLength);
    generateBtn.addEventListener("click", syncLength);
    toggleBtn.addEventListener("click", toggleTheme)
});