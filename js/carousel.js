export function initCarousel() {
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const dotsContainer = document.getElementById("carousel-dots");
    if (!track || !prevBtn || !nextBtn || !dotsContainer)
        return;
    const carouselTrack = track;
    const slides = track.querySelectorAll(".carousel__slide");
    const total = slides.length;
    let current = 0;
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = `carousel__dot${i === 0 ? " is-active" : ""}`;
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".carousel__dot");
    function goTo(index) {
        current = (index + total) % total;
        carouselTrack.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    }
    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));
    let autoplay = setInterval(() => goTo(current + 1), 5000);
    const carousel = document.getElementById("services-carousel");
    carousel?.addEventListener("mouseenter", () => clearInterval(autoplay));
    carousel?.addEventListener("mouseleave", () => {
        autoplay = setInterval(() => goTo(current + 1), 5000);
    });
}
