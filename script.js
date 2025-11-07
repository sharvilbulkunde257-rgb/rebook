// Import Supabase client (CDN ES module)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const openAuthBtn = document.getElementById("open-auth-btn");
const authSection = document.getElementById("auth-section");
const closeAuthBtn = document.getElementById("close-auth");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginMessage = document.getElementById("login-message");
const signupMessage = document.getElementById("signup-message");
const userArea = document.getElementById("user-area");
const welcomeText = document.getElementById("welcome-text");
const logoutBtn = document.getElementById("logout-btn");

const booksContainer = document.getElementById("books-container");
const sellForm = document.getElementById("sell-form");
const message = document.getElementById("message");
const clearFormBtn = document.getElementById("clear-form");

// Utility: show/hide auth modal
function showAuth() {
  authSection.style.display = "flex";
  authSection.setAttribute("aria-hidden", "false");
}
function hideAuth() {
  authSection.style.display = "none";
  authSection.setAttribute("aria-hidden", "true");
}

// Tabs
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabSignup.classList.remove("active");
  loginForm.style.display = "";
  signupForm.style.display = "none";
  loginMessage.textContent = "";
  signupMessage.textContent = "";
});
tabSignup.addEventListener("click", () => {
  tabSignup.classList.add("active");
  tabLogin.classList.remove("active");
  loginForm.style.display = "none";
  signupForm.style.display = "";
  loginMessage.textContent = "";
  signupMessage.textContent = "";
});
openAuthBtn.addEventListener("click", showAuth);
closeAuthBtn.addEventListener("click", hideAuth);

// AUTH: Sign up
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  signupMessage.textContent = "Please wait...";
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  if (!email || !password) {
    signupMessage.textContent = "Fill email & password.";
    return;
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    signupMessage.style.color = "var(--danger)";
    signupMessage.textContent = error.message;
  } else {
    signupMessage.style.color = "var(--accent)";
    signupMessage.textContent = "Signup success. Check your email to verify, then login.";
  }
});

// AUTH: Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginMessage.textContent = "Logging in...";
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  if (!email || !password) {
    loginMessage.textContent = "Enter both email & password.";
    return;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    loginMessage.style.color = "var(--danger)";
    loginMessage.textContent = error.message;
  } else {
    loginMessage.style.color = "var(--accent)";
    loginMessage.textContent = "Logged in!";
    hideAuth();
    await checkSessionOnLoad();
    loadBooks();
  }
});

// AUTH: Logout
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  await checkSessionOnLoad();
  loadBooks();
});

async function showUser(user) {
  if (!user) {
    userArea.style.display = "none";
    openAuthBtn.style.display = "";
    welcomeText.textContent = "";
    return;
  }
  userArea.style.display = "flex";
  openAuthBtn.style.display = "none";
  welcomeText.textContent = `Welcome, ${user.email}`;
}

// check session on load
async function checkSessionOnLoad() {
  const { data } = await supabase.auth.getSession();
  if (data?.session?.user) {
    await showUser(data.session.user);
  } else {
    await showUser(null);
  }
}
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) showUser(session.user);
  else showUser(null);
});

// Books loading
async function loadBooks() {
  booksContainer.innerHTML = '<div class="loader">Loading books...</div>';
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      booksContainer.innerHTML = `<div class="loader" style="color:var(--danger)">Error loading books.</div>`;
      console.error(error);
      return;
    }
    if (!data || data.length === 0) {
      booksContainer.innerHTML = `<div class="loader">No books yet. Be the first to sell one!</div>`;
      return;
    }
    booksContainer.innerHTML = data
      .map((b) => {
        const img = b.image_url?.length
          ? b.image_url
          : "https://via.placeholder.com/200x280?text=No+Image";
        return `
          <div class="book-card">
            <img src="${img}" alt="${escapeHtml(b.title || "Book")}" />
            <div class="book-info">
              <h3>${escapeHtml(b.title || "Untitled")}</h3>
              <p>Author: ${escapeHtml(b.author || "Unknown")}</p>
              <p>Condition: ${escapeHtml(b.condition || "-")}</p>
              <p style="margin-top:8px;font-weight:700;color:var(--accent)">₹${b.price ?? "N/A"}</p>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error(err);
    booksContainer.innerHTML = `<div class="loader" style="color:var(--danger)">Error loading books.</div>`;
  }
}
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "'");
}

// SELL FORM: upload book
if (sellForm) {
  sellForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      message.style.color = "var(--danger)";
      message.textContent = "You must be logged in to upload a book.";
      return;
    }
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const price = document.getElementById("price").value.trim();
    const condition = document.getElementById("condition").value.trim();
    const image_url = document.getElementById("image_url").value.trim();
    if (!title || !author || !price || !condition || !image_url) {
      message.style.color = "var(--danger)";
      message.textContent = "Fill all fields.";
      return;
    }
    message.style.color = "";
    message.textContent = "Uploading...";
    const { error } = await supabase
      .from("books")
      .insert([{ title, author, price, condition, image_url }]);
    if (error) {
      console.error(error);
      message.style.color = "var(--danger)";
      message.textContent = "Error uploading. Check console.";
    } else {
      message.style.color = "var(--accent)";
      message.textContent = "Book uploaded!";
      sellForm.reset();
      loadBooks();
    }
  });
}
if (clearFormBtn) {
  clearFormBtn.addEventListener("click", () => {
    sellForm.reset();
    message.textContent = "";
  });
}

// INIT
window.addEventListener("DOMContentLoaded", async () => {
  hideAuth();
  await checkSessionOnLoad();
  await loadBooks();
});
