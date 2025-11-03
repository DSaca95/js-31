const searchBtn = document.getElementById("search-btn");
const input = document.getElementById("ingerdient-input");
const container = document.getElementById("recipe-container");
const btnLeft = document.getElementById("scroll-left");
const btnRight = document.getElementById("scroll-right");

const scrollController = (() => {
    const update = () => {
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        btnLeft.disabled = Math.floor(scrollLeft) <= 0;
        btnRight.disabled = Math.ceil(scrollLeft) >= Math.floor(maxScroll);
    };

    const scrollBy = (direction = 1) => {
        container.scrollBy({ left: direction * window.innerWidth, behavior: "smooth" });
    };

    const disableAll = () => {
        btnLeft.disabled = true;
        btnRight.disabled = true;
    };

    const refresh = () => {
        requestAnimationFrame(() => setTimeout(update, 50));
    };

    return { update, scrollBy, disableAll, refresh };
})();

const renderRecipes = (meals) => {
    container.innerHTML = meals.map(meal => {
        const ingerdients = Array.from({ length: 20 }, (_, i) => {
            const ing = meal[`strIngredient${i+1}`];
            const measure = meal[`strMeasure${i+1}`];
            return ing ? `${measure} ${ing}` : null;
        }).filter(Boolean).join("<br>");

        return `
            <div class="recipe-card">
                <img src="${meal.strMealThumb}" alt="${meal.strmeal}" />
                <div class="text-content">
                    <h2>${meal.strMeal}</h2>
                    <p><strong>Ingredients:</strong><br>${ingerdients}</p>
                    <p><strong>Instuctions:</strong><br>${meal.strInstructions.slice(0, 300)}...</p>
                    <a href="${meal.strSource || meal.strYoutube}" target="_blank">Full recipe</a>
                </div>
            </div>
        `;
    }).join("");

    scrollController.refresh();
};

const updateScrollButtons = () => {
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    btnLeft.disabled = scrollLeft <= 0;
    btnRight.disabled = scrollLeft >= maxScroll - 1;
}

btnLeft.addEventListener('click', () => scrollController.scrollBy(-1));
btnRight.addEventListener('click', () => scrollController.scrollBy(1));
container.addEventListener('scroll', scrollController.update);
window.addEventListener('resize', scrollController.update);

searchBtn.addEventListener('click', async () => {
    const query = input.value.trim();
    if (!query) return;

    container.innerHTML = "<p>Loading...</p>";
    scrollController.disableAll();

    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await res.json();

        if (!data.meals) throw new Error("No recipes found");
        renderRecipes(data.meals);
    } catch (error) {
        container.innerHTML = `<p style="color:#ad0042;">${error.message}</p>`;
        scrollController.disableAll();
    }
});

window.addEventListener('load', () => {
    scrollController.update();
});