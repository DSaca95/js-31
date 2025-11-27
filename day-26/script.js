const gallery = document.getElementById("gallery");
const modal = document.getElementById("lightbox");
const modalImg = document.getElementById("lightbox-img");
const caption = document.getElementById("lightbox-caption");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let images = [];
let currentIndex = 0;

const loadImages = async () => {
    const response = await fetch("https://picsum.photos/v2/list?page=2&limit=50");
    const data = await response.json();
    images = data;

    gallery.innerHTML = "";
    images.forEach((imgData, index) => {
        const card = document.createElement("div");
        card.className = "gallery-card";

        const img = document.createElement("img");
        img.className = "gallery-item";
        img.src = imgData.download_url;
        img.alt = imgData.author || `Photo ${index + 1}`;

        img.addEventListener('click', () => openModal(index));
        card.appendChild(img);
        gallery.appendChild(card);
    });
}

const openModal = (index) => {
    modal.style.display = "block";
    currentIndex = index;
    modalImg.src = images[index].download_url;
    caption.textContent = images[index].author || `Photo ${index + 1}`;
}

const closeModal = () => {
    modal.style.display = "none";
}

const showPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openModal(currentIndex);
}

const showNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    openModal(currentIndex);
}

closeBtn.addEventListener('click', closeModal);
prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);

document.addEventListener('keydown', (e) => {
    if (modal.style.display === "block") {
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "ArrowRight") showNext();
    }
});

loadImages();