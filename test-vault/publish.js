const h = {
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
}, f = (l) => {
  const a = l.split(`
`), e = {
    data: {},
    content: l
  };
  if (a[0] !== "---")
    return e;
  const t = a.slice(1).findIndex((n) => n === "---") + 1;
  if (t === 0)
    return e;
  const o = a.slice(1, t).join(`
`).split(`
`);
  for (let n = 0; n < o.length; n++) {
    const p = o[n], [s, ...d] = p.split(":").map((r) => r.trim()), i = d.join(":").trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    if (s && (i === "|" || i === ">")) {
      const r = [];
      for (; n + 1 < o.length && (/^\s/.test(o[n + 1]) || o[n + 1] === ""); )
        n++, r.push(o[n].trim());
      e.data[s] = r.join(`
`);
      continue;
    }
    s && i && (i === "true" ? e.data[s] = !0 : i === "false" ? e.data[s] = !1 : e.data[s] = i);
  }
  return e.content = a.slice(t + 1).join(`
`), e;
}, w = (l) => {
  const a = l.match(/\[([^\]]*)\]\(([^\(]*)\)/);
  if (a) {
    const [e, t, c] = a;
    return { url: c, alt: t };
  }
  return null;
}, y = (l) => l.split(`
`).filter((t) => t.startsWith("!")).map((t) => w(t.slice(1))).filter((t) => t !== null);
console.log("Image Layouts loading...");
function v(l, a, e) {
  const t = document.createElement("div");
  t.className = `image-layouts image-layouts-grid image-layouts-layout-${a}`;
  const c = h[a];
  if ((l.length < c ? [
    ...l,
    ...Array(c - l.length).fill({
      url: "https://via.placeholder.com/640x480"
    })
  ] : l.slice(0, c)).forEach((n, p) => {
    var i;
    const s = document.createElement("div");
    s.className = `group relative image-layouts-image-${p}`;
    const d = document.createElement("img");
    if (d.src = n.url, d.alt = n.alt || `Image ${p + 1}`, d.className = "w-full h-full object-cover object-center", n.alt || e.descriptions && e.descriptions[p]) {
      const r = ((i = e.descriptions) == null ? void 0 : i[p]) || n.alt, m = document.createElement("div");
      m.className = "absolute bottom-0 left-0 right-0 flex items-end p-4", m.setAttribute("aria-hidden", "true"), e.permanentOverlay || m.classList.add("opacity-0", "group-hover:opacity-100");
      const u = document.createElement("div");
      u.className = "w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter", u.textContent = r, m.appendChild(u), s.appendChild(m);
    }
    s.appendChild(d), t.appendChild(s);
  }), e.caption) {
    const n = document.createElement("div");
    n.className = "text-center mt-2 text-sm text-gray-600", n.textContent = e.caption, t.appendChild(n);
  }
  return t;
}
function b(l, a, e) {
  const t = document.createElement("div");
  t.className = `image-layouts-masonry-grid-${a}`;
  const c = Array(a).fill(null).map(() => {
    const o = document.createElement("div");
    return o.className = "image-layouts-masonry-column", o;
  });
  if (l.forEach((o, n) => {
    var i;
    const p = n % a, s = document.createElement("div");
    s.className = "group relative";
    const d = document.createElement("img");
    if (d.src = o.url, d.alt = o.alt || `Image ${n + 1}`, d.className = "w-full h-full object-cover object-center", o.alt || e.descriptions && e.descriptions[n]) {
      const r = ((i = e.descriptions) == null ? void 0 : i[n]) || o.alt, m = document.createElement("div");
      m.className = "absolute bottom-0 left-0 right-0 flex items-end p-4", m.setAttribute("aria-hidden", "true"), e.permanentOverlay || m.classList.add("opacity-0", "group-hover:opacity-100");
      const u = document.createElement("div");
      u.className = "w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter", u.textContent = r, m.appendChild(u), s.appendChild(m);
    }
    s.appendChild(d), c[p].appendChild(s);
  }), c.forEach((o) => t.appendChild(o)), e.caption) {
    const o = document.createElement("div");
    o.className = "text-center mt-2 text-sm text-gray-600", o.textContent = e.caption, t.appendChild(o);
  }
  return t;
}
function E(l, a) {
  const e = document.createElement("div");
  e.className = "image-layout-carousel";
  const t = document.createElement("div");
  t.className = "slides-container";
  for (const [r, m] of l.entries()) {
    const u = document.createElement("div");
    u.className = `slide${r === 0 ? " active" : ""}`;
    const g = document.createElement("img");
    g.src = m.url, g.alt = m.alt || `Image ${r + 1}`, u.appendChild(g), t.appendChild(u);
  }
  const c = document.createElement("button");
  c.className = "nav-button prev", c.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  `;
  const o = document.createElement("button");
  o.className = "nav-button next", o.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  `;
  let n = 0;
  function p(r) {
    const m = Array.from(
      t.getElementsByClassName("slide")
    );
    if (m[n].classList.remove("active"), m[r].classList.add("active"), i) {
      const u = Array.from(
        i.getElementsByTagName("img")
      );
      u[n].classList.remove("active"), u[r].classList.add("active"), u[r].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
    n = r;
  }
  function s() {
    const r = (n + 1) % l.length;
    p(r);
  }
  function d() {
    const r = (n - 1 + l.length) % l.length;
    p(r);
  }
  o.onclick = s, c.onclick = d, e.tabIndex = 0, e.onkeydown = (r) => {
    r.key === "ArrowLeft" && d(), r.key === "ArrowRight" && s();
  };
  let i;
  if (a) {
    i = document.createElement("div"), i.className = "thumbnails-container";
    for (let r = 0; r < l.length; r++) {
      const m = document.createElement("div");
      m.className = "thumbnail-item";
      const u = document.createElement("img");
      u.src = l[r].url, u.alt = l[r].alt || `Thumbnail ${r + 1}`, r === 0 && u.classList.add("active"), u.onclick = () => p(r), m.appendChild(u), i.appendChild(m);
    }
  }
  return e.appendChild(t), e.appendChild(c), e.appendChild(o), i && e.appendChild(i), e;
}
publish.registerMarkdownCodeBlockProcessor("image-layout", (l, a) => {
  console.log("Processing image-layout block:", { source: l });
  const { data: e, content: t } = f(l), c = y(t);
  if (!e.layout) {
    console.error("No layout specified in front matter");
    return;
  }
  for (console.log("Parsed config:", { data: e, images: c }); a.firstChild; )
    a.removeChild(a.firstChild);
  const o = C(String(e.layout), c, e);
  o && a.appendChild(o);
});
function C(l, a, e) {
  const t = l.startsWith("legacy-layout-") ? l.slice(14) : l.startsWith("legacy-masonry-") ? `masonry-${l.slice(15)}` : l;
  if (t === "carousel")
    return E(a, e.showThumbnails !== !1);
  if (t === "custom")
    return x(a, String(e.grid ?? ""), e);
  const c = t.match(/^masonry-([2-6])$/);
  return c ? b(a, parseInt(c[1]), e) : h[t] ? v(a, t, e) : null;
}
function x(l, a, e) {
  const t = a.split(`
`).map((s) => s.trim()).filter((s) => s !== "").map((s) => s.split(/\s+/));
  if (t.length === 0)
    return null;
  const c = t[0].length;
  if (t.some((s) => s.length !== c))
    return null;
  const o = [];
  for (const s of t)
    for (const d of s)
      d !== "." && !o.includes(d) && o.push(d);
  if (o.length === 0)
    return null;
  const n = document.createElement("div");
  if (n.className = "image-layouts image-layouts-grid", n.style.display = "grid", n.style.gap = "0.5rem", n.style.gridTemplateColumns = `repeat(${c}, 1fr)`, n.style.gridTemplateAreas = t.map(
    (s) => `"${s.map((d) => d === "." ? "." : `image-${o.indexOf(d)}`).join(" ")}"`
  ).join(" "), (l.length < o.length ? [
    ...l,
    ...Array(o.length - l.length).fill({
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480'%3E%3Crect width='100%25' height='100%25' fill='%2388888822'/%3E%3C/svg%3E"
    })
  ] : l.slice(0, o.length)).forEach((s, d) => {
    const i = document.createElement("div");
    i.className = "group relative", i.style.gridArea = `image-${d}`;
    const r = document.createElement("img");
    r.src = s.url, r.alt = s.alt || `Image ${d + 1}`, r.className = "w-full h-full object-cover object-center", i.appendChild(r), n.appendChild(i);
  }), e.caption) {
    const s = document.createElement("div");
    s.className = "text-center mt-2 text-sm text-gray-600", s.textContent = e.caption, n.appendChild(s);
  }
  return n;
}
Object.keys(h).forEach((l) => {
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-${l}`,
    (a, e) => {
      const { data: t, content: c } = f(a), o = y(c), n = v(o, l, t);
      e.replaceChildren(n);
    }
  );
});
for (let l = 2; l <= 6; l++)
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-masonry-${l}`,
    (a, e) => {
      const { data: t, content: c } = f(a), o = y(c), n = b(o, l, t);
      e.replaceChildren(n);
    }
  );
console.log("Image Layouts loaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("Processing existing image-layout blocks");
  const l = document.querySelectorAll("pre > code.language-image-layout");
  console.log("Found blocks:", l.length);
  for (const a of l) {
    const e = a.textContent || "", { data: t, content: c } = f(e), o = y(c);
    if (console.log("Processing block:", { data: t, images: o }), o.length > 0) {
      let n;
      if (a.className.includes("language-image-layout-masonry-")) {
        const p = parseInt(a.className.split("-").pop() || "2");
        n = b(o, p, t);
      } else if (a.className.includes("language-image-layout-")) {
        const p = a.className.split("-").pop();
        h[p] && (n = v(o, p, t));
      } else
        t.layout && (n = C(String(t.layout), o, t));
      n && a.parentElement && (console.log("Replacing block with layout"), a.parentElement.replaceWith(n));
    }
  }
});
