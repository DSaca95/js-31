const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const randomBtn = document.getElementById("random-btn");
const card = document.getElementById("pokemon-card");
const img = document.getElementById("pokemon-img");
const nameEl = document.getElementById("pokemon-name");
const idEl = document.getElementById("pokemon-id");
const typesEl = document.getElementById("pokemon-types");
const statsEl = document.getElementById("pokemon-stats");
const feedback = document.getElementById("feedback");

const typeIcons = {
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  grass: "🌿",
  psychic: "🔮",
  ghost: "👻",
  ice: "❄️",
  rock: "🪨",
  dragon: "🐉",
  dark: "🌑",
  fairy: "✨",
  fighting: "🥊",
  flying: "🕊️",
  poison: "☠️",
  ground: "🌍",
  bug: "🐛",
  steel: "⚙️",
  normal: "🔘",
};

const fetchPokemon = async (query) => {
  feedback.textContent = "Loading...";
  card.classList.add("hidden");

  try {
    const data = await getPokemonData(query);
    const isLegendary = await getLegendaryStatus(data.species.url);

    renderCard(data, isLegendary);
    feedback.textContent = "";
    card.classList.remove("hidden");
  } catch (error) {
    feedback.textContent = "Pokémon not found.";
    console.error(error);
  }
};

const getPokemonData = async (query) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${String(query).toLowerCase()}`
  );
  if (!response.ok) throw new Error("Not found");
  return await response.json();
};

const getLegendaryStatus = async (speciesUrl) => {
  const response = await fetch(speciesUrl);
  const species = await response.json();
  return species.is_legendary;
};

const renderCard = (data, isLegendary) => {
  card.classList.toggle("rare", isLegendary);
  clearVisuals();

  renderStatusLabel(isLegendary);
  if (isLegendary) renderLegendaryAura();

  nameEl.textContent = data.name;
  idEl.textContent = `ID: ${data.id}`;
  img.src = data.sprites.front_default;

  renderTypes(data.types);
  renderGradient(data.types);
  renderStats(data.stats);
};

const renderLegendaryAura = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "rare-frame");
  svg.setAttribute("viewBox", "0 0 360 480");
  svg.setAttribute("preserveAspectRatio", "none");

  ["left", "right"].forEach((side) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "4");
    rect.setAttribute("y", "4");
    rect.setAttribute("width", "352");
    rect.setAttribute("height", "472");
    rect.setAttribute("rx", "16");
    rect.setAttribute("ry", "16");
    rect.setAttribute("class", `rare-line ${side}`);
    svg.appendChild(rect);
  });

  card.prepend(svg);
};

const renderStatusLabel = (isLegendary) => {
  const label = document.createElement("div");
  label.className = "status-label";
  label.textContent = isLegendary ? "Legendary Pokémon" : "Standard Pokémon";

  const existing = card.querySelector(".status-label");
  if (existing) existing.remove();

  card.insertBefore(label, img);
};

const renderTypes = (types) => {
  typesEl.innerHTML = "";
  types.forEach((t) => {
    const span = document.createElement("span");
    span.textContent = `${typeIcons[t.type.name] || ""} ${t.type.name}`;
    span.classList.add(t.type.name);
    typesEl.appendChild(span);
  });
};

const renderGradient = (types) => {
  const names = types.map((t) => t.type.name);
  const gradient =
    names.length === 1
      ? `var(--type-${names[0]})`
      : `linear-gradient(135deg, var(--type-${names[0]}), var(--type-${names[1]}))`;

  card.style.setProperty("--card-gradient", gradient);
};

const renderStats = (stats) => {
  statsEl.innerHTML = "";
  stats.forEach((s) => {
    const wrapper = document.createElement("div");
    const label = document.createElement("p");
    label.textContent = `${s.stat.name}: ${s.base_stat}`;

    const bar = document.createElement("div");
    bar.className = "stat-bar";

    const fill = document.createElement("div");
    fill.className = "stat-bar-fill";
    fill.style.width = `${Math.min(s.base_stat, 100)}%`;

    bar.appendChild(fill);
    wrapper.appendChild(label);
    wrapper.appendChild(bar);
    statsEl.appendChild(wrapper);
  });
};

const clearVisuals = () => {
  const aura = card.querySelector(".rare-frame");
  if (aura) aura.remove();

  const label = card.querySelector(".status-label");
  if (label) label.remove();
};

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchPokemon(query);
});

randomBtn.addEventListener("click", () => {
  const randomId = Math.floor(Math.random() * 1025) + 1;
  fetchPokemon(randomId);
});

card.addEventListener("mousedown", () => {
  card.classList.add("dragging");
});

card.addEventListener("mouseup", () => {
  card.classList.remove("dragging");
});

card.addEventListener("mouseleave", () => {
  card.classList.remove("dragging");
});

card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * 10; // max ±10°
  const rotateY = ((x - centerX) / centerX) * -10;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
});

card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });

window.addEventListener("DOMContentLoaded", () => {
  fetchPokemon("mewtwo");
});
