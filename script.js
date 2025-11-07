// ✅ Import Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// --- Supabase credentials (tumne ye diye they) ---
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWpmc2FxbmZzeGp2ZWx6emNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjM3ODksImV4cCI6MjA3NzU5OTc4OX0.dVu97vNOYDhSIctdhgBt0KWtuP1VwCk_4vQqO2o2rtk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------- DOM refs ----------
const loginToggle = document.getElementById("login-toggle");
const signupToggle = document.getElementById("signup-toggle");
const logoutBtn = document.getElementById("logout-btn");

const loginCard = document.getElementById("login-card");
const signupCard = document.getElementById("signup-card");
const authSection = document.getElementById("auth-section");

const appSection = document.getElementById("app-section");
const welcomeText = document.getElementById("welcome-text");
const welcomeUser = document.getElementById("welcome-user");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginMessage = document.getElementById("login-message");
const signupMessage = document.getElementById("signup-message");

const sellForm = document.getElementById("sell-form");
const sellMessage = document.getElementById("sell-message");
const booksContainer = document.getElementById("books-container");

// ---------- UI helpers ----------
function showLogin(){ loginCard.style.display = "block"; signupCard.style.display = "none"; }
function showSignup(){ loginCard.style.display = "none"; signupCard.style.display = "block"; }
function showApp(user){ authSection.style.display = "none"; appSection.style.display = "block"; logoutBtn.style.display = "inline-block"; welcomeText.style.display = "inline-block"; welcomeText.textContent = `Hi, ${user.email}`; welcomeUser.textContent = `Welcome, ${user.email.split('@')[0]}!`; }
function hideApp(){ authSection.style.display = "flex"; appSection.style.display = "none"; logoutBtn.style.display = "none"; welcomeText.style.display = "none"; welcomeText.textContent = ""; }

// toggle handlers
loginToggle.addEventListener("click", ()=>{ showLogin(); });
signupToggle.addEventListener("click", ()=>{ showSignup(); });
document.getElementById("show-signup").addEventListener("click", (e)=>{ e.preventDefault(); showSignup(); });
document.getElementById("show-login").addEventListener("click", (e)=>{ e.preventDefault(); showLogin(); });

// ---------- Auth: signup ----------
signupForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  signupMessage.textContent = "Creating account...";
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try{
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      signupMessage.textContent = "❌ " + error.message;
      signupMessage.style.color = "red";
    } else {
      signupMessage.textContent = "✅ Check your email to confirm (if needed).";
      signupMessage.style.color = "green";
    }
  } catch(err){
    signupMessage.textContent = "❌ " + err.message;
    signupMessage.style.color = "red";
  }
});

// ---------- Auth: login ----------
loginForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  loginMessage.textContent = "Logging in...";
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try{
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      loginMessage.textContent = "❌ " + error.message;
      loginMessage.style.color = "red";
    } else {
      loginMessage.textContent = "✅ Logged in!";
      loginMessage.style.color = "green";
      await checkSessionAndUpdateUI();
    }
  } catch(err){
    loginMessage.textContent = "❌ " + err.message;
    loginMessage.style.color = "red";
  }
});

// ---------- Auth: logout ----------
logoutBtn.addEventListener("click", async ()=>{
  await supabase.auth.signOut();
  hideApp();
});

// ---------- Session check + listen ----------
async function checkSessionAndUpdateUI(){
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (session && session.user) {
    showApp(session.user);
    loadBooks();
  } else {
    hideApp();
    loadBooks(); // still load (public) — but if you enabled RLS requiring auth, it will return empty unless policies allow anon read
  }
}

// react to auth changes (login via magic link / other tab)
supabase.auth.onAuthStateChange((event, session) => {
  if (session && session.user) showApp(session.user);
  else hideApp();
});

// ---------- Load books ----------
async function loadBooks(){
  if (!booksContainer) return;
  booksContainer.innerHTML = "<p>Loading books...</p>";
  try{
    const { data, error } = await supabase.from("books").select("*").order("id", { ascending: false });

    if (error) {
      booksContainer.innerHTML = "<p style='color:crimson'>Error loading books. See console.</p>";
      console.error("Supabase loadBooks error:", error);
      return;
    }

    if (!data || data.length === 0) {
      booksContainer.innerHTML = "<p>No books yet — be the first to sell!</p>";
      return;
    }

    booksContainer.innerHTML = data.map(book=>{
      const img = book.image_url || "https://via.placeholder.com/400x520?text=No+Image";
      return `
        <div class="book-card">
          <img src="${img}" alt="${escapeHtml(book.title || 'Book')}" />
          <div class="book-info">
            <h4>${escapeHtml(book.title || "Untitled")}</h4>
            <p class="muted">Author: ${escapeHtml(book.author || "Unknown")}</p>
            <p class="muted">Condition: ${escapeHtml(book.condition || "N/A")}</p>
            <p class="book-price">₹${book.price ?? "N/A"}</p>
          </div>
        </div>
      `;
    }).join("");

  } catch(err){
    console.error("loadBooks exception:", err);
    booksContainer.innerHTML = "<p style='color:crimson'>Something went wrong.</p>";
  }
}

// ---------- Sell book (insert) ----------
if (sellForm) {
  sellForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    sellMessage.textContent = "Uploading...";
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const price = document.getElementById("price").value.trim();
    const condition = document.getElementById("condition").value.trim();
    const image_url = document.getElementById("image_url").value.trim();

    if (!title || !author || !price || !condition || !image_url) {
      sellMessage.textContent = "❌ Please fill all fields.";
      sellMessage.style.color = "red";
      return;
    }

    try{
      const { error } = await supabase.from("books").insert([{ title, author, price, condition, image_url }]);
      if (error) {
        sellMessage.textContent = "⚠️ " + error.message;
        sellMessage.style.color = "red";
        console.error(error);
      } else {
        sellMessage.textContent = "✅ Uploaded successfully!";
        sellMessage.style.color = "green";
        sellForm.reset();
        loadBooks();
      }
    } catch(err){
      sellMessage.textContent = "⚠️ " + err.message;
      sellMessage.style.color = "red";
      console.error(err);
    }
  });
}

// ---------- small helpers ----------
function escapeHtml(text){
  if (!text) return "";
  return text.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

// ---------- init ----------
document.addEventListener("DOMContentLoaded", async ()=>{
  showLogin(); // by default show login form
  await checkSessionAndUpdateUI();
  // load books even if not logged in (if your RLS allows anon SELECT)
  await loadBooks();
});
