// ReBook merged site script

// Sample listings array
let listings = [
  {id:1,title:"Concepts of Physics Vol.1",author:"H.C. Verma",cat:"student",price:280,orig:600,img:"https://m.media-amazon.com/images/I/51GJ+8q7eML._SX351_BO1,204,203,200_.jpg"},
  {id:2,title:"One Piece Vol.1",author:"Eiichiro Oda",cat:"manga",price:350,orig:699,img:"https://m.media-amazon.com/images/I/81vW9wV59eL.jpg"},
  {id:3,title:"Rich Dad Poor Dad",author:"Robert Kiyosaki",cat:"finance",price:180,orig:399,img:"https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg"},
  {id:4,title:"Atomic Habits",author:"James Clear",cat:"fiction",price:300,orig:599,img:"https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg"}
];

// Helper to render listings
function renderListings(filter='all', q='') {
  const container = document.getElementById('listings');
  if(!container) return;
  let items = listings.slice();
  if(filter !== 'all') items = items.filter(it=>it.cat===filter);
  if(q) items = items.filter(it=> (it.title+it.author).toLowerCase().includes(q.toLowerCase()));
  if(items.length===0) {
    container.innerHTML = '<div class="muted">No books found.</div>';
    return;
  }
  container.innerHTML = items.map(it=>`
    <div class="book-card">
      <img src="${it.img}" alt="${it.title}">
      <h4>${it.title}</h4>
      <div class="price">₹${it.price} <span class="strike">₹${it.orig}</span></div>
      <button class="btn primary" onclick='buyNow(${it.id})'>Buy</button>
    </div>
  `).join('');
}

// Buy simulation
function buyNow(id) {
  const item = listings.find(x=>x.id===id);
  if(!item) return alert('Item not found');
  const upi = prompt('Enter your UPI ID to simulate payment (demo): yourupi@bank','yourupi@bank');
  if(!upi) return;
  alert(`Thanks! You purchased "${item.title}". Seller will be paid to ${upi} (simulated).`);
}

// Navigation
function showSection(id){
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
  });
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

// Sell form
function handleSell(e){
  e.preventDefault();
  const title = document.getElementById('s_title').value || '';
  const author = document.getElementById('s_author').value || '';
  const cat = document.getElementById('s_cat').value || 'student';
  const price = document.getElementById('s_price').value || 100;
  const notes = document.getElementById('s_notes').value || '';
  const id = Math.max(0,...listings.map(x=>x.id)) + 1;
  listings.unshift({id,title,author,cat,price,orig:price+150,img:"https://via.placeholder.com/300x400?text=Book"});
  alert('Your book has been listed! It appears in Buy section.');
  document.getElementById('sellForm').reset();
  showSection('buy');
  renderListings();
}

// Search + filter bindings
document.addEventListener('DOMContentLoaded', () => {
  renderListings();
  // show home initially
  showSection('home');

  const search = document.getElementById('search');
  const filt = document.getElementById('filterCat');
  if(search) {
    search.addEventListener('input', ()=> renderListings(filt.value, search.value));
  }
  if(filt) {
    filt.addEventListener('change', ()=> renderListings(filt.value, search.value));
  }

  // reveal sections on scroll
  const sections = document.querySelectorAll('.section');
  const reveal = () => {
    sections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if(r.top < window.innerHeight - 80) sec.classList.add('active');
    });
  };
  window.addEventListener('scroll', reveal);
  reveal();
});
