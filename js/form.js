import { CONTACT_EMAIL } from "./data.js";
function showError(field, message) {
    const input = document.getElementById(field);
    const errorEl = document.querySelector(`[data-error="${field}"]`);
    input?.classList.add("is-error");
    if (errorEl)
        errorEl.textContent = message;
}
function clearErrors() {
    document.querySelectorAll(".form__input, .form__select, .form__textarea").forEach((el) => {
        el.classList.remove("is-error");
    });
    document.querySelectorAll(".form__error").forEach((el) => {
        el.textContent = "";
    });
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
        showError("service", "Please select a service");
        valid = false;
    }
    if (!fields.message.value.trim()) {
        showError("message", "Please describe your project");
        valid = false;
    }
    return valid;
}
export function initForm() {
    const form = document.getElementById("contact-form");
    if (!form)
        return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fields = {
            name: document.getElementById("name"),
            email: document.getElementById("email"),
            service: document.getElementById("service"),
            message: document.getElementById("message"),
        };
        if (!validate(fields))
            return;
        const serviceLabel = fields.service.options[fields.service.selectedIndex].text;
        const subject = encodeURIComponent(`AETRA Studio — ${serviceLabel}`);
        const body = encodeURIComponent(`Name: ${fields.name.value}\nEmail: ${fields.email.value}\nService: ${serviceLabel}\n\n${fields.message.value}`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
}
