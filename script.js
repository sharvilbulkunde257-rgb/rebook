import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase Credentials
const SUPABASE_URL = "https://rlqjfsaqnfsxjvelzzci.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const userInfoDiv = document.getElementById("user-info");

// Sign Up
if(signupBtn){
  signupBtn.addEventListener("click", async () => {
    const { data, error } = await supabase.auth.signUp({
      email: emailInput.value,
      password: passwordInput.value
    });
    if(error) alert(error.message);
    else alert("Signup successful! Please login.");
  });
}

// Login
if(loginBtn){
  loginBtn.addEventListener("click", async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
      password: passwordInput.value
    });
    if(error) alert(error.message);
    else window.location.href = "dashboard.html";
  });
}

// Logout
if(logoutBtn){
  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if(error) alert(error.message);
    else window.location.href = "index.html";
  });
}

// Display logged-in user on dashboard
if(userInfoDiv){
  supabase.auth.getSession().then(({ data }) => {
    if(data.session){
      userInfoDiv.innerHTML = `Logged in as: ${data.session.user.email}`;
    } else {
      window.location.href = "index.html";
    }
  });
}
