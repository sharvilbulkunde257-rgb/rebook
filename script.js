import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase Credentials
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."; // ← yahan apni full anon key daal do

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const userInfoDiv = document.getElementById("user-info");

// Sign Up
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) return alert("Please enter email and password!");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("✅ Signup successful! Please login now.");
  });
}

// Login
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) return alert("Please enter email and password!");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      alert("✅ Login successful!");
      window.location.href = "dashboard.html";
    }
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    else window.location.href = "index.html";
  });
}

// Dashboard session check
if (userInfoDiv) {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      const userEmail = data.session.user.email;
      userInfoDiv.textContent = `Logged in as: ${userEmail}`;
    } else {
      window.location.href = "index.html";
    }
  });
}
