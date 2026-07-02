let revealObserver: IntersectionObserver | null = null;

function getRevealObserver(show: (el: Element) => void): IntersectionObserver {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
  }

  return revealObserver;
}

function revealVisibleElements(): void {
  const elements = document.querySelectorAll<HTMLElement>(".reveal");

  const show = (el: Element): void => {
    el.classList.add("is-visible");
  };

  const observer = getRevealObserver(show);

  elements.forEach((el) => {
    if (el.classList.contains("is-visible")) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show(el);
      return;
    }

    observer.observe(el);
  });
}

export function initScrollReveal(): void {
  revealVisibleElements();
  requestAnimationFrame(revealVisibleElements);
  window.addEventListener("load", revealVisibleElements, { once: true });
}
