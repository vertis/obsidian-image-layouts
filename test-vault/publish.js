const $ = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="#88888822"/><circle cx="240" cy="170" r="36" fill="#88888855"/><path d="M120 360l110-140 80 95 60-60 130 105z" fill="#88888855"/></svg>'
)}`, f = {
  a: 2,
  b: 2,
  c: 2,
  d: 3,
  e: 3,
  f: 4,
  g: 4,
  h: 3,
  i: 4,
  single: 1
}, y = (n) => {
  const t = n.split(`
`), o = {
    data: {},
    content: n
  };
  if (t[0] !== "---")
    return o;
  const e = t.slice(1).findIndex((l) => l === "---") + 1;
  if (e === 0)
    return o;
  const a = t.slice(1, e).join(`
`).split(`
`);
  for (let l = 0; l < a.length; l++) {
    const c = a[l], [i, ...d] = c.split(":").map((r) => r.trim()), m = d.join(":").trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    if (i && /^[|>][+-]?\d*$/.test(m)) {
      const r = [];
      for (; l + 1 < a.length && (/^\s/.test(a[l + 1]) || a[l + 1] === ""); )
        l++, r.push(a[l].trim());
      o.data[i] = r.join(`
`);
      continue;
    }
    i && m && (m === "true" ? o.data[i] = !0 : m === "false" ? o.data[i] = !1 : o.data[i] = m);
  }
  return o.content = t.slice(e + 1).join(`
`), o;
}, M = (n) => {
  const t = n.match(/\[([^\]]*)\]\(([^\(]*)\)/);
  if (t) {
    const [o, e, s] = t;
    return { url: s, alt: e };
  }
  return null;
}, v = (n) => n.split(`
`).filter((e) => e.startsWith("!")).map((e) => M(e.slice(1))).filter((e) => e !== null);
console.log("Image Layouts loading...");
function k(n, t) {
  return n.length < t ? [
    ...n,
    ...Array(t - n.length).fill({ url: $ })
  ] : n.slice(0, t);
}
function w(n, t, o) {
  var l;
  const e = document.createElement("div");
  e.className = "group relative";
  const s = document.createElement("img");
  s.src = n.url, s.alt = n.alt || `Image ${t + 1}`, s.className = "w-full h-full object-cover object-center";
  const a = ((l = o.descriptions) == null ? void 0 : l[t]) || n.alt;
  if (a) {
    const c = document.createElement("div");
    c.className = "absolute bottom-0 left-0 right-0 flex items-end p-4", c.setAttribute("aria-hidden", "true"), o.permanentOverlay || c.classList.add("opacity-0", "group-hover:opacity-100");
    const i = document.createElement("div");
    i.className = "w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter", i.textContent = a, c.appendChild(i), e.appendChild(c);
  }
  return e.appendChild(s), e;
}
function C(n, t) {
  if (!t.caption)
    return n;
  const o = document.createElement("div");
  o.appendChild(n);
  const e = document.createElement("div");
  return e.className = "text-center mt-2 text-sm text-gray-600", e.textContent = t.caption, o.appendChild(e), o;
}
function b(n, t, o) {
  const e = document.createElement("div");
  return e.className = `image-layouts image-layouts-grid image-layouts-layout-${t}`, k(n, f[t]).forEach((a, l) => {
    const c = w(a, l, o);
    c.classList.add(`image-layouts-image-${l}`), e.appendChild(c);
  }), C(e, o);
}
function E(n, t, o) {
  const e = document.createElement("div");
  e.className = `image-layouts-masonry-grid-${t}`;
  const s = Array(t).fill(null).map(() => {
    const a = document.createElement("div");
    return a.className = "image-layouts-masonry-column", a;
  });
  return n.forEach((a, l) => {
    const c = l % t;
    s[c].appendChild(
      w(a, l, o)
    );
  }), s.forEach((a) => e.appendChild(a)), C(e, o);
}
function T(n, t) {
  const o = document.createElement("div");
  o.className = "image-layout-carousel";
  const e = document.createElement("div");
  e.className = "slides-container";
  for (const [r, g] of n.entries()) {
    const u = document.createElement("div");
    u.className = `slide${r === 0 ? " active" : ""}`;
    const p = document.createElement("img");
    p.src = g.url, p.alt = g.alt || `Image ${r + 1}`, u.appendChild(p), e.appendChild(u);
  }
  const s = document.createElement("button");
  s.className = "nav-button prev", s.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  `;
  const a = document.createElement("button");
  a.className = "nav-button next", a.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  `;
  let l = 0;
  function c(r) {
    const g = Array.from(
      e.getElementsByClassName("slide")
    );
    if (g[l].classList.remove("active"), g[r].classList.add("active"), m) {
      const u = Array.from(
        m.getElementsByTagName("img")
      );
      u[l].classList.remove("active"), u[r].classList.add("active"), u[r].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
    l = r;
  }
  function i() {
    const r = (l + 1) % n.length;
    c(r);
  }
  function d() {
    const r = (l - 1 + n.length) % n.length;
    c(r);
  }
  a.onclick = i, s.onclick = d, o.tabIndex = 0, o.onkeydown = (r) => {
    r.key === "ArrowLeft" && d(), r.key === "ArrowRight" && i();
  };
  let m;
  if (t) {
    m = document.createElement("div"), m.className = "thumbnails-container";
    for (let r = 0; r < n.length; r++) {
      const g = document.createElement("div");
      g.className = "thumbnail-item";
      const u = document.createElement("img");
      u.src = n[r].url, u.alt = n[r].alt || `Thumbnail ${r + 1}`, r === 0 && u.classList.add("active"), u.onclick = () => c(r), g.appendChild(u), m.appendChild(g);
    }
  }
  return o.appendChild(e), o.appendChild(s), o.appendChild(a), m && o.appendChild(m), o;
}
publish.registerMarkdownCodeBlockProcessor("image-layout", (n, t) => {
  console.log("Processing image-layout block:", { source: n });
  const { data: o, content: e } = y(n), s = v(e);
  if (!o.layout) {
    console.error("No layout specified in front matter");
    return;
  }
  for (console.log("Parsed config:", { data: o, images: s }); t.firstChild; )
    t.removeChild(t.firstChild);
  const a = x(String(o.layout), s, o);
  a && t.appendChild(a);
});
function x(n, t, o) {
  const e = n.startsWith("legacy-layout-") ? n.slice(14) : n.startsWith("legacy-masonry-") ? `masonry-${n.slice(15)}` : n;
  if (e === "carousel")
    return T(t, o.showThumbnails !== !1);
  if (e === "custom")
    return A(t, String(o.grid ?? ""), o);
  const s = e.match(/^masonry-([2-6])$/);
  return s ? E(t, parseInt(s[1]), o) : f[e] ? b(t, e, o) : null;
}
function h(n) {
  const t = document.createElement("div");
  return t.className = "image-layouts-error", t.style.cssText = "color: #888; font-size: 0.85em; padding: 0.5rem; border: 1px dashed #8886; border-radius: 6px; white-space: pre-wrap;", t.textContent = `Image Layouts: ${n}`, t;
}
function A(n, t, o) {
  const e = t.split(`
`).map((i) => i.trim()).filter((i) => i !== "").map((i) => i.split(/\s+/));
  if (e.length === 0)
    return h("A custom layout needs a `grid` option.");
  const s = e[0].length;
  if (e.some((i) => i.length !== s))
    return h(
      "Every row in `grid` must have the same number of cells."
    );
  const a = [];
  for (const i of e)
    for (const d of i)
      d !== "." && !a.includes(d) && a.push(d);
  if (a.length === 0)
    return h("The `grid` needs at least one image cell.");
  if (a.length > 20)
    return h("`grid` supports up to 20 images.");
  for (const i of a) {
    let d = Number.POSITIVE_INFINITY, m = -1, r = Number.POSITIVE_INFINITY, g = -1, u = 0;
    for (const [p, N] of e.entries())
      for (const [I, L] of N.entries())
        L === i && (d = Math.min(d, p), m = Math.max(m, p), r = Math.min(r, I), g = Math.max(g, I), u++);
    if (u !== (m - d + 1) * (g - r + 1))
      return h(
        `The cells for "${i}" must form a solid rectangle.`
      );
  }
  const l = document.createElement("div");
  return l.className = "image-layouts image-layouts-grid", l.style.display = "grid", l.style.gap = "0.5rem", l.style.gridTemplateColumns = `repeat(${s}, 1fr)`, l.style.gridTemplateAreas = e.map(
    (i) => `"${i.map((d) => d === "." ? "." : `image-${a.indexOf(d)}`).join(" ")}"`
  ).join(" "), k(n, a.length).forEach((i, d) => {
    const m = w(i, d, o);
    m.style.gridArea = `image-${d}`, l.appendChild(m);
  }), C(l, o);
}
Object.keys(f).forEach((n) => {
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-${n}`,
    (t, o) => {
      const { data: e, content: s } = y(t), a = v(s), l = b(a, n, e);
      o.replaceChildren(l);
    }
  );
});
for (let n = 2; n <= 6; n++)
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-masonry-${n}`,
    (t, o) => {
      const { data: e, content: s } = y(t), a = v(s), l = E(a, n, e);
      o.replaceChildren(l);
    }
  );
console.log("Image Layouts loaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("Processing existing image-layout blocks");
  const n = document.querySelectorAll("pre > code.language-image-layout");
  console.log("Found blocks:", n.length);
  for (const t of n) {
    const o = t.textContent || "", { data: e, content: s } = y(o), a = v(s);
    if (console.log("Processing block:", { data: e, images: a }), a.length > 0) {
      let l;
      if (t.className.includes("language-image-layout-masonry-")) {
        const c = parseInt(t.className.split("-").pop() || "2");
        l = E(a, c, e);
      } else if (t.className.includes("language-image-layout-")) {
        const c = t.className.split("-").pop();
        f[c] && (l = b(a, c, e));
      } else
        e.layout && (l = x(String(e.layout), a, e));
      l && t.parentElement && (console.log("Replacing block with layout"), t.parentElement.replaceWith(l));
    }
  }
});
