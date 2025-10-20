const init = () => {
    console.log("Carousel init...");
    const track = document.getElementById("img-container");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const indicators = document.querySelector(".indicators");
    const previewBar = document.getElementById("preview-bar");

    let index = 0;
    let autoSlide;
    let totalSlides = 0;

    const fetchImages = async () => {
        try {
            const response = await fetch("https://picsum.photos/v2/list?page=2&limit=7");
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const images = await response.json();
            totalSlides = images.length;

            images.forEach((img, i) => {
                const id = img.id;

                const mainImg = document.createElement("img");
                mainImg.src = `https://picsum.photos/id/${id}/640/360`;
                mainImg.alt = `Slide ${i + 1}`;
                mainImg.dataset.index = i;
                mainImg.style.flexShrink = "0";
                mainImg.style.width = "100%";
                track.appendChild(mainImg);

                const thumbImg = document.createElement("img");
                thumbImg.src = `https://picsum.photos/id/${id}/80/45`;
                thumbImg.alt = `Preview ${i + 1}`;
                thumbImg.dataset.index = i;
                previewBar.appendChild(thumbImg);

                thumbImg.addEventListener("click", () => {
                    index = i;
                    updateCarousel();
                    resetAutoSlide();
                });

                const dot = document.createElement("span");
                dot.dataset.index = i;
                indicators.appendChild(dot);
            });

            updateCarousel();
            startAutoSlide();
        } catch (error) {
            console.error("GET failed", error);
            track.innerHTML = `<p style="color:red; text-align:center;>Could not GET photos.</p>`;
        }
    }
    fetchImages();

    const updateCarousel = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
    
        indicators.querySelectorAll("span").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    
        previewBar.querySelectorAll("img").forEach((thumb, i) => {
            thumb.classList.toggle("active", i === index);
        })
    };

    const startAutoSlide = () => {
        autoSlide = setInterval(() => {
            index = (index + 1) % totalSlides;
            updateCarousel();
        }, 4000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlide);
        startAutoSlide();
    };

    prevBtn.addEventListener("click", () => {
        index = (index - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoSlide();
    });
    
    nextBtn.addEventListener("click", () => {
        index = (index + 1) % totalSlides;
        updateCarousel();
        resetAutoSlide();
    });
    
    indicators.addEventListener("click", (e) => {
        if (e.target.tagName === "SPAN" && e.target.dataset.index) {
            index = parseInt(e.target.dataset.index);
            updateCarousel();
            resetAutoSlide();
        }
    });
    
    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const delta = endX -startX;
    
        if (Math.abs(delta) > 50) {
            if (delta > 0) {
                index = (index - 1 + totalSlides) % totalSlides;
            } else {
                index = (index + 1) % totalSlides;
            }
            updateCarousel();
            resetAutoSlide();
        }
    });
}

document.addEventListener("DOMContentLoaded", init);


