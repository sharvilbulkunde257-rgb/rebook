import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// 🔑 Supabase setup
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const authSection = document.getElementById("auth-section");
const welcomeSection = document.getElementById("welcome-section");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authMessage = document.getElementById("auth-message");
const welcomeUser = document.getElementById("welcome-user");
const booksContainer = document.getElementById("books-container");
const sellForm = document.getElementById("sell-form");
const message = document.getElementById("message");

let mode = "login";

// Toggle login/signup
signupBtn.addEventListener("click", () => {
  mode = "signup";
  authTitle.textContent = "Create an Account";
  authMessage.textContent = "";
});
loginBtn.addEventListener("click", () => {
  mode = "login";
  authTitle.textContent = "Login";
  authMessage.textContent = "";
});

// Auth submit
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  let result;

  if (mode === "signup") result = await supabase.auth.signUp({ email, password });
  else result = await supabase.auth.signInWithPassword({ email, password });

  if (result.error) {
    authMessage.textContent = result.error.message;
    authMessage.style.color = "red";
  } else {
    checkUser();
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  authSection.classList.remove("hidden");
  welcomeSection.classList.add("hidden");
  logoutBtn.style.display = "none";
});

// ✅ Session persist fix
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    checkUser();
  } else {
    authSection.classList.remove("hidden");
    welcomeSection.classList.add("hidden");
  }
});

// Check user
async function checkUser() {
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    const email = data.user.email;
    welcomeUser.textContent = `Welcome, ${email}`;
    authSection.classList.add("hidden");
    welcomeSection.classList.remove("hidden");
    logoutBtn.style.display = "inline-block";
    loadBooks();
  }
}
checkUser();

// Upload Book
if (sellForm) {
  sellForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const price = document.getElementById("price").value.trim();
    const condition = document.getElementById("condition").value.trim();
    const image_url = document.getElementById("image_url").value.trim();

    const { error } = await supabase.from("books").insert([{ title, author, price, condition, image_url }]);
    if (error) {
      message.textContent = "⚠️ Error adding book!";
      message.style.color = "red";
    } else {
      message.textContent = "✅ Book uploaded successfully!";
      message.style.color = "green";
      sellForm.reset();
      loadBooks();
    }
  });
}

// Load books
async function loadBooks() {
  const { data, error } = await supabase.from("books").select("*").order("id", { ascending: false });
  if (error) {
    booksContainer.innerHTML = "<p>Error loading books</p>";
  } else {
    booksContainer.innerHTML = data
      .map(
        (book) => `
        <div class="book-card">
          <img src="${book.image_url}" alt="${book.title}">
          <h4>${book.title}</h4>
          <p>${book.author}</p>
          <p><strong>₹${book.price}</strong></p>
          <p>${book.condition}</p>
        </div>`
      )
      .join("");
  }
}
