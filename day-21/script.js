const md = (src) => {
    const escape = (s) => s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    let text = escape(src);
  
    // Headings
    text = text
      .replace(/^###### (.*)$/gm, "<h6>$1</h6>")
      .replace(/^##### (.*)$/gm, "<h5>$1</h5>")
      .replace(/^#### (.*)$/gm, "<h4>$1</h4>")
      .replace(/^### (.*)$/gm, "<h3>$1</h3>")
      .replace(/^## (.*)$/gm, "<h2>$1</h2>")
      .replace(/^# (.*)$/gm, "<h1>$1</h1>");
  
    // Bold and italic
    text = text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  
    // Inline code
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  
    // Links [text](url)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // Lists: collect consecutive items into <ul>/<ol>
    const wrapLists = (lines) => {
      const out = [];
      let mode = null;
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (/^\s*-\s+/.test(l)) {
          if (mode !== "ul") { out.push("<ul>"); mode = "ul"; }
          out.push("<li>" + l.replace(/^\s*-\s+/, "") + "</li>");
        } else if (/^\s*\d+\.\s+/.test(l)) {
          if (mode !== "ol") { out.push("<ol>"); mode = "ol"; }
          out.push("<li>" + l.replace(/^\s*\d+\.\s+/, "") + "</li>");
        } else {
          if (mode === "ul") { out.push("</ul>"); mode = null; }
          if (mode === "ol") { out.push("</ol>"); mode = null; }
          if (l.trim() === "") out.push("");
          else out.push("<p>" + l + "</p>");
        }
      }
      if (mode === "ul") out.push("</ul>");
      if (mode === "ol") out.push("</ol>");
      return out.join("\n");
    };
  
    return wrapLists(text.split("\n"));
  };

const editor = document.getElementById("editor");
const preview = document.getElementById("preview");

const fontFamily = document.getElementById("fontFamily");
const typeScale = document.getElementById("typeScale");
const lineHeight = document.getElementById("lineHeight");
const letterSpacing = document.getElementById("letterSpacing");
const columns = document.getElementById("columns");
const pageMargin = document.getElementById("pageMargin");

const render = () => {
    preview.innerHTML = md(editor.value);
    applyTypo();
};

const applyTypo = () => {
    preview.style.fontFamily = fontFamily.value;

    const base = parseFloat(typeScale.value);
    preview.style.fontSize = `${16 * base}px`;
    preview.style.lineHeight = lineHeight.value;
    preview.style.letterSpacing = `${letterSpacing.value}em`;

    const h = (lvl) => `${(16 * base) * Math.pow(1.25, 6 - lvl)}px`;
    preview.querySelectorAll("h1").forEach(el => el.style.fontSize = h(1));
    preview.querySelectorAll("h2").forEach(el => el.style.fontSize = h(2));
    preview.querySelectorAll("h3").forEach(el => el.style.fontSize = h(3));
    preview.querySelectorAll("h4").forEach(el => el.style.fontSize = h(4));
    preview.querySelectorAll("h5").forEach(el => el.style.fontSize = h(5));
    preview.querySelectorAll("h6").forEach(el => el.style.fontSize = h(6));

    const cols = parseInt(columns.value, 10);
    preview.style.columnCount = cols;
    preview.style.columnGap = cols > 1 ? "2.2rem" : "0";

    preview.style.padding = `${pageMargin.value}px`;
};

editor.addEventListener("input", render);
[fontFamily, typeScale, lineHeight, letterSpacing, columns, pageMargin]
  .forEach(ctrl => ctrl.addEventListener("input", applyTypo));

editor.value = `# Day 21 — Markdown Previewer

A live Markdown previewer that converts user input into formatted HTML in real time.

## Features
- Headings, lists, links, emphasis
- Responsive split view
- Typographic controls (typescale, font, line height)
- Layout options (columns, margins)

### Link
[Open example.com](https://example.com)

\`inline code\` and **bold** + *italic*.

1. First
2. Second
3. Third
`;

render();
applyTypo();