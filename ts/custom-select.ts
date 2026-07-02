function getSelectedLabel(select: HTMLSelectElement): string {
  const option = select.options[select.selectedIndex];
  return option?.text || select.options[0]?.text || "";
}

function buildMenu(select: HTMLSelectElement, menu: HTMLElement, trigger: HTMLButtonElement): void {
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

function createOptionButton(
  select: HTMLSelectElement,
  option: HTMLOptionElement,
  menu: HTMLElement,
  trigger: HTMLButtonElement
): HTMLButtonElement {
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

function syncTrigger(select: HTMLSelectElement, trigger: HTMLButtonElement, menu: HTMLElement): void {
  const valueEl = trigger.querySelector<HTMLElement>(".custom-select__value");
  if (!valueEl) return;

  valueEl.textContent = getSelectedLabel(select);
  valueEl.classList.toggle("is-placeholder", !select.value);

  menu.querySelectorAll<HTMLButtonElement>(".custom-select__option").forEach((optionBtn) => {
    const isSelected = optionBtn.dataset.value === select.value;
    optionBtn.classList.toggle("is-selected", isSelected);
    optionBtn.setAttribute("aria-selected", String(isSelected));
  });
}

function openMenu(menu: HTMLElement, trigger: HTMLButtonElement): void {
  menu.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  trigger.closest(".custom-select")?.classList.add("is-open");
}

function closeMenu(menu: HTMLElement, trigger: HTMLButtonElement): void {
  menu.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
  trigger.closest(".custom-select")?.classList.remove("is-open");
}

function closeAllMenus(): void {
  document.querySelectorAll<HTMLElement>(".custom-select.is-open").forEach((wrap) => {
    const menu = wrap.querySelector<HTMLElement>(".custom-select__menu");
    const trigger = wrap.querySelector<HTMLButtonElement>(".custom-select__trigger");
    if (menu && trigger) closeMenu(menu, trigger);
  });
}

function buildTrigger(select: HTMLSelectElement): HTMLButtonElement {
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

function enhanceSelect(select: HTMLSelectElement): void {
  const existingWrap = select.closest(".custom-select");
  const existingTrigger = existingWrap?.querySelector(".custom-select__trigger");

  if (select.dataset.customized === "true" && existingTrigger) return;

  if (existingWrap && !existingTrigger) {
    const parent = existingWrap.parentNode;
    if (parent) {
      parent.insertBefore(select, existingWrap);
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

export function initCustomSelects(): void {
  const selects = Array.from(document.querySelectorAll<HTMLSelectElement>(".form__select"));
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
