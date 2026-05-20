function setupSubpageMenu() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");

  if (!header || !toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setFooterYear() {
  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function setupFaqs() {
  document.querySelectorAll("[data-faq-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest("[data-faq-item]");
      if (!item) {
        return;
      }

      item.classList.toggle("is-open");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSubpageMenu();
  setFooterYear();
  setupFaqs();
});
