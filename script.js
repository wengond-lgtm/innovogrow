const icons = {
  leaf: '<svg viewBox="0 0 24 24"><path d="M6 14c0-5 4.5-8 12-9 0 8-3 13-9 13-2 0-3-1-3-4Z"/><path d="M6 18c0-4 3-7 7-9"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M4 19h16"/><path d="M7 19V9"/><path d="M12 19V6"/><path d="M17 19v-4"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 6 13h5l-1 9 8-12h-5V2Z"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 5 2.8 8.5 7 10 4.2-1.5 7-5 7-10V6Z"/><path d="m9.4 12 1.7 1.8 3.5-3.8"/></svg>',
  layers: '<svg viewBox="0 0 24 24"><path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 16 8 4 8-4"/></svg>',
  grid: '<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4z"/><path d="M13 4h7v7h-7z"/><path d="M4 13h7v7H4z"/><path d="M13 13h7v7h-7z"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="m12 2 1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z"/></svg>',
  wrench: '<svg viewBox="0 0 24 24"><path d="M14 6a4 4 0 0 0 4 4l-8 8a2 2 0 1 1-2.8-2.8l8-8A4 4 0 0 1 14 6Z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 13 4 4L19 7"/></svg>'
};

function syncViewportScale() {
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const scale = viewportWidth <= 800 ? 1 : Math.min(1.875, viewportWidth / 1024);
  document.documentElement.style.setProperty("--page-scale", scale.toFixed(4));
}

syncViewportScale();
window.addEventListener("resize", syncViewportScale, { passive: true });

const defaultHomeContent = {
  hero: {
    title: "Simplify Commercial Top Lighting at Scale",
    description: "Commercial LED grow lighting solutions built around simplified top-light layouts, with IG 800 and IG 330 linear indoor options, plus IG 150 under-canopy support where your facility needs them.",
    primaryCta: {
      label: "Explore Top Light",
      href: "products.html#tl-300-d1"
    },
    secondaryCta: {
      label: "Request a Lighting Plan",
      href: "contact.html"
    },
    features: [
      { icon: "bolt", title: "Simplified Top Lighting", text: "Cleaner layout with fewer drivers" },
      { icon: "chart", title: "Higher Yields", text: "Stronger canopy-wide growth" },
      { icon: "leaf", title: "Better Light Distribution", text: "Improve whole-room uniformity" },
      { icon: "shield", title: "Built for Commercial", text: "Reliable. Scalable. Durable." }
    ]
  },
  challenge: {
    eyebrow: "The Challenge",
    title: "A Full-Dimensional Approach to Crop Architecture",
    description: "To maximize yield and quality in modern commercial facilities, single-source lighting is no longer sufficient. InnovoGrow provides a complete, multi-layered lighting ecosystem designed to deliver precise photobiological support from every angle, adapting seamlessly to any spatial constraint and growth stage."
  },
  productsSection: {
    eyebrow: "Our Solutions",
    title: "Products Built for Commercial Growers",
    linkLabel: "View All Products",
    linkHref: "products.html"
  },
  products: [
    {
      className: "product-card--toplight",
      badge: "Featured",
      title: "IG 300-D1 Top Light",
      description: "Simplify your top-lighting layout with one driver.",
      bullets: ["One-driver architecture", "Clean installation", "Scalable for large facilities"],
      href: "products.html#tl-300-d1",
      image: "assets/site-images/home-card-toplight.png"
    },
    {
      className: "product-card--geniv",
      badge: "Classic",
      title: "IG 800 Linear Indoor LED",
      description: "Flexible linear lighting for indoor cultivation.",
      bullets: ["Versatile applications", "Ideal for racks & propagation", "Supplemental side lighting"],
      href: "products.html#gen-iv",
      image: "assets/site-images/products-fixture-gen-iv.png"
    },
    {
      className: "product-card--veg330",
      badge: "Classic",
      title: "IG 330 Linear Indoor LED",
      description: "Dedicated linear lighting for veg rooms and uniform early-stage growth.",
      bullets: ["Built for vegetative environments", "Uniform linear coverage", "Clean indoor facility integration"],
      href: "products.html#veg-330",
      image: "assets/site-images/products-fixture-veg-330.png"
    },
    {
      className: "product-card--undercanopy",
      badge: "Featured",
      title: "IG 150 Under Canopy LED",
      description: "Targeted under-canopy support that strengthens lower-zone development.",
      bullets: ["Supports lower canopy performance", "Low profile, easy to install", "Pairs with primary top-light layouts"],
      href: "products.html#uc-series",
      image: "assets/site-images/products-fixture-uc-series.png"
    }
  ],
  strategiesSection: {
    eyebrow: "Complete Lighting Strategies",
    title: "A Complete Solution for Every Grow"
  },
  strategies: [
    {
      icon: "layers",
      title: "Top-Light Simplification",
      model: "IG 300-D1",
      text: "Ideal for new builds or upgrades that require a cleaner, simpler top-lighting solution.",
      href: "solutions.html#top-lighting"
    },
    {
      icon: "leaf",
      title: "Under-Canopy Support",
      model: "IG 150",
      text: "Add targeted lower-canopy support to top-light rooms that need stronger whole-plant uniformity.",
      href: "solutions.html#under-canopy-lighting"
    },
    {
      icon: "grid",
      title: "Full Indoor Layout",
      model: "IG 300-D1 + IG 800 + IG 330 + IG 150",
      text: "A complete lighting system for uniform, scalable, and high-performance facilities.",
      href: "solutions.html#full-facility-layouts"
    }
  ],
  performanceSection: {
    eyebrow: "Why Growers Choose InnovoGrow",
    title: "Engineered for Performance. Built for Growers."
  },
  metrics: [
    { icon: "spark", title: "Optimized Light Distribution" },
    { icon: "wrench", title: "Low-Profile & Installation-Friendly" },
    { icon: "grid", title: "Scalable Product Architecture" },
    { icon: "bolt", title: "High Efficiency & Reliability" },
    { icon: "leaf", title: "Wide Application Versatility" },
    { icon: "check", title: "Certifications & Quality Assured" }
  ],
  applicationsSection: {
    eyebrow: "Designed for Multiple Applications"
  },
  applications: [
    { title: "High-Density Flowering Crops", imageBase: "assets/site-images/solutions-usecase-high-density-flowering-crops" },
    { title: "Greenhouse Cultivation", imageBase: "assets/site-images/solutions-usecase-greenhouse-cultivation" },
    { title: "Vertical Farming", imageBase: "assets/site-images/solutions-usecase-vertical-farming" },
    { title: "Indoor Commercial Grow Rooms", imageBase: "assets/site-images/solutions-usecase-indoor-grow-rooms" }
  ],
  contactSection: {
    eyebrow: "Get Started",
    title: "Need a Lighting Layout for Your Facility?",
    description: "Tell us about your grow. Our lighting experts will help you design the right solution for higher yields, better quality, and long-term efficiency.",
    benefits: [
      { icon: "assets/site-images/home-icon-personalized-lighting-plan.svg", text: "Personalized Lighting Plan" },
      { icon: "assets/site-images/home-icon-ppfd-layout-recommendation.svg", text: "PPFD & Layout Recommendation" },
      { icon: "assets/site-images/home-icon-product-roi-guidance.svg", text: "Product & ROI Guidance" }
    ],
    cardText: "Our team typically responds within 1 business day.",
    cardButtonLabel: "Request Lighting Plan",
    cardButtonHref: "contact.html"
  }
};

const photoCardSizes = "(max-width: 800px) calc(100vw - 24px), (max-width: 1366px) calc(50vw - 28px), calc(25vw - 28px)";

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

function textAttrs(prop, type = "text") {
  const typeAttr = type ? ` data-type="${type}"` : "";
  return `data-editable="text" data-prop="${prop}"${typeAttr}`;
}

function imageAttrs(srcProp, altProp) {
  const altAttr = altProp ? ` data-prop-alt="${altProp}"` : "";
  return `data-editable="image" data-prop-src="${srcProp}"${altAttr}`;
}

function arrayAttrs(prop) {
  return `data-editable="array" data-prop="${prop}"`;
}

function arrayItemAttrs() {
  return `data-editable="array-item"`;
}

function renderHero(content) {
  document.querySelector("#hero-title").textContent = content.hero.title;
  document.querySelector("#hero-description").textContent = content.hero.description;
  document.querySelector("#hero-primary-cta").textContent = content.hero.primaryCta.label;
  document.querySelector("#hero-primary-cta").href = content.hero.primaryCta.href;
  document.querySelector("#hero-secondary-cta").textContent = content.hero.secondaryCta.label;
  document.querySelector("#hero-secondary-cta").href = content.hero.secondaryCta.href;

  const features = document.querySelector("#hero-features");
  features.setAttribute("data-editable", "array");
  features.setAttribute("data-prop", "hero.features");
  features.innerHTML = content.hero.features.map((feature) => `
    <div class="hero-feature" ${arrayItemAttrs()}>
      <span class="round-icon">${icons[feature.icon] || feature.icon}</span>
      <div>
        <strong ${textAttrs("title")}>${feature.title}</strong>
        <span ${textAttrs("text", "text")}>${feature.text}</span>
      </div>
    </div>
  `).join("");
}

function renderChallenge(content) {
  document.querySelector("#challenge-eyebrow").textContent = content.challenge.eyebrow;
  document.querySelector("#challenge-title").textContent = content.challenge.title;
  document.querySelector("#challenge-description").textContent = content.challenge.description;
}

function renderProducts(content) {
  document.querySelector("#products-section-eyebrow").textContent = content.productsSection.eyebrow;
  document.querySelector("#products-section-title").textContent = content.productsSection.title;
  document.querySelector("#products-section-link").textContent = content.productsSection.linkLabel;
  document.querySelector("#products-section-link").href = content.productsSection.linkHref;

  const grid = document.querySelector("#product-grid");
  grid.setAttribute("data-editable", "array");
  grid.setAttribute("data-prop", "products");
  grid.innerHTML = content.products.map((product) => `
    <article class="product-card ${product.className || ""}" ${arrayItemAttrs()}>
      <div class="product-copy">
        ${product.badge ? `<span class="badge ${product.badge === "Classic" ? "badge--classic" : ""}" ${textAttrs("badge")}>${product.badge}</span>` : ""}
        <h3 ${textAttrs("title", "block")}>${product.title}</h3>
        <p ${textAttrs("description", "text")}>${product.description}</p>
        <ul ${arrayAttrs("bullets")}>${product.bullets.map((item) => `<li ${arrayItemAttrs()}>${item}</li>`).join("")}</ul>
      </div>
      <div class="product-media">
        <img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async" ${imageAttrs("image", "title")}>
      </div>
    </article>
  `).join("");
}

function renderStrategies(content) {
  document.querySelector("#strategies-section-eyebrow").textContent = content.strategiesSection.eyebrow;
  document.querySelector("#strategies-section-title").textContent = content.strategiesSection.title;

  const grid = document.querySelector("#strategy-grid");
  grid.setAttribute("data-editable", "array");
  grid.setAttribute("data-prop", "strategies");
  grid.innerHTML = content.strategies.map((strategy) => `
    <article class="strategy-card" ${arrayItemAttrs()}>
      <span class="round-icon">${icons[strategy.icon] || strategy.icon}</span>
      <h3 ${textAttrs("title")}>${strategy.title}</h3>
      <strong ${textAttrs("model")}>${strategy.model}</strong>
      <p ${textAttrs("text", "text")}>${strategy.text}</p>
      <a href="${strategy.href}">Learn More</a>
    </article>
  `).join("");
}

function renderMetrics(content) {
  document.querySelector("#performance-section-eyebrow").textContent = content.performanceSection.eyebrow;
  document.querySelector("#performance-section-title").textContent = content.performanceSection.title;

  const grid = document.querySelector("#metric-grid");
  grid.setAttribute("data-editable", "array");
  grid.setAttribute("data-prop", "metrics");
  grid.innerHTML = content.metrics.map((metric) => `
    <div class="metric-item" ${arrayItemAttrs()}>
      <span class="round-icon">${icons[metric.icon] || metric.icon}</span>
      <strong ${textAttrs("title")}>${metric.title}</strong>
    </div>
  `).join("");
}

function renderApplications(content) {
  document.querySelector("#applications-section-eyebrow").textContent = content.applicationsSection.eyebrow;

  const grid = document.querySelector("#application-grid");
  grid.setAttribute("data-editable", "array");
  grid.setAttribute("data-prop", "applications");
  grid.innerHTML = content.applications.map((application) => `
    <article class="application-card" ${arrayItemAttrs()}>
      ${buildResponsivePicture(application.imageBase, application.title, photoCardSizes)}
      <strong ${textAttrs("title")}>${application.title}</strong>
    </article>
  `).join("");
}

function renderContact(content) {
  document.querySelector("#contact-section-eyebrow").textContent = content.contactSection.eyebrow;
  document.querySelector("#contact-section-title").textContent = content.contactSection.title;
  document.querySelector("#contact-section-description").textContent = content.contactSection.description;

  const benefits = document.querySelector("#contact-benefits");
  benefits.setAttribute("data-editable", "array");
  benefits.setAttribute("data-prop", "contactSection.benefits");
  benefits.innerHTML = content.contactSection.benefits.map((benefit) => `
    <span ${arrayItemAttrs()}>
      <img src="${benefit.icon}" alt="" aria-hidden="true" decoding="async" ${imageAttrs("icon")}>
      <span ${textAttrs("text")}>${benefit.text}</span>
    </span>
  `).join("");

  document.querySelector("#contact-card-text").textContent = content.contactSection.cardText;
  document.querySelector("#contact-card-button").textContent = content.contactSection.cardButtonLabel;
  document.querySelector("#contact-card-button").href = content.contactSection.cardButtonHref;
}

function setupMenu() {
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

function setupForm() {
  const form = document.querySelector(".contact-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

async function loadHomeContent() {
  try {
    const response = await fetch("content/home.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unexpected response: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Falling back to default home content.", error);
    return defaultHomeContent;
  }
}

async function init() {
  const content = await loadHomeContent();
  renderHero(content);
  renderChallenge(content);
  renderProducts(content);
  renderStrategies(content);
  renderMetrics(content);
  renderApplications(content);
  renderContact(content);
  setupMenu();
  setupForm();
  document.querySelector("#year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);
