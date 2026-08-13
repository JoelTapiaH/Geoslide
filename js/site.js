/* ============================================================
   GEOBUILDING — comportamiento del sitio
   1. Menú móvil
   2. Rail de cota (la profundidad sigue al scroll)
   3. Revelado de secciones
   4. Animación del corte de portada
   5. Perfil de excavaciones (gráfico + tooltip)
   6. Formularios de contacto
   ============================================================ */

(function () {
  "use strict";

  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Datos de obra (fichas técnicas GEOBUILDING) ---------- */
  var OBRAS = [
    { obra: "CAMINO REAL",           ml: 5920, nfc: 31.40, sotanos: "Nueve",           dias: 281, anclaje: 19, carga: 105, fs: 1.52, fsp: 1.28 },
    { obra: "S2431",                 ml: 2365, nfc: 22.20, sotanos: "Seis",            dias: 248, anclaje: 16, carga: 90,  fs: 1.53, fsp: 1.29 },
    { obra: "ROMA",                  ml: 1516, nfc: 21.20, sotanos: "Seis",            dias: 91,  anclaje: 14, carga: 105, fs: 1.53, fsp: 1.28 },
    { obra: "ANTONIO BAZO 1166",     ml: 1129, nfc: 21.00, sotanos: "Seis",            dias: 161, anclaje: 15, carga: 105, fs: 1.50, fsp: 1.30 },
    { obra: "TOVAR 121",             ml: 1720, nfc: 20.75, sotanos: "Seis",            dias: 143, anclaje: 15, carga: 105, fs: 1.52, fsp: 1.30 },
    { obra: "PARDO 669",             ml: 2828, nfc: 20.60, sotanos: "Seis",            dias: null, anclaje: 15, carga: 90, fs: 1.51, fsp: 1.30 },
    { obra: "BENAVIDES 1130",        ml: 1057, nfc: 20.20, sotanos: "Seis",            dias: 84,  anclaje: 15, carga: 90,  fs: 1.54, fsp: 1.27 },
    { obra: "CANAVAL 185",           ml: 1213, nfc: 19.25, sotanos: "Seis y medio",    dias: 111, anclaje: 14, carga: 90,  fs: 1.59, fsp: 1.29 },
    { obra: "ROOSEVELT",             ml: 1330, nfc: 18.80, sotanos: "Cinco",           dias: 94,  anclaje: 15, carga: 90,  fs: 1.57, fsp: 1.25 },
    { obra: "LARCO 791",             ml: 2096, nfc: 17.85, sotanos: "Cinco y medio",   dias: 110, anclaje: 15, carga: 105, fs: 1.58, fsp: 1.36 },
    { obra: "LIBERTY ONE",           ml: 814,  nfc: 16.80, sotanos: "Cinco",           dias: 87,  anclaje: 14, carga: 90,  fs: 1.61, fsp: 1.34 },
    { obra: "BOLIVAR 1220",          ml: 538,  nfc: 13.75, sotanos: "Cuatro",          dias: 101, anclaje: 12, carga: 75,  fs: 1.57, fsp: 1.28 },
    { obra: "CAMINOS DEL INCA 1396", ml: 322,  nfc: 12.25, sotanos: "Tres y medio",    dias: 21,  anclaje: 11, carga: 75,  fs: 1.55, fsp: 1.32 },
    { obra: "REPUBLICA DE CHILE",    ml: 768,  nfc: 11.70, sotanos: "Tres",            dias: 36,  anclaje: 15, carga: 90,  fs: 1.60, fsp: 1.34 },
    { obra: "GRAU 455",              ml: 1254, nfc: 10.65, sotanos: "Tres",            dias: 98,  anclaje: 14, carga: 75,  fs: 1.58, fsp: 1.30 },
    { obra: "JACINTO LARA 340",      ml: 385,  nfc: 9.30,  sotanos: "Tres",            dias: null, anclaje: 10, carga: 90, fs: 1.56, fsp: 1.40 }
  ];
  window.GEO_OBRAS = OBRAS;

  var nf = new Intl.NumberFormat("es-PE");

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- 1. Menú móvil ---------- */
  function menu() {
    var btn = $("[data-menu-btn]");
    var nav = $("[data-nav]");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var abierto = nav.getAttribute("data-abierto") === "true";
      nav.setAttribute("data-abierto", String(!abierto));
      btn.setAttribute("aria-expanded", String(!abierto));
      btn.textContent = abierto ? "Menú" : "Cerrar";
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.setAttribute("data-abierto", "false");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "Menú";
      });
    });
  }

  /* ---------- 2. Rail de cota ---------- */
  function rail() {
    var lectura = $("[data-cota]");
    if (!lectura) return;
    var fondo = parseFloat(lectura.getAttribute("data-fondo") || "31.4");
    var pend = false;

    function pinta() {
      pend = false;
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      var p = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
      lectura.textContent = "−" + (p * fondo).toFixed(2) + " m";
    }
    window.addEventListener("scroll", function () {
      if (!pend) { pend = true; window.requestAnimationFrame(pinta); }
    }, { passive: true });
    window.addEventListener("resize", pinta);
    pinta();
  }

  /* ---------- 3. Revelado ---------- */
  function revelar() {
    var items = $$(".rev");
    if (!items.length) return;
    if (reducido || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.setAttribute("data-visible", "true"); });
      return;
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.setAttribute("data-visible", "true");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3b. Video del hero ----------
     Solo se descarga en pantallas grandes y con movimiento permitido.
     En móvil o con reduced-motion queda el póster, que ya está en el HTML. */
  function heroVideo() {
    var media = $("[data-hero-video]");
    if (!media) return;
    if (reducido || window.innerWidth < 760) return;

    var v = document.createElement("video");
    v.src = media.getAttribute("data-hero-video");
    v.poster = media.getAttribute("data-hero-poster");
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("aria-hidden", "true");
    v.preload = "auto";
    v.style.opacity = "0";
    v.style.transition = "opacity .8s ease";

    v.addEventListener("playing", function () {
      v.style.opacity = "1";
      var img = media.querySelector("img");
      if (img) img.style.visibility = "hidden";
    });
    v.addEventListener("error", function () { v.remove(); });

    media.appendChild(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () { v.remove(); });
  }

  /* ---------- 4. Corte de portada ---------- */
  function corte() {
    var svg = $("[data-corte]");
    if (!svg) return;
    $$(".corte__traza", svg).forEach(function (p) {
      var l = p.getTotalLength ? p.getTotalLength() : 600;
      p.style.setProperty("--len", Math.ceil(l));
    });
    window.requestAnimationFrame(function () { svg.classList.add("corte--anim"); });
  }

  /* ---------- 5. Perfil de excavaciones ---------- */
  function perfil() {
    var host = $("[data-perfil]");
    if (!host) return;

    var lista = OBRAS.slice().sort(function (a, b) { return b.nfc - a.nfc; });
    var limite = parseInt(host.getAttribute("data-limite") || "0", 10);
    if (limite > 0) lista = lista.slice(0, limite);

    var W = 1180, H = 460;
    var mIzq = 56, mDer = 18, mSup = 40, mInf = 74;
    var pw = W - mIzq - mDer, ph = H - mSup - mInf;
    var maxProf = 32;
    var y = function (m) { return mSup + (m / maxProf) * ph; };
    var paso = pw / lista.length;
    var ancho = Math.min(46, paso * 0.52);

    var ns = "http://www.w3.org/2000/svg";
    function el(n, a) {
      var e = document.createElementNS(ns, n);
      for (var k in a) if (a.hasOwnProperty(k)) e.setAttribute(k, a[k]);
      return e;
    }

    var svg = el("svg", {
      viewBox: "0 0 " + W + " " + H,
      class: "perfil__svg",
      role: "img",
      "aria-label": "Profundidad de excavación alcanzada en " + lista.length + " obras, de 9,30 a 31,40 metros bajo el nivel de calle."
    });

    /* Retícula de cotas cada 5 m */
    for (var m = 0; m <= 30; m += 5) {
      svg.appendChild(el("line", {
        x1: mIzq, x2: W - mDer, y1: y(m), y2: y(m),
        stroke: m === 0 ? "#E6EAF2" : "#263149",
        "stroke-width": m === 0 ? 1.5 : 1
      }));
      var t = el("text", { x: mIzq - 10, y: y(m) + 3.5, "text-anchor": "end", class: "perfil__et" });
      t.textContent = m === 0 ? "0.00" : "−" + m + ".00";
      svg.appendChild(t);
    }
    var cal = el("text", { x: mIzq, y: mSup - 14, class: "perfil__et" });
    cal.textContent = "N.P.T. CALLE";
    svg.appendChild(cal);

    var tip = host.querySelector(".tip");

    lista.forEach(function (o, i) {
      var cx = mIzq + paso * i + paso / 2;
      var alto = y(o.nfc) - y(0);
      var g = el("g", { class: "perfil__g", tabindex: "0", role: "listitem" });

      /* Barra = profundidad alcanzada (una sola medida por eje) */
      var r = el("rect", {
        x: cx - ancho / 2, y: y(0), width: ancho, height: alto,
        rx: 0, class: "perfil__barra", fill: "#3A66CF"
      });
      /* extremo redondeado en el fondo de la excavación */
      var cap = el("rect", {
        x: cx - ancho / 2, y: y(o.nfc) - 8, width: ancho, height: 8,
        rx: 4, class: "perfil__barra", fill: "#3A66CF"
      });
      g.appendChild(r);
      g.appendChild(cap);

      /* Cota al pie */
      var c = el("text", { x: cx, y: y(o.nfc) + 17, "text-anchor": "middle", class: "perfil__et" });
      c.textContent = "−" + o.nfc.toFixed(2);
      g.appendChild(c);

      /* Rótulo de obra, vertical */
      var n = el("text", {
        x: cx, y: H - mInf + 16, "text-anchor": "end", class: "perfil__et",
        transform: "rotate(-90 " + cx + " " + (H - mInf + 16) + ")"
      });
      n.textContent = o.obra;
      g.appendChild(n);

      function ver(ev) {
        if (!tip) return;
        var caja = host.getBoundingClientRect();
        var px, py;
        if (ev && ev.clientX) {
          px = ev.clientX - caja.left;
          py = ev.clientY - caja.top;
        } else {
          var b = r.getBoundingClientRect();
          px = b.left + b.width / 2 - caja.left;
          py = b.top - caja.top;
        }
        tip.style.left = px + "px";
        tip.style.top = py + "px";
        tip.innerHTML =
          '<span class="tip__t">' + o.obra + "</span>" +
          fila("Profundidad", "−" + o.nfc.toFixed(2) + " m") +
          fila("Sótanos", o.sotanos) +
          fila("Perforación", nf.format(o.ml) + " ml") +
          fila("Ejecución", o.dias ? o.dias + " días" : "En ejecución") +
          fila("Anclaje máx.", o.anclaje + " m · " + o.carga + " t") +
          fila("FS estático", o.fs.toFixed(2));
        tip.setAttribute("data-ver", "true");
      }
      function ocultar() { if (tip) tip.setAttribute("data-ver", "false"); }

      g.addEventListener("mousemove", ver);
      g.addEventListener("mouseenter", ver);
      g.addEventListener("mouseleave", ocultar);
      g.addEventListener("focus", ver);
      g.addEventListener("blur", ocultar);

      svg.appendChild(g);
    });

    function fila(k, v) {
      return '<span class="tip__f"><span>' + k + "</span><span>" + v + "</span></span>";
    }

    var scroller = host.querySelector(".perfil__scroll");
    (scroller || host).appendChild(svg);
  }

  /* ---------- 6. Formularios ---------- */
  function formularios() {
    $$("[data-form]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = f.querySelector(".form-ok");
        if (ok) {
          ok.setAttribute("data-ver", "true");
          ok.textContent = "Solicitud registrada. Te llamamos dentro del horario de atención (L–V, 8:00 a 18:00).";
        }
        f.reset();
      });
    });
  }

  /* ---------- Arranque ---------- */
  function init() {
    menu(); rail(); revelar(); heroVideo(); corte(); perfil(); formularios();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
