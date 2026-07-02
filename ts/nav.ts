export function initNav(): void {
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("nav");
  const header = document.getElementById("header");
  const links = document.querySelectorAll<HTMLAnchorElement>(".header__link");
  const mobileCta = document.querySelector<HTMLAnchorElement>(".header__cta-mobile");

  if (!menuBtn || !nav || !header) return;

  const setMenuOpen = (isOpen: boolean): void => {
    nav.classList.toggle("is-open", isOpen);
    menuBtn.classList.toggle("is-open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    document.body.classList.toggle("is-menu-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  const closeMenu = (): void => setMenuOpen(false);

  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(!nav.classList.contains("is-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target === nav) closeMenu();
  });

  links.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  mobileCta?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
    if (nav.classList.contains("is-open")) closeMenu();
  });

  const sections = document.querySelectorAll<HTMLElement>("section[id]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -40% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}
