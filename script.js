// Smooth page transitions between sections
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sample books data
const books = [
  { title: "Rich Dad Poor Dad", price: "₹249", img: "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg", category: "finance" },
  { title: "The Alchemist", price: "₹159", img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg", category: "fiction" },
  { title: "Physics Class 12", price: "₹199", img: "https://m.media-amazon.com/images/I/61fVYhN5IhL.jpg", category: "student" },
  { title: "Attack on Titan Vol.1", price: "₹199", img: "https://m.media-amazon.com/images/I/81Uwb7Fkk6L.jpg", category: "manga" },
  { title: "Think and Grow Rich", price: "₹189", img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg", category: "finance" },
];

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

