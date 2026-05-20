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

const heroFeatures = [
  ["leaf", "Better Light Distribution", "Improve canopy uniformity"],
  ["chart", "Higher Yields", "Stronger lower growth"],
  ["bolt", "Reduced Complexity", "Simplified installation"],
  ["shield", "Built for Commercial", "Reliable. Scalable. Durable."]
];

// Change image paths here when replacing or adding product photos later.
const products = [
  {
    className: "product-card--wide",
    badge: "Featured",
    title: "UC Series Under Canopy LED",
    description: "Unlock the potential of your lower canopy.",
    bullets: [
      "Improve lower bud & flower development",
      "Low profile, easy to install",
      "Designed for high-density grows"
    ],
    model: "UC160 / UC120",
    link: "View UC Series",
    href: "products.html#uc-series",
    image: "assets/reference/product-uc.png"
  },
  {
    badge: "Featured",
    title: "TL 300-D1 Top Light One Driver Solution",
    description: "Simplify your top-lighting layout with one driver.",
    bullets: [
      "One-driver architecture",
      "Clean installation",
      "Scalable for large facilities"
    ],
    model: "TL 300-D1",
    link: "View TL 300-D1",
    href: "products.html#tl-300-d1",
    image: "assets/reference/product-tl.png"
  },
  {
    title: "Gen IV Linear Indoor LED",
    description: "Flexible linear lighting for indoor cultivation.",
    bullets: [
      "Versatile applications",
      "Ideal for racks & propagation",
      "Supplemental side lighting"
    ],
    model: "Gen IV",
    link: "View Gen IV",
    href: "products.html#gen-iv",
    image: "assets/reference/product-gen.png"
  }
];

const strategies = [
  {
    icon: "leaf",
    title: "Under-Canopy Upgrade",
    model: "UC160 / UC120",
    text: "Perfect for existing top-light grow rooms needing better lower canopy development.",
    href: "solutions.html#under-canopy-lighting"
  },
  {
    icon: "layers",
    title: "Top-Light Simplification",
    model: "TL 300-D1",
    text: "Ideal for new builds or upgrades that require a cleaner, simpler top-lighting solution.",
    href: "solutions.html#top-lighting"
  },
  {
    icon: "grid",
    title: "Full Indoor Layout",
    model: "TL 300-D1 + UC Series + Gen IV",
    text: "A complete lighting system for uniform, scalable, and high-performance facilities.",
    href: "solutions.html#full-facility-layouts"
  }
];

const metrics = [
  ["spark", "Optimized Light Distribution"],
  ["wrench", "Low-Profile & Installation-Friendly"],
  ["grid", "Scalable Product Architecture"],
  ["bolt", "High Efficiency & Reliability"],
  ["leaf", "Wide Application Versatility"],
  ["check", "Certifications & Quality Assured"]
];

const applications = [
  ["High-Density Flowering Crops", "assets/reference/app-flowering.png"],
  ["Greenhouse Cultivation", "assets/reference/app-greenhouse.png"],
  ["Vertical Farming", "assets/reference/app-vertical.png"],
  ["Indoor Commercial Grow Rooms", "assets/reference/app-indoor.png"]
];

function renderHeroFeatures() {
  document.querySelector("#hero-features").innerHTML = heroFeatures.map(([icon, title, text]) => `
    <div class="hero-feature">
      <span class="round-icon">${icons[icon]}</span>
      <div>
        <strong>${title}</strong>
        <span>${text}</span>
      </div>
    </div>
  `).join("");
}

function renderProducts() {
  document.querySelector("#product-grid").innerHTML = products.map((product) => `
    <article class="product-card ${product.className || ""}">
      <div class="product-copy">
        ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <ul>${product.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
        <p class="model">Model: <strong>${product.model}</strong></p>
        <a href="${product.href}">${product.link}</a>
      </div>
      <div class="product-media">
        <img src="${product.image}" alt="${product.title}">
      </div>
    </article>
  `).join("");
}

function renderStrategies() {
  document.querySelector("#strategy-grid").innerHTML = strategies.map((strategy) => `
    <article class="strategy-card">
      <span class="round-icon">${icons[strategy.icon]}</span>
      <h3>${strategy.title}</h3>
      <strong>${strategy.model}</strong>
      <p>${strategy.text}</p>
      <a href="${strategy.href}">Learn More</a>
    </article>
  `).join("");
}

function renderMetrics() {
  document.querySelector("#metric-grid").innerHTML = metrics.map(([icon, title]) => `
    <div class="metric-item">
      <span class="round-icon">${icons[icon]}</span>
      <strong>${title}</strong>
    </div>
  `).join("");
}

function renderApplications() {
  document.querySelector("#application-grid").innerHTML = applications.map(([title, image]) => `
    <article class="application-card">
      <img src="${image}" alt="${title}">
      <strong>${title}</strong>
    </article>
  `).join("");
}

function setupMenu() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupForm() {
  document.querySelector(".contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

function init() {
  renderHeroFeatures();
  renderProducts();
  renderStrategies();
  renderMetrics();
  renderApplications();
  setupMenu();
  setupForm();
  document.querySelector("#year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);
