let paletteContainer;
let generateBtn;
let colorCountInput;
let contrastSelect;
let saveBtn;
let toggleButton;

const generateHex = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

const generatePalette = () => {
    paletteContainer.innerHTML = "";
    const count = parseInt(colorCountInput.value) || 5;
    const contrast = contrastSelect.value;

    switch (contrast) {
        case "any": return generateAnyPalette(count);
        case "dark": return generateFilteredPalette(count, isDark, "Dark");
        case "light": return generateFilteredPalette(count, hex => !isDark(hex), "Light");
        case "pure": return generatePurePalette(count);
        case "saturation": return generateFilteredPalette(count, hex => getSaturation(hex) > 0.5, "Saturated");
        case "quantity": return generateQuantityContrast(count);
        case "complementary": return generateComplementaryPalette(count);
        case "warm-cool": return generateWarmCoolContrast(Math.floor(count / 2));
        case "light-dark": return generateLightDarkContrast(Math.floor(count / 2));
        case "monochrome": return generateMonochromePalette(count);
        case "vivid-pastel": return generateVividPastelContrast(Math.floor(count / 2));
    }
};

const createColorCard = (hex, label = "") => {
    const card = createColorCardElement(hex, label, true);
    if (card) paletteContainer.appendChild(card);
};

const isDark = (hex) => getLuminance(hex) < 128;

const generatePurePalette = (count = 6) => {
    paletteContainer.innerHTML = "";
    const pureColors =["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    for (let i = 0; i < count; i++) {
        const hex = pureColors[i % pureColors.length];
        createColorCard(hex, "Pure");
    }
};

const isWarm = (hex) => {
    const [hue] = hexToHSL(hex);
    return hue < 90 || hue > 270;
};

const generateAnyPalette = (count = 5) => {
    paletteContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const hex = generateHex();
        createColorCard(hex);
    }
};

const generateFilteredPalette = (count, filterFn, label = "", maxAttempts = 1000) => {
    paletteContainer.innerHTML = "";
    let generated = 0;
    let attempts = 0;

    while (generated < count && attempts < maxAttempts) {
        const hex = generateHex();
        if (filterFn(hex)) {
            createColorCard(hex, label);
            generated++;
        }
        attempts++;
    }
};

const generatePairedContrast = (pairCount, filterA, labelA, filterB, labelB) => {
    paletteContainer.innerHTML = "";
    let generated = 0;

    while (generated < pairCount) {
        let hexA, hexB;

        do { hexA = generateHex(); } while (!filterA(hexA));
        do { hexB = generateHex(); } while (!filterB(hexB));

        createColorCard(hexA, labelA);
        createColorCard(hexB, labelB);
        generated++;
    }
};

const generateWarmCoolContrast = (pairCount = 3) => {
    generatePairedContrast(pairCount, isWarm, "Warm", hex => !isWarm(hex), "Cool");
};

const generateComplementaryPalette = (count = 5) => {
    paletteContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const base = generateHex();
        const comp = getComplementary(base);
        createColorCard(base, "Base");
        createColorCard(comp, "Comp");
    }
};

const getComplementary = (hex) => {
    const comp = 0xffffff ^ parseInt(hex.slice(1), 16);
    return "#" + comp.toString(16).padStart(6, "0");
};

const getLuminance = (hex) => {
    const [r, g, b] = hexToRGB(hex);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const generateLightDarkContrast = (pairCount = 3) => {
   generatePairedContrast(pairCount, hex=> getLuminance(hex) < 128, "Dark", hex => getLuminance(hex) >= 128, "Light");
};

const getSaturation = (hex) => {
    const [r, g, b] = hexToRGB(hex);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max === 0 ? 0 : (max - min) / max;
};

const generateQuantityContrast = (count = 5, dominantRatio = 0.8) => {
    paletteContainer.innerHTML = "";

    const accentCount = count - 1;
    if (accentCount < 1) {
        createColorCard(generateHex(), "100%");
        return;
    }

    const dominant = generateHex();
    const percent = (value) => `${(value * 100).toFixed(1)}%`
    createColorCard(dominant, percent(dominantRatio));

    const accentRatio = (1 - dominantRatio) / accentCount;
    for (let i = 0; i < accentCount; i++) {
        createColorCard(generateHex(), percent(accentRatio));
    }
};

const generateMonochromePalette = (count = 5) => {
    paletteContainer.innerHTML = "";

    const base = generateHex();
    const [h, s, l] = hexToHSL(base);

    for (let i = 0; i < count; i++) {
        const lightness = Math.min(1, Math.max(0, l + (i - count / 2) * 0.1));
        const hex = hslToHex(h, s, lightness);
        const label = `L${Math.round(lightness * 100)}%`;
        createColorCard(hex, label);
    }
};

const generateVividPastelContrast = (pairCount = 3) => {
    paletteContainer.innerHTML = "";

    let generated = 0;
    while (generated < pairCount) {
        let vivid, pastel;

        do {
            vivid = generateHex();
        } while (!isVivid(vivid));

        do {
            pastel = generateHex();
        } while (!isPastel(pastel));

        createColorCard(vivid, "Vivid");
        createColorCard(pastel, "Pastel");
        generated++;
    }
};

const generateVividColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 0.9;
    const lightness = 0.5;
    return hslToHex(hue, saturation, lightness);
};

const generatePastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 0.4;
    const lightness = 0.8;
    return hslToHex(hue, saturation, lightness);
};

const isVivid = (hex) => {
    const [h, s, l] = hexToHSL(hex);
    return s > 0.7 && l > 0.3 && l < 0.7;
};

const isPastel = (hex) => {
    const [h, s, l] = hexToHSL(hex);
    return s < 0.5 && l > 0.7;
}

const hslToHex = (h, s, l) => {
    h = h / 360;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 0) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1/3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1/3);
    }

    const toHex = x => {
        if (isNaN(x) || x < 0 || x > 1) return "00";
        return Math.round(x * 255).toString(16).padStart(2, "0");
    }
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

const hexToRGB = (hex) => {
    const parsed = parseInt(hex.slice(1), 16);
    const r = (parsed >> 16) & 255;
    const g = (parsed >> 8) & 255;
    const b = parsed & 255;
    return [r, g, b];
};

const hexToHSL = (hex) => {
    const [r, g, b] = hexToRGB(hex).map(v => v /255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max -min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((g - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h *= 60;
    }
    return [h, s, l];
};

const savePalette = () => {
    const cards = document.querySelectorAll(".color-card");
    const palette = Array.from(cards)
        .map(card => {
            const hex = card.getAttribute("data-hex");
            if (!hex || !hex.startsWith("#") || hex.length !== 7) return null;
            return {
                hex,
                label: card.getAttribute("data-label") || ""
            };
        })
        .filter(Boolean);
    const saved = JSON.parse(localStorage.getItem("savedPalettes") || "[]");
    saved.push(palette);
    localStorage.setItem("savedPalettes", JSON.stringify(saved));
};

const loadSavedPalettes = () => {
    const container = document.getElementById("saved-palettes");
    container.innerHTML = "";
    const saved = JSON.parse(localStorage.getItem("savedPalettes") || "[]");

    saved.forEach((palette, index) => {
        const group = document.createElement("div");
        group.className = "palette-group";

        const title = document.createElement("h3");
        title.textContent = `Palette ${index + 1}`;
        group.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "palette-grid";

        palette.forEach(({hex, label}) => {
            const card = createColorCardElement(hex, label, true)
            if (card) grid.appendChild(card);
        });
        group.appendChild(grid);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";
        removeBtn.addEventListener("click", () => {
            saved.splice(index, 1);
            localStorage.setItem("savedPalettes", JSON.stringify(saved));
            loadSavedPalettes();
        });

        group.appendChild(removeBtn);
        container.appendChild(group);
    });
};

const createColorCardElement = (hex, label = "", enableCopy = true) => {
    if (!hex || typeof hex !== "string" || !hex.startsWith("#") || hex.length !== 7) {
        console.warn("Skipping invalid hex:", hex);
        return null;
    }

    const card = document.createElement("div");
    card.className = "color-card";
    card.style.backgroundColor = hex;
    card.classList.add(getLuminance(hex) < 128 ? "light-text" : "dark-text");
    card.textContent = label ? `${hex} (${label})` : hex;
    card.setAttribute("data-hex", hex);
    card.setAttribute("data-label", label);

    if (enableCopy) {
        card.addEventListener("click", () => {
            navigator.clipboard.writeText(hex);
            card.textContent = "Copied!";
            setTimeout(() => {
                card.textContent = label ? `${hex} (${label})` : hex;
            }, 1000);
        });
    }

    return card;
};

const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark");
    toggleButton.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");

}

const applySavedTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.body.classList.add("dark");
        toggleButton.textContent = "☀️ Light Mode";
    }
};

const init = () => {
    paletteContainer = document.getElementById("palette");
    generateBtn = document.getElementById("generate");
    colorCountInput = document.getElementById("color-count");
    contrastSelect = document.getElementById("contrast-type");
    saveBtn = document.getElementById("save");
    toggleButton = document.getElementById("theme-toggle");

    toggleButton.addEventListener("click", toggleTheme);
    generateBtn.addEventListener("click", generatePalette);
    saveBtn.addEventListener("click", savePalette);

    applySavedTheme();
    generatePalette();
    loadSavedPalettes();
}

document.addEventListener("DOMContentLoaded", init);