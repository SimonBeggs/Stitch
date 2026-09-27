const pageRoutes = [
  { match: /\bhome\b/, href: "index.html" },
  { match: /\b(menu|order now|order here|full menu)\b/, href: "menu.html" },
  {
    match: /\b(locations?|find a location|nearest|drive.thru)\b/,
    href: "locations.html",
  },
  {
    match: /\b(our story|why in-n-out|full story|taste the history)\b/,
    href: "our-story.html",
  },
  {
    match:
      /\b(careers?|store associates?|management training|excellent benefits|open positions|apply now)\b/,
    href: "careers.html",
  },
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";

for (const link of document.querySelectorAll('a[href="#"]')) {
  const label = link.textContent.replace(/\s+/g, " ").trim().toLowerCase();
  const route = pageRoutes.find(({ match }) => match.test(label));

  if (!route) continue;

  const href =
    route.href === "locations.html" && /find a location/i.test(label)
      ? "locations.html#locationSearchInput"
      : route.href;

  link.href = href;

  if (link.closest("nav") && route.href === currentPage) {
    link.setAttribute("aria-current", "page");
  }
}

const headerNav = document.querySelector("header nav");

if (headerNav) {
  const menuStyle = document.createElement("style");
  menuStyle.textContent = `
    .site-menu-toggle { display: none; align-items: center; border: 1px solid #a51d33; border-radius: 4px; background: #fffdf7; color: #a51d33; padding: 9px 13px; font: inherit; font-weight: 700; cursor: pointer; }
    .site-mobile-nav { display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 49; overflow: auto; align-content: start; gap: 4px; padding: 18px 22px; background: #fffdf7; box-shadow: 0 10px 30px rgb(35 28 20 / 18%); }
    .site-mobile-nav[data-open="true"] { display: grid; }
    .site-mobile-link { display: block; padding: 14px 12px; border-bottom: 1px solid #eadfd0; color: #8c1829; font: inherit; font-size: 16px; font-weight: 700; text-decoration: none; }
    @media (max-width: 1023px) { .site-menu-toggle { display: inline-flex; } }
    @media (max-width: 600px) { main h1.font-display-hero { font-size: clamp(30px, 9vw, 38px) !important; line-height: 1.08 !important; } }
  `;
  document.head.append(menuStyle);

  const menuToggle = document.createElement("button");
  menuToggle.className = "site-menu-toggle";
  menuToggle.type = "button";
  menuToggle.textContent = "Menu";
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-controls", "site-mobile-nav");
  menuToggle.setAttribute("aria-label", "Open site navigation");

  const mobileNav = document.createElement("nav");
  mobileNav.className = "site-mobile-nav";
  mobileNav.id = "site-mobile-nav";
  mobileNav.setAttribute("aria-label", "Mobile navigation");
  mobileNav.dataset.open = "false";

  for (const link of headerNav.querySelectorAll('a[href$=".html"]')) {
    const mobileLink = link.cloneNode(true);
    mobileLink.className = "site-mobile-link";
    mobileNav.append(mobileLink);
  }

  headerNav.before(menuToggle);
  document.body.append(mobileNav);

  const setMenuOpen = (open) => {
    mobileNav.dataset.open = String(open);
    menuToggle.textContent = open ? "Close menu" : "Menu";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close site navigation" : "Open site navigation",
    );
    mobileNav.style.top = `${document.querySelector("header").offsetHeight}px`;
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  mobileNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1024px)").matches) setMenuOpen(false);
  });
}
