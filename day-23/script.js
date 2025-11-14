const input = document.getElementById("htmlInput");
const lineNumbers = document.getElementById("lineNumbers");
const analyzeBtn = document.getElementById("analyzeBtn");
const issueList = document.getElementById("issues");

const updateLineNumbers = () => {
    const lines = input.value.split("\n").length;
    lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => (i+1)).join("<br>");
};

input.addEventListener('input', updateLineNumbers);
updateLineNumbers();

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const brightness = ([r, g, b]) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
};

const colorDifference = (rgb1, rgb2) => {
    return Math.abs(rgb1[0] - rgb2[0]) +
           Math.abs(rgb1[1] - rgb2[1]) +
           Math.abs(rgb1[2] - rgb2[2]);
};

const contrast = (hex1, hex2) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const brightDiff = Math.abs(brightness(rgb1) - brightness(rgb2));
    const colorDiff = colorDifference(rgb1, rgb2);
    return { brightDiff, colorDiff };
}

analyzeBtn.addEventListener('click', () => {
    const html = input.value;
    issueList.innerHTML = "";

    const issues = [];

    const lines = html.split("\n");

    const container = document.createElement("div");
    container.innerHTML = html;

    lines.forEach((line, idx) => {
        if (line.includes("<img") && !line.includes("alt=")) {
            issues.push(`Line ${idx + 1}: Image missing alt attribute ${line.trim()}`);
        }
    });

    const headings = Array.from(container.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    if (headings.length > 0) {
        const levels = headings.map(h => parseInt(h.tagName.substring(1)));
        for (let i = 1; i < levels.length; i++) {
            if (levels[i] - levels[i - 1] > 1) {
                const headingHtml = headings[i].outerHTML;
                const lineIndex = lines.findIndex(line => line.includes(headingHtml));
                issues.push(`Line ${lineIndex + 1}: Improper heading structure (jumped from h${levels[i - 1]} to h${levels[i]})`);
            }
        }
    }

    lines.forEach((line, idx) => {
        if (line.includes("style")) {
            const colorMatch = line.match(/color:\s*(#[0-9a-fA-F]{3,6})/);
            const bgMatch = line.match(/background:\s*(#[0-9a-fA-F]{3,6})/);
            if (colorMatch && bgMatch) {
                const { brightDiff, colorDiff } = contrast(colorMatch[1], bgMatch[1]);
                if (brightDiff < 255 || colorDiff < 500) {
                    issues.push(`Line ${idx + 1}: Low contrast (brightness diff ${brightDiff.toFixed(1)}, color diff ${colorDiff} ${line.trim()})`);
                }
            }
        }
    });

    if (issues.length === 0) {
        issueList.innerHTML = "<li>No issues found 🎉</li>";
    } else {
        issues.forEach(issue => {
            const li = document.createElement("li");
            li.textContent = issue;
            issueList.appendChild(li);
        });
    }
});