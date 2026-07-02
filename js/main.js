import { initNav } from "./nav.js";
import { initMarquee } from "./marquee.js";
import { initCarousel } from "./carousel.js";
import { initForm } from "./form.js";
import { initScrollReveal } from "./scroll-reveal.js";
document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initMarquee();
    initCarousel();
    initForm();
    initScrollReveal();
});
