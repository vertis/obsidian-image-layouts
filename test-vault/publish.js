const g = {
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
}, y = (l) => {
  const a = l.split(`
`), e = {
    data: {},
    content: l
  };
  if (a[0] !== "---")
    return e;
  const n = a.slice(1).findIndex((o) => o === "---") + 1;
  return n === 0 || (a.slice(1, n).join(`
`).split(`
`).forEach((o) => {
    const [d, ...p] = o.split(":").map((u) => u.trim()), m = p.join(":").trim();
    d && m && (m === "true" ? e.data[d] = !0 : m === "false" ? e.data[d] = !1 : e.data[d] = m);
  }), e.content = a.slice(n + 1).join(`
`)), e;
}, w = (l) => {
  const a = l.match(/\[([^\]]*)\]\(([^\(]*)\)/);
  if (a) {
    const [e, n, c] = a;
    return { url: c, alt: n };
  }
  return null;
}, f = (l) => l.split(`
`).filter((n) => n.startsWith("!")).map((n) => w(n.slice(1))).filter((n) => n !== null);
console.log("Image Layouts loading...");
function v(l, a, e) {
  const n = document.createElement("div");
  n.className = `image-layouts image-layouts-grid image-layouts-layout-${a}`;
  const c = g[a];
  if ((l.length < c ? [
    ...l,
    ...Array(c - l.length).fill({
      url: "https://via.placeholder.com/640x480"
    })
  ] : l.slice(0, c)).forEach((o, d) => {
    var u;
    const p = document.createElement("div");
    p.className = `group relative image-layouts-image-${d}`;
    const m = document.createElement("img");
    if (m.src = o.url, m.alt = o.alt || `Image ${d + 1}`, m.className = "w-full h-full object-cover object-center", o.alt || e.descriptions && e.descriptions[d]) {
      const s = ((u = e.descriptions) == null ? void 0 : u[d]) || o.alt, r = document.createElement("div");
      r.className = "absolute bottom-0 left-0 right-0 flex items-end p-4", r.setAttribute("aria-hidden", "true"), e.permanentOverlay || r.classList.add("opacity-0", "group-hover:opacity-100");
      const i = document.createElement("div");
      i.className = "w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter", i.textContent = s, r.appendChild(i), p.appendChild(r);
    }
    p.appendChild(m), n.appendChild(p);
  }), e.caption) {
    const o = document.createElement("div");
    o.className = "text-center mt-2 text-sm text-gray-600", o.textContent = e.caption, n.appendChild(o);
  }
  return n;
}
function b(l, a, e) {
  const n = document.createElement("div");
  n.className = `image-layouts-masonry-grid-${a}`;
  const c = Array(a).fill(null).map(() => {
    const t = document.createElement("div");
    return t.className = "image-layouts-masonry-column", t;
  });
  if (l.forEach((t, o) => {
    var u;
    const d = o % a, p = document.createElement("div");
    p.className = "group relative";
    const m = document.createElement("img");
    if (m.src = t.url, m.alt = t.alt || `Image ${o + 1}`, m.className = "w-full h-full object-cover object-center", t.alt || e.descriptions && e.descriptions[o]) {
      const s = ((u = e.descriptions) == null ? void 0 : u[o]) || t.alt, r = document.createElement("div");
      r.className = "absolute bottom-0 left-0 right-0 flex items-end p-4", r.setAttribute("aria-hidden", "true"), e.permanentOverlay || r.classList.add("opacity-0", "group-hover:opacity-100");
      const i = document.createElement("div");
      i.className = "w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter", i.textContent = s, r.appendChild(i), p.appendChild(r);
    }
    p.appendChild(m), c[d].appendChild(p);
  }), c.forEach((t) => n.appendChild(t)), e.caption) {
    const t = document.createElement("div");
    t.className = "text-center mt-2 text-sm text-gray-600", t.textContent = e.caption, n.appendChild(t);
  }
  return n;
}
function C(l, a) {
  const e = document.createElement("div");
  e.className = "image-layout-carousel";
  const n = document.createElement("div");
  n.className = "slides-container";
  for (const [s, r] of l.entries()) {
    const i = document.createElement("div");
    i.className = `slide${s === 0 ? " active" : ""}`;
    const h = document.createElement("img");
    h.src = r.url, h.alt = r.alt || `Image ${s + 1}`, i.appendChild(h), n.appendChild(i);
  }
  const c = document.createElement("button");
  c.className = "nav-button prev", c.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  `;
  const t = document.createElement("button");
  t.className = "nav-button next", t.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  `;
  let o = 0;
  function d(s) {
    const r = Array.from(
      n.getElementsByClassName("slide")
    );
    if (r[o].classList.remove("active"), r[s].classList.add("active"), u) {
      const i = Array.from(
        u.getElementsByTagName("img")
      );
      i[o].classList.remove("active"), i[s].classList.add("active"), i[s].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
    o = s;
  }
  function p() {
    const s = (o + 1) % l.length;
    d(s);
  }
  function m() {
    const s = (o - 1 + l.length) % l.length;
    d(s);
  }
  t.onclick = p, c.onclick = m, e.tabIndex = 0, e.onkeydown = (s) => {
    s.key === "ArrowLeft" && m(), s.key === "ArrowRight" && p();
  };
  let u;
  if (a) {
    u = document.createElement("div"), u.className = "thumbnails-container";
    for (let s = 0; s < l.length; s++) {
      const r = document.createElement("div");
      r.className = "thumbnail-item";
      const i = document.createElement("img");
      i.src = l[s].url, i.alt = l[s].alt || `Thumbnail ${s + 1}`, s === 0 && i.classList.add("active"), i.onclick = () => d(s), r.appendChild(i), u.appendChild(r);
    }
  }
  return e.appendChild(n), e.appendChild(c), e.appendChild(t), u && e.appendChild(u), e;
}
publish.registerMarkdownCodeBlockProcessor("image-layout", (l, a) => {
  console.log("Processing image-layout block:", { source: l });
  const { data: e, content: n } = y(l), c = f(n);
  if (!e.layout) {
    console.error("No layout specified in front matter");
    return;
  }
  for (console.log("Parsed config:", { data: e, images: c }); a.firstChild; )
    a.removeChild(a.firstChild);
  if (e.layout === "carousel") {
    console.log("Creating carousel with thumbnails:", e.showThumbnails);
    const t = C(c, e.showThumbnails !== !1);
    a.appendChild(t);
  } else if (e.layout.match(/^legacy-layout-[a-i]$/)) {
    const t = e.layout.charAt(e.layout.length - 1);
    if (g[t]) {
      const o = v(c, t, e);
      a.appendChild(o);
    }
  } else if (e.layout.match(/^legacy-masonry-[2-6]$/)) {
    const t = parseInt(e.layout.charAt(e.layout.length - 1));
    if (t >= 2 && t <= 6) {
      const o = b(c, t, e);
      a.appendChild(o);
    }
  }
});
Object.keys(g).forEach((l) => {
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-${l}`,
    (a, e) => {
      const { data: n, content: c } = y(a), t = f(c), o = v(t, l, n);
      e.replaceChildren(o);
    }
  );
});
for (let l = 2; l <= 6; l++)
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-masonry-${l}`,
    (a, e) => {
      const { data: n, content: c } = y(a), t = f(c), o = b(t, l, n);
      e.replaceChildren(o);
    }
  );
console.log("Image Layouts loaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("Processing existing image-layout blocks");
  const l = document.querySelectorAll("pre > code.language-image-layout");
  console.log("Found blocks:", l.length);
  for (const a of l) {
    const e = a.textContent || "", { data: n, content: c } = y(e), t = f(c);
    if (console.log("Processing block:", { data: n, images: t }), t.length > 0) {
      let o;
      if (a.className.includes("language-image-layout-masonry-")) {
        const d = parseInt(a.className.split("-").pop() || "2");
        o = b(t, d, n);
      } else if (a.className.includes("language-image-layout-")) {
        const d = a.className.split("-").pop();
        g[d] && (o = v(t, d, n));
      } else
        n.layout === "carousel" && (o = C(t, n.showThumbnails !== !1));
      o && a.parentElement && (console.log("Replacing block with layout"), a.parentElement.replaceWith(o));
    }
  }
});
