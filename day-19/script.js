const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const bgColorPicker = document.getElementById("bgColorPicker");
const brushSize = document.getElementById("brushSize");
const clearBtn = document.getElementById("clearBtn");
const controls = document.querySelector(".controls");
const controlsToggle = document.getElementById("controls-toggle");

const exportBtn = document.getElementById("export-btn");
const previewModal = document.getElementById("previewModal");
const previewImage = document.getElementById("previewImage");
const closePreview = document.getElementById("closePreview");

const downloadPng = document.getElementById("downloadPng");
const downloadJpg = document.getElementById("downloadJpg");
const downloadSvg = document.getElementById("downloadSvg");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

const brushBtns = document.querySelectorAll(".brush-btn");

let undoStack = [];
let redoStack = [];

let currentBrush = "pen";
let pencilPattern = null;

let drawing = false;
let currentColor = colorPicker.value;
let backgroundColor = bgColorPicker.value;
let currenSize = brushSize.value;

ctx.fillStyle = backgroundColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const saveState = () => {
    undoStack.push(canvas.toDataURL());
    redoStack = [];
}
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height =
    window.innerHeight -
    document.querySelector("header").offsetHeight -
    document.querySelector(".controls").offsetHeight;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const startDrawing = (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
};

const draw = (e) => {
    if (!drawing) return;

    const x = getX(e);
    const y = getY(e);

    if (currentBrush === "fill") {
        floodFill(Math.floor(x), Math.floor(y), currentColor);
        drawing = false;
        return;
    }

    ctx.lineTo(x, y);

    if (currentBrush === "pen") {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = currentColor;
    } else if (currentBrush === "pencil") {
        if (!pencilPattern) pencilPattern = createPencilPattern(currentColor);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = pencilPattern;
        ctx.lineWidth = currenSize * 0.7;
    } else if (currentBrush === "easer") {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = backgroundColor;
    }

    ctx.lineWidth = currenSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
};

const stopDrawing = () => {
    drawing = false;
    ctx.closePath();
    saveState();
};

const getX = (e) => e.touches ? e.touches[0].clientX : e.clientX;
const getY = (e) => {
  const offset = document.querySelector("header").offsetHeight + document.querySelector(".controls").offsetHeight;
  return e.touches ? e.touches[0].clientY - offset : e.clientY - offset;
};

bgColorPicker.addEventListener('input', (e) => {
    backgroundColor = e.target.value;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

const floodFill = (startX, startY, fillColor) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height, { willReadFrequently: true });
    const data = imageData.data;

    const targetColor = getPixel(data, startX, startY);
    const replacement = hexToRgba(fillColor);

    if (colorsMatch(targetColor, replacement)) return;

    const stack = [[startX, startY]];

    while (stack.length) {
        const [x, y] = stack.pop();
        if (x < 0 || y < 0 || x >= canvas.widt || y >= canvas.height) continue;

        const currentColor = getPixel(data, x, y);
        if (colorsMatch(currentColor, targetColor)) {
            setPixel(data, x, y, replacement);
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

const getPixel = (data, x, y) => {
    const i = (y * canvas.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}

const setPixel = (data, x, y, color) => {
    const i = (y * canvas.width + x) * 4;
    data[i] = color[0];
    data[i + 1] = color[1];
    data[i + 2] = color[2];
    data[i + 3] = 255;
}

const colorsMatch = (a, b) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

const hexToRgba = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
}

const createPencilPattern = (color) => {
    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = noiseCanvas.height = 20;
    const nctx = noiseCanvas.getContext("2d");

    for (let i = 0; i < 200; i++) {
        nctx.fillStyle = color;
        nctx.globalAlpha = Math.random() * 0.3 + 0.1;
        nctx.fillRect(Math.random() * 20, Math.random() * 20, 1, 1);
    }
    return ctx.createPattern(noiseCanvas, "repeat");
}

colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    if (currentBrush === "pencil") {
        pencilPattern = createPencilPattern(currentColor);
    }
})

canvas.addEventListener('mousedown', startDrawing, { passive: true });
canvas.addEventListener('mousemove', draw, { passive: true });
canvas.addEventListener('mouseup', stopDrawing, { passive: true });
canvas.addEventListener('mouseout', stopDrawing, { passive: true });

canvas.addEventListener('touchstart', startDrawing, { passive:true });
canvas.addEventListener('touchmove', draw, { passive:true });
canvas.addEventListener('touchend', stopDrawing, { passive:true });

colorPicker.addEventListener('input', (e) => (currentColor = e.target.value));
brushSize.addEventListener('input', (e) => (currenSize = e.target.value));

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to erase the canvas?')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

controlsToggle.addEventListener('click', () => {
    controls.classList.toggle('closed');
});

exportBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL("image/png");
    previewImage.src = dataUrl;
    previewModal.classList.remove("closed");
});

closePreview.addEventListener('click', () => {
    previewModal.classList.add("closed");
});

downloadPng.addEventListener('click', () => {
    const link = document.createElement("a");
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
});

downloadJpg.addEventListener('click', () => {
    const link = document.createElement("a");
    link.download = `drawing-${Date.now()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.9);
    link.click();
});

downloadSvg.addEventListener('click', () => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
            <image href="${canvas.toDataURL("image/png")}" width="100%" height="100%"/>
        </svg>
    `;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = `drawing-${Date.now()}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
});

undoBtn.addEventListener('click', () => {
    if (undoStack.length > 0) {
        const lastState = undoStack.pop();
        redoStack.push(canvas.toDataURL());

        const img = new Image();
        img.src = lastState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
});

redoBtn.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(canvas.toDataURL());

        const img = new Image();
        img.src = nextState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
});

brushBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        brushBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentBrush = btn.dataset.brush;
    });
});

document.querySelector('.brush-btn[data-brush="pen"]').classList.add("active");