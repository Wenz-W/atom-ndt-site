const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const navigationLinks = navigation?.querySelectorAll("a");

const closeMenu = () => {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  navigation?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigationLinks?.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const desktopNavigation = window.matchMedia("(min-width: 1024px)");
const resetMobileMenu = (event) => {
  if (event.matches) closeMenu();
};

if (typeof desktopNavigation.addEventListener === "function") {
  desktopNavigation.addEventListener("change", resetMobileMenu);
} else {
  desktopNavigation.addListener(resetMobileMenu);
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const openReportDialog = document.querySelector(".report-dialog[open]");

  if (openReportDialog) {
    event.preventDefault();
    openReportDialog.close();
    return;
  }

  if (menuToggle?.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

document.querySelectorAll("[data-faq]").forEach((faq) => {
  const triggers = faq.querySelectorAll("[data-faq-trigger]");

  triggers.forEach((trigger) => {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;

    if (!panel) return;

    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      trigger.setAttribute("aria-expanded", String(!isExpanded));
      panel.hidden = isExpanded;
    });
  });
});

let reportOpener = null;

document.querySelectorAll("[data-report-open]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = document.getElementById(trigger.dataset.reportOpen);

    if (!dialog || typeof dialog.showModal !== "function") return;

    reportOpener = trigger;
    dialog.showModal();
    dialog.querySelector("[data-report-close]")?.focus();
  });
});

document.querySelectorAll(".report-dialog").forEach((dialog) => {
  dialog.querySelector("[data-report-close]")?.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    reportOpener?.focus();
    reportOpener = null;
  });
});
