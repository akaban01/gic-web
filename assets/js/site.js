/* =========================================================
   Georgetown Islamic Center (GIC) — site behaviour
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- Theme ---------------- */

  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("gic-theme");
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) {}

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.addEventListener("click", function (ev) {
    var toggle = ev.target.closest("[data-theme-toggle]");
    if (!toggle) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("gic-theme", next); } catch (e) {}
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  });

  /* ---------------- Mobile nav ---------------- */

  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("primary-nav");
  var backdrop = document.querySelector(".nav-backdrop");

  function setNav(open) {
    if (!nav) return;
    if (open) {
      var header = document.querySelector(".site-header");
      if (header) nav.style.setProperty("--nav-top", (header.getBoundingClientRect().bottom + 14) + "px");
    }
    nav.setAttribute("data-open", String(open));
    if (backdrop) backdrop.setAttribute("data-open", String(open));
    if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open && window.innerWidth <= 1024 ? "hidden" : "";
  }

  if (navToggle) navToggle.addEventListener("click", function () {
    setNav(nav.getAttribute("data-open") !== "true");
  });
  if (backdrop) backdrop.addEventListener("click", function () { setNav(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 1024) setNav(false); });

  /* ---------------- Sticky header shade ---------------- */

  var header = document.querySelector(".site-header");
  if (header) {
    var setShade = function () {
      header.setAttribute("data-scrolled", String(window.scrollY > 8));
    };
    setShade();
    window.addEventListener("scroll", setShade, { passive: true });
  }

  /* ---------------- Reveal on scroll ----------------
     Nothing is hidden until this runs, so the page stays readable
     without JS (and for anyone who prefers reduced motion).        */

  (function () {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var groups = document.querySelectorAll(
      "main section .section-head, main section .split > *, main section .grid > *," +
      " main section .stats, main section .timeline > li, main section .contact-grid > *," +
      " main section > .wrap > .notice, main section > .wrap > .callout-line"
    );
    if (!groups.length) return;

    root.classList.add("js-reveal");

    var seen = new WeakMap();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });

    groups.forEach(function (el) {
      el.classList.add("reveal");
      // Stagger siblings a little so rows of cards cascade rather than pop.
      var parent = el.parentNode;
      var i = seen.get(parent) || 0;
      seen.set(parent, i + 1);
      if (i) el.style.setProperty("--reveal-delay", Math.min(i, 4) * 70 + "ms");
      io.observe(el);
    });
  })();

  /* ---------------- Footer year ---------------- */

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------------- Prayer times ---------------- */
  /*  GIC publishes its own Adhan + Iqamah times (they are not calculated
      here). Update this schedule whenever the masjid posts a new monthly
      timetable — e.g. from the "Monthly Schedule" PDF on gicmasjid.org.
      Last updated for the schedule in effect: August 2026.               */

  var TZ = "America/Chicago";

  var SCHEDULE = {
    Fajr:    { adhan: "5:26 AM", iqamah: "6:15 AM", note: "Dawn" },
    Sunrise: { adhan: "6:54 AM", iqamah: null,       note: "Shurooq — no prayer", sun: true },
    Dhuhr:   { adhan: "1:36 PM", iqamah: "2:00 PM",  note: "Midday" },
    Asr:     { adhan: "6:20 PM", iqamah: "6:45 PM",  note: "Afternoon" },
    Maghrib: { adhan: "8:17 PM", iqamah: "8:22 PM",  note: "Sunset" },
    Isha:    { adhan: "9:39 PM", iqamah: "9:50 PM",  note: "Night" }
  };
  var ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  var ICONS = {
    Fajr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 3v2M5 8l1.4 1.4M19 8l-1.4 1.4M2 18h20M6 18a6 6 0 0 1 12 0"/></svg>',
    Sunrise: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 2v4M4.9 7.9 7 10M19.1 7.9 17 10M2 18h20M8 22h8M6 18a6 6 0 0 1 12 0"/></svg>',
    Dhuhr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"/></svg>',
    Asr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="11" r="3.4"/><path d="M12 3.5v1.6M4.6 11H3M21 11h-1.6M6.6 5.6 5.5 4.5M17.4 5.6l1.1-1.1M3 19h18"/></svg>',
    Maghrib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 10V2M8.5 5.5 12 2l3.5 3.5M2 18h20M6 18a6 6 0 0 1 12 0M8 22h8"/></svg>',
    Isha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>'
  };

  var host = document.querySelector("[data-prayer-widget]");
  if (!host) return;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function localParts(date) {
    var fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    });
    var out = {};
    fmt.formatToParts(date).forEach(function (p) {
      if (p.type !== "literal") out[p.type] = p.value;
    });
    return {
      hour: +(out.hour === "24" ? "0" : out.hour), minute: +out.minute, second: +out.second
    };
  }

  function toMinutes(clock) {
    var m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(clock.trim());
    if (!m) return null;
    var h = +m[1] % 12;
    if (/pm/i.test(m[3])) h += 12;
    return h * 60 + +m[2];
  }

  function render() {
    var list = host.querySelector("[data-prayer-rows]");
    var dateEl = host.querySelector("[data-prayer-date]");
    if (dateEl) {
      dateEl.textContent = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ, weekday: "long", month: "long", day: "numeric", year: "numeric"
      }).format(new Date());
    }
    if (!list) return;
    var head =
      '<li class="prayer-rows__head" aria-hidden="true">' +
        "<span></span><span>Prayer</span><span>Adhan</span><span>Iqamah</span>" +
      "</li>";
    list.innerHTML = head + ORDER.map(function (key) {
      var row = SCHEDULE[key];
      return '<li data-slot="' + key + '"' + (row.sun ? ' class="is-sun"' : "") + '>' +
        '<span class="p-icon" aria-hidden="true">' + (ICONS[key] || "") + "</span>" +
        '<span class="p-name">' + key + "<small>" + row.note + "</small></span>" +
        '<span class="p-adhan">' + row.adhan + "</span>" +
        '<span class="p-time">' + (row.iqamah || "&mdash;") + "</span>" +
      "</li>";
    }).join("");
  }

  function tick() {
    var p = localParts(new Date());
    var nowMin = p.hour * 60 + p.minute;
    var nowSec = nowMin * 60 + p.second;

    var next = null;
    for (var i = 0; i < ORDER.length; i++) {
      var key = ORDER[i];
      var row = SCHEDULE[key];
      if (row.sun) continue;
      var mins = toMinutes(row.iqamah || row.adhan);
      if (mins !== null && mins > nowMin) { next = { key: key, at: mins * 60 }; break; }
    }
    if (!next) {
      var fajrMin = toMinutes(SCHEDULE.Fajr.iqamah || SCHEDULE.Fajr.adhan);
      next = { key: "Fajr", at: (24 * 60 + fajrMin) * 60, tomorrow: true };
    }

    var nameEl = host.querySelector("[data-countdown-name]");
    var valEl = host.querySelector("[data-countdown-value]");
    host.querySelectorAll("[data-prayer-rows] li").forEach(function (li) {
      li.removeAttribute("data-next");
    });
    if (!valEl) return;

    var diff = Math.max(0, next.at - nowSec);
    var h = Math.floor(diff / 3600);
    var m = Math.floor((diff % 3600) / 60);
    var s = diff % 60;
    valEl.textContent = (h > 0 ? h + "h " : "") + m + "m " + pad(s) + "s";
    if (nameEl) nameEl.textContent = "until " + next.key + (next.tomorrow ? " (tomorrow)" : "");

    var el = host.querySelector('[data-prayer-rows] li[data-slot="' + next.key + '"]');
    if (el) el.setAttribute("data-next", "true");
  }

  render();
  tick();
  setInterval(tick, 1000);
})();
