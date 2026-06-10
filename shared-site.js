const siteContentRoot = "@file[/content/site.json].";
const siteNavPages = ["home", "products", "solutions", "resources", "about", "contact"];

const defaultSiteContent = {
  header: {
    nav: [
      { label: "Home", href: "index.html" },
      { label: "Products", href: "products.html" },
      { label: "Solutions", href: "solutions.html" },
      { label: "Resources", href: "resources.html" },
      { label: "About", href: "about.html" },
      { label: "Contact", href: "contact.html" }
    ],
    cta: {
      label: "Request Lighting Plan",
      href: "contact.html"
    }
  },
  footer: {
    brandDescription: "InnovoGrow delivers high-performance LED grow lighting solutions for commercial cultivation environments.",
    columns: [
      {
        title: "Products",
        links: [
          { label: "IG 300-D1 Top Light", href: "products.html#tl-300-d1" },
          { label: "IG 800 Linear Indoor LED", href: "products.html#gen-iv" },
          { label: "IG 330 Linear Indoor LED", href: "products.html#veg-330" },
          { label: "IG 150 Under Canopy LED", href: "products.html#uc-series" }
        ]
      },
      {
        title: "Solutions",
        links: [
          { label: "Top Lighting", href: "solutions.html#top-lighting" },
          { label: "Under Canopy Lighting", href: "solutions.html#under-canopy-lighting" },
          { label: "Indoor Cultivation", href: "solutions.html#indoor-cultivation" },
          { label: "Greenhouse Lighting", href: "solutions.html#greenhouse-lighting" }
        ]
      },
      {
        title: "Resources",
        links: [
          { label: "Spec Sheets", href: "resources.html#resource-library" },
          { label: "Installation Guides", href: "resources.html#resource-library" },
          { label: "Case Studies", href: "resources.html#case-studies" },
          { label: "FAQ", href: "resources.html#faq" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About InnovoGrow", href: "about.html" },
          { label: "Contact Us", href: "contact.html" },
          { label: "Become a Distributor", href: "contact.html" }
        ]
      }
    ],
    newsletter: {
      title: "Newsletter",
      description: "Stay updated with the latest products and cultivation insights.",
      placeholder: "Your email",
      ariaLabel: "Your email",
      buttonLabel: "->"
    },
    bottom: {
      copyrightText: "InnovoGrow. All rights reserved.",
      privacyLabel: "Privacy Policy",
      privacyHref: "#top",
      termsLabel: "Terms of Use",
      termsHref: "#top"
    }
  }
};

function siteRootProp(prop) {
  return `${siteContentRoot}${prop}`;
}

function siteTextAttrs(prop, type = "text") {
  const typeAttr = type ? ` data-type="${type}"` : "";
  return `data-editable="text" data-prop="${siteRootProp(prop)}"${typeAttr}`;
}

function siteArrayAttrs(prop) {
  return `data-editable="array" data-prop="${siteRootProp(prop)}"`;
}

function siteArrayItemAttrs() {
  return `data-editable="array-item"`;
}

function renderSiteNav(currentPage, content) {
  const nav = document.querySelector("#site-nav");
  if (!nav || !Array.isArray(content.header?.nav)) {
    return;
  }

  nav.setAttribute("data-editable", "array");
  nav.setAttribute("data-prop", siteRootProp("header.nav"));
  nav.innerHTML = content.header.nav.map((item, index) => {
    const activeClass = siteNavPages[index] === currentPage ? ' class="active"' : "";
    return `
      <a${activeClass} href="${item.href}" ${siteArrayItemAttrs()}>
        <span ${siteTextAttrs("label")}>${item.label}</span>
      </a>
    `;
  }).join("");
}

function renderSiteHeaderCta(content) {
  const cta = document.querySelector("#site-header-cta");
  if (!cta || !content.header?.cta) {
    return;
  }

  cta.href = content.header.cta.href;
  cta.innerHTML = `
    <span class="calendar-icon"></span>
    <span ${siteTextAttrs("header.cta.label")}>${content.header.cta.label}</span>
  `;
}

function renderSiteFooter(content) {
  const footerInner = document.querySelector("#site-footer-inner");
  if (footerInner && content.footer) {
    footerInner.innerHTML = `
      <div class="footer-brand">
        <img src="assets/site-images/brand-innovogrow-logo.svg" alt="InnovoGrow" loading="lazy" decoding="async">
        <p ${siteTextAttrs("footer.brandDescription", "text")}>${content.footer.brandDescription}</p>
      </div>
      <div ${siteArrayAttrs("footer.columns")} style="display: contents;">
        ${content.footer.columns.map((column) => `
          <div class="footer-col" ${siteArrayItemAttrs()}>
            <h3 ${siteTextAttrs("title")}>${column.title}</h3>
            <div ${siteArrayAttrs("links")} style="display: contents;">
              ${column.links.map((link) => `
                <a href="${link.href}" ${siteArrayItemAttrs()}>
                  <span ${siteTextAttrs("label")}>${link.label}</span>
                </a>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      <div class="footer-newsletter">
        <h3 ${siteTextAttrs("footer.newsletter.title")}>${content.footer.newsletter.title}</h3>
        <p ${siteTextAttrs("footer.newsletter.description", "text")}>${content.footer.newsletter.description}</p>
        <form>
          <input
            type="email"
            placeholder="${content.footer.newsletter.placeholder || ""}"
            aria-label="${content.footer.newsletter.ariaLabel || content.footer.newsletter.placeholder || ""}"
          >
          <button type="button">
            <span ${siteTextAttrs("footer.newsletter.buttonLabel")}>${content.footer.newsletter.buttonLabel}</span>
          </button>
        </form>
      </div>
    `;
  }

  const footerBottom = document.querySelector("#site-footer-bottom");
  if (!footerBottom || !content.footer?.bottom) {
    return;
  }

  const year = new Date().getFullYear();
  footerBottom.innerHTML = `
    <p>&copy; ${year} <span ${siteTextAttrs("footer.bottom.copyrightText", "text")}>${content.footer.bottom.copyrightText}</span></p>
    <div>
      <a href="${content.footer.bottom.privacyHref || "#top"}">
        <span ${siteTextAttrs("footer.bottom.privacyLabel")}>${content.footer.bottom.privacyLabel}</span>
      </a>
      <a href="${content.footer.bottom.termsHref || "#top"}">
        <span ${siteTextAttrs("footer.bottom.termsLabel")}>${content.footer.bottom.termsLabel}</span>
      </a>
    </div>
  `;
}

async function loadSiteContent() {
  try {
    const response = await fetch("content/site.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unexpected response: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Falling back to default shared site content.", error);
    return defaultSiteContent;
  }
}

function renderSiteChrome(currentPage, content) {
  const resolvedContent = content || defaultSiteContent;
  renderSiteNav(currentPage, resolvedContent);
  renderSiteHeaderCta(resolvedContent);
  renderSiteFooter(resolvedContent);
}

window.InnovoGrowSite = {
  defaultSiteContent,
  loadSiteContent,
  renderSiteChrome,
  siteArrayAttrs,
  siteArrayItemAttrs,
  siteRootProp,
  siteTextAttrs
};
