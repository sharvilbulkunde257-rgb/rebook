// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Book category filter (example for category buttons)
const categoryButtons = document.querySelectorAll(".category-btn");
const books = document.querySelectorAll(".book-card");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");

    books.forEach((book) => {
      if (category === "all" || book.classList.contains(category)) {
        book.style.display = "block";
      } else {
        book.style.display = "none";
      }
    });

    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

// Upload book simulation
const uploadForm = document.getElementById("uploadForm");

if (uploadForm) {
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✅ Your book has been listed successfully!");
    uploadForm.reset();
  });
}

// Wallet balance simulation
let balance = 120;
const balanceDisplay = document.getElementById("wallet-balance");
if (balanceDisplay) {
  balanceDisplay.textContent = `₹${balance}`;

  document.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const price = parseInt(btn.getAttribute("data-price"));
      if (balance >= price) {
        balance -= price;
        balanceDisplay.textContent = `₹${balance}`;
        alert("📚 Book purchased successfully!");
      } else {
        alert("⚠️ Insufficient balance!");
      }
    });
  });
}

