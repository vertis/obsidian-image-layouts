const h = (i) => {
  const a = i.split(`
`), t = {
    data: {},
    content: i
  };
  if (a[0] !== "---")
    return t;
  const o = a.slice(1).findIndex((s) => s === "---") + 1;
  return o === 0 || (a.slice(1, o).join(`
`).split(`
`).forEach((s) => {
    const [c, ...p] = s.split(":").map((m) => m.trim()), u = p.join(":").trim();
    c && u && (u === "true" ? t.data[c] = !0 : u === "false" ? t.data[c] = !1 : t.data[c] = u);
  }), t.content = a.slice(o + 1).join(`
`)), t;
}, b = (i) => {
  const a = i.match(/\[([^\]]*)\]\(([^\(]*)\)/);
  if (a) {
    const [t, o, e] = a;
    return { url: e, alt: o };
  }
  return null;
}, g = (i) => i.split(`
`).filter((o) => o.startsWith("!")).map((o) => b(o.slice(1))).filter((o) => o !== null);
console.log("Image Layouts loading...");
publish.registerMarkdownCodeBlockProcessor("image-layout", (i, a) => {
  console.log("Processing image-layout block:", { source: i });
  const { data: t, content: o } = h(i), e = {
    layout: t.layout,
    carouselShowThumbnails: t.carouselShowThumbnails
  };
  if (!t) {
    console.error("Failed to parse front matter");
    return;
  }
  if (console.log("Parsed config:", e), e.layout === "carousel") {
    console.log("Creating carousel");
    const l = g(o);
    console.log("Parsed images:", l);
    const s = f(l, e.carouselShowThumbnails);
    for (; a.firstChild; )
      a.removeChild(a.firstChild);
    a.append(s);
  } else
    console.log("Not a carousel layout:", e.layout);
});
function f(i, a) {
  const t = document.createElement("div");
  t.className = "image-layout-carousel", t.style.position = "relative", t.style.width = "100%", t.style.height = "400px", t.style.overflow = "hidden";
  const o = document.createElement("div");
  o.className = "slides", o.style.position = "relative", o.style.width = "100%", o.style.height = "100%", i.forEach((r, d) => {
    const n = document.createElement("div");
    n.className = "slide", n.style.position = "absolute", n.style.top = "0", n.style.left = "0", n.style.width = "100%", n.style.height = "100%", n.style.opacity = d === 0 ? "1" : "0", n.style.transition = "opacity 0.5s ease-in-out";
    const y = document.createElement("img");
    y.src = r.url, r.alt && (y.alt = r.alt), y.style.width = "100%", y.style.height = "100%", y.style.objectFit = "contain", n.appendChild(y), o.appendChild(n);
  });
  const e = document.createElement("button");
  e.textContent = "←", e.className = "nav-button prev", e.style.position = "absolute", e.style.left = "10px", e.style.top = "50%", e.style.transform = "translateY(-50%)", e.style.zIndex = "1", e.style.padding = "10px", e.style.background = "rgba(0, 0, 0, 0.5)", e.style.color = "white", e.style.border = "none", e.style.borderRadius = "5px", e.style.cursor = "pointer";
  const l = document.createElement("button");
  l.textContent = "→", l.className = "nav-button next", l.style.position = "absolute", l.style.right = "10px", l.style.top = "50%", l.style.transform = "translateY(-50%)", l.style.zIndex = "1", l.style.padding = "10px", l.style.background = "rgba(0, 0, 0, 0.5)", l.style.color = "white", l.style.border = "none", l.style.borderRadius = "5px", l.style.cursor = "pointer";
  let s;
  a && (s = document.createElement("div"), s.className = "thumbnails", s.style.position = "absolute", s.style.bottom = "10px", s.style.left = "50%", s.style.transform = "translateX(-50%)", s.style.display = "flex", s.style.gap = "10px", s.style.zIndex = "1", i.forEach((r, d) => {
    const n = document.createElement("img");
    n.src = r.url, n.style.width = "50px", n.style.height = "50px", n.style.objectFit = "cover", n.style.cursor = "pointer", n.style.border = d === 0 ? "2px solid white" : "2px solid transparent", n.style.borderRadius = "5px", n.onclick = () => p(d), s.appendChild(n);
  }));
  let c = 0;
  function p(r) {
    const d = o.getElementsByClassName("slide");
    if (d[c].style.opacity = "0", d[r].style.opacity = "1", a && s) {
      const n = s.getElementsByTagName("img");
      n[c].style.border = "2px solid transparent", n[r].style.border = "2px solid white";
    }
    c = r;
  }
  function u() {
    const r = (c + 1) % i.length;
    p(r);
  }
  function m() {
    const r = (c - 1 + i.length) % i.length;
    p(r);
  }
  return l.onclick = u, e.onclick = m, t.appendChild(o), t.appendChild(e), t.appendChild(l), a && s && t.appendChild(s), t;
}
console.log("Image Layouts loaded");
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(
    "pre > code.language-image-layout"
  ).forEach((a) => {
    var s;
    const t = a.textContent || "", { data: o, content: e } = h(t), l = g(e);
    if (l.length > 0) {
      const c = f(l, o.showThumbnails);
      (s = a.parentElement) == null || s.replaceWith(c);
    }
  });
});
