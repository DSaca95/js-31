const API_URL = "https://jsonplaceholder.typicode.com/posts";
const toggleBtn = document.getElementById("toggle-theme");
const blogContainer = document.getElementById("blog-container");
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");
const staffList = document.getElementById("staff-list");

const state = {
    posts: [],
    selectedId: null,
    error: null
};

const fetchPosts = async () => {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        state.posts = data.slice(0, 10);
        state.error = null;
        render();
        renderStaffPicks();
    } catch (err) {
        state.error = "Falied to load posts.";
        render();
    }
};

const renderList = () => {
    return state.posts.map(post => `
        <article class="post-preview" data-id="${post.id}">
            <h2>${post.title}</h2>
            <p>${post.body.slice(0, 100)}...</p>
            <button class="read-more">Read more</button>
        </article>
        `).join("");
};

const renderDetails = () => {
    const post = state.posts.find(p => p.id === state.selectedId);
    if (!post) return "";

    return `
        <article class="post-detail">
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <button class="back">Back</button>
        </article>
    `;
};

const renderStaffPicks = () => {
    const picks = state.posts.slice(5, 8);
    staffList.innerHTML = picks.map(post => `
        <li>
            <strong>${post.title}</strong><br>
            <small>${post.body.slice(0, 60)}...</small>
        </li>
    `).join("");
};

const render = () => {
    if (state.error) {
        blogContainer.innerHTML = `<p class="error">${state.error}</p>`;
        return;
    }

    blogContainer.innerHTML = state.selectedId ? renderDetails() : renderList();

    blogContainer.querySelectorAll(".read-more").forEach(btn => {
        btn.addEventListener('click', e => {
            const id = +e.target.closest(".post-preview").dataset.id;
            state.selectedId = id;
            render();
        });
    });

    const backBtn = blogContainer.querySelector(".back");
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            state.selectedId = null;
            render();
        });
    };
}

toggleBtn.addEventListener('click', () => {
    const current = document.body.getAttribute("data-theme");
    document.body.setAttribute("data-theme", current === "dark" ? "light" : "dark");
});

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle("open");
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove("open");
    }
})

window.addEventListener('DOMContentLoaded', () => {
    document.body.setAttribute("data-theme", "light");
    fetchPosts();
});