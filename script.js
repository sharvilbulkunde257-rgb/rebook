// ---------- Main JS for ReBook v2 ----------

// Mock product data (in real app fetch from API)
const PRODUCTS = [
  { id: 1, title: "Advanced Physics — 2nd Ed", author: "R.K. Sharma", price: 450, condition: "good" },
  { id: 2, title: "Calculus Made Easy", author: "T. Y. Lam", price: 320, condition: "like-new" },
  { id: 3, title: "Organic Chemistry — Vol 1", author: "Morrison", price: 380, condition: "good" },
  { id: 4, title: "Modern Economics", author: "P. Samuelson", price: 210, condition: "fair" },
  { id: 5, title: "English Grammar Complete", author: "A. Kumar", price: 150, condition: "good" },
  { id: 6, title: "Programming in C", author: "Dennis Ritchie", price: 275, condition: "like-new" },
  { id: 7, title: "Data Structures", author: "S. Lipschutz", price: 300, condition: "good" },
  { id: 8, title: "World History", author: "H. Jenkins", price: 180, condition: "fair" }
];

let visibleCount = 6;
let cartCount = 0;

// DOM references
const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const condSelect = document.getElementById("cond");
const loadMoreBtn = document.getElementById("loadMore");
const loader = document.getElementById("loader");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const listForm = document.getElementById("listForm");
const openList = document.getElementById("openList");
const startListing = document.getElementById("startListing");

// Render products
function renderProducts(items, count = visibleCount) {
  const slice = items.slice(0, count);
  grid.innerHTML = slice.map(p => `
    <article class="card reveal">
      <div class="cover-small">📕</div>
      <div class="tag">Used • ${capitalize(p.condition)}</div>
      <h3 style="margin:8px 0">${escapeHtml(p.title)}</h3>
      <div class="muted">${escapeHtml(p.author)}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
        <div style="font-weight:800">₹${p.price}</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm btn-primary" onclick="buyNow(${p.id})">Buy</button>
          <button class="btn btn-sm btn-outline" onclick="addToCart(event, ${p.id})">Add</button>
        </div>
      </div>
    </article>
  `).join('');
  initReveal();
}

// Utilities
function escapeHtml(text){ return String(text).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }
function capitalize(s){ return s[0].toUpperCase() + s.slice(1); }

// Filters
function filterAndRender(){
  const q = (searchInput.value || "").toLowerCase().trim();
  const cond = condSelect.value;
  const filtered = PRODUCTS.filter(p => {
    const matchesQ = p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    const matchesCond = cond ? p.condition === cond : true;
    return matchesQ && matchesCond;
  });
  renderProducts(filtered, visibleCount);
}

// Load more
loadMoreBtn.addEventListener("click", () => {
  visibleCount += 6;
  filterAndRender();
});

// Search / select
searchInput.addEventListener("input", () => { visibleCount = 6; filterAndRender(); });
condSelect.addEventListener("change", () => { visibleCount = 6; filterAndRender(); });

// Buy / Cart mock functions
window.buyNow = function(id){
  const p = PRODUCTS.find(x => x.id === id);
  alert(`Buying: ${p.title} — Checkout flow not implemented in demo.`);
}

window.addToCart = function(e, id){
  cartCount++;
  // small flying effect
  const btn = e.currentTarget;
  const fly = document.createElement("div");
  fly.className = "fly";
  fly.textContent = "📚";
  document.body.appendChild(fly);
  const rect = btn.getBoundingClientRect();
  fly.style.left = rect.left + "px";
  fly.style.top = rect.top + "px";
  const header = document.querySelector(".nav");
  const cartX = header.getBoundingClientRect().right - 120;
  const cartY = header.getBoundingClientRect().top + 12;
  requestAnimationFrame(()=> {
    fly.style.transform = `translate3d(${cartX - rect.left}px, ${cartY - rect.top}px, 0) scale(.3)`;
    fly.style.opacity = 0;
  });
  setTimeout(()=> fly.remove(), 900);
  // update CTA badge (simple)
  document.querySelector(".brand-sub").textContent = `${cartCount} items in cart`;
}

// reveal animation
function initReveal(){
  const reveals = document.querySelectorAll(".reveal");
  const handle = () => {
    reveals.forEach(el => {
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight - 80) el.classList.add("visible");
    });
  };
  handle();
  window.removeEventListener("scroll", handle);
  window.addEventListener("scroll", handle);
}

// Modal (listing)
function openModal(){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

openList.addEventListener("click", openModal);
startListing.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
document.getElementById("cancelList").addEventListener("click", closeModal);

listForm && listForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // simplistic publish behavior
  const fd = new FormData(listForm);
  const newItem = {
    id: Date.now(),
    title: fd.get("title"),
    author: fd.get("author"),
    price: Number(fd.get("price")) || 0,
    condition: fd.get("condition") || "good"
  };
  PRODUCTS.unshift(newItem);
  closeModal();
  visibleCount = 6;
  filterAndRender();
  alert("Listing published ✓ (demo)");
});

// Mobile hamburger
const hamburger = document.getElementById("hamburger");
hamburger && hamburger.addEventListener("click", () => {
  document.querySelector(".menu-list").classList.toggle("open");
  hamburger.classList.toggle("open");
});

// theme toggle (simple)
const themeToggle = document.getElementById("themeToggle");
themeToggle && themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  themeToggle.textContent = document.documentElement.classList.contains("light") ? "🌤" : "🌙";
});

// buy featured
document.getElementById("buyFeatured").addEventListener("click", ()=> {
  alert("Buy flow for featured item — demo only");
});

// simulate initial loading
window.addEventListener("load", () => {
  setTimeout(()=> {
    loader.classList.add("hide");
    renderProducts(PRODUCTS);
  }, 450);
});

// Accessibility: close modal on Esc
window.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeModal();
});
