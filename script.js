// Mock data
const PRODUCTS = [
  { id: 1, title: "Advanced Physics — 2nd Ed", author: "R.K. Sharma", price: 450, condition: "good", image: "images/book-placeholder.jpg" },
  { id: 2, title: "Calculus Made Easy", author: "T. Y. Lam", price: 320, condition: "like-new", image: "images/book-placeholder.jpg" },
  { id: 3, title: "Data Structures in C", author: "Karumanchi", price: 280, condition: "fair", image: "images/book-placeholder.jpg" },
  { id: 4, title: "Organic Chemistry", author: "Morrison & Boyd", price: 600, condition: "good", image: "images/book-placeholder.jpg" },
  { id: 5, title: "Microeconomics", author: "N. Gregory Mankiw", price: 400, condition: "like-new", image: "images/book-placeholder.jpg" },
  { id: 6, title: "World History", author: "J. R. McNeill", price: 350, condition: "good", image: "images/book-placeholder.jpg" },
  { id: 7, title: "Linear Algebra", author: "Gilbert Strang", price: 500, condition: "fair", image: "images/book-placeholder.jpg" },
  { id: 8, title: "Psychology", author: "David Myers", price: 450, condition: "like-new", image: "images/book-placeholder.jpg" },
  { id: 9, title: "Computer Networks", author: "Andrew Tanenbaum", price: 550, condition: "good", image: "images/book-placeholder.jpg" },
  { id: 10, title: "Thermodynamics", author: "Cengel", price: 480, condition: "fair", image: "images/book-placeholder.jpg" },
  { id: 11, title: "Discrete Mathematics", author: "Kenneth Rosen", price: 420, condition: "good", image: "images/book-placeholder.jpg" },
  { id: 12, title: "Statistics", author: "Murray Spiegel", price: 380, condition: "like-new", image: "images/book-placeholder.jpg" }
];

let currentIndex = 0;
const itemsPerLoad = 6;

// DOM elements
const productsGrid = document.getElementById('products-grid');
const loadMoreBtn = document.getElementById('load-more');
const searchInput = document.getElementById('search');
const conditionFilter = document.getElementById('condition-filter');
const startListingBtn = document.getElementById('start-listing');
const browseBooksBtn = document.getElementById('browse-books');
const listingModal = document.getElementById('listing-modal');
const closeModal = document.getElementById('close-modal');
const listingForm = document.getElementById('listing-form');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const loader = document.getElementById('loader');

// Hide loader on page load
window.addEventListener('load', () => {
  loader.style.display = 'none';
});

// Render products
function renderProducts(products) {
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="product-content">
        <div class="tag">${product.condition.replace('-', ' ')}</div>
        <h3>${product.title}</h3>
        <p>${product.author}</p>
        <div class="price">₹${product.price}</div>
        <div class="product-actions">
          <button class="btn btn-primary" onclick="buyNow(${product.id})">Buy Now</button>
          <button class="btn btn-secondary" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// Initial render
renderProducts(PRODUCTS.slice(0, itemsPerLoad));
currentIndex = itemsPerLoad;

// Load more
loadMoreBtn.addEventListener('click', () => {
  const nextProducts = PRODUCTS.slice(currentIndex, currentIndex + itemsPerLoad);
  renderProducts(nextProducts);
  currentIndex += itemsPerLoad;
  if (currentIndex >= PRODUCTS.length) {
    loadMoreBtn.style.display = 'none';
  }
});

// Search and filter
function filterProducts() {
  const query = searchInput.value.toLowerCase();
  const condition = conditionFilter.value;
  const filtered = PRODUCTS.filter(product => {
    const matchesQuery = product.title.toLowerCase().includes(query) || product.author.toLowerCase().includes(query);
    const matchesCondition = !condition || product.condition === condition;
    return matchesQuery && matchesCondition;
  });
  productsGrid.innerHTML = '';
  renderProducts(filtered);
  loadMoreBtn.style.display = filtered.length > itemsPerLoad ? 'block' : 'none';
  currentIndex = itemsPerLoad;
}

searchInput.addEventListener('input', filterProducts);
conditionFilter.addEventListener('change', filterProducts);

// Modal
startListingBtn.addEventListener('click', () => {
  listingModal.style.display = 'block';
  listingModal.setAttribute('aria-hidden', 'false');
});

closeModal.addEventListener('click', () => {
  listingModal.style.display = 'none';
  listingModal.setAttribute('aria-hidden', 'true');
});

window.addEventListener('click', (e) => {
  if (e.target === listingModal) {
    listingModal.style.display = 'none';
    listingModal.setAttribute('aria-hidden', 'true');
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && listingModal.style.display === 'block') {
    listingModal.style.display = 'none';
    listingModal.setAttribute('aria-hidden', 'true');
  }
});

// Form submit
listingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(listingForm);
  const listing = {
    title: formData.get('title'),
    author: formData.get('author'),
    condition: formData.get('condition'),
    price: formData.get('price'),
    notes: formData.get('notes')
  };
  console.log('New listing:', listing);
  alert('Listing published! (Mock)');
  listingModal.style.display = 'none';
  listingModal.setAttribute('aria-hidden', 'true');
  listingForm.reset();
});

// Buy Now mock
function buyNow(id) {
  alert(`Buying book ID: ${id} (Mock checkout)`);
}

// Add to Cart mock with animation
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  alert(`Added ${product.title} to cart (Mock)`);
  // Simple flying animation placeholder
  const card = event.target.closest('.product-card');
  const flyingElement = card.cloneNode(true);
  flyingElement.style.position = 'fixed';
  flyingElement.style.top = card.getBoundingClientRect().top + 'px';
  flyingElement.style.left = card.getBoundingClientRect().left + 'px';
  flyingElement.style.width = card.offsetWidth + 'px';
  flyingElement.style.zIndex = 1000;
  flyingElement.style.transition = 'all 0.5s ease';
  document.body.appendChild(flyingElement);
  setTimeout(() => {
    flyingElement.style.transform = 'scale(0.1)';
    flyingElement.style.opacity = 0;
  }, 100);
  setTimeout(() => {
    document.body.removeChild(flyingElement);
  }, 600);
}

// Hamburger menu
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Theme toggle placeholder
// const themeToggle = document.getElementById('theme-toggle');
// themeToggle.addEventListener('click', () => {
//   document.body.classList.toggle('light-theme');
// });
