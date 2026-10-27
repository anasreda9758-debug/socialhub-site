(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;

  /* ---------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------- */
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });
  }

  /* ---------------------------------------------------------------------
     Header background on scroll
     --------------------------------------------------------------------- */
  const header = document.querySelector(".site-header");
  if (header && !header.classList.contains("site-header--solid")) {
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Language switch (home page only)
     --------------------------------------------------------------------- */
  const langToggle = document.querySelector("[data-lang-toggle]");
  const language = {
    ar: {
      title: "SocialHub Desktop — إدارة حسابات التواصل الاجتماعي من جهازك",
      description:
        "SocialHub Desktop تطبيق Windows لإدارة حسابات التواصل الاجتماعي والنشر والجدولة والتعليقات. بياناتك تبقى على جهازك، ورموز OAuth مشفّرة.",
      label: "English",
      labelLang: "en",
      aria: "التبديل إلى الإنجليزية",
      menu: "فتح القائمة",
      nav: "التنقل الرئيسي",
      brand: "SocialHub — الصفحة الرئيسية",
      mock: "معاينة لواجهة SocialHub: تقويم جدولة أسبوعي مع منشورات موزعة على أيام الشهر",
    },
    en: {
      title: "SocialHub Desktop — Social media management on your terms",
      description:
        "SocialHub Desktop is a local-first Windows app for managing social accounts, publishing, scheduling, and comments. Your data stays on your device; OAuth tokens are encrypted.",
      label: "العربية",
      labelLang: "ar",
      aria: "Switch to Arabic",
      menu: "Open menu",
      nav: "Primary navigation",
      brand: "SocialHub — Home",
      mock: "Preview of the SocialHub interface: a weekly scheduling calendar with posts spread across the month",
    },
  };

  const readStoredLanguage = () => {
    try {
      return window.localStorage.getItem("socialhub.lang");
    } catch {
      return null;
    }
  };

  const storeLanguage = (value) => {
    try {
      window.localStorage.setItem("socialhub.lang", value);
    } catch {
      /* Storage may be unavailable; the switch still works for this page. */
    }
  };

  const applyLanguage = (value, options = {}) => {
    if (value !== "ar" && value !== "en") return;
    const copy = language[value];

    root.lang = value;
    root.dir = value === "ar" ? "rtl" : "ltr";
    root.dataset.lang = value;
    document.title = copy.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", copy.description);

    const label = langToggle?.querySelector("[data-lang-label]");
    if (label) {
      label.textContent = copy.label;
      label.lang = copy.labelLang;
    }

    if (langToggle) {
      langToggle.setAttribute("aria-label", copy.aria);
      langToggle.setAttribute("title", copy.aria);
      langToggle.dataset.currentLang = value;
    }

    if (navToggle) navToggle.setAttribute("aria-label", copy.menu);

    const primaryNav = document.querySelector("[data-nav]");
    if (primaryNav) primaryNav.setAttribute("aria-label", copy.nav);

    const brand = document.querySelector(".site-header .brand");
    if (brand) brand.setAttribute("aria-label", copy.brand);

    const mock = document.querySelector(".mock-window");
    if (mock) mock.setAttribute("aria-label", copy.mock);

    const altEn = document.querySelector('link[rel="alternate"][hreflang="en"]');
    const altAr = document.querySelector('link[rel="alternate"][hreflang="ar"]');
    if (altEn) altEn.href = "https://socialhub.vylo.win/?lang=en";
    if (altAr) altAr.href = "https://socialhub.vylo.win/?lang=ar";

    if (options.persist) storeLanguage(value);

    if (options.updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", value);
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  };

  if (langToggle) {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("lang");
    const initial =
      fromUrl === "ar" || fromUrl === "en"
        ? fromUrl
        : readStoredLanguage() === "en"
          ? "en"
          : "ar";

    applyLanguage(initial);

    langToggle.addEventListener("click", () => {
      const next = root.dataset.lang === "ar" ? "en" : "ar";
      applyLanguage(next, { persist: true, updateUrl: true });
      closeNav();
    });
  }

  /* ---------------------------------------------------------------------
     Current year
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---------------------------------------------------------------------
     Keep policy jump links in sync with the section in view
     --------------------------------------------------------------------- */
  const current = document.querySelector("[data-policy-current]");
  if (current) {
    const links = Array.from(document.querySelectorAll("[data-policy-jump] a[href^='#']"));
    const targets = links
      .map((link) => {
        const id = link.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        return el ? { link, el } : null;
      })
      .filter(Boolean);

    if (targets.length) {
      const mark = () => {
        const at = window.scrollY + 160;
        let active = targets[0];
        targets.forEach((target) => {
          if (target.el.getBoundingClientRect().top + window.scrollY <= at) active = target;
        });
        links.forEach((link) => link.removeAttribute("aria-current"));
        if (active) active.link.setAttribute("aria-current", "true");
      };
      mark();
      window.addEventListener("scroll", mark, { passive: true });
    }
  }

  /* ---------------------------------------------------------------------
     Table of contents: open on desktop, collapsed on tablet and mobile
     --------------------------------------------------------------------- */
  const toc = document.querySelector("details.policy-toc");
  if (toc) {
    const wide = window.matchMedia("(min-width: 1051px)");
    const syncToc = () => {
      toc.open = wide.matches;
    };
    syncToc();
    if (wide.addEventListener) wide.addEventListener("change", syncToc);
  }

  /* ---------------------------------------------------------------------
     Clean up the `nav-open` state when resizing to desktop
     --------------------------------------------------------------------- */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeNav();
  });

  if (body) body.classList.add("is-ready");
})();
