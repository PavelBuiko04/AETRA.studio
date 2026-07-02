import { marqueeItems } from "./data.js";

export function initMarquee(): void {
  const track = document.getElementById("marquee-track");
  if (!track) return;

  const content = track.querySelector(".marquee__content");
  if (!content) return;

  const clone = content.cloneNode(true) as HTMLElement;
  track.appendChild(clone);

  const html = marqueeItems
    .flatMap((item) => [`<span>${item}</span>`, `<span class="marquee__dot">•</span>`])
    .join("");

  content.innerHTML = html;
  clone.innerHTML = html;
}
