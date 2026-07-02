import { initNav } from "./nav.js";
import { initMarquee } from "./marquee.js";
import { initForm } from "./form.js";
import { initCustomSelects } from "./custom-select.js";
import { initScrollReveal } from "./scroll-reveal.js";
import { initAboutRead } from "./about-read.js";

import { initCampaignLayout } from "./campaign-layout.js";
import { initVideos } from "./video.js";

function runInit(name: string, fn: () => void): void {
  try {
    fn();
  } catch (error) {
    console.error(`[AETRA] ${name} failed:`, error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  runInit("nav", initNav);
  runInit("marquee", initMarquee);
  runInit("form", initForm);
  runInit("scrollReveal", initScrollReveal);
  runInit("customSelects", initCustomSelects);
  runInit("aboutRead", initAboutRead);
  runInit("campaignLayout", initCampaignLayout);
  runInit("videos", initVideos);
});
