// ✅ Import Supabase client from CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase credentials
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Helper to smooth scroll
window.scrollToSection = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
};

// ✅ Elements
const appContainer = document.body;
const booksSection = document.querySelector(".books-section");
const uploadSection = document.querySelector(".upload-section");
const header = document.querySelector("header");
const hero = document.querySelector(".hero");

// ✅ AUTH UI SETUP
function showAuthUI() {
  appContainer.innerHTML = `
    <div class="auth-container">
      <h1>📚 ReBook Login / Signup</h1>
      <input type="email" id="email" placeholder="Enter your email" required />
      <input type="password" id="password" placeholder="Enter password" required />
      <button id="signup-btn">Sign Up</button>
      <button id="login-btn" class="outline">Login</button>
      <p id="auth-msg"></p>
    </div>
  `;

  document.getElementById("signup-btn").addEventListener("click", signupUser);
  document.getElementById("login-btn").addEventListener("click", loginUser);
}

// ✅ SIGNUP
async function signupUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("auth-msg");

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    msg.textContent = "⚠️ " + error.message;
    msg.style.color = "red";
  } else {
    msg.textContent = "✅ Signup successful! Please check your email to confirm.";
    msg.style.color = "green";
  }
}

// ✅ LOGIN
async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("auth-msg");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    msg.textContent = "⚠️ " + error.message;
    msg.style.color = "red";
  } else {
    msg.textContent = "✅ Logged in successfully!";
    msg.style.color = "green";
    setTimeout(() => location.reload(), 1000);
  }
}

// ✅ LOGOUT
async function logoutUser() {
  await supabase.auth.signOut();
  location.reload();
}

// ✅ Check if logged in
async function checkAuth() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    showAuthUI();
  } else {
    renderAppUI(data.user);
  }
}

// ✅ MAIN UI
function renderAppUI(user) {
  document.body.innerHTML = `
    <header>
      <div class="logo">📚 ReBook</div>
      <nav>
        <a href="#books-section">Buy Books</a>
        <a href="#sell-book">Sell Book</a>
        <button id="logout-btn" class="logout-btn">Logout</button>
      </nav>
    </header>

    <section class="hero" id="home">
      <h1>Welcome, ${user.email.split("@")[0]} 👋</h1>
      <p>Buy & Sell Used Books in Seconds</p>
      <div class="hero-buttons">
        <button class="primary" onclick="scrollToSection('books-section')">Browse Books</button>
        <button class="outline" onclick="scrollToSection('sell-book')">Sell Your Book</button>
      </div>
    </section>

    <section class="books-section" id="books-section">
      <h2>Available Books</h2>
      <div id="books-container" class="book-grid"><p>Loading books...</p></div>
    </section>

    <section class="upload-section" id="sell-book">
      <h2>Sell Your Book</h2>
      <form id="sell-form">
        <input type="text" id="title" placeholder="Book Title" required />
        <input type="text" id="author" placeholder="Author Name" required />
        <input type="number" id="price" placeholder="Price (₹)" required />
        <input type="text" id="condition" placeholder="Condition (Good / Like New)" required />
        <input type="url" id="image_url" placeholder="Book Image URL" required />
        <button type="submit">Upload Book</button>
      </form>
      <p id="message"></p>
    </section>

    <footer>
      <p>© 2025 ReBook | Making Reading Affordable for Everyone 💚</p>
    </footer>
  `;

  document.getElementById("logout-btn").addEventListener("click", logoutUser);

  // After rendering, reload books and form logic
  loadBooks();
  setupSellForm();
}

// ✅ Load available books
async function loadBooks() {
  const container = document.getElementById("books-container");
  container.innerHTML = "<p>Loading books...</p>";

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    container.innerHTML = "<p style='color:red;'>⚠️ Error loading books.</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No books available yet. Be the first to sell one!</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (book) => `
      <div class="book-card">
        <img src="${book.image_url}" alt="${book.title}" />
        <div class="book-info">
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p>Condition: ${book.condition}</p>
          <p><strong>₹${book.price}</strong></p>
        </div>
      </div>
    `
    )
    .join("");
}

// ✅ Handle Sell Book Form
function setupSellForm() {
  const form = document.getElementById("sell-form");
  const message = document.getElementById("message");

  if (form) {
