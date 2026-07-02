export function initAboutRead(): void {
  const el = document.querySelector<HTMLElement>("[data-about-read]");
  if (!el) return;

  const source = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
  if (!source) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const words = source.split(" ");
  el.textContent = "";
  el.setAttribute("aria-label", source);

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "about__word";
    span.textContent = word;
    span.style.setProperty("--read-delay", `${index * 0.07}s`);
    el.appendChild(span);

    if (index < words.length - 1) {
      el.appendChild(document.createTextNode(" "));
    }
  });

  const start = (): void => {
    if (el.classList.contains("is-reading")) return;
    el.classList.add("is-reading");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
  );

  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
    start();
    return;
  }

  observer.observe(el);
}
