(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  root.classList.add("js");

  // Always open a page at the top (or at its #section). Some hosts carry the old scroll position over.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  // Once the reader has scrolled, never pull them back. On a phone "load" fires late.
  var readerMoved = false;
  ["touchstart", "wheel", "keydown", "pointerdown"].forEach(function (ev) {
    window.addEventListener(ev, function () { readerMoved = true; }, { passive: true, capture: true });
  });
  function toStart() {
    if (readerMoved) return;
    var id = location.hash.slice(1);
    var target = id && document.getElementById(decodeURIComponent(id));
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
  toStart();
  document.addEventListener("DOMContentLoaded", toStart);
  window.addEventListener("load", function () { toStart(); setTimeout(toStart, 60); setTimeout(toStart, 300); });
  window.addEventListener("pageshow", function (e) { if (e.persisted) { readerMoved = false; toStart(); } });

  // Toast
  var toastEl = $("#toast"), t;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(t); t = setTimeout(function () { toastEl.classList.remove("show"); }, 1800);
  }

  // Reading progress + hero parallax
  var bar = $(".progress b"), heroBg = $(".hero .bg"), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
      if (heroBg && !reduce) heroBg.style.transform = "translateY(" + (window.scrollY * 0.3).toFixed(1) + "px)";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal (transform only) and table of contents highlight
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    $all(".rv").forEach(function (el) { io.observe(el); });

    var tocLinks = $all(".toc a");
    if (tocLinks.length) {
      var heads = tocLinks.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
      var spy = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          tocLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      heads.forEach(function (h) { if (h) spy.observe(h); });
    }
  } else {
    $all(".rv").forEach(function (el) { el.classList.add("in"); });
  }

  // Card spotlight
  $all(".card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // Tag filter on the index
  var chips = $all(".chip"), cards = $all("[data-tags]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var tag = chip.dataset.tag;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      function apply() { cards.forEach(function (card) { card.hidden = !(tag === "all" || card.dataset.tags.split("|").indexOf(tag) !== -1); }); }
      if (document.startViewTransition && !reduce) document.startViewTransition(apply); else apply();
    });
  });

  // Lightbox for figures
  var lb = $("#lightbox");
  $all("button.zoom").forEach(function (b) {
    b.addEventListener("click", function () {
      var img = b.querySelector("img");
      $("#lightbox-img").src = img.currentSrc || img.src; $("#lightbox-img").alt = img.alt;
      if (lb && lb.showModal) lb.showModal();
    });
  });
  if (lb) lb.addEventListener("click", function () { lb.close(); });

  // Copy link
  $all("[data-copy-link]").forEach(function (b) {
    b.addEventListener("click", function () {
      var url = b.getAttribute("data-copy-link");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { toast("Link copied"); }, function () { toast(url); });
      } else { toast(url); }
    });
  });

  // Embers in the hero
  var canvas = $(".hero canvas");
  if (canvas && !reduce) {
    var ctx = canvas.getContext("2d"), W = 0, H = 0, motes = [];
    function size() {
      var d = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * d; canvas.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    function mote(any) { return { x: Math.random() * W, y: any ? Math.random() * H : H + 8, r: .6 + Math.random() * 2, v: .2 + Math.random() * .6, p: Math.random() * 6.3 }; }
    size();
    for (var i = 0; i < (W < 700 ? 30 : 60); i++) motes.push(mote(true));
    window.addEventListener("resize", size);
    var visible = true;
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(canvas);
    (function frame(ts) {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      var s = ts / 1000;
      motes.forEach(function (m, k) {
        m.y -= m.v; m.x += Math.sin(s + m.p) * .3;
        if (m.y < -10) motes[k] = mote(false);
        var a = .5 + .4 * Math.sin(s * 3 + m.p * 4);
        ctx.fillStyle = "rgba(255,190,110," + (a * .16).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 4, 0, 6.283); ctx.fill();
        ctx.fillStyle = "rgba(255,210,140," + a.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
    })(0);
  }
})();
