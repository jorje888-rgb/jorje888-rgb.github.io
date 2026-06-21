/* -----------------------------
   SMOOTH SCROLL
----------------------------- */

document.querySelectorAll("nav a").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(a.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

/* -----------------------------
   SCROLL REVEAL ANIMATION
----------------------------- */

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll("section, .card, .glass, .event").forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});

/* -----------------------------
   PARALLAX LAVA BLOBS
----------------------------- */

window.addEventListener("mousemove", (e) => {
  const blobs = document.querySelectorAll(".blob");

  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  blobs.forEach((blob, i) => {
    blob.style.transform = `translate(${x * (i+1)}px, ${y * (i+1)}px)`;
  });
});
