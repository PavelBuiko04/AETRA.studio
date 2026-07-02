export function initCarousel(): void {
  const track = document.getElementById("carousel-track");
  const viewport = track?.parentElement;
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const dotsContainer = document.getElementById("carousel-dots");

  if (!track || !viewport || !prevBtn || !nextBtn || !dotsContainer) return;

  const carouselTrack = track;
  const slides = track.querySelectorAll<HTMLElement>(".carousel__slide");
  const total = slides.length;
  let current = 0;
  let autoplay: ReturnType<typeof setInterval> | undefined;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = `carousel__dot${i === 0 ? " is-active" : ""}`;
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll<HTMLButtonElement>(".carousel__dot");

  function getSlideWidth(): number {
    return viewport.clientWidth;
  }

  function goTo(index: number): void {
    current = (index + total) % total;
    const offset = current * getSlideWidth();
    carouselTrack.style.transform = `translate3d(-${offset}px, 0, 0)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
  }

  function startAutoplay(): void {
    if (autoplay) clearInterval(autoplay);
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  const resizeObserver = new ResizeObserver(() => goTo(current));
  resizeObserver.observe(viewport);

  startAutoplay();

  const carousel = document.getElementById("services-carousel");
  carousel?.addEventListener("mouseenter", () => {
    if (autoplay) clearInterval(autoplay);
  });
  carousel?.addEventListener("mouseleave", startAutoplay);

  goTo(0);
}
