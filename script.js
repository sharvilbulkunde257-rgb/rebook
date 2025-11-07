// ✅ Import Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase credentials
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🌿 DOM elements
const authSection = document.getElementById("auth-section");
const booksSection = document.getElementById("books-section");
const sellSection = document.getElementById("sell-book");
const logoutBtn = document.getElementById("logout-btn");
const message = document.getElementById("message");

// 🌿 Hide main content initially
booksSection.style.display = "none";
sellSection.style.display = "none";

// ✅ Smooth scroll helper
window.scrollToSection = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
};

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
    console.error(error);
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

// ✅ Sell Book form
const form = document.getElementById("sell-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const price = document.getElementById("price").value.trim();
    const condition = document.getElementById("condition").value.trim();
    const image_url = document.getElementById("image_url").value.trim();

    if (!title || !author || !price || !condition || !image_url) {
      message.textContent = "❌ Please fill all fields!";
      message.style.color = "red";
      return;
    }

    const { error } = await supabase.from("books").insert([{ title, author, price, condition, image_url }]);

    if (error) {
      console.error(error);
      message.textContent = "⚠️ Error uploading book!";
      message.style.color = "red";
    } else {
      message.textContent = "✅ Book uploaded successfully!";
      message.style.color = "green";
      form.reset();
      loadBooks();
    }
  });
}

// ✅ AUTH SYSTEM
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const authMsg = document.getElementById("auth-message");

// Signup
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    authMsg.textContent = "❌ " + error.message;
    authMsg.style.color = "red";
  } else {
    authMsg.textContent = "✅ Signup successful! Check your email.";
    authMsg.style.color = "green";
  }
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    authMsg.textContent = "❌ " + error.message;
    authMsg.style.color = "red";
  } else {
    authMsg.textContent = "✅ Login successful!";
    authMsg.style.color = "green";
    showMainContent();
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  hideMainContent();
});

// ✅ Check user session on page load
async function checkUserSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    showMainContent();
  } else {
    hideMainContent();
  }
}

function showMainContent() {
  authSection.style.display = "none";
  booksSection.style.display = "block";
  sellSection.style.display = "block";
  logoutBtn.style.display = "inline-block";
  loadBooks();
}

function hideMainContent() {
  authSection.style.display = "block";
  booksSection.style.display = "none";
  sellSection.style.display = "none";
  logoutBtn.style.display = "none";
}

checkUserSession();
