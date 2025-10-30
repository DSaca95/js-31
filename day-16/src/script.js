const searchBtn = document.getElementById("search-btn");
const usernameInput = document.getElementById("username");
const profileContainer = document.getElementById("profile-container");
const toggleTheme = document.getElementById("toggle-theme");
const app = document.getElementById("app");

searchBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    if (!username) return;

    profileContainer.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error("User not found");

        const data = await response.json();
        renderProfile(data);
    } catch (error) {
        profileContainer.innerHTML = `<p style="color:#ad0042;">${error.message}</p>`;
    }
});

toggleTheme.addEventListener("click", () => {
    app.classList.toggle("theme-light");
    app.classList.toggle("theme-dark");
});

function renderProfile(data) {
    const createdDate = new Date(data.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });


    profileContainer.innerHTML = `
        <div class="profile-card">
            <img src="${data.avatar_url}" alt="${data.name}" width="100" style="border-radius:50%;" />
            <h2>${data.login ?? "No name available"}<br><span>${data.name ?? "No name available"}</span></h2>
            <p>${data.bio ?? "No bio available"}</p>
            <p>Repos: ${data.public_repos}</p>
            <p>Followers: ${data.followers}</p>
            <p>Following: ${data.following}
            <p>Joined: ${createdDate}</p>
            
            <p>🔗 <a href="${data.html_url}" target="_blank">View onGitHub</a></p>
        </div>
    `;
}