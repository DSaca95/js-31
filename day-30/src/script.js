const API_KEY = import.meta.env.VITE_EMOJI_API_KEY;

const sortState = {
    alpha: "asc",
    unicode: "asc"
};

const emojiGrid = document.getElementById("emojiGrid");
const searchInput = document.getElementById("emojiSearch");
const pillContainer = document.querySelector(".pill-filters");
const sortButtons = document.querySelectorAll("#sortOrder button");

const fetchEmojis = async () => {
    const response = await fetch(`https://emoji-api.com/emojis?access_key=${API_KEY}`);
    const data = await response.json();
    return data;
};

const renderEmojis = (list) => {
    let html = "";
    let currentGroup = "";
    
    list.forEach(e => {
        if (e.group !== currentGroup) {
            currentGroup = e.group;
            html += `<div class="emoji-group-header">${currentGroup}</div>`;
        }
        html += `
            <div class="emoji-card" data-char="${e.character}">
                <div class="emoji-inner">
                    <div class="emoji-front">
                        <span>${e.character}</span>
                    </div>
                    <div class="emoji-back">
                        <p class="emoji-name">${e.unicodeName}</p>
                        <p class="emoji-meta">U+${e.codePoint} • ${e.group}</p>
                        <p class="emoji-keywords">${e.subGroup}</p>
                    </div>
                </div>
            </div>
        `;
    });

    emojiGrid.innerHTML = html;

    document.querySelectorAll(".emoji-card").forEach(card => {
        card.addEventListener("click", () => {
            const emoji = card.dataset.char;
            navigator.clipboard.writeText(emoji).then(() => {
                triggerFirework(card, emoji);
            });
        });
    });
};

const renderPills = (groups) => {
    pillContainer.innerHTML = `
        <button class="pill active" data-category="all">All</button>
        ${groups.map(g => `<button class="pill" data-category="${g}">${g}</button>`).join("")}
    `;
};

const showToast = (message) => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1500);
};

const triggerFirework = (card, emoji) => {
    showToast(`✅ Copied! ${emoji}`);

    const container = document.createElement("div");
    container.classList.add("firework-container");
    card.appendChild(container);

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement("span");
        particle.classList.add("particle");
        particle.textContent = emoji;
        container.appendChild(particle);

        const angle = Math.random() * 360;
        const distance = 40 + Math.random() * 40;
        particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
        particle.style.setProperty("--r", `${Math.random() * 720}deg`);
    }

    setTimeout(() => container.remove(), 1000);
};

const getGroups = (list) => {
    return [...new Set(list.map(e => e.group))];
}

const filterBySearch = (list, query) => {
    const q = query.toLowerCase();
    return list.filter(e => 
        e.unicodeName.toLowerCase().includes(q) ||
        e.group.toLowerCase().includes(q) ||
        e.subGroup.toLowerCase().includes(q)
    );
};

const filterByGroup = (list, category) => {
    return list.filter(e => e.group === category);
};

const sortByName = (list, order = "asc") => {
    return [...list].sort((a, b) => {
        if (a.unicodeName < b.unicodeName) return order === "asc" ? -1 : 1;
        if (a.unicodeName > b.unicodeName) return order === "asc" ? 1 : -1;
        return 0;
    });
};

const sortByUnicode = (list, order = "asc") => {
    return [...list].sort((a, b) => {
        const aCode = parseInt(a.codePoint, 16);
        const bCode = parseInt(b.codePoint, 16);
        return order === "asc" ? aCode - bCode : bCode - aCode;
    });
};

window.addEventListener("load", async () => {
    let allEmojis = await fetchEmojis();
    renderEmojis(allEmojis);

    const groups = getGroups(allEmojis);
    renderPills(groups);

    const pills = document.querySelectorAll(".pill");

    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            const category = pill.dataset.category;

            pills.forEach(p => p.classList.remove("active"));

            pill.classList.add("active");
            
            if (category === "all") {
                renderEmojis(allEmojis);
            } else {
                const filtered = filterByGroup(allEmojis, category);
                renderEmojis(filtered);
            }
        });
    });

    searchInput.addEventListener("input", e => {
        const filtered = filterBySearch(allEmojis, e.target.value);
        renderEmojis(filtered);
    });

    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            const category = pill.dataset.category;
            if (category === "all") {
                renderEmojis(allEmojis);
            } else {
                const filtered = filterByGroup(allEmojis, category);
                renderEmojis(filtered);
            }
            
        });

        sortButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const category = btn.dataset.category;
                let sorted = [];

                const currentOrder = sortState[category] === "asc" ? "desc" : "asc";
                sortState[category] = currentOrder;

                if (category === "alpha") {
                    sorted = sortByName(allEmojis, currentOrder);
                } else if (category === "unicode") {
                    sorted = sortByUnicode(allEmojis, currentOrder);
                }

                renderEmojis(sorted);
            });
        });
    });
});
