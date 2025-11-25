const GAMMA_TRESHOLD = 0.03928;
const GAMMA_DIVISOR = 12.92;
const GAMMA_OFFSET = 0.055;
const GAMMA_SCALE = 1.055;
const GAMMA_EXPONENT = 2.4;

const LUMINANCE_WEIGHTS = [0.2126, 0.7152, 0.0722];
const CONTRAST_OFFSET = 0.05;
const WCGA_LEVELS = { AA: 4.5, AAA: 7 };

const DEFAULTS = {
    primary: "#e57373",
    secondary: "#ffffff",
    text: "#000000",
    btnText: "#ffffff",
    titleWeight: "700",
    titleSize: "22",
    bodyWeight: "400",
    bodySize: "16",
    btnRadius: "24"
};

const DARK_SURFACE = "#121212";

const primaryColorPicker = document.getElementById("primaryColor");
const secondaryColorPicker = document.getElementById("secondaryColor");
const textColorPicker = document.getElementById("textColor");

const primaryHexInput = document.getElementById("primaryHex");
const secondaryHexInput = document.getElementById("secondaryHex");
const textHexInput = document.getElementById("textHex");
const btnTextColorPicker = document.getElementById("btnTextColor");
const btnTextHexInput = document.getElementById("btnTextHex");

const titleWeight = document.getElementById("titleWeight");
const titleSize = document.getElementById("titleSize");
const bodyWeight = document.getElementById("bodyWeight");
const bodySize = document.getElementById("bodySize");
const btnRadius = document.getElementById("btnRadius");

const lightCard = document.querySelector(".ui-card.light");
const darkCard = document.querySelector(".ui-card.dark");

const lightTitleRatio = document.getElementById("lightTitleRatio");
const lightTitleLevel = document.getElementById("lightTitleLevel");
const lightBodyRatio = document.getElementById("lightBodyRatio");
const lightBodyLevel = document.getElementById("lightBodyLevel");
const lightBtnRatio = document.getElementById("lightBtnRatio");
const lightBtnLevel = document.getElementById("lightBtnLevel");

const darkTitleRatio = document.getElementById("darkTitleRatio");
const darkTitleLevel = document.getElementById("darkTitleLevel");
const darkBodyRatio = document.getElementById("darkBodyRatio");
const darkBodyLevel = document.getElementById("darkBodyLevel");
const darkBtnRatio = document.getElementById("darkBtnRatio");
const darkBtnLevel = document.getElementById("darkBtnLevel");

const resetBtn = document.getElementById("resetBtn");

const swatches = {
    primarySwatch: document.getElementById("primarySwatch"),
    primaryLight: document.getElementById("primaryLight"),
    primaryDark: document.getElementById("primaryDark"),
    secondarySwatch: document.getElementById("secondarySwatch"),
    secondaryLight: document.getElementById("secondaryLight"),
    secondaryDark: document.getElementById("secondaryDark")
};

const expandShortHex = (hex)  => {
    const clean = hex.replace("#", "").toLowerCase();
    if (clean.length === 3) return "#" + clean.split("").map(c => c + c).join("");
    return "#" + clean.padStart(6, "0");
};

const hexToRgb = (hex) => {
    const clean = expandShortHex(hex).replace("#", "");
    return [0, 1, 2].map(i => parseInt(clean.slice(i * 2, i * 2 + 2), 16));
};

const getLuminance = (rgb) => {
    return rgb.reduce((acc, c, i) => {
        const val = c / 255;
        const linear = val <= GAMMA_TRESHOLD
            ? val / GAMMA_DIVISOR
            : Math.pow((val + GAMMA_OFFSET) / GAMMA_SCALE, GAMMA_EXPONENT);
        return acc + linear * LUMINANCE_WEIGHTS[i];
    }, 0);
};

const invertColor = (hex) => {
    const [r, g, b] = hexToRgb(hex);
    const inverted = [255 - r, 255 - g, 255 - b];
    return hslToHex(...rgbToHsl(...inverted));
}

const getContrastRatio = (bgHex, textHex) => {
    const bgLum = getLuminance(hexToRgb(bgHex));
    const textLum = getLuminance(hexToRgb(textHex));
    const lighter = Math.max(bgLum, textLum);
    const darker = Math.min(bgLum, textLum);
    return (lighter + CONTRAST_OFFSET) / (darker + CONTRAST_OFFSET);
};

const getWCAGLevel = (ratio) => {
    if (ratio >= WCGA_LEVELS.AAA) return "AAA";
    if (ratio >= WCGA_LEVELS.AA) return "AA";
    return "Fail";
};

const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
};

const hueToRgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return q + (q - p) * (2 / 3 - t) * 6;
    return p;
};

const hslToHex = (h, s, l) => {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
};

const adjustLightness = (hex, percent) => {
    const [r, g, b] = hexToRgb(hex);
    const hsl = rgbToHsl(r, g, b);
    hsl[2] = Math.min(1, Math.max(0, hsl[2] + percent));
    return hslToHex(hsl[0], hsl[1], hsl[2]);
};

const updateBrandPreview = () => {
    const primary = primaryHexInput.value;
    const secondary = secondaryHexInput.value;
    const text = textHexInput.value;
    const btnText = btnTextHexInput.value;

    const primaryLightHex = adjustLightness(primary, 0.2);
    const primaryDarkHex = adjustLightness(primary, -0.2);
    const secondaryLightHex = adjustLightness(secondary, 0.2);
    const secondaryDarkHex = adjustLightness(secondary, -0.2);

    const darkSurface       = DARK_SURFACE;
    const primaryLightDark  = adjustLightness(primary, 0.2);
    const primaryDarkDark   = adjustLightness(primary, -0.2);
    const secondaryLightDark= adjustLightness(darkSurface, 0.2);
    const secondaryDarkDark = adjustLightness(darkSurface, -0.2);

    const list = [
    { el: document.getElementById("primarySwatchLight"), color: primary, fg: btnText, name: "Primary (Light)" },
    { el: document.getElementById("primaryLight"), color: primaryLightHex, fg: btnText, name: "Primary Light" },
    { el: document.getElementById("primaryDark"), color: primaryDarkHex, fg: btnText, name: "Primary Dark" },
    { el: document.getElementById("secondarySwatchLight"), color: secondary, fg: text, name: "Secondary (Light)" },
    { el: document.getElementById("secondaryLight"), color: secondaryLightHex, fg: text, name: "Secondary Light" },
    { el: document.getElementById("secondaryDark"), color: secondaryDarkHex, fg: text, name: "Secondary Dark" },

    { el: document.getElementById("primarySwatchDark"), color: primary, fg: btnText, name: "Primary (Dark)" },
    { el: document.getElementById("primaryLightDark"), color: primaryLightDark, fg: btnText, name: "Primary Light (Dark)" },
    { el: document.getElementById("primaryDarkDark"), color: primaryDarkDark, fg: btnText, name: "Primary Dark (Dark)" },
    { el: document.getElementById("secondarySwatchDark"), color: darkSurface, fg: "#ffffff", name: "Secondary (Dark)" },
    { el: document.getElementById("secondaryLightDark"), color: secondaryLightDark, fg: "#ffffff", name: "Secondary Light (Dark)" },
    { el: document.getElementById("secondaryDarkDark"), color: secondaryDarkDark, fg: "#ffffff", name: "Secondary Dark (Dark)" }
    ];

    list.forEach(item => {
        if (!item.el) return;
        item.el.style.backgroundColor = item.color;
        item.el.style.color = item.fg;
        const ratio = getContrastRatio(item.color, item.fg);
        const level = getWCAGLevel(ratio);
        item.el.textContent = `${item.name} — ${level} (${ratio.toFixed(2)})`;
    });
};

const applyTypography = (card, titleWeightVal, titleSizeVal, bodyWeightVal, bodySizeVal) => {
    const titleEl = card.querySelector(".title");
    const bodyEl = card.querySelector(".body");
    titleEl.style.fontWeight = titleWeightVal;
    titleEl.style.fontSize = `${titleSizeVal}px`;
    bodyEl.style.fontWeight = bodyWeightVal;
    bodyEl.style.fontSize = `${bodySizeVal}px`;
};

const updateUICard = (card, isDark) => {
    if (!card) return;

    const primary = primaryHexInput.value;
    const secondary = secondaryHexInput.value;
    let bodyText = textHexInput.value;
    const titleText = textHexInput.value;
    const btnText = btnTextHexInput.value;

    const bg = isDark ? adjustLightness(secondary, -0.85) : secondary;
    if (isDark) {
        bodyText = invertColor(bodyText);
    }

    card.style.backgroundColor = bg;
    card.style.color = bodyText;

    const header = card.querySelector(".ui-header");
    if (header) {
        header.style.backgroundColor = primary;
        header.style.color = titleText;
    }

    const btn = card.querySelector(".ui-button");
    btn.style.backgroundColor = primary;
    btn.style.color = btnText;
    btn.style.borderRadius = `${btnRadius.value}px`;

    const track = card.querySelector(".slider");
    const thumb = card.querySelector(".slider .thumb");
    track.style.backgroundColor = adjustLightness(secondary, isDark ? -0.2 : 0.1);
    thumb.style.backgroundColor = primary;

    applyTypography(card, titleWeight.value, titleSize.value, bodyWeight.value, bodySize.value);

    const titleEl = card.querySelector(".title");
    const bodyEl = card.querySelector(".body");

    const titleRatio = getContrastRatio(bg, titleText);
    const bodyRatio = getContrastRatio(bg, bodyText);
    const btnRatio = getContrastRatio(primary, btnText);

    const titleLevel = getWCAGLevel(titleRatio);
    const bodyLevel = getWCAGLevel(bodyRatio);
    const btnLevel = getWCAGLevel(btnRatio);

    if (isDark) {
        darkTitleRatio.textContent = titleRatio.toFixed(2);
        darkTitleLevel.textContent = titleLevel;
        darkBodyRatio.textContent = bodyRatio.toFixed(2);
        darkBodyLevel.textContent = bodyLevel;
        darkBtnRatio.textContent = btnRatio.toFixed(2);
        darkBtnLevel.textContent = btnLevel;
    } else {
        lightTitleRatio.textContent = titleRatio.toFixed(2);
        lightTitleLevel.textContent = titleLevel;
        lightBodyRatio.textContent = bodyRatio.toFixed(2);
        lightBodyLevel.textContent = bodyLevel;
        lightBtnRatio.textContent = btnRatio.toFixed(2);
        lightBtnLevel.textContent = btnLevel;
    }
};

const updateAll = () => {
    primaryColorPicker.value = expandShortHex(primaryHexInput.value);
    secondaryColorPicker.value = expandShortHex(secondaryHexInput.value);
    textColorPicker.value = expandShortHex(textHexInput.value);

    updateUICard(lightCard, false);
    updateUICard(darkCard, true);

    updateBrandPreview();
};

[primaryColorPicker, secondaryColorPicker, textColorPicker].forEach(inp => {
    inp.addEventListener("input", e => {
        const map = {
            primaryColor: primaryHexInput,
            secondaryColor: secondaryHexInput,
            textColor: textHexInput
        };
        const target = map[e.target.id];
        target.value = e.target.value;
        updateAll();
    });
});

[primaryHexInput, secondaryHexInput, textHexInput].forEach(inp => {
    inp.addEventListener("input", updateAll);
});

[titleWeight, titleSize, bodyWeight, bodySize, btnRadius].forEach(inp => {
    inp.addEventListener("change", updateAll);
});

btnTextColorPicker.addEventListener("input", e => {
    btnTextHexInput.value = e.target.value;
    updateAll();
});
btnTextHexInput.addEventListener("input", updateAll);

resetBtn.addEventListener("click", () => {
    primaryHexInput.value = DEFAULTS.primary;
    secondaryHexInput.value = DEFAULTS.secondary;
    textHexInput.value = DEFAULTS.text;
    btnTextHexInput.value = DEFAULTS.btnText;

    titleWeight.value = DEFAULTS.titleWeight;
    titleSize.value   = DEFAULTS.titleSize;
    bodyWeight.value  = DEFAULTS.bodyWeight;
    bodySize.value    = DEFAULTS.bodySize;
    btnRadius.value   = DEFAULTS.btnRadius;

    primaryColorPicker.value   = DEFAULTS.primary;
    secondaryColorPicker.value = DEFAULTS.secondary;
    textColorPicker.value      = DEFAULTS.text;
    btnTextColorPicker.value   = DEFAULTS.btnText;
})

updateAll();