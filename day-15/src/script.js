const apiKey = import.meta.env.VITE_OMDB_KEY;

const searchInput = document.getElementById("search");
const heroSlider = document.getElementById("hero-slider");
const sciFiRow = document.getElementById("sci-fi-row");
const horrorRow = document.getElementById("horror-row");
const thrillerRow = document.getElementById("thriller-row");

const allBtn = document.getElementById("all-btn");
const moviesBtn = document.getElementById("movies-btn");
const seriesBtn = document.getElementById("series-btn");

const mainSections = document.querySelector("main");

const keywords = ["dream", "ghost", "city", "love", "dark", "code", "future", "war"];
const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];


searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if (query.length >= 3) {
        clearRows();
        heroSlider.classList.add("grid-mode", "fullscreen");
        mainSections.classList.add("hidden");
        fetchAndRender(query, "", heroSlider);
        setActiveBtn(null);
    } else {
        heroSlider.classList.remove("grid-mode", "fullscreen");
        mainSections.classList.remove("hidden");
    }
});

moviesBtn.addEventListener("click", () => {
    clearRows();
    heroSlider.classList.remove("grid-mode", "fullscreen");
    mainSections.classList.remove("hidden");
    searchInput.value = "";

    fetchAndRender(randomKeyword, "movie", heroSlider);
    fetchAndRender("space", "movie", sciFiRow);
    fetchAndRender("horror", "movie", horrorRow);
    fetchAndRender("thriller", "movie", thrillerRow);
    setActiveBtn(moviesBtn);
});

seriesBtn.addEventListener("click", () => {
    clearRows();
    heroSlider.classList.remove("grid-mode", "fullscreen");
    mainSections.classList.remove("hidden");
    searchInput.value = "";

    fetchAndRender(randomKeyword, "series", heroSlider);
    fetchAndRender("space", "series", sciFiRow);
    fetchAndRender("horror", "series", horrorRow);
    fetchAndRender("thriller", "series", thrillerRow);
    setActiveBtn(seriesBtn);
});

allBtn.addEventListener("click", () => {
    clearRows();
    heroSlider.classList.remove("grid-mode", "fullscreen");
    mainSections.classList.remove("hidden");
    searchInput.value = "";

    fetchAndRender(randomKeyword, "", heroSlider);
    fetchAndRender("space", "", sciFiRow);
    fetchAndRender("horror", "", horrorRow);
    fetchAndRender("thriller", "", thrillerRow);
    setActiveBtn(allBtn);
});

const updateCylinderEffect = () => {
    const cards = heroSlider.querySelectorAll(".movie-card");
    const center = heroSlider.scrollLeft + heroSlider.offsetWidth / 2;

    cards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const offset = cardCenter - center;
        const angle = -offset / 10;
        const depth = 100 - Math.abs(offset) / 5;
        card.style.transform = `rotateY(${angle}deg) translateZ(${depth}px)`;
    });
};

heroSlider.addEventListener("scroll", updateCylinderEffect);

const clearRows = () => {
    heroSlider.innerHTML = "";
    sciFiRow.innerHTML = "";
    horrorRow.innerHTML = "";
    thrillerRow.innerHTML = "";
};

const setActiveBtn = (activeBtn) => {
    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
}


const fetchAndRender = async (query, type, container) => {
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}${type ? `&type=${type}` : ""}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === "False"){
            console.warn("No matches:", data.Error);
            return;
        }

        data.Search.forEach((movie) => renderCard(movie, container));
        updateCylinderEffect();
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function renderCard(movie, container) {
    const card = document.createElement("div");
    card.className = "movie-card";

    const fallbackPoster = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";
    const poster = movie.Poster !== "N/A" ? movie.Poster : fallbackPoster;

    card.innerHTML = `
        <img src="${poster}" alt="${movie.Title}"
            onerror="this.onerror=null;this.src='${fallbackPoster}';" />
        <div class="text-block">
            <h3>${movie.Title}</h3>
            <p>${movie.Year} • ${movie.Type}</p>
        </div>
    `;

    container.appendChild(card);
}

fetchAndRender(randomKeyword, "", heroSlider);

fetchAndRender("space", "movie", sciFiRow);
fetchAndRender("horror", "movie", horrorRow);
fetchAndRender("thriller", "movie", thrillerRow);