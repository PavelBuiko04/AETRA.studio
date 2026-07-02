import { CONTACT_EMAIL, GOOGLE_SHEETS_WEB_APP_URL } from "./data.js";

interface FormFields {
  name: HTMLInputElement;
  email: HTMLInputElement;
  service: HTMLSelectElement;
  industry: HTMLSelectElement;
  message: HTMLTextAreaElement;
}

function showError(field: string, message: string): void {
  const input = document.getElementById(field);
  const errorEl = document.querySelector(`[data-error="${field}"]`);
  input?.classList.add("is-error");
  input?.closest(".custom-select")?.classList.add("is-error");
  if (errorEl) errorEl.textContent = message;
}

function clearErrors(): void {
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

function setFormStatus(form: HTMLFormElement, message: string, type: "success" | "error" | ""): void {
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  if (!status) return;

  status.textContent = message;
  status.hidden = !message;
  status.classList.toggle("is-success", type === "success");
  status.classList.toggle("is-error", type === "error");
}

function validate(fields: FormFields): boolean {
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

function getFields(): FormFields {
  return {
    name: document.getElementById("name") as HTMLInputElement,
    email: document.getElementById("email") as HTMLInputElement,
    service: document.querySelector<HTMLSelectElement>('#contact-form select[name="service"]')!,
    industry: document.querySelector<HTMLSelectElement>('#contact-form select[name="industry"]')!,
    message: document.getElementById("message") as HTMLTextAreaElement,
  };
}

function getLabels(fields: FormFields): { serviceLabel: string; industryLabel: string } {
  const serviceLabel = fields.service.options[fields.service.selectedIndex].text;
  const industryLabel = fields.industry.value
    ? fields.industry.options[fields.industry.selectedIndex].text
    : "";

  return { serviceLabel, industryLabel };
}

async function submitToGoogleSheets(
  fields: FormFields,
  serviceLabel: string,
  industryLabel: string
): Promise<void> {
  const payload = {
    timestamp: new Date().toISOString(),
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    projectType: serviceLabel,
    industry: industryLabel,
    message: fields.message.value.trim(),
  };

  const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const result = (await response.json()) as { ok?: boolean; error?: string };
  if (!result.ok) {
    throw new Error(result.error || "Unknown error");
  }
}

function submitViaMailto(
  fields: FormFields,
  serviceLabel: string,
  industryLabel: string
): void {
  const subject = encodeURIComponent(`AETRA Studio — ${serviceLabel}`);
  const body = encodeURIComponent(
    `Name: ${fields.name.value}\nEmail: ${fields.email.value}\nProject: ${serviceLabel}${industryLabel ? `\nIndustry: ${industryLabel}` : ""}\n\n${fields.message.value}`
  );

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export function initForm(): void {
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  if (!form) return;

  const submitBtn = form.querySelector<HTMLButtonElement>(".form__submit");
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
      submitBtn.textContent = "Sending…";
    }

    try {
      await submitToGoogleSheets(fields, serviceLabel, industryLabel);
      form.reset();
      document.querySelectorAll(".custom-select").forEach((wrap) => {
        const select = wrap.querySelector<HTMLSelectElement>("select");
        const valueEl = wrap.querySelector<HTMLElement>(".custom-select__value");
        if (!select || !valueEl) return;
        const placeholder = select.options[0]?.text || "";
        valueEl.textContent = placeholder;
        valueEl.classList.add("is-placeholder");
      });
      setFormStatus(form, "Thanks — we received your request and will reply within 24 hours.", "success");
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
