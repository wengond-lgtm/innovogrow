function syncViewportScale() {
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const scale = viewportWidth <= 800 ? 1 : Math.min(1.875, viewportWidth / 1024);
  document.documentElement.style.setProperty("--page-scale", scale.toFixed(4));
}

const cardPictureSizes = "(max-width: 800px) calc(100vw - 24px), (max-width: 1366px) calc(50vw - 28px), calc(25vw - 28px)";
const supportPictureSizes = "(max-width: 1100px) calc(100vw - 36px), 320px";
const hubPictureSizes = "(max-width: 1100px) calc(100vw - 36px), 220px";
const currentPage = document.body.dataset.page || "home";
const currentContentRoot = `@file[/content/${currentPage}.json].`;

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

function rootProp(prop) {
  return `${currentContentRoot}${prop}`;
}

function textAttrs(prop, type = "text") {
  const typeAttr = type ? ` data-type="${type}"` : "";
  return `data-editable="text" data-prop="${prop}"${typeAttr}`;
}

function rootTextAttrs(prop, type = "text") {
  return textAttrs(rootProp(prop), type);
}

function imageAttrs(srcProp, altProp) {
  const altAttr = altProp ? ` data-prop-alt="${altProp}"` : "";
  return `data-editable="image" data-prop-src="${srcProp}"${altAttr}`;
}

function arrayAttrs(prop) {
  return `data-editable="array" data-prop="${prop}"`;
}

function rootArrayAttrs(prop) {
  return arrayAttrs(rootProp(prop));
}

function arrayItemAttrs() {
  return `data-editable="array-item"`;
}

function bindTextElement(element, prop, type = "text") {
  if (!element || !prop) {
    return;
  }

  element.setAttribute("data-editable", "text");
  const resolvedProp = prop.startsWith("@file[") || !prop.includes(".") ? prop : rootProp(prop);
  element.setAttribute("data-prop", resolvedProp);
  if (type) {
    element.setAttribute("data-type", type);
  }
}

function bindArrayElement(element, prop) {
  if (!element || !prop) {
    return;
  }

  element.setAttribute("data-editable", "array");
  const resolvedProp = prop.startsWith("@file[") ? prop : rootProp(prop);
  element.setAttribute("data-prop", resolvedProp);
}

function setText(selector, value, prop, type = "text") {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") {
    element.textContent = value;
  }

  bindTextElement(element, prop, type);
}

function setHTML(selector, value, prop, type = "text") {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") {
    element.innerHTML = value;
  }

  bindTextElement(element, prop, type);
}

function setLink(selector, label, href, labelProp, type = "text") {
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

  bindTextElement(element, labelProp, type);
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

function renderFeatureList(containerSelector, features, baseProp) {
  const container = document.querySelector(containerSelector);
  if (!container || !Array.isArray(features)) {
    return;
  }

  bindArrayElement(container, baseProp);
  container.innerHTML = features.map((feature) => `
    <div class="hero-feature" ${arrayItemAttrs()}>
      <span class="round-icon" ${textAttrs("icon")}>${feature.icon}</span>
      <div>
        <strong ${textAttrs("title")}>${feature.title}</strong>
        <span ${textAttrs("text")}>${feature.text}</span>
      </div>
    </div>
  `).join("");
}

function renderFaqGrid(containerSelector, items, baseProp) {
  const container = document.querySelector(containerSelector);
  if (!container || !Array.isArray(items)) {
    return;
  }

  bindArrayElement(container, baseProp);
  container.innerHTML = items.map((item) => `
    <article class="faq-item ${item.open ? "is-open" : ""}" data-faq-item ${arrayItemAttrs()}>
      <button type="button" data-faq-trigger ${textAttrs("question")}>${item.question}</button>
      <div class="faq-answer" data-faq-panel><p ${textAttrs("answer", "text")}>${item.answer}</p></div>
    </article>
  `).join("");
}

function renderProductsPage(content) {
  setText("#products-hero-eyebrow", content.hero?.eyebrow, "hero.eyebrow");
  setText("#products-hero-title", content.hero?.title, "hero.title", "block");
  setText("#products-hero-description", content.hero?.description, "hero.description", "text");
  renderFeatureList("#products-hero-features", content.hero?.features, "hero.features");

  const stack = document.querySelector("#products-catalog-stack");
  if (stack && Array.isArray(content.products)) {
    bindArrayElement(stack, "products");
    stack.innerHTML = content.products.map((product) => `
      <article class="catalog-card" id="${product.id}" ${arrayItemAttrs()}>
        <div class="catalog-top">
          <div class="catalog-copy">
            ${product.badge ? `<span class="badge" ${textAttrs("badge")}>${product.badge}</span>` : ""}
            <h2 ${textAttrs("title", "block")}>${product.title}</h2>
            ${product.modelLine ? `<p class="catalog-model-line" ${textAttrs("modelLine")}>${product.modelLine}</p>` : ""}
            <p class="catalog-description" ${textAttrs("description", "text")}>${product.description}</p>
            <div class="catalog-actions">
              <a class="btn btn-primary" href="${product.primaryHref}" ${textAttrs("primaryLabel")}>${product.primaryLabel}</a>
              <a class="catalog-secondary-link" href="${product.secondaryHref}" ${textAttrs("secondaryLabel")}>${product.secondaryLabel}</a>
            </div>
          </div>
          <div class="${product.mediaClass}">
            <img src="${product.image}" alt="${product.alt}" loading="lazy" decoding="async" ${imageAttrs("image", "alt")}>
            ${product.bubble ? `<div class="catalog-bubble"><span ${textAttrs("bubble.label")}>${product.bubble.label}</span><strong ${textAttrs("bubble.value")}>${product.bubble.value}</strong></div>` : ""}
            ${Array.isArray(product.labels) ? `
              <div ${arrayAttrs("labels")}>
                ${product.labels.map((label) => `<span class="${label.className}" ${arrayItemAttrs()}><span ${textAttrs("text")}>${label.text}</span></span>`).join("")}
              </div>
            ` : ""}
          </div>
        </div>
        <div class="catalog-apps">
          <p>Ideal Applications</p>
          <div class="catalog-tags" ${arrayAttrs("applications")}>
            ${product.applications.map((application) => `<span ${arrayItemAttrs()}>${application}</span>`).join("")}
          </div>
        </div>
        <div class="catalog-table-wrap">
          <table class="catalog-table">
            <thead>
              <tr ${arrayAttrs("table.columns")}>${product.table.columns.map((column) => `<th ${arrayItemAttrs()}>${column}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${product.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="catalog-benefits" ${arrayAttrs("benefits")}>
          ${product.benefits.map((benefit) => `
            <div class="catalog-benefit" ${arrayItemAttrs()}>
              <span class="round-icon" ${textAttrs("index")}>${benefit.index}</span>
              <div>
                <strong ${textAttrs("title")}>${benefit.title}</strong>
                <p ${textAttrs("text", "text")}>${benefit.text}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </article>
    `).join("");
  }

  setText("#products-cta-title", content.cta?.title, "cta.title", "block");
  setText("#products-cta-description", content.cta?.description, "cta.description", "text");
  setLink("#products-cta-button", content.cta?.buttonLabel, content.cta?.buttonHref, "cta.buttonLabel");
}

function renderSolutionsPage(content) {
  setText("#solutions-hero-eyebrow", content.hero?.eyebrow, "hero.eyebrow");
  setText("#solutions-hero-title", content.hero?.title, "hero.title", "block");
  setText("#solutions-hero-description", content.hero?.description, "hero.description", "text");
  renderFeatureList("#solutions-hero-features", content.hero?.features, "hero.features");
  setLink("#solutions-hero-primary-cta", content.hero?.primaryCta?.label, content.hero?.primaryCta?.href, "hero.primaryCta.label");
  setLink("#solutions-hero-secondary-cta", content.hero?.secondaryCta?.label, content.hero?.secondaryCta?.href, "hero.secondaryCta.label");

  const links = document.querySelector("#solutions-link-grid");
  if (links && content.applicationLinks) {
    links.innerHTML = `
      <article class="solution-link-intro">
        <h2 ${rootTextAttrs("applicationLinks.title", "block")}>${content.applicationLinks.title}</h2>
        <p ${rootTextAttrs("applicationLinks.description", "text")}>${content.applicationLinks.description}</p>
      </article>
      <div class="solution-link-cards" ${rootArrayAttrs("applicationLinks.cards")} style="display: contents;">
        ${content.applicationLinks.cards.map((card) => `
          <a class="solution-link-card" href="#${card.id}" id="${card.id}" ${arrayItemAttrs()}>
            <span class="solution-link-icon" ${textAttrs("icon")}>${card.icon}</span>
            <strong ${textAttrs("title")}>${card.title}</strong>
            <p ${textAttrs("text", "text")}>${card.text}</p>
          </a>
        `).join("")}
      </div>
    `;
  }

  const systemGrid = document.querySelector("#solutions-system-grid");
  if (systemGrid && content.system) {
    systemGrid.innerHTML = `
      <article class="system-intro">
        <p class="eyebrow" ${rootTextAttrs("system.eyebrow")}>${content.system.eyebrow}</p>
        <h2 ${rootTextAttrs("system.title", "block")}>${content.system.title}</h2>
        <p ${rootTextAttrs("system.description", "text")}>${content.system.description}</p>
        <a class="plain-link" href="${content.system.linkHref}" ${rootTextAttrs("system.linkLabel")}>${content.system.linkLabel}</a>
      </article>
      <div class="system-cards" ${rootArrayAttrs("system.cards")}>
        ${content.system.cards.map((card, index) => `
          ${index > 0 ? `<span class="system-plus">+</span>` : ""}
          <article class="system-card" ${arrayItemAttrs()}>
            <img src="${card.image}" alt="${card.alt}" loading="lazy" decoding="async" ${imageAttrs("image", "alt")}>
            <div>
              <p class="system-card-title" ${textAttrs("title")}>${card.title}</p>
              <strong ${textAttrs("heading")}>${card.heading}</strong>
              <span ${textAttrs("text", "text")}>${card.text}</span>
            </div>
          </article>
        `).join("")}
      </div>
      <p class="system-summary" ${rootTextAttrs("system.summary", "text")}>${content.system.summary}</p>
    `;
  }

  const comparePanel = document.querySelector("#solutions-compare-panel");
  if (comparePanel && content.compare) {
    comparePanel.innerHTML = `
      <div class="compare-challenges">
        <p class="eyebrow" ${rootTextAttrs("compare.eyebrow")}>${content.compare.eyebrow}</p>
        <h2 ${rootTextAttrs("compare.title", "block")}>${content.compare.title}</h2>
        <ul ${rootArrayAttrs("compare.challenges")}>
          ${content.compare.challenges.map((challenge) => `
            <li ${arrayItemAttrs()}>
              <strong ${textAttrs("title")}>${challenge.title}</strong>
              <span ${textAttrs("text", "text")}>${challenge.text}</span>
            </li>
          `).join("")}
        </ul>
      </div>
      <div class="compare-visuals compare-visuals--single">
        <img class="compare-composite-image" src="assets/site-images/solutions-comparison-panel.png" alt="Lighting comparison with and without the InnovoGrow system">
        <article class="compare-card compare-card--negative">
          <span class="compare-chip" ${rootTextAttrs("compare.negativeChip")}>${content.compare.negativeChip}</span>
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
          <span class="compare-chip compare-chip--green" ${rootTextAttrs("compare.positiveChip")}>${content.compare.positiveChip}</span>
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
        <h2 ${rootTextAttrs("compare.advantageTitle", "block")}>${content.compare.advantageTitle}</h2>
        <ul ${rootArrayAttrs("compare.advantages")}>
          ${content.compare.advantages.map((advantage) => `
            <li ${arrayItemAttrs()}>
              <strong ${textAttrs("title")}>${advantage.title}</strong>
              <span ${textAttrs("text", "text")}>${advantage.text}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    `;
  }

  setText("#solutions-use-cases-title", content.useCases?.title, "useCases.title", "block");
  setText("#solutions-use-cases-description", content.useCases?.description, "useCases.description", "text");
  setLink("#solutions-use-cases-link", content.useCases?.linkLabel, content.useCases?.linkHref, "useCases.linkLabel");
  const useCaseGrid = document.querySelector("#solutions-use-case-grid");
  if (useCaseGrid && Array.isArray(content.useCases?.cards)) {
    bindArrayElement(useCaseGrid, "useCases.cards");
    useCaseGrid.innerHTML = content.useCases.cards.map((card) => `
      <article class="use-case-card" ${arrayItemAttrs()}>
        ${buildResponsivePicture(card.imageBase, card.title, cardPictureSizes)}
        <div class="use-case-copy">
          <strong ${textAttrs("title")}>${card.title}</strong>
          <p ${textAttrs("text", "text")}>${card.text}</p>
          <a href="${card.href}">View Solution</a>
        </div>
      </article>
    `).join("");
  }

  setText("#solutions-packages-title", content.packages?.title, "packages.title", "block");
  setText("#solutions-packages-description", content.packages?.description, "packages.description", "text");
  const packageGrid = document.querySelector("#solutions-package-grid");
  if (packageGrid && Array.isArray(content.packages?.cards)) {
    bindArrayElement(packageGrid, "packages.cards");
    packageGrid.innerHTML = content.packages.cards.map((card) => `
      <article class="package-card ${card.wide ? "package-card--wide" : ""}" ${arrayItemAttrs()}>
        <p class="eyebrow" ${textAttrs("eyebrow")}>${card.eyebrow}</p>
        <h3 ${textAttrs("title", "block")}>${card.title}</h3>
        <p ${textAttrs("description", "text")}>${card.description}</p>
        <div class="package-includes">
          <strong>Includes:</strong>
          <div ${arrayAttrs("includes")}>
            ${card.includes.map((item) => `<span ${arrayItemAttrs()}>${item}</span>`).join("")}
          </div>
        </div>
        <img src="${card.image}" alt="${card.alt}" loading="lazy" decoding="async" ${imageAttrs("image", "alt")}>
        <div class="package-benefits" ${arrayAttrs("benefits")}>
          ${card.benefits.map((benefit) => `<span ${arrayItemAttrs()}>${benefit}</span>`).join("")}
        </div>
        <a href="${card.href}">View Details</a>
      </article>
    `).join("");
  }

  setText("#solutions-process-title", content.process?.title, "process.title", "block");
  setText("#solutions-process-description", content.process?.description, "process.description", "text");
  const processGrid = document.querySelector("#solutions-process-grid");
  if (processGrid && Array.isArray(content.process?.steps)) {
    bindArrayElement(processGrid, "process.steps");
    processGrid.innerHTML = content.process.steps.map((step) => `
      <article class="process-card" ${arrayItemAttrs()}>
        <span class="process-icon" ${textAttrs("number")}>${step.number}</span>
        <strong ${textAttrs("title")}>${step.title}</strong>
        <p ${textAttrs("text", "text")}>${step.text}</p>
      </article>
    `).join("");
  }

  setText("#solutions-cta-title", content.cta?.title, "cta.title", "block");
  setText("#solutions-cta-description", content.cta?.description, "cta.description", "text");
  setLink("#solutions-cta-button", content.cta?.buttonLabel, content.cta?.buttonHref, "cta.buttonLabel");
  setText("#solutions-cta-status", content.cta?.status, "cta.status", "text");
}

function renderResourcesPage(content) {
  setText("#resources-hero-eyebrow", content.hero?.eyebrow, "hero.eyebrow");
  setText("#resources-hero-title", content.hero?.title, "hero.title", "block");
  setText("#resources-hero-description", content.hero?.description, "hero.description", "text");
  setLink("#resources-hero-primary-cta", content.hero?.primaryCta?.label, content.hero?.primaryCta?.href, "hero.primaryCta.label");
  setLink("#resources-hero-secondary-cta", content.hero?.secondaryCta?.label, content.hero?.secondaryCta?.href, "hero.secondaryCta.label");

  const features = document.querySelector("#resources-feature-grid");
  if (features && Array.isArray(content.features)) {
    bindArrayElement(features, "features");
    features.innerHTML = content.features.map((item) => `
      <article ${arrayItemAttrs()}>
        <strong ${textAttrs("title")}>${item.title}</strong>
        <span ${textAttrs("text", "text")}>${item.text}</span>
      </article>
    `).join("");
  }

  setText("#resources-library-eyebrow", content.library?.eyebrow, "library.eyebrow");
  setText("#resources-library-title", content.library?.title, "library.title", "block");
  setText("#resources-library-description", content.library?.description, "library.description", "text");
  const tabs = document.querySelector("#resources-tabs");
  if (tabs && Array.isArray(content.library?.tabs)) {
    bindArrayElement(tabs, "library.tabs");
    tabs.innerHTML = content.library.tabs.map((tab, index) => `
      <span class="${index === 0 ? "is-active" : ""}" ${arrayItemAttrs()}>${tab}</span>
    `).join("");
  }
  const cards = document.querySelector("#resources-card-grid");
  if (cards && Array.isArray(content.library?.cards)) {
    bindArrayElement(cards, "library.cards");
    cards.innerHTML = content.library.cards.map((card) => `
      <article class="resource-card" ${arrayItemAttrs()}>
        <span class="resource-badge" ${textAttrs("badge")}>${card.badge}</span>
        ${card.graphic ? `<div class="resource-graphic" aria-hidden="true"></div>` : `<img src="${card.image}" alt="${card.title}" loading="lazy" decoding="async" ${imageAttrs("image", "title")}>`}
        <strong ${textAttrs("title", "block")}>${card.title}</strong>
        <p ${textAttrs("description", "text")}>${card.description}</p>
        <a href="${card.href}" ${textAttrs("linkLabel")}>${card.linkLabel}</a>
      </article>
    `).join("");
  }
  setLink("#resources-library-button", content.library?.buttonLabel, content.library?.buttonHref, "library.buttonLabel");

  setText("#resources-cases-eyebrow", content.cases?.eyebrow, "cases.eyebrow");
  setText("#resources-cases-title", content.cases?.title, "cases.title", "block");
  setLink("#resources-cases-link", content.cases?.linkLabel, content.cases?.linkHref, "cases.linkLabel");
  const caseGrid = document.querySelector("#resources-case-grid");
  if (caseGrid && Array.isArray(content.cases?.cards)) {
    bindArrayElement(caseGrid, "cases.cards");
    caseGrid.innerHTML = content.cases.cards.map((card) => `
      <article class="case-card" ${arrayItemAttrs()}>
        ${buildResponsivePicture(card.imageBase, `${card.title} case study`, cardPictureSizes)}
        <p class="case-kicker" ${textAttrs("kicker")}>${card.kicker}</p>
        <strong ${textAttrs("title", "block")}>${card.title}</strong>
        <p ${textAttrs("description", "text")}>${card.description}</p>
        <a href="${card.href}">Read Case Study</a>
      </article>
    `).join("");
  }

  setText("#resources-faq-eyebrow", content.faq?.eyebrow, "faq.eyebrow");
  setText("#resources-faq-title", content.faq?.title, "faq.title", "block");
  setText("#resources-faq-description", content.faq?.description, "faq.description", "text");
  setLink("#resources-faq-link", content.faq?.linkLabel, content.faq?.linkHref, "faq.linkLabel");
  renderFaqGrid("#resources-faq-grid", content.faq?.items, "faq.items");

  setText("#resources-hub-eyebrow", content.hub?.eyebrow, "hub.eyebrow");
  setText("#resources-hub-title", content.hub?.title, "hub.title", "block");
  setText("#resources-hub-description", content.hub?.description, "hub.description", "text");
  setLink("#resources-hub-button", content.hub?.buttonLabel, content.hub?.buttonHref, "hub.buttonLabel");
  setText("#resources-subscribe-title", content.hub?.subscribeTitle, "hub.subscribeTitle", "block");
  setText("#resources-subscribe-description", content.hub?.subscribeDescription, "hub.subscribeDescription", "text");
  setText("#resources-subscribe-note", content.hub?.subscribeNote, "hub.subscribeNote", "text");
}

function renderAboutPage(content) {
  setText("#about-hero-eyebrow", content.hero?.eyebrow, "hero.eyebrow");
  setText("#about-hero-title", content.hero?.title, "hero.title", "block");
  setText("#about-hero-lead", content.hero?.lead, "hero.lead", "text");
  setText("#about-hero-description", content.hero?.description, "hero.description", "text");
  renderFeatureList("#about-hero-features", content.hero?.features, "hero.features");

  setText("#about-story-eyebrow", content.story?.eyebrow, "story.eyebrow");
  setText("#about-story-title", content.story?.title, "story.title", "block");
  if (Array.isArray(content.story?.paragraphs)) {
    setText("#about-story-paragraph-1", content.story.paragraphs[0], "story.paragraphs.0", "text");
    setText("#about-story-paragraph-2", content.story.paragraphs[1], "story.paragraphs.1", "text");
  }
  setLink("#about-story-button", content.story?.buttonLabel, content.story?.buttonHref, "story.buttonLabel");
  const storySide = document.querySelector("#about-story-side");
  if (storySide && Array.isArray(content.story?.sideCards)) {
    bindArrayElement(storySide, "story.sideCards");
    storySide.innerHTML = content.story.sideCards.map((card) => `
      <article class="story-side-card" ${arrayItemAttrs()}>
        <h3 ${textAttrs("title")}>${card.title}</h3>
        <p ${textAttrs("text", "text")}>${card.text}</p>
      </article>
    `).join("");
  }

  const journeyGrid = document.querySelector("#about-journey-grid");
  if (journeyGrid && content.journey) {
    journeyGrid.innerHTML = `
      <article class="journey-intro">
        <p class="eyebrow" ${rootTextAttrs("journey.eyebrow")}>${content.journey.eyebrow}</p>
        <h2 ${rootTextAttrs("journey.title", "block")}>${content.journey.title}</h2>
      </article>
      <div class="journey-items" ${rootArrayAttrs("journey.items")} style="display: contents;">
        ${content.journey.items.map((item) => `<article class="journey-item" ${arrayItemAttrs()}><strong ${textAttrs("year")}>${item.year}</strong><span ${textAttrs("text", "text")}>${item.text}</span></article>`).join("")}
      </div>
    `;
  }

  setText("#about-values-eyebrow", content.values?.eyebrow, "values.eyebrow");
  setText("#about-values-title", content.values?.title, "values.title", "block");
  const valuesGrid = document.querySelector("#about-values-grid");
  if (valuesGrid && Array.isArray(content.values?.items)) {
    bindArrayElement(valuesGrid, "values.items");
    valuesGrid.innerHTML = content.values.items.map((item) => `
      <article class="value-card" ${arrayItemAttrs()}>
        <img class="value-card__icon" src="${item.icon}" alt="${item.title} icon" loading="lazy" decoding="async" ${imageAttrs("icon")}>
        <strong ${textAttrs("title")}>${item.title}</strong>
        <p ${textAttrs("text", "text")}>${item.text}</p>
      </article>
    `).join("");
  }

  setText("#about-proof-eyebrow", content.proof?.eyebrow, "proof.eyebrow");
  setText("#about-proof-title", content.proof?.title, "proof.title", "block");
  const proofMetrics = document.querySelector("#about-proof-metrics");
  if (proofMetrics && Array.isArray(content.proof?.metrics)) {
    bindArrayElement(proofMetrics, "proof.metrics");
    proofMetrics.innerHTML = content.proof.metrics.map((item) => `
      <article class="proof-metric" ${arrayItemAttrs()}>
        <img class="proof-metric__icon" src="${item.icon}" alt="${item.title} icon" loading="lazy" decoding="async" ${imageAttrs("icon")}>
        <strong ${textAttrs("title")}>${item.title}</strong>
        <span ${textAttrs("text", "text")}>${item.text}</span>
      </article>
    `).join("");
  }
  const proofStats = document.querySelector("#about-proof-stats");
  if (proofStats && Array.isArray(content.proof?.stats)) {
    bindArrayElement(proofStats, "proof.stats");
    proofStats.innerHTML = content.proof.stats.map((stat) => `
      <article ${arrayItemAttrs()}>
        <strong ${textAttrs("value")}>${stat.value}</strong>
        <span ${textAttrs("text", "text")}>${stat.text}</span>
      </article>
    `).join("");
  }

  setText("#about-team-eyebrow", content.team?.eyebrow, "team.eyebrow");
  setText("#about-team-title", content.team?.title, "team.title", "block");
  const teamCards = document.querySelector("#about-team-cards");
  if (teamCards && Array.isArray(content.team?.members)) {
    bindArrayElement(teamCards, "team.members");
    teamCards.innerHTML = content.team.members.map((member) => `
      <article class="team-card" ${arrayItemAttrs()}>
        <span class="${member.avatarClass}"></span>
        <strong ${textAttrs("name")}>${member.name}</strong>
        <p ${textAttrs("role", "text")}>${member.role}</p>
      </article>
    `).join("");
  }
  setText("#about-team-side-title", content.team?.sideTitle, "team.sideTitle", "block");
  setText("#about-team-side-description", content.team?.sideDescription, "team.sideDescription", "text");
  setLink("#about-team-side-button", content.team?.sideButtonLabel, content.team?.sideButtonHref, "team.sideButtonLabel");

  setText("#about-craft-eyebrow", content.craft?.eyebrow, "craft.eyebrow");
  setText("#about-craft-title", content.craft?.title, "craft.title", "block");
  setText("#about-craft-description", content.craft?.description, "craft.description", "text");
  setLink("#about-craft-button", content.craft?.buttonLabel, content.craft?.buttonHref, "craft.buttonLabel");
  const craftCards = document.querySelector("#about-craft-cards");
  if (craftCards && Array.isArray(content.craft?.cards)) {
    bindArrayElement(craftCards, "craft.cards");
    craftCards.innerHTML = content.craft.cards.map((card) => `
      <article class="craft-card" ${arrayItemAttrs()}>
        <div class="${card.mediaClass}" aria-hidden="true"></div>
        <strong ${textAttrs("title")}>${card.title}</strong>
        <p ${textAttrs("text", "text")}>${card.text}</p>
      </article>
    `).join("");
  }

  setText("#about-support-eyebrow", content.support?.eyebrow, "support.eyebrow");
  setText("#about-support-title", content.support?.title, "support.title", "block");
  setText("#about-support-description", content.support?.description, "support.description", "text");
  const supportList = document.querySelector("#about-support-list");
  if (supportList && Array.isArray(content.support?.items)) {
    bindArrayElement(supportList, "support.items");
    supportList.innerHTML = content.support.items.map((item) => `
      <article ${arrayItemAttrs()}>
        <img class="support-list__icon" src="${item.icon}" alt="${item.title} icon" loading="lazy" decoding="async" ${imageAttrs("icon")}>
        <strong ${textAttrs("title")}>${item.title}</strong>
        <span ${textAttrs("text", "text")}>${item.text}</span>
      </article>
    `).join("");
  }

  setText("#about-cta-title", content.cta?.title, "cta.title", "block");
  setText("#about-cta-description", content.cta?.description, "cta.description", "text");
  setLink("#about-cta-button", content.cta?.buttonLabel, content.cta?.buttonHref, "cta.buttonLabel");
}

function renderContactPage(content) {
  setText("#contact-hero-eyebrow", content.hero?.eyebrow, "hero.eyebrow");
  setText("#contact-hero-title", content.hero?.title, "hero.title", "block");
  setText("#contact-hero-description", content.hero?.description, "hero.description", "text");
  renderFeatureList("#contact-hero-features", content.hero?.features, "hero.features");

  setText("#contact-form-title", content.form?.title, "form.title", "block");
  setText("#contact-form-description", content.form?.description, "form.description", "text");
  const sideCards = document.querySelector("#contact-side-cards");
  if (sideCards && Array.isArray(content.sideCards)) {
    bindArrayElement(sideCards, "sideCards");
    sideCards.innerHTML = content.sideCards.map((card) => `
      <article class="contact-info-card" ${arrayItemAttrs()}>
        <h3 ${textAttrs("title")}>${card.title}</h3>
        ${card.strong ? `<strong ${textAttrs("strong")}>${card.strong}</strong>` : ""}
        ${card.text ? `<p ${textAttrs("text", "text")}>${card.text}</p>` : ""}
        ${card.note ? `<span ${textAttrs("note", "text")}>${card.note}</span>` : ""}
        ${card.link ? `<a href="${card.link.href}" ${textAttrs("link.label")}>${card.link.label}</a>` : ""}
      </article>
    `).join("");
  }

  setText("#contact-process-title", content.process?.title, "process.title", "block");
  setText("#contact-process-description", content.process?.description, "process.description", "text");
  const processSteps = document.querySelector("#contact-process-steps");
  if (processSteps && Array.isArray(content.process?.steps)) {
    bindArrayElement(processSteps, "process.steps");
    processSteps.innerHTML = content.process.steps.map((step) => `
      <article ${arrayItemAttrs()}>
        <strong ${textAttrs("number")}>${step.number}</strong>
        <span ${textAttrs("title")}>${step.title}</span>
        <p ${textAttrs("text", "text")}>${step.text}</p>
      </article>
    `).join("");
  }
  setLink("#contact-process-button", content.process?.buttonLabel, content.process?.buttonHref, "process.buttonLabel");
  setText("#contact-process-note", content.process?.note, "process.note", "text");

  setText("#contact-faq-eyebrow", content.faq?.eyebrow, "faq.eyebrow");
  setText("#contact-faq-title", content.faq?.title, "faq.title", "block");
  setLink("#contact-faq-link", content.faq?.linkLabel, content.faq?.linkHref, "faq.linkLabel");
  renderFaqGrid("#contact-faq-list", content.faq?.items, "faq.items");

  setText("#contact-map-title", content.map?.title, "map.title", "block");
  setText("#contact-map-description", content.map?.description, "map.description", "text");
  setHTML("#contact-map-pin-west", content.map?.westLabel, "map.westLabel", "text");
  setHTML("#contact-map-pin-midwest", content.map?.midwestLabel, "map.midwestLabel", "text");
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
