export function initNav() {
    const menuBtn = document.getElementById("menu-btn");
    const nav = document.getElementById("nav");
    const header = document.getElementById("header");
    const links = document.querySelectorAll(".header__link");
    if (!menuBtn || !nav || !header)
        return;
    menuBtn.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        menuBtn.classList.toggle("is-open", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
    });
    links.forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            menuBtn.classList.remove("is-open");
            menuBtn.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
        });
    });
    window.addEventListener("scroll", () => {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
    });
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach((link) => {
                    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }, { rootMargin: "-40% 0px -40% 0px" });
    sections.forEach((section) => observer.observe(section));
}
