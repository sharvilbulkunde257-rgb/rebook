// --- PAGE NAVIGATION SYSTEM FOR REBOOK ---

const pages = {
  home: `
    <section class="hero">
      <h1>ReBook</h1>
      <p>Buy, Sell & Discover Affordable Books — From Textbooks to Manga 📚</p>
      <div class="hero-buttons">
        <button class="btn-primary" onclick="goToPage('buy')">Buy Books</button>
        <button class="btn-outline" onclick="goToPage('sell')">Sell Books</button>
      </div>
    </section>
    <section class="categories">
      <h2>Explore Our Collections</h2>
      <div class="book-grid">
        <div class="book-card">
          <img src="https://m.media-amazon.com/images/I/81Uwb7Fkk6L.jpg">
          <h3>Attack on Titan Vol. 1</h3>
          <p class="price"><s>₹499</s> ₹199</p>
        </div>
        <div class="book-card">
          <img src="https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg">
          <h3>The Alchemist</h3>
          <p class="price"><s>₹399</s> ₹159</p>
        </div>
      </div>
    </section>
  `,
  buy: `
    <section class="page">
      <h2>Buy Books</h2>
      <p>Find your next great read — textbooks, novels, or manga at the best prices!</p>
      <div class="book-grid">
        <div class="book-card">
          <img src="https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg">
          <h3>Atomic Habits</h3>
          <p class="price"><s>₹699</s> ₹299</p>
        </div>
        <div class="book-card">
          <img src="https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg">
          <h3>Rich Dad Poor Dad</h3>
          <p class="price"><s>₹599</s> ₹249</p>
        </div>
      </div>
      <button class="btn-outline" onclick="goToPage('home')">⬅ Back to Home</button>
    </section>
  `,
  sell: `
    <section class="page">
      <h2>Sell Your Book</h2>
      <p>Turn your used books into instant cash! Fill in the details below:</p>
      <form class="sell-form" onsubmit="return handleSell(event)">
        <input type="text" id="bookName" placeholder="Book Name" required>
        <input type="number" id="price" placeholder="Expected Price ₹" required>
        <textarea id="desc" placeholder="Book Description"></textarea>
        <button type="submit" class="btn-primary">List for Sale</button>
      </form>
      <button class="btn-outline" onclick="goToPage('home')">⬅ Back to Home</button>
    </section>
  `
};

function goToPage(pageName) {
  document.getElementById("app").innerHTML = pages[pageName] || "<h2>Page Not Found</h2>";
  window.scrollTo(0, 0);
}

function handleSell(event) {
  event.preventDefault();
  const name = document.getElementById("bookName").value;
  const price = document.getElementById("price").value;
  alert(`🎉 Your book "${name}" has been listed for ₹${price}!`);
  goToPage('home');
}

document.addEventListener("DOMContentLoaded", () => {
  goToPage('home');
});
