// ===============================
// ReBook v2 — main.js (Premium Animated Version)
// ===============================

// Loader fade-out animation
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  setTimeout(() => loader.classList.add("hide"), 800);
});

// Mock product data
const PRODUCTS = [
  { id: 1, title: "Advanced Physics — 2nd Ed", author: "R.K. Sharma", price: 450, condition: "Good", cover: "images/book1.jpg" },
  { id: 2, title: "Calculus Made Easy", author: "T.Y. Lam", price: 320, condition: "Like New", cover: "images/book2.jpg" },
  { id: 3, title: "Organic Chemistry", author: "Morrison & Boyd", price: 510, condition: "Used", cover: "images/book3.jpg" },
  { id: 4, title: "Data Structures in C", author: "S. Lipschutz", price: 290, condition: "Good", cover: "images/book4.jpg" },
  { id: 5, title: "Engineering Mechanics", author: "Hibbeler", price: 430, condition: "Like New", cover: "images/book5.jpg" }
];

// Render product cards dynamically
const productContainer = document.querySelector(".browse-grid");

function renderProducts() {
  productContainer.innerHTML = "";
  PRODUCTS.forEach((book) => {
    const card = document.createElement("div");
    card.className = "product-card reveal";
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}">
      <div class="product-info">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p class="condition">${book.condition}</p>
        <h4>₹${book.price}</h4>
        <button class="buy-btn">Buy Now</button>
      </div>
    `;
    productContainer.appendChild(card);
  });
}
renderProducts();

// Scroll reveal animation
const reveals = document.querySelectorAll(".reveal");
window.addEventListener("scroll", () => {
  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) el.classList.add("visible");
  });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Navbar scroll effect
const navbar = document.querySelector("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});

// Modal open/close for "Sell Book"
const modal = document.querySelector(".sell-modal");
const openModal = document.querySelector("#openSellModal");
const closeModal = document.querySelector("#closeModal");

if (openModal && modal) {
  openModal.addEventListener("click", () => modal.classList.add("active"));
  closeModal.addEventListener("click", () => modal.classList.remove("active"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
}

// Theme toggle
const themeBtn = document.querySelector("#themeToggle");
themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  themeBtn.textContent = document.body.classList.contains("light-theme") ? "🌙" : "☀️";
});

// Floating particle animation (for premium feel)
const canvas = document.getElementById("bgCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = Math.random() * 0.3 - 0.15;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
      if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = "rgba(0, 180, 255, 0.4)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initParticles();
  });
}

// Floating “Add to cart” animation
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("buy-btn")) {
    const btn = e.target;
    btn.classList.add("pulse");
    setTimeout(() => btn.classList.remove("pulse"), 600);
  }
});
