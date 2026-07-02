"use strict";
(() => {
  // ts/nav.ts
  function initNav() {
    const menuBtn = document.getElementById("menu-btn");
    const nav = document.getElementById("nav");
    const header = document.getElementById("header");
    const links = document.querySelectorAll(".header__link");
    const mobileCta = document.querySelector(".header__cta-mobile");
    if (!menuBtn || !nav || !header) return;
    const setMenuOpen = (isOpen) => {
      nav.classList.toggle("is-open", isOpen);
      menuBtn.classList.toggle("is-open", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.classList.toggle("is-menu-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    };
    const closeMenu2 = () => setMenuOpen(false);
    menuBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      setMenuOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", (event) => {
      if (event.target === nav) closeMenu2();
    });
    links.forEach((link) => {
      link.addEventListener("click", closeMenu2);
    });
    mobileCta?.addEventListener("click", closeMenu2);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu2();
      }
    });
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
      if (nav.classList.contains("is-open")) closeMenu2();
    });
    const sections = document.querySelectorAll("section[id]");
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

  // ts/data.ts
  var CONTACT_EMAIL = "hello@aetra.studio";
  var GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxeQdFIGgYRfa11woWxcvUF8iY8zhFkxONcVlaVwaS8wzhBIWlKf6YpB4BjAg5HZOVy/exec";
  var marqueeItems = [
    "Fashion",
    "Hospitality",
    "Beauty",
    "Travel",
    "Retail",
    "Lifestyle"
  ];

  // ts/marquee.ts
  function initMarquee() {
    const track = document.getElementById("marquee-track");
    if (!track) return;
    const content = track.querySelector(".marquee__content");
    if (!content) return;
    const clone = content.cloneNode(true);
    track.appendChild(clone);
    const html = marqueeItems.flatMap((item) => [`<span>${item}</span>`, `<span class="marquee__dot">\u2022</span>`]).join("");
    content.innerHTML = html;
    clone.innerHTML = html;
  }

  // ts/form.ts
  function showError(field, message) {
    const input = document.getElementById(field);
    const errorEl = document.querySelector(`[data-error="${field}"]`);
    input?.classList.add("is-error");
    input?.closest(".custom-select")?.classList.add("is-error");
    if (errorEl) errorEl.textContent = message;
  }
  function clearErrors() {
    document.querySelectorAll(".form__input, .form__select, .form__textarea").forEach((el) => {
      el.classList.remove("is-error");
    });
    document.querySelectorAll(".custom-select").forEach((el) => {
      el.classList.remove("is-error");
    });
    document.querySelectorAll(".form__error").forEach((el) => {
      el.textContent = "";
    });
  }
  function setFormStatus(form, message, type) {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle("is-success", type === "success");
    status.classList.toggle("is-error", type === "error");
  }
  function validate(fields) {
    clearErrors();
    let valid = true;
    if (!fields.name.value.trim()) {
      showError("name", "Please enter your name");
      valid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.value.trim() || !emailPattern.test(fields.email.value)) {
      showError("email", "Please enter a valid email");
      valid = false;
    }
    if (!fields.service.value) {
      showError("service", "Please select a project type");
      valid = false;
    }
    if (!fields.message.value.trim()) {
      showError("message", "Please describe your project");
      valid = false;
    }
    return valid;
  }
  function getFields() {
    return {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      service: document.querySelector('#contact-form select[name="service"]'),
      industry: document.querySelector('#contact-form select[name="industry"]'),
      message: document.getElementById("message")
    };
  }
  function getLabels(fields) {
    const serviceLabel = fields.service.options[fields.service.selectedIndex].text;
    const industryLabel = fields.industry.value ? fields.industry.options[fields.industry.selectedIndex].text : "";
    return { serviceLabel, industryLabel };
  }
  async function submitToGoogleSheets(fields, serviceLabel, industryLabel) {
    const payload = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      projectType: serviceLabel,
      industry: industryLabel,
      message: fields.message.value.trim()
    };
    const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    const result = await response.json();
    if (!result.ok) {
      throw new Error(result.error || "Unknown error");
    }
  }
  function submitViaMailto(fields, serviceLabel, industryLabel) {
    const subject = encodeURIComponent(`AETRA Studio \u2014 ${serviceLabel}`);
    const body = encodeURIComponent(
      `Name: ${fields.name.value}
Email: ${fields.email.value}
Project: ${serviceLabel}${industryLabel ? `
Industry: ${industryLabel}` : ""}

${fields.message.value}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }
  function initForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const submitBtn = form.querySelector(".form__submit");
    const defaultBtnText = submitBtn?.textContent || "Send Request";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = getFields();
      if (!validate(fields)) return;
      const { serviceLabel, industryLabel } = getLabels(fields);
      setFormStatus(form, "", "");
      if (!GOOGLE_SHEETS_WEB_APP_URL) {
        submitViaMailto(fields, serviceLabel, industryLabel);
        return;
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending\u2026";
      }
      try {
        await submitToGoogleSheets(fields, serviceLabel, industryLabel);
        form.reset();
        document.querySelectorAll(".custom-select").forEach((wrap) => {
          const select = wrap.querySelector("select");
          const valueEl = wrap.querySelector(".custom-select__value");
          if (!select || !valueEl) return;
          const placeholder = select.options[0]?.text || "";
          valueEl.textContent = placeholder;
          valueEl.classList.add("is-placeholder");
        });
        setFormStatus(form, "Thanks \u2014 we received your request and will reply within 24 hours.", "success");
      } catch {
        setFormStatus(
          form,
          "Something went wrong. Please try again or email us at hello@aetra.studio.",
          "error"
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnText;
        }
      }
    });
  }

  // ts/custom-select.ts
  function getSelectedLabel(select) {
    const option = select.options[select.selectedIndex];
    return option?.text || select.options[0]?.text || "";
  }
  function buildMenu(select, menu, trigger) {
    menu.innerHTML = "";
    Array.from(select.children).forEach((child) => {
      if (child instanceof HTMLOptGroupElement) {
        const group = document.createElement("div");
        group.className = "custom-select__group";
        const label = document.createElement("p");
        label.className = "custom-select__group-label";
        label.textContent = child.label;
        group.appendChild(label);
        Array.from(child.querySelectorAll("option")).forEach((option) => {
          if (!option.value) return;
          group.appendChild(createOptionButton(select, option, menu, trigger));
        });
        menu.appendChild(group);
        return;
      }
      if (child instanceof HTMLOptionElement) {
        if (!child.value) return;
        menu.appendChild(createOptionButton(select, child, menu, trigger));
      }
    });
  }
  function createOptionButton(select, option, menu, trigger) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "custom-select__option";
    button.textContent = option.text;
    button.dataset.value = option.value;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(select.value === option.value));
    if (!option.value) {
      button.classList.add("custom-select__option--placeholder");
    }
    button.addEventListener("click", () => {
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      closeMenu(menu, trigger);
      syncTrigger(select, trigger, menu);
    });
    return button;
  }
  function syncTrigger(select, trigger, menu) {
    const valueEl = trigger.querySelector(".custom-select__value");
    if (!valueEl) return;
    valueEl.textContent = getSelectedLabel(select);
    valueEl.classList.toggle("is-placeholder", !select.value);
    menu.querySelectorAll(".custom-select__option").forEach((optionBtn) => {
      const isSelected = optionBtn.dataset.value === select.value;
      optionBtn.classList.toggle("is-selected", isSelected);
      optionBtn.setAttribute("aria-selected", String(isSelected));
    });
  }
  function openMenu(menu, trigger) {
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    trigger.closest(".custom-select")?.classList.add("is-open");
  }
  function closeMenu(menu, trigger) {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.closest(".custom-select")?.classList.remove("is-open");
  }
  function closeAllMenus() {
    document.querySelectorAll(".custom-select.is-open").forEach((wrap) => {
      const menu = wrap.querySelector(".custom-select__menu");
      const trigger = wrap.querySelector(".custom-select__trigger");
      if (menu && trigger) closeMenu(menu, trigger);
    });
  }
  function buildTrigger(select) {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "custom-select__trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    const valueEl = document.createElement("span");
    valueEl.className = `custom-select__value${select.value ? "" : " is-placeholder"}`;
    valueEl.textContent = getSelectedLabel(select);
    const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevron.setAttribute("class", "custom-select__chevron");
    chevron.setAttribute("viewBox", "0 0 24 24");
    chevron.setAttribute("fill", "none");
    chevron.setAttribute("stroke", "currentColor");
    chevron.setAttribute("stroke-width", "2");
    chevron.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M6 9l6 6 6-6");
    chevron.appendChild(path);
    trigger.append(valueEl, chevron);
    return trigger;
  }
  function enhanceSelect(select) {
    const existingWrap = select.closest(".custom-select");
    const existingTrigger = existingWrap?.querySelector(".custom-select__trigger");
    if (select.dataset.customized === "true" && existingTrigger) return;
    if (existingWrap && !existingTrigger) {
      const parent2 = existingWrap.parentNode;
      if (parent2) {
        parent2.insertBefore(select, existingWrap);
        existingWrap.remove();
      }
      select.classList.remove("custom-select__native");
      select.removeAttribute("aria-hidden");
      select.tabIndex = 0;
      delete select.dataset.customized;
    }
    const wrap = document.createElement("div");
    wrap.className = "custom-select";
    const parent = select.parentNode;
    if (!parent) return;
    parent.insertBefore(wrap, select);
    select.classList.add("custom-select__native");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");
    wrap.appendChild(select);
    const trigger = buildTrigger(select);
    const selectId = select.id;
    if (selectId) {
      trigger.id = selectId;
      select.removeAttribute("id");
    }
    const menu = document.createElement("div");
    menu.className = "custom-select__menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    buildMenu(select, menu, trigger);
    menu.addEventListener("click", (event) => event.stopPropagation());
    wrap.append(trigger, menu);
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = wrap.classList.contains("is-open");
      closeAllMenus();
      if (!isOpen) openMenu(menu, trigger);
    });
    select.addEventListener("change", () => syncTrigger(select, trigger, menu));
    select.dataset.customized = "true";
  }
  function initCustomSelects() {
    const selects = Array.from(document.querySelectorAll(".form__select"));
    selects.forEach((select) => {
      try {
        enhanceSelect(select);
      } catch (error) {
        console.error("[AETRA] custom select failed:", select.id || select.name, error);
      }
    });
    document.addEventListener("click", closeAllMenus);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAllMenus();
    });
  }

  // ts/scroll-reveal.ts
  var revealObserver = null;
  function getRevealObserver(show) {
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
  function revealVisibleElements() {
    const elements = document.querySelectorAll(".reveal");
    const show = (el) => {
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
  function initScrollReveal() {
    revealVisibleElements();
    requestAnimationFrame(revealVisibleElements);
    window.addEventListener("load", revealVisibleElements, { once: true });
  }

  // ts/about-read.ts
  function initAboutRead() {
    const el = document.querySelector("[data-about-read]");
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
    const start = () => {
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

  // ts/campaign-layout.ts
  function initCampaignLayout() {
    const rows = document.querySelectorAll(".campaign-group__grid");
    if (rows.length === 0) return;
    const fit = () => {
      const isScroll = window.matchMedia("(max-width: 971px)").matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const minHeight = isMobile ? 200 : 220;
      const maxHeight = isMobile ? 300 : Infinity;
      rows.forEach((row) => {
        const cards = row.querySelectorAll(".campaign-card");
        cards.forEach((card) => {
          const w = card.dataset.w;
          const h = card.dataset.h;
          if (w && h) {
            card.style.setProperty("--card-w", w);
            card.style.setProperty("--card-h", h);
          }
        });
      });
      if (isScroll) {
        const scrollHeight = isMobile ? Math.min(300, Math.max(220, window.innerWidth * 0.52)) : Math.min(340, Math.max(260, window.innerWidth * 0.36));
        rows.forEach((row) => {
          row.style.setProperty("--row-height", `${scrollHeight}px`);
        });
        return;
      }
      const metrics = [];
      rows.forEach((row) => {
        const cards = row.querySelectorAll(".campaign-card");
        if (cards.length === 0) return;
        const styles = getComputedStyle(row);
        const gap = parseFloat(styles.columnGap || styles.gap) || 16;
        const available = row.clientWidth;
        let ratioSum = 0;
        cards.forEach((card) => {
          const w = Number(card.dataset.w);
          const h = Number(card.dataset.h);
          if (w > 0 && h > 0) ratioSum += w / h;
        });
        if (ratioSum === 0 || available <= 0) return;
        const gaps = gap * Math.max(0, cards.length - 1);
        const idealHeight = (available - gaps) / ratioSum;
        metrics.push({ row, height: idealHeight });
      });
      const unifiedHeight = metrics.length > 0 ? Math.min(...metrics.map((m) => m.height)) : minHeight;
      const height = Math.min(maxHeight, Math.max(minHeight, unifiedHeight));
      metrics.forEach(({ row }) => {
        row.style.setProperty("--row-height", `${height}px`);
      });
    };
    fit();
    const observer = new ResizeObserver(fit);
    rows.forEach((row) => observer.observe(row));
    window.addEventListener("resize", fit, { passive: true });
    window.addEventListener("load", fit, { passive: true });
  }

  // ts/video.ts
  function initVideos() {
    const heroVideo = document.querySelector(".hero__video");
    if (heroVideo) {
      heroVideo.muted = true;
      heroVideo.playsInline = true;
      heroVideo.play().catch(() => {
      });
    }
    const videos = document.querySelectorAll(
      ".work__media--video, .campaign-card__media--video"
    );
    if (videos.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );
    videos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      observer.observe(video);
    });
  }

  // ts/main.ts
  function runInit(name, fn) {
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
})();
