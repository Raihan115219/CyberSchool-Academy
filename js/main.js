// CyberSchool Academy — demo interactions (vanilla JS, no dependencies)
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initHeaderShadow();
    initMobileMenu();
    initDropdowns();
    initAnnouncement();
    initToasts();
    initContactForm();
    initSearch();
    initTestimonials();
    initReveal();
    initTree();
    initCounters();
    initSpotlight();
    initScrollSpy();
    initHeroParallax();
  });

  function initYear() {
    $$("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
  }

  function initHeaderShadow() {
    const header = $("[data-header]");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  // ---------- Mobile menu ----------
  function initMobileMenu() {
    const toggle = $("[data-menu-toggle]");
    const menu = $("#mobile-menu");
    if (!toggle || !menu) return;
    const icon = $("[data-menu-icon] use", toggle);

    const setOpen = (open) => {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      icon?.setAttribute("href", open ? "#i-x" : "#i-menu");
    };

    toggle.addEventListener("click", () => setOpen(menu.hidden));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
  }

  // ---------- Desktop dropdowns (disclosure pattern) ----------
  function initDropdowns() {
    const groups = $$("[data-dropdown]");
    if (!groups.length) return;

    const close = (group, returnFocus = false) => {
      const btn = $("[data-dropdown-toggle]", group);
      const panel = $(".dropdown", group);
      if (panel.hidden) return;
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (returnFocus) btn.focus();
    };
    const closeAll = (except) => groups.forEach((g) => g !== except && close(g));

    groups.forEach((group) => {
      const btn = $("[data-dropdown-toggle]", group);
      const panel = $(".dropdown", group);

      btn.addEventListener("click", () => {
        const open = panel.hidden;
        closeAll(group);
        panel.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
      });

      btn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          closeAll(group);
          panel.hidden = false;
          btn.setAttribute("aria-expanded", "true");
          $("a", panel)?.focus();
        }
      });

      panel.addEventListener("keydown", (e) => {
        const items = $$("a", panel);
        const i = items.indexOf(document.activeElement);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          items[(i + 1) % items.length].focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          items[(i - 1 + items.length) % items.length].focus();
        }
      });

      panel.addEventListener("click", (e) => {
        if (e.target.closest("a")) close(group);
      });

      group.addEventListener("focusout", (e) => {
        if (!group.contains(e.relatedTarget)) close(group);
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-dropdown]")) closeAll();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const openGroup = groups.find((g) => !$(".dropdown", g).hidden);
      if (openGroup) close(openGroup, true);
    });
  }

  // ---------- Announcement bar ----------
  function initAnnouncement() {
    const bar = $("[data-announce]");
    if (!bar) return;
    const KEY = "csa-announce-dismissed";
    try {
      if (sessionStorage.getItem(KEY)) bar.remove();
    } catch {
      /* storage unavailable — keep the bar */
    }
    $("[data-announce-close]", bar)?.addEventListener("click", () => {
      bar.remove();
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    });
  }

  // ---------- Demo notices ----------
  let toastTimer;
  function showToast(message) {
    const toast = $("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => (toast.hidden = true), 300);
    }, 4200);
  }

  function initToasts() {
    $$("[data-demo-message]").forEach((el) =>
      el.addEventListener("click", () => showToast(el.dataset.demoMessage))
    );
  }

  // ---------- Contact form (preview: nothing is sent) ----------
  function initContactForm() {
    const form = $("[data-contact-form]");
    const note = $("[data-contact-note]");
    if (!form || !note) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const name = new FormData(form).get("name")?.toString().trim() || "";
      form.reset();
      note.textContent = name ? `Thanks, ${name}. We noted your message.` : "Thanks. We noted your message.";
    });

    form.addEventListener("input", () => {
      if (note.textContent) note.textContent = "";
    });
  }

  // ---------- In-page search (demo, no backend) ----------
  function initSearch() {
    const dialog = $("[data-search]");
    const input = $("[data-search-input]");
    const list = $("[data-search-results]");
    if (!dialog || !input || !list || typeof dialog.showModal !== "function") return;

    const index = [
      { label: "Cyber Security", kind: "Department", href: "#dept-cyber-security" },
      { label: "Digital Forensics", kind: "Department", href: "#dept-forensics" },
      { label: "Ethical Hacking", kind: "Department", href: "#dept-hacking" },
      { label: "OSINT", kind: "Department", href: "#dept-osint" },
      { label: "Cyber Law", kind: "Department", href: "#dept-law" },
      { label: "University Programs", kind: "Department", href: "#dept-university" },
      { label: "Cyber Law & Compliance", kind: "Featured course", href: "#featured-title" },
      { label: "Learning Paths", kind: "Section", href: "#learning-paths" },
      { label: "About, mission & vision", kind: "Section", href: "#about" },
      { label: "Why CyberSchool", kind: "Section", href: "#why" },
      { label: "Student testimonials", kind: "Section", href: "#testimonials" },
      { label: "Events & webinars", kind: "Section", href: "#events" },
      { label: "Blog", kind: "Section", href: "#blog" },
      { label: "Quick links", kind: "Section", href: "#resources" },
      { label: "Contact", kind: "Section", href: "#contact" },
    ];

    const render = (query) => {
      const q = query.trim().toLowerCase();
      const hits = index.filter((item) => !q || item.label.toLowerCase().includes(q));
      list.replaceChildren(
        ...(hits.length
          ? hits.map((item) => {
              const li = document.createElement("li");
              const a = document.createElement("a");
              a.className = "search-result";
              a.href = item.href;
              a.innerHTML = "<span></span><small></small>";
              a.firstChild.textContent = item.label;
              a.lastChild.textContent = item.kind;
              li.append(a);
              return li;
            })
          : [Object.assign(document.createElement("li"), {
              className: "px-3 py-4 text-sm text-fg-3",
              textContent: "No matches.",
            })])
      );
    };

    const open = () => {
      input.value = "";
      render("");
      dialog.showModal();
      input.focus();
    };

    $$("[data-search-open]").forEach((btn) => btn.addEventListener("click", open));
    document.addEventListener("keydown", (e) => {
      const typing = /input|textarea|select/i.test(document.activeElement?.tagName || "");
      if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        if (!dialog.open) open();
      }
    });

    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        $(".search-result", list)?.click();
      }
    });
    list.addEventListener("click", (e) => {
      if (e.target.closest("a")) dialog.close();
    });
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close(); // backdrop click
    });
  }

  // ---------- Testimonial spotlight (tabs + autoplay) ----------
  // Autoplay is driven by the CSS progress-bar animation: when it ends, advance.
  // Pauses on hover/focus and while off screen; disabled for reduced motion.
  function initTestimonials() {
    const root = $("[data-testimonials]");
    if (!root) return;
    const tabs = $$("[role='tab']", root);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    const stage = $(".testi-stage", root);
    const counter = $("[data-testi-current]", root);
    if (!tabs.length || panels.some((p) => !p) || !stage) return;

    let current = 0;
    const select = (i, { focus = false } = {}) => {
      current = (i + tabs.length) % tabs.length;
      tabs.forEach((tab, n) => {
        const on = n === current;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        tab.classList.toggle("is-active", on);
        panels[n].classList.toggle("is-active", on);
      });
      // restart the progress animation on the newly active tab
      const bar = $(".testi-progress i", tabs[current]);
      if (bar) {
        bar.style.animation = "none";
        void bar.offsetWidth;
        bar.style.removeProperty("animation");
      }
      stage.dataset.accent = tabs[current].dataset.accent;
      if (counter) counter.textContent = String(current + 1).padStart(2, "0");
      if (focus) tabs[current].focus();
    };

    root.classList.add("is-ready");
    stage.classList.add("is-ready");
    select(0);

    tabs.forEach((tab, n) => tab.addEventListener("click", () => select(n)));
    $("[role='tablist']", root).addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (e.key in keys) select(current + keys[e.key], { focus: true });
      else if (e.key === "Home") select(0, { focus: true });
      else if (e.key === "End") select(tabs.length - 1, { focus: true });
      else return;
      e.preventDefault();
    });
    $("[data-testi-prev]", root)?.addEventListener("click", () => select(current - 1));
    $("[data-testi-next]", root)?.addEventListener("click", () => select(current + 1));

    if (reducedMotion.matches) return;
    root.classList.add("is-autoplay");
    root.addEventListener("animationend", (e) => {
      if (e.animationName === "testi-progress") select(current + 1);
    });

    // Pause while the visitor is reading/interacting, or the section is off screen
    let hovering = false;
    let focused = false;
    let offscreen = true;
    const sync = () => root.classList.toggle("is-paused", hovering || focused || offscreen);
    root.addEventListener("pointerenter", () => ((hovering = true), sync()));
    root.addEventListener("pointerleave", () => ((hovering = false), sync()));
    root.addEventListener("focusin", () => ((focused = true), sync()));
    root.addEventListener("focusout", (e) => {
      if (!root.contains(e.relatedTarget)) (focused = false), sync();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => ((offscreen = !entry.isIntersecting), sync()), {
        threshold: 0.35,
      }).observe(root);
    } else {
      offscreen = false;
    }
    sync();
  }

  // ---------- Scroll reveal ----------
  // Elements already on screen at load are left alone (no flash); the rest
  // fade in as they enter, staggered among siblings. Without JS nothing is hidden.
  const REVEAL_TARGETS = [
    "[data-reveal]",
    ".path-card",
    ".dept-card",
    ".featured-course",
    ".mv-card",
    ".event-card",
    ".recordings",
    ".post-card",
    ".resource-card",
    ".site-footer .container-site > *",
    ".site-footer .container-site > .grid > *",
  ].join(",");

  function initReveal() {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const els = $$(REVEAL_TARGETS).filter(
      (el) => !el.closest(".hero") && !el.parentElement.closest(".will-reveal")
    );
    const viewH = window.innerHeight;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-in");
          observer.unobserve(el);
          // Hand transitions back to the element's own hover styles once done
          const cleanup = () => {
            el.removeEventListener("transitionend", done);
            el.classList.remove("will-reveal", "is-in");
            el.style.removeProperty("--d");
          };
          const done = (e) => {
            if (e.target === el && e.propertyName === "opacity") cleanup();
          };
          el.addEventListener("transitionend", done);
          setTimeout(cleanup, 1800); // fallback if transitionend never fires
        });
      },
      // Small bottom inset so even the last line of the footer can trigger
      { rootMargin: "0px 0px -24px 0px", threshold: 0.05 }
    );

    const siblingIndex = new Map();
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < viewH * 0.92) return; // already visible
      const parent = el.parentElement.tagName === "LI" ? el.parentElement.parentElement : el.parentElement;
      const i = siblingIndex.get(parent) ?? 0;
      siblingIndex.set(parent, i + 1);
      el.style.setProperty("--d", `${Math.min(i, 5) * 90}ms`);
      el.classList.add("will-reveal");
      observer.observe(el);
    });
  }

  // ---------- "Why CyberSchool" tree: trunk grows with scroll, branches light up ----------
  function initTree() {
    const tree = $("[data-tree]");
    const trunk = $("[data-tree-trunk]", tree || document);
    if (!tree || !trunk || reducedMotion.matches) return; // static, fully lit tree

    const items = $$(".tree-item", tree);
    tree.classList.add("is-animated");

    let grown = 0; // never shrinks, so lit branches stay lit when scrolling back up
    let frame = 0;
    const update = () => {
      frame = 0;
      const t = trunk.getBoundingClientRect();
      // Trunk tip follows ~2/3 down the viewport (lower on phones so cards appear sooner)
      const reach = window.innerHeight * (window.innerWidth < 768 ? 0.82 : 0.68) - t.top;
      // Re-clamp every time: a resize can make the trunk shorter than what has grown
      grown = Math.min(t.height, Math.max(grown, reach, 0));
      tree.style.setProperty("--grow", `${grown}px`);

      items.forEach((item) => {
        if (item.classList.contains("is-lit")) return;
        const node = $(".tree-node", item).getBoundingClientRect();
        if (node.top + node.height / 2 - t.top <= grown) item.classList.add("is-lit");
      });
      if (grown >= t.height) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => (frame ||= requestAnimationFrame(update));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  // ---------- Count-up figures ----------
  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length) return;
    const fmt = new Intl.NumberFormat("en-US");
    const render = (el, value) =>
      (el.textContent = el.hasAttribute("data-count-plain") ? String(value) : fmt.format(value));
    // Years count up a little, totals from zero
    const startValue = (el) =>
      el.hasAttribute("data-count-plain") ? Math.max(0, Number(el.dataset.count) - 25) : 0;
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return; // final values already in HTML

    const run = (el) => {
      const target = Number(el.dataset.count);
      const from = startValue(el);
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        render(el, Math.round(from + (target - from) * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          run(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) render(el, startValue(el));
      observer.observe(el);
    });
  }

  // ---------- Cursor spotlight on cards ----------
  function initSpotlight() {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const cards = $$(".path-card, .event-card, .post-card, .mv-card, .stat, .featured-course, .dept-card");
    cards.forEach((card) => {
      card.classList.add("spotlight");
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  // ---------- Highlight the nav item for the section in view ----------
  // A section is "current" while it spans the line 40% down the viewport.
  function initScrollSpy() {
    const links = $$(".site-header ul .nav-link[href^='#']");
    const sections = [...new Set(links.map((a) => a.getAttribute("href")))]
      .map((id) => $(id))
      .filter(Boolean);
    if (!sections.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      const current = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      const href = current ? `#${current.id}` : "";
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === href));
    };
    window.addEventListener("scroll", () => (frame ||= requestAnimationFrame(update)), { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // ---------- Subtle hero parallax (desktop pointers only) ----------
  function initHeroParallax() {
    const hero = $(".hero");
    const art = $(".hero-art");
    if (!hero || !art || reducedMotion.matches || !window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) return;

    let frame = 0;
    hero.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = art.getBoundingClientRect();
        const px = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) || 0;
        const py = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) || 0;
        art.style.setProperty("--px", Math.max(-1, Math.min(1, px)).toFixed(3));
        art.style.setProperty("--py", Math.max(-1, Math.min(1, py)).toFixed(3));
      });
    });
    hero.addEventListener("pointerleave", () => {
      art.style.setProperty("--px", "0");
      art.style.setProperty("--py", "0");
    });
  }
})();
