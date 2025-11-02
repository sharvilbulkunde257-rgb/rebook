// Mock data with added ratings and colorful tags
const PRODUCTS = [
  { id: 1, title: "Advanced Physics — 2nd Ed", author: "R.K. Sharma", price: 450, condition: "good", rating: 4.5, image: "images/book-placeholder.jpg", color: "#ffb703" },
  { id: 2, title: "Calculus Made Easy", author: "T. Y. Lam", price: 320, condition: "like-new", rating: 4.8, image: "images/book-placeholder.jpg", color: "#fb5607" },
  { id: 3, title: "Data Structures in C", author: "Karumanchi", price: 280, condition: "fair", rating: 4.2, image: "images/book-placeholder.jpg", color: "#8338ec" },
  { id: 4, title: "Organic Chemistry", author: "Morrison & Boyd", price: 600, condition: "good", rating: 4.7, image: "images/book-placeholder.jpg", color: "#06ffa5" },
  { id: 5, title: "Microeconomics", author: "N. Gregory Mankiw", price: 400, condition: "like-new", rating: 4.6, image: "images/book-placeholder.jpg", color: "#ff006e" },
  { id: 6, title: "World History", author: "J. R. McNeill", price: 350, condition: "good", rating: 4.4, image: "images/book-placeholder.jpg", color: "#3a86ff" },
  { id: 7, title: "Linear Algebra", author: "Gilbert Strang", price: 500, condition: "fair", rating: 4.3, image: "images/book-placeholder.jpg", color: "#ffbe0b" },
  { id: 8, title: "Psychology", author: "David Myers", price: 450, condition: "like-new", rating: 4.9, image: "images/book-placeholder.jpg", color: "#fb5607" },
  { id: 9, title: "Computer Networks", author: "Andrew Tanenbaum", price: 550, condition: "good", rating: 4.5, image: "images/book-placeholder.jpg", color: "#8338ec" },
  { id: 10, title: "Thermodynamics", author: "Cengel", price: 480, condition: "fair", rating: 4.1, image: "images/book-placeholder.jpg", color: "#06ffa5" },
  { id: 11, title: "Discrete Mathematics", author: "Kenneth Rosen", price: 420, condition: "good", rating: 4.6, image: "images/book-placeholder.jpg", color: "#ff006e" },
  { id: 12, title: "Statistics", author: "Murray Spiegel", price: 380, condition: "like-new", rating: 4.7, image: "images/book-placeholder.jpg", color: "#3a86ff" }
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
const themeToggle = document.getElementById('theme-toggle');

// Hide loader with fade-out animation
window.addEventListener('load', () => {
  loader.style.animation = 'fade-out 0.5s ease-out forwards';
  setTimeout(() => loader.style.display = 'none', 500);
});

// Render products with colorful animations and effects
function renderProducts(products) {
  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card animate-fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <div class="card-glow" style="background: linear-gradient(135deg, ${product.color}20, transparent);"></div>
      <img src="${product.image}" alt="${product.title}" class="product-img">
      <div class="product-content">
        <div class="tag" style="background: ${product.color}; color: #04050a;">${product.condition.replace('-', ' ')}</div>
        <h3>${product.title}</h3>
        <p>${product.author}</p>
        <div class="rating">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} (${product.rating})</div>
        <div class="price" style="color: ${product.color};">₹${product.price}</div>
        <div class="product-actions">
          <button class="btn btn-primary animate-rainbow" onclick="buyNow(${product.id})">Buy Now</button>
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

// Load more with colorful burst effect
loadMoreBtn.addEventListener('click', () => {
  const nextProducts = PRODUCTS.slice(currentIndex, currentIndex + itemsPerLoad);
  renderProducts(nextProducts);
  currentIndex += itemsPerLoad;
  if (currentIndex >= PRODUCTS.length) {
    loadMoreBtn.style.display = 'none';
  }
  // Colorful burst animation
  loadMoreBtn.style.animation = 'burst 0.5s ease-out';
  setTimeout(() => loadMoreBtn.style.animation = '', 500);
});

// Search and filter with smooth transitions
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

// Modal with colorful scale-in animation
startListingBtn.addEventListener('click', () => {
  listingModal.style.display = 'block';
  listingModal.setAttribute('aria-hidden', 'false');
  listingModal.querySelector('.modal-content').style.animation = 'scale-in-color 0.3s ease-out';
});

closeModal.addEventListener('click', () => {
  listingModal.style.animation = 'fade-out 0.3s ease-out';
  setTimeout(() => {
    listingModal.style.display = 'none';
    listingModal.setAttribute('aria-hidden', 'true');
    listingModal.style.animation = '';
  }, 300);
});

window.addEventListener('click', (e) => {
  if (e.target === listingModal) {
    closeModal.click();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && listingModal.style.display === 'block') {
    closeModal.click();
  }
});

// Form submit with colorful success feedback
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
  // Colorful success animation
  const submitBtn = listingForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Published!';
  submitBtn.style.background = 'linear-gradient(135deg, #06ffa5, #3a86ff)';
  submitBtn.style.animation = 'bounce 0.5s ease-out';
  setTimeout(() => {
    alert('Listing published! (Mock)');
    listingModal.style.display = 'none';
    listingModal.setAttribute('aria-hidden', 'true');
    listingForm.reset();
    submitBtn.textContent = 'Publish Listing';
    submitBtn.style.background = '';
    submitBtn.style.animation = '';
  }, 1000);
});

// Buy Now mock with colorful explosion effect
function buyNow(id) {
  const product = PRODUCTS.find(p => p.id === id);
  alert(`Buying ${product.title} (Mock checkout)`);
  // Colorful explosion
  const card = event.target.closest('.product-card');
  createExplosion(card, product.color);
}

// Add to Cart mock with flying colorful animation
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  alert(`Added ${product.title} to cart (Mock)`);
  // Enhanced flying animation with color
  const card = event.target.closest('.product-card');
  const flyingElement = card.cloneNode(true);
  flyingElement.style.position = 'fixed';
  flyingElement.style.top = card.getBoundingClientRect().top + 'px';
  flyingElement.style.left = card.getBoundingClientRect().left + 'px';
  flyingElement.style.width = card.offsetWidth + 'px';
  flyingElement.style.zIndex = 1000;
  flyingElement.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  flyingElement.style.transform = 'rotate(0deg)';
  document.body.appendChild(flyingElement);
  setTimeout(() => {
    flyingElement.style.transform = 'scale(0.1) rotate(720deg)';
    flyingElement.style.opacity = 0;
    flyingElement.style.top = '50px';
    flyingElement.style.left = 'calc(100vw - 100px)';
  }, 100);
  setTimeout(() => {
    document.body.removeChild(flyingElement);
  }, 900);
}

// Colorful explosion effect
function createExplosion(element, color) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.background = color;
    particle.style.borderRadius = '50%';
    particle.style.top = element.getBoundingClientRect().top + element.offsetHeight / 2 + 'px';
    particle.style.left = element.getBoundingClientRect().left + element.offsetWidth / 2 + 'px';
    particle.style.zIndex = 1001;
    particle.style.animation = `explode 1s ease-out forwards`;
    particle.style.animationDelay = `${i * 0.05}s`;
    document.body.appendChild(particle);
    setTimeout(() => document.body.removeChild(particle), 1000);
  }
}

// Hamburger menu with colorful toggle
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
  if (hamburger.classList.contains('active')) {
    hamburger.style.animation = 'rainbow-rotate 0.5s ease-out';
  } else {
    hamburger.style.animation = '';
  }
});

// Theme toggle with colorful transition
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
  themeToggle.style.animation = 'spin 0.5s ease-out';
  setTimeout(() => themeToggle.style.animation = '', 500);
});

// Additional colorful animations (add to CSS if needed, but JS triggers them)
document.querySelectorAll('.animate-fade-in').forEach(el => {
  el.style.animation = 'fade-in 0.6s ease-out forwards';
});

document.querySelectorAll('.animate-rainbow').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'linear-gradient(45deg, #ff006e, #fb5607, #ffb703, #06ffa5, #3a86ff)';
    btn.style.backgroundSize = '400% 400%';
    btn.style.animation = 'rainbow-shift 1s ease infinite';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = '';
    btn.style.animation = '';
  });
});
