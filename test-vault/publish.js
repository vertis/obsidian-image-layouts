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
}, f = (n) => {
  const o = n.split(`
`), e = {
    data: {},
    content: n
  };
  if (o[0] !== "---")
    return e;
  const t = o.slice(1).findIndex((l) => l === "---") + 1;
  return t === 0 || (o.slice(1, t).join(`
`).split(`
`).forEach((l) => {
    const [d, ...p] = l.split(":").map((u) => u.trim()), m = p.join(":").trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    d && m && (m === "true" ? e.data[d] = !0 : m === "false" ? e.data[d] = !1 : e.data[d] = m);
  }), e.content = o.slice(t + 1).join(`
`)), e;
}, k = (n) => {
  const o = n.match(/\[([^\]]*)\]\(([^\(]*)\)/);
  if (o) {
    const [e, t, s] = o;
    return { url: s, alt: t };
  }
  return null;
}, y = (n) => n.split(`
`).filter((t) => t.startsWith("!")).map((t) => k(t.slice(1))).filter((t) => t !== null);
console.log("Image Layouts loading...");
function v(n, o, e) {
  const t = document.createElement("div");
  t.className = `image-layouts image-layouts-grid image-layouts-layout-${o}`;
  const s = h[o];
  if ((n.length < s ? [
    ...n,
    ...Array(s - n.length).fill({
      url: "https://via.placeholder.com/640x480"
    })
  ] : n.slice(0, s)).forEach((l, d) => {
    var u;
    const p = document.createElement("div");
    p.className = `group relative image-layouts-image-${d}`;
    const m = document.createElement("img");
    if (m.src = l.url, m.alt = l.alt || `Image ${d + 1}`, m.className = "w-full h-full object-cover object-center", l.alt || e.descriptions && e.descriptions[d]) {
      const c = ((u = e.descriptions) == null ? void 0 : u[d]) || l.alt, r = document.createElement("div");
      r.className = "absolute bottom-0 left-0 right-0 flex items-end p-4", r.setAttribute("aria-hidden", "true"), e.permanentOverlay || r.classList.add("opacity-0", "group-hover:opacity-100");
      const i = document.createElement("div");
      i.className = "w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter", i.textContent = c, r.appendChild(i), p.appendChild(r);
    }
    p.appendChild(m), t.appendChild(p);
  }), e.caption) {
    const l = document.createElement("div");
    l.className = "text-center mt-2 text-sm text-gray-600", l.textContent = e.caption, t.appendChild(l);
  }
  return t;
}
function b(n, o, e) {
  const t = document.createElement("div");
  t.className = `image-layouts-masonry-grid-${o}`;
  const s = Array(o).fill(null).map(() => {
    const a = document.createElement("div");
    return a.className = "image-layouts-masonry-column", a;
  });
  if (n.forEach((a, l) => {
    var u;
    const d = l % o, p = document.createElement("div");
    p.className = "group relative";
    const m = document.createElement("img");
    if (m.src = a.url, m.alt = a.alt || `Image ${l + 1}`, m.className = "w-full h-full object-cover object-center", a.alt || e.descriptions && e.descriptions[l]) {
      const c = ((u = e.descriptions) == null ? void 0 : u[l]) || a.alt, r = document.createElement("div");
      r.className = "absolute bottom-0 left-0 right-0 flex items-end p-4", r.setAttribute("aria-hidden", "true"), e.permanentOverlay || r.classList.add("opacity-0", "group-hover:opacity-100");
      const i = document.createElement("div");
      i.className = "w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter", i.textContent = c, r.appendChild(i), p.appendChild(r);
    }
    p.appendChild(m), s[d].appendChild(p);
  }), s.forEach((a) => t.appendChild(a)), e.caption) {
    const a = document.createElement("div");
    a.className = "text-center mt-2 text-sm text-gray-600", a.textContent = e.caption, t.appendChild(a);
  }
  return t;
}
function w(n, o) {
  const e = document.createElement("div");
  e.className = "image-layout-carousel";
  const t = document.createElement("div");
  t.className = "slides-container";
  for (const [c, r] of n.entries()) {
    const i = document.createElement("div");
    i.className = `slide${c === 0 ? " active" : ""}`;
    const g = document.createElement("img");
    g.src = r.url, g.alt = r.alt || `Image ${c + 1}`, i.appendChild(g), t.appendChild(i);
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
  function d(c) {
    const r = Array.from(
      t.getElementsByClassName("slide")
    );
    if (r[l].classList.remove("active"), r[c].classList.add("active"), u) {
      const i = Array.from(
        u.getElementsByTagName("img")
      );
      i[l].classList.remove("active"), i[c].classList.add("active"), i[c].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
    l = c;
  }
  function p() {
    const c = (l + 1) % n.length;
    d(c);
  }
  function m() {
    const c = (l - 1 + n.length) % n.length;
    d(c);
  }
  a.onclick = p, s.onclick = m, e.tabIndex = 0, e.onkeydown = (c) => {
    c.key === "ArrowLeft" && m(), c.key === "ArrowRight" && p();
  };
  let u;
  if (o) {
    u = document.createElement("div"), u.className = "thumbnails-container";
    for (let c = 0; c < n.length; c++) {
      const r = document.createElement("div");
      r.className = "thumbnail-item";
      const i = document.createElement("img");
      i.src = n[c].url, i.alt = n[c].alt || `Thumbnail ${c + 1}`, c === 0 && i.classList.add("active"), i.onclick = () => d(c), r.appendChild(i), u.appendChild(r);
    }
  }
  return e.appendChild(t), e.appendChild(s), e.appendChild(a), u && e.appendChild(u), e;
}
publish.registerMarkdownCodeBlockProcessor("image-layout", (n, o) => {
  console.log("Processing image-layout block:", { source: n });
  const { data: e, content: t } = f(n), s = y(t);
  if (!e.layout) {
    console.error("No layout specified in front matter");
    return;
  }
  for (console.log("Parsed config:", { data: e, images: s }); o.firstChild; )
    o.removeChild(o.firstChild);
  const a = C(String(e.layout), s, e);
  a && o.appendChild(a);
});
function C(n, o, e) {
  const t = n.startsWith("legacy-layout-") ? n.slice(14) : n.startsWith("legacy-masonry-") ? `masonry-${n.slice(15)}` : n;
  if (t === "carousel")
    return w(o, e.showThumbnails !== !1);
  const s = t.match(/^masonry-([2-6])$/);
  return s ? b(o, parseInt(s[1]), e) : h[t] ? v(o, t, e) : null;
}
Object.keys(h).forEach((n) => {
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-${n}`,
    (o, e) => {
      const { data: t, content: s } = f(o), a = y(s), l = v(a, n, t);
      e.replaceChildren(l);
    }
  );
});
for (let n = 2; n <= 6; n++)
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-masonry-${n}`,
    (o, e) => {
      const { data: t, content: s } = f(o), a = y(s), l = b(a, n, t);
      e.replaceChildren(l);
    }
  );
console.log("Image Layouts loaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("Processing existing image-layout blocks");
  const n = document.querySelectorAll("pre > code.language-image-layout");
  console.log("Found blocks:", n.length);
  for (const o of n) {
    const e = o.textContent || "", { data: t, content: s } = f(e), a = y(s);
    if (console.log("Processing block:", { data: t, images: a }), a.length > 0) {
      let l;
      if (o.className.includes("language-image-layout-masonry-")) {
        const d = parseInt(o.className.split("-").pop() || "2");
        l = b(a, d, t);
      } else if (o.className.includes("language-image-layout-")) {
        const d = o.className.split("-").pop();
        h[d] && (l = v(a, d, t));
      } else
        t.layout && (l = C(String(t.layout), a, t));
      l && o.parentElement && (console.log("Replacing block with layout"), o.parentElement.replaceWith(l));
    }
  }
});
