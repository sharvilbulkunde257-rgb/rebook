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
// Smooth page transitions between sections
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Upload book simulation
const uploadForm = document.getElementById("uploadForm");
// Sample books data
const books = [
  { title: "Rich Dad Poor Dad", price: "₹249", img: "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg", category: "finance" },
  { title: "The Alchemist", price: "₹159", img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg", category: "fiction" },
  { title: "Physics Class 12", price: "₹199", img: "https://m.media-amazon.com/images/I/61fVYhN5IhL.jpg", category: "student" },
  { title: "Attack on Titan Vol.1", price: "₹199", img: "https://m.media-amazon.com/images/I/81Uwb7Fkk6L.jpg", category: "manga" },
  { title: "Think and Grow Rich", price: "₹189", img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg", category: "finance" },
];

if (uploadForm) {
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✅ Your book has been listed successfully!");
    uploadForm.reset();
// Display books dynamically in Buy section
function renderBooks(list = books) {
  const container = document.getElementById('listings');
  if (!container) return;
  container.innerHTML = '';
  list.forEach(b => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${b.img}" alt="${b.title}">
      <h4>${b.title}</h4>
      <div class="price">${b.price}</div>
    `;
    container.appendChild(card);
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
// Filter books by category or search
function initFilters() {
  const search = document.getElementById('search');
  const filterCat = document.getElementById('filterCat');

  if (!search || !filterCat) return;

  function applyFilter() {
    const term = search.value.toLowerCase();
    const cat = filterCat.value;
    const filtered = books.filter(b =>
      (cat === "all" || b.category === cat) &&
      b.title.toLowerCase().includes(term)
    );
    renderBooks(filtered);
  }

  search.addEventListener('input', applyFilter);
  filterCat.addEventListener('change', applyFilter);

  renderBooks(); // initial display
}

// Handle selling form submission
function handleSell(event) {
  event.preventDefault();
  const title = document.getElementById('s_title').value;
  const author = document.getElementById('s_author').value;
  const cat = document.getElementById('s_cat').value;
  const price = document.getElementById('s_price').value;

  alert(`✅ "${title}" by ${author} listed for ${price} in ${cat} category!`);
  event.target.reset();
  showSection('home');
}

// Initialize app
window.onload = function() {
  initFilters();
  renderBooks();
};
