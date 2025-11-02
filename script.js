// ---------- Navbar Scroll Effect ----------
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// ---------- Mobile Menu Toggle ----------
const menuBtn = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuBtn.classList.toggle("open");
});

// ---------- Smooth Scroll for Anchor Links ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// ---------- Reveal Animations on Scroll ----------
const revealElements = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  for (let el of revealElements) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  }
};
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ---------- Product Card Hover Animation ----------
document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.classList.add("hovered");
  });
  card.addEventListener("mouseleave", () => {
    card.classList.remove("hovered");
  });
});

// ---------- Floating Button Scroll to Top ----------
const topBtn = document.createElement("button");
topBtn.innerHTML = "↑";
topBtn.classList.add("scroll-top");
document.body.appendChild(topBtn);

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 400 ? "block" : "none";
});

// ---------- Simple Loading Animation ----------
window.addEventListener("load", () => {
  document.querySelector(".loader").classList.add("hide");
});
