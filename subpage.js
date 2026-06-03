function syncViewportScale() {
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const scale = viewportWidth <= 800 ? 1 : Math.min(1.875, viewportWidth / 1024);
  document.documentElement.style.setProperty("--page-scale", scale.toFixed(4));
}

const cardPictureSizes = "(max-width: 800px) calc(100vw - 24px), (max-width: 1366px) calc(50vw - 28px), calc(25vw - 28px)";
const supportPictureSizes = "(max-width: 1100px) calc(100vw - 36px), 320px";
const hubPictureSizes = "(max-width: 1100px) calc(100vw - 36px), 220px";

function buildResponsivePicture(basePath, alt, sizes, widths = [480, 768, 1200]) {
  const webpSet = widths.map((width) => `${basePath}-${width}w.webp ${width}w`).join(", ");
  const jpgSet = widths.map((width) => `${basePath}-${width}w.jpg ${width}w`).join(", ");
  const fallbackWidth = widths[Math.min(1, widths.length - 1)];

  return `
    <picture>
      <source type="image/webp" srcset="${webpSet}" sizes="${sizes}">
      <img
        src="${basePath}-${fallbackWidth}w.jpg"
        srcset="${jpgSet}"
        sizes="${sizes}"
        alt="${alt}"
        loading="lazy"
        decoding="async"
      >
    </picture>
  `;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") {
    element.textContent = value;
  }
}

function setHTML(selector, value) {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") {
    element.innerHTML = value;
  }
}

function setLink(selector, label, href) {
  const element = document.querySelector(selector);
  if (!element) {
    return;
  }

  if (typeof label === "string") {
    element.textContent = label;
  }

  if (typeof href === "string") {
    element.href = href;
  }
}

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

async function loadSubpageContent(page) {
  try {
    const response = await fetch(`content/${page}.json`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unexpected response: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Unable to load content for ${page}.`, error);
    return null;
  }
}

function renderFeatureList(containerSelector, features) {
  const container = document.querySelector(containerSelector);
  if (!container || !Array.isArray(features)) {
    return;
  }

  container.innerHTML = features.map((feature) => `
    <div class="hero-feature">
      <span class="round-icon">${feature.icon}</span>
      <div>
        <strong>${feature.title}</strong>
        <span>${feature.text}</span>
      </div>
    </div>
  `).join("");
}

function renderFaqGrid(containerSelector, items) {
  const container = document.querySelector(containerSelector);
  if (!container || !Array.isArray(items)) {
    return;
  }

  container.innerHTML = items.map((item) => `
    <article class="faq-item ${item.open ? "is-open" : ""}" data-faq-item>
      <button type="button" data-faq-trigger>${item.question}</button>
      <div class="faq-answer" data-faq-panel><p>${item.answer}</p></div>
    </article>
  `).join("");
}

function renderProductsPage(content) {
  setText("#products-hero-eyebrow", content.hero?.eyebrow);
  setText("#products-hero-title", content.hero?.title);
  setText("#products-hero-description", content.hero?.description);
  renderFeatureList("#products-hero-features", content.hero?.features);

  const stack = document.querySelector("#products-catalog-stack");
  if (stack && Array.isArray(content.products)) {
    stack.innerHTML = content.products.map((product) => `
      <article class="catalog-card" id="${product.id}">
        <div class="catalog-top">
          <div class="catalog-copy">
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}
            <h2>${product.title}</h2>
            ${product.modelLine ? `<p class="catalog-model-line">${product.modelLine}</p>` : ""}
            <p class="catalog-description">${product.description}</p>
            <div class="catalog-actions">
              <a class="btn btn-primary" href="${product.primaryHref}">${product.primaryLabel}</a>
              <a class="catalog-secondary-link" href="${product.secondaryHref}">${product.secondaryLabel}</a>
            </div>
          </div>
          <div class="${product.mediaClass}">
            <img src="${product.image}" alt="${product.alt}" loading="lazy" decoding="async">
            ${product.bubble ? `<div class="catalog-bubble"><span>${product.bubble.label}</span><strong>${product.bubble.value}</strong></div>` : ""}
            ${Array.isArray(product.labels) ? product.labels.map((label) => `<span class="${label.className}">${label.text}</span>`).join("") : ""}
          </div>
        </div>
        <div class="catalog-apps">
          <p>Ideal Applications</p>
          <div class="catalog-tags">
            ${product.applications.map((application) => `<span>${application}</span>`).join("")}
          </div>
        </div>
        <div class="catalog-table-wrap">
          <table class="catalog-table">
            <thead>
              <tr>${product.table.columns.map((column) => `<th>${column}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${product.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="catalog-benefits">
          ${product.benefits.map((benefit) => `
            <div class="catalog-benefit">
              <span class="round-icon">${benefit.index}</span>
              <div>
                <strong>${benefit.title}</strong>
                <p>${benefit.text}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </article>
    `).join("");
  }

  setText("#products-cta-title", content.cta?.title);
  setText("#products-cta-description", content.cta?.description);
  setLink("#products-cta-button", content.cta?.buttonLabel, content.cta?.buttonHref);
}

function renderSolutionsPage(content) {
  setText("#solutions-hero-eyebrow", content.hero?.eyebrow);
  setText("#solutions-hero-title", content.hero?.title);
  setText("#solutions-hero-description", content.hero?.description);
  renderFeatureList("#solutions-hero-features", content.hero?.features);
  setLink("#solutions-hero-primary-cta", content.hero?.primaryCta?.label, content.hero?.primaryCta?.href);
  setLink("#solutions-hero-secondary-cta", content.hero?.secondaryCta?.label, content.hero?.secondaryCta?.href);

  const links = document.querySelector("#solutions-link-grid");
  if (links && content.applicationLinks) {
    links.innerHTML = `
      <article class="solution-link-intro">
        <h2>${content.applicationLinks.title}</h2>
        <p>${content.applicationLinks.description}</p>
      </article>
      ${content.applicationLinks.cards.map((card) => `
        <a class="solution-link-card" href="#${card.id}" id="${card.id}">
          <span class="solution-link-icon">${card.icon}</span>
          <strong>${card.title}</strong>
          <p>${card.text}</p>
        </a>
      `).join("")}
    `;
  }

  const systemGrid = document.querySelector("#solutions-system-grid");
  if (systemGrid && content.system) {
    systemGrid.innerHTML = `
      <article class="system-intro">
        <p class="eyebrow">${content.system.eyebrow}</p>
        <h2>${content.system.title}</h2>
        <p>${content.system.description}</p>
        <a class="plain-link" href="${content.system.linkHref}">${content.system.linkLabel}</a>
      </article>
      <div class="system-cards">
        ${content.system.cards.map((card, index) => `
          ${index > 0 ? `<span class="system-plus">+</span>` : ""}
          <article class="system-card">
            <img src="${card.image}" alt="${card.alt}" loading="lazy" decoding="async">
            <div>
              <p class="system-card-title">${card.title}</p>
              <strong>${card.heading}</strong>
              <span>${card.text}</span>
            </div>
          </article>
        `).join("")}
      </div>
      <p class="system-summary">${content.system.summary}</p>
    `;
  }

  const comparePanel = document.querySelector("#solutions-compare-panel");
  if (comparePanel && content.compare) {
    comparePanel.innerHTML = `
      <div class="compare-challenges">
        <p class="eyebrow">${content.compare.eyebrow}</p>
        <h2>${content.compare.title}</h2>
        <ul>
          ${content.compare.challenges.map((challenge) => `
            <li>
              <strong>${challenge.title}</strong>
              <span>${challenge.text}</span>
            </li>
          `).join("")}
        </ul>
      </div>
      <div class="compare-visuals compare-visuals--single">
        <img class="compare-composite-image" src="assets/site-images/solutions-comparison-panel.png" alt="Lighting comparison with and without the InnovoGrow system">
        <article class="compare-card compare-card--negative">
          <span class="compare-chip">${content.compare.negativeChip}</span>
          <div class="compare-stage compare-stage--weak">
            <img class="compare-fixture compare-fixture--weak" src="assets/site-images/products-fixture-tl-300-d1.png" alt="Top lighting only fixture">
            <div class="compare-canopy">
              ${buildResponsivePicture("assets/site-images/solutions-usecase-high-density-flowering-crops", "Lighting without a system", supportPictureSizes)}
            </div>
            <div class="compare-floor"></div>
            <span class="compare-callout compare-callout--left compare-callout--top">Hot spots<br>and shadows</span>
            <span class="compare-callout compare-callout--left compare-callout--mid">Lower canopy<br>left behind</span>
            <span class="compare-callout compare-callout--left compare-callout--bottom">Wasted light<br>and energy</span>
          </div>
        </article>
        <article class="compare-card compare-card--positive">
          <span class="compare-chip compare-chip--green">${content.compare.positiveChip}</span>
          <div class="compare-stage compare-stage--strong">
            <img class="compare-fixture compare-fixture--strong" src="assets/site-images/products-fixture-uc-series.png" alt="InnovoGrow system fixture">
            <div class="compare-canopy">
              ${buildResponsivePicture("assets/site-images/solutions-usecase-indoor-grow-rooms", "Lighting with the InnovoGrow system", supportPictureSizes)}
            </div>
            <div class="compare-floor"></div>
            <span class="compare-callout compare-callout--right compare-callout--top">Uniform light<br>across canopy</span>
            <span class="compare-callout compare-callout--right compare-callout--mid">Lower growth<br>fully optimized</span>
            <span class="compare-callout compare-callout--right compare-callout--bottom">Higher yield<br>&amp; efficiency</span>
          </div>
        </article>
      </div>
      <div class="compare-advantage">
        <h2>${content.compare.advantageTitle}</h2>
        <ul>
          ${content.compare.advantages.map((advantage) => `
            <li>
              <strong>${advantage.title}</strong>
              <span>${advantage.text}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    `;
  }

  setText("#solutions-use-cases-title", content.useCases?.title);
  setText("#solutions-use-cases-description", content.useCases?.description);
  setLink("#solutions-use-cases-link", content.useCases?.linkLabel, content.useCases?.linkHref);
  const useCaseGrid = document.querySelector("#solutions-use-case-grid");
  if (useCaseGrid && Array.isArray(content.useCases?.cards)) {
    useCaseGrid.innerHTML = content.useCases.cards.map((card) => `
      <article class="use-case-card">
        ${buildResponsivePicture(card.imageBase, card.title, cardPictureSizes)}
        <div class="use-case-copy">
          <strong>${card.title}</strong>
          <p>${card.text}</p>
          <a href="${card.href}">View Solution</a>
        </div>
      </article>
    `).join("");
  }

  setText("#solutions-packages-title", content.packages?.title);
  setText("#solutions-packages-description", content.packages?.description);
  const packageGrid = document.querySelector("#solutions-package-grid");
  if (packageGrid && Array.isArray(content.packages?.cards)) {
    packageGrid.innerHTML = content.packages.cards.map((card) => `
      <article class="package-card ${card.wide ? "package-card--wide" : ""}">
        <p class="eyebrow">${card.eyebrow}</p>
        <h3>${card.title}</h3>
        <p>${card.description}</p>
        <div class="package-includes">
          <strong>Includes:</strong>
          ${card.includes.map((item) => `<span>${item}</span>`).join("")}
        </div>
        <img src="${card.image}" alt="${card.alt}" loading="lazy" decoding="async">
        <div class="package-benefits">
          ${card.benefits.map((benefit) => `<span>${benefit}</span>`).join("")}
        </div>
        <a href="${card.href}">View Details</a>
      </article>
    `).join("");
  }

  setText("#solutions-process-title", content.process?.title);
  setText("#solutions-process-description", content.process?.description);
  const processGrid = document.querySelector("#solutions-process-grid");
  if (processGrid && Array.isArray(content.process?.steps)) {
    processGrid.innerHTML = content.process.steps.map((step) => `
      <article class="process-card">
        <span class="process-icon">${step.number}</span>
        <strong>${step.title}</strong>
        <p>${step.text}</p>
      </article>
    `).join("");
  }

  setText("#solutions-cta-title", content.cta?.title);
  setText("#solutions-cta-description", content.cta?.description);
  setLink("#solutions-cta-button", content.cta?.buttonLabel, content.cta?.buttonHref);
  setText("#solutions-cta-status", content.cta?.status);
}

function renderResourcesPage(content) {
  setText("#resources-hero-eyebrow", content.hero?.eyebrow);
  setText("#resources-hero-title", content.hero?.title);
  setText("#resources-hero-description", content.hero?.description);
  setLink("#resources-hero-primary-cta", content.hero?.primaryCta?.label, content.hero?.primaryCta?.href);
  setLink("#resources-hero-secondary-cta", content.hero?.secondaryCta?.label, content.hero?.secondaryCta?.href);

  const features = document.querySelector("#resources-feature-grid");
  if (features && Array.isArray(content.features)) {
    features.innerHTML = content.features.map((item) => `
      <article><strong>${item.title}</strong><span>${item.text}</span></article>
    `).join("");
  }

  setText("#resources-library-eyebrow", content.library?.eyebrow);
  setText("#resources-library-title", content.library?.title);
  setText("#resources-library-description", content.library?.description);
  const tabs = document.querySelector("#resources-tabs");
  if (tabs && Array.isArray(content.library?.tabs)) {
    tabs.innerHTML = content.library.tabs.map((tab, index) => `
      <span class="${index === 0 ? "is-active" : ""}">${tab}</span>
    `).join("");
  }
  const cards = document.querySelector("#resources-card-grid");
  if (cards && Array.isArray(content.library?.cards)) {
    cards.innerHTML = content.library.cards.map((card) => `
      <article class="resource-card">
        <span class="resource-badge">${card.badge}</span>
        ${card.graphic ? `<div class="resource-graphic" aria-hidden="true"></div>` : `<img src="${card.image}" alt="${card.title}" loading="lazy" decoding="async">`}
        <strong>${card.title}</strong>
        <p>${card.description}</p>
        <a href="${card.href}">${card.linkLabel}</a>
      </article>
    `).join("");
  }
  setLink("#resources-library-button", content.library?.buttonLabel, content.library?.buttonHref);

  setText("#resources-cases-eyebrow", content.cases?.eyebrow);
  setText("#resources-cases-title", content.cases?.title);
  setLink("#resources-cases-link", content.cases?.linkLabel, content.cases?.linkHref);
  const caseGrid = document.querySelector("#resources-case-grid");
  if (caseGrid && Array.isArray(content.cases?.cards)) {
    caseGrid.innerHTML = content.cases.cards.map((card) => `
      <article class="case-card">
        ${buildResponsivePicture(card.imageBase, `${card.title} case study`, cardPictureSizes)}
        <p class="case-kicker">${card.kicker}</p>
        <strong>${card.title}</strong>
        <p>${card.description}</p>
        <a href="${card.href}">Read Case Study</a>
      </article>
    `).join("");
  }

  setText("#resources-faq-eyebrow", content.faq?.eyebrow);
  setText("#resources-faq-title", content.faq?.title);
  setText("#resources-faq-description", content.faq?.description);
  setLink("#resources-faq-link", content.faq?.linkLabel, content.faq?.linkHref);
  renderFaqGrid("#resources-faq-grid", content.faq?.items);

  setText("#resources-hub-eyebrow", content.hub?.eyebrow);
  setText("#resources-hub-title", content.hub?.title);
  setText("#resources-hub-description", content.hub?.description);
  setLink("#resources-hub-button", content.hub?.buttonLabel, content.hub?.buttonHref);
  setText("#resources-subscribe-title", content.hub?.subscribeTitle);
  setText("#resources-subscribe-description", content.hub?.subscribeDescription);
  setText("#resources-subscribe-note", content.hub?.subscribeNote);
}

function renderAboutPage(content) {
  setText("#about-hero-eyebrow", content.hero?.eyebrow);
  setText("#about-hero-title", content.hero?.title);
  setText("#about-hero-lead", content.hero?.lead);
  setText("#about-hero-description", content.hero?.description);
  renderFeatureList("#about-hero-features", content.hero?.features);

  setText("#about-story-eyebrow", content.story?.eyebrow);
  setText("#about-story-title", content.story?.title);
  if (Array.isArray(content.story?.paragraphs)) {
    setText("#about-story-paragraph-1", content.story.paragraphs[0]);
    setText("#about-story-paragraph-2", content.story.paragraphs[1]);
  }
  setLink("#about-story-button", content.story?.buttonLabel, content.story?.buttonHref);
  const storySide = document.querySelector("#about-story-side");
  if (storySide && Array.isArray(content.story?.sideCards)) {
    storySide.innerHTML = content.story.sideCards.map((card) => `
      <article class="story-side-card">
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      </article>
    `).join("");
  }

  const journeyGrid = document.querySelector("#about-journey-grid");
  if (journeyGrid && content.journey) {
    journeyGrid.innerHTML = `
      <article class="journey-intro">
        <p class="eyebrow">${content.journey.eyebrow}</p>
        <h2>${content.journey.title}</h2>
      </article>
      ${content.journey.items.map((item) => `<article class="journey-item"><strong>${item.year}</strong><span>${item.text}</span></article>`).join("")}
    `;
  }

  setText("#about-values-eyebrow", content.values?.eyebrow);
  setText("#about-values-title", content.values?.title);
  const valuesGrid = document.querySelector("#about-values-grid");
  if (valuesGrid && Array.isArray(content.values?.items)) {
    valuesGrid.innerHTML = content.values.items.map((item) => `
      <article class="value-card">
        <img class="value-card__icon" src="${item.icon}" alt="${item.title} icon" loading="lazy" decoding="async">
        <strong>${item.title}</strong>
        <p>${item.text}</p>
      </article>
    `).join("");
  }

  setText("#about-proof-eyebrow", content.proof?.eyebrow);
  setText("#about-proof-title", content.proof?.title);
  const proofMetrics = document.querySelector("#about-proof-metrics");
  if (proofMetrics && Array.isArray(content.proof?.metrics)) {
    proofMetrics.innerHTML = content.proof.metrics.map((item) => `
      <article class="proof-metric">
        <img class="proof-metric__icon" src="${item.icon}" alt="${item.title} icon" loading="lazy" decoding="async">
        <strong>${item.title}</strong>
        <span>${item.text}</span>
      </article>
    `).join("");
  }
  const proofStats = document.querySelector("#about-proof-stats");
  if (proofStats && Array.isArray(content.proof?.stats)) {
    proofStats.innerHTML = content.proof.stats.map((stat) => `
      <article><strong>${stat.value}</strong><span>${stat.text}</span></article>
    `).join("");
  }

  setText("#about-team-eyebrow", content.team?.eyebrow);
  setText("#about-team-title", content.team?.title);
  const teamCards = document.querySelector("#about-team-cards");
  if (teamCards && Array.isArray(content.team?.members)) {
    teamCards.innerHTML = content.team.members.map((member) => `
      <article class="team-card"><span class="${member.avatarClass}"></span><strong>${member.name}</strong><p>${member.role}</p></article>
    `).join("");
  }
  setText("#about-team-side-title", content.team?.sideTitle);
  setText("#about-team-side-description", content.team?.sideDescription);
  setLink("#about-team-side-button", content.team?.sideButtonLabel, content.team?.sideButtonHref);

  setText("#about-craft-eyebrow", content.craft?.eyebrow);
  setText("#about-craft-title", content.craft?.title);
  setText("#about-craft-description", content.craft?.description);
  setLink("#about-craft-button", content.craft?.buttonLabel, content.craft?.buttonHref);
  const craftCards = document.querySelector("#about-craft-cards");
  if (craftCards && Array.isArray(content.craft?.cards)) {
    craftCards.innerHTML = content.craft.cards.map((card) => `
      <article class="craft-card">
        <div class="${card.mediaClass}" aria-hidden="true"></div>
        <strong>${card.title}</strong>
        <p>${card.text}</p>
      </article>
    `).join("");
  }

  setText("#about-support-eyebrow", content.support?.eyebrow);
  setText("#about-support-title", content.support?.title);
  setText("#about-support-description", content.support?.description);
  const supportList = document.querySelector("#about-support-list");
  if (supportList && Array.isArray(content.support?.items)) {
    supportList.innerHTML = content.support.items.map((item) => `
      <article>
        <img class="support-list__icon" src="${item.icon}" alt="${item.title} icon" loading="lazy" decoding="async">
        <strong>${item.title}</strong>
        <span>${item.text}</span>
      </article>
    `).join("");
  }

  setText("#about-cta-title", content.cta?.title);
  setText("#about-cta-description", content.cta?.description);
  setLink("#about-cta-button", content.cta?.buttonLabel, content.cta?.buttonHref);
}

function renderContactPage(content) {
  setText("#contact-hero-eyebrow", content.hero?.eyebrow);
  setText("#contact-hero-title", content.hero?.title);
  setText("#contact-hero-description", content.hero?.description);
  renderFeatureList("#contact-hero-features", content.hero?.features);

  setText("#contact-form-title", content.form?.title);
  setText("#contact-form-description", content.form?.description);
  const sideCards = document.querySelector("#contact-side-cards");
  if (sideCards && Array.isArray(content.sideCards)) {
    sideCards.innerHTML = content.sideCards.map((card) => `
      <article class="contact-info-card">
        <h3>${card.title}</h3>
        ${card.strong ? `<strong>${card.strong}</strong>` : ""}
        ${card.text ? `<p>${card.text}</p>` : ""}
        ${card.note ? `<span>${card.note}</span>` : ""}
        ${card.link ? `<a href="${card.link.href}">${card.link.label}</a>` : ""}
      </article>
    `).join("");
  }

  setText("#contact-process-title", content.process?.title);
  setText("#contact-process-description", content.process?.description);
  const processSteps = document.querySelector("#contact-process-steps");
  if (processSteps && Array.isArray(content.process?.steps)) {
    processSteps.innerHTML = content.process.steps.map((step) => `
      <article><strong>${step.number}</strong><span>${step.title}</span><p>${step.text}</p></article>
    `).join("");
  }
  setLink("#contact-process-button", content.process?.buttonLabel, content.process?.buttonHref);
  setText("#contact-process-note", content.process?.note);

  setText("#contact-faq-eyebrow", content.faq?.eyebrow);
  setText("#contact-faq-title", content.faq?.title);
  setLink("#contact-faq-link", content.faq?.linkLabel, content.faq?.linkHref);
  renderFaqGrid("#contact-faq-list", content.faq?.items);

  setText("#contact-map-title", content.map?.title);
  setText("#contact-map-description", content.map?.description);
  setHTML("#contact-map-pin-west", content.map?.westLabel);
  setHTML("#contact-map-pin-midwest", content.map?.midwestLabel);
}

function renderSubpageContent(page, content) {
  if (!content) {
    return;
  }

  if (page === "products") {
    renderProductsPage(content);
    return;
  }

  if (page === "solutions") {
    renderSolutionsPage(content);
    return;
  }

  if (page === "resources") {
    renderResourcesPage(content);
    return;
  }

  if (page === "about") {
    renderAboutPage(content);
    return;
  }

  if (page === "contact") {
    renderContactPage(content);
  }
}

syncViewportScale();
window.addEventListener("resize", syncViewportScale, { passive: true });

document.addEventListener("DOMContentLoaded", async () => {
  setupSubpageMenu();
  setFooterYear();

  const page = document.body.dataset.page;
  if (page) {
    const content = await loadSubpageContent(page);
    renderSubpageContent(page, content);
  }

  setupFaqs();
});
