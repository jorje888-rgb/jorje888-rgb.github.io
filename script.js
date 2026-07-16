// ---------- TICKER TAPE ----------
// Placeholder ticker data — replace symbols/values with whatever you want to display,
// or wire this up to a real market data API later.
const tickerData = [
  { symbol: "SPX", change: "+0.42%", up: true },
  { symbol: "AAPL", change: "+1.18%", up: true },
  { symbol: "TSLA", change: "-0.76%", up: false },
  { symbol: "NVDA", change: "+2.03%", up: true },
  { symbol: "BTC", change: "-1.24%", up: false },
  { symbol: "QQQ", change: "+0.55%", up: true },
  { symbol: "MSFT", change: "+0.31%", up: true },
  { symbol: "AMD", change: "-0.88%", up: false },
];

function renderTicker() {
  const ticker = document.getElementById("ticker");
  if (!ticker) return;
  const items = [...tickerData, ...tickerData, ...tickerData];
  ticker.innerHTML = items
    .map(
      (item) =>
        `<span>${item.symbol} <span class="${item.up ? "up" : "down"}">${item.change}</span></span>`
    )
    .join("");
}

// ---------- LIVE CLOCK / MARKET STATUS ----------
function updateClock() {
  const clockEl = document.getElementById("market-clock");
  const statusEl = document.getElementById("market-status");
  if (!clockEl) return;

  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString("en-US", { hour12: false });

  // Simple placeholder logic: mark "open" 9:30–16:00 local time, weekdays only.
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && minutes >= 570 && minutes <= 960;

  if (statusEl) {
    statusEl.style.background = isOpen ? "var(--green)" : "var(--red)";
    statusEl.style.boxShadow = isOpen
      ? "0 0 8px var(--green)"
      : "0 0 8px var(--red)";
  }
}

// ---------- COUNT-UP STATS ----------
function animateCountUp(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const decimals = el.dataset.count.includes(".")
    ? el.dataset.count.split(".")[1].length
    : 0;
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---------- CHART HELPERS ----------
// Generates a smooth-ish random walk so the placeholder chart looks alive.
// Replace this with real equity data whenever you have it — an array of numbers works.
function generateSeries(points, volatility, drift) {
  const series = [100];
  for (let i = 1; i < points; i++) {
    const change = (Math.random() - 0.45) * volatility + drift;
    series.push(series[i - 1] + change);
  }
  return series;
}

function seriesToPath(series, width, height, padding = 10) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const step = (width - padding * 2) / (series.length - 1);

  const points = series.map((val, i) => {
    const x = padding + i * step;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return [x, y];
  });

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`))
    .join(" ");

  const fillPath =
    linePath +
    ` L ${points[points.length - 1][0]},${height} L ${points[0][0]},${height} Z`;

  return { linePath, fillPath };
}

function animatePath(pathEl, finalD, duration = 1400) {
  if (!pathEl) return;
  pathEl.setAttribute("d", finalD);
  const length = pathEl.getTotalLength();
  pathEl.style.strokeDasharray = length;
  pathEl.style.strokeDashoffset = length;
  pathEl.getBoundingClientRect(); // force reflow
  pathEl.style.transition = `stroke-dashoffset ${duration}ms ease`;
  requestAnimationFrame(() => {
    pathEl.style.strokeDashoffset = "0";
  });
}

function renderMiniChart() {
  const line = document.getElementById("mini-chart-path");
  const fill = document.getElementById("mini-chart-fill");
  if (!line) return;
  const series = generateSeries(24, 3, 0.6);
  const { linePath, fillPath } = seriesToPath(series, 240, 60, 4);
  animatePath(line, linePath, 1200);
  if (fill) fill.setAttribute("d", fillPath);
}

function renderEquityChart() {
  const line = document.getElementById("equity-path");
  const fill = document.getElementById("equity-fill");
  const grid = document.getElementById("chart-grid");
  if (!line) return;

  const width = 800;
  const height = 260;

  // Draw horizontal grid lines
  if (grid) {
    grid.innerHTML = "";
    const rows = 4;
    for (let i = 0; i <= rows; i++) {
      const y = (height / rows) * i;
      const lineEl = document.createElementNS("http://www.w3.org/2000/svg", "line");
      lineEl.setAttribute("x1", "0");
      lineEl.setAttribute("x2", width);
      lineEl.setAttribute("y1", y);
      lineEl.setAttribute("y2", y);
      grid.appendChild(lineEl);
    }
  }

  const series = generateSeries(60, 4, 0.8);
  const { linePath, fillPath } = seriesToPath(series, width, height, 12);
  if (fill) fill.setAttribute("d", fillPath);
  animatePath(line, linePath, 1800);
}

// ---------- SCROLL REVEAL ----------
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  renderTicker();
  updateClock();
  setInterval(updateClock, 1000);
  initScrollReveal();
  renderMiniChart();
  renderEquityChart();

  document.querySelectorAll(".hero-metric-value[data-count]").forEach((el) => {
    animateCountUp(el);
  });
});
