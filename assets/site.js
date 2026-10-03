// Header hairline once the page scrolls.
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Fade sections in as they enter the viewport.
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }
  }, { rootMargin: "0px 0px -8% 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// Click-to-load YouTube: <button class="yt" data-id="VIDEO_ID"> with a thumbnail inside.
document.querySelectorAll(".yt[data-id]").forEach((el) => {
  el.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${el.dataset.id}?autoplay=1&rel=0`;
    iframe.title = el.getAttribute("aria-label") || "YouTube video";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    el.replaceChildren(iframe);
    el.style.cursor = "default";
  }, { once: true });
});

// <figure data-optional hidden> holding a video: reveal only once the file loads,
// so the page stays clean until the video has been added.
document.querySelectorAll("figure[data-optional] video").forEach((v) => {
  const show = () => (v.closest("figure").hidden = false);
  if (v.readyState >= 1) show();
  else v.addEventListener("loadedmetadata", show, { once: true });
});

// Lightbox: <button data-images="a.jpg|b.jpg" data-captions="One|Two" data-title="Series">.
const triggers = document.querySelectorAll("[data-images]");
if (triggers.length) {
  const lb = document.createElement("dialog");
  lb.className = "lightbox";
  lb.innerHTML = `
    <header><span class="eyebrow lb-title"></span><button type="button" class="lb-close">Close</button></header>
    <div class="stage"><img alt=""></div>
    <footer><span class="eyebrow lb-cap"></span>
      <span class="nav-btns"><button type="button" class="lb-prev" aria-label="Previous">←</button><button type="button" class="lb-next" aria-label="Next">→</button></span>
    </footer>`;
  document.body.append(lb);
  const img = lb.querySelector("img");
  let list = [], caps = [], i = 0, title = "";

  const show = () => {
    img.src = list[i];
    img.alt = caps[i] || title;
    lb.querySelector(".lb-title").textContent = title;
    lb.querySelector(".lb-cap").textContent =
      `${list.length > 1 ? `${i + 1} / ${list.length}` : ""}${caps[i] ? `  ·  ${caps[i]}` : ""}`;
    lb.querySelector(".nav-btns").hidden = list.length < 2;
  };
  const step = (d) => { i = (i + d + list.length) % list.length; show(); };

  triggers.forEach((t) => t.addEventListener("click", () => {
    list = t.dataset.images.split("|");
    caps = (t.dataset.captions || "").split("|");
    title = t.dataset.title || "";
    i = 0;
    show();
    lb.showModal();
  }));
  lb.querySelector(".lb-close").addEventListener("click", () => lb.close());
  lb.querySelector(".lb-prev").addEventListener("click", () => step(-1));
  lb.querySelector(".lb-next").addEventListener("click", () => step(1));
  lb.querySelector(".stage").addEventListener("click", (e) => { if (e.target !== img) lb.close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
}

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
