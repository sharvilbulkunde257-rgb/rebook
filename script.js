// Handle SIGNUP
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    signupMessage.textContent = 'Signing up...';

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
        signupMessage.textContent = `Error: ${error.message}`;
        signupMessage.style.color = 'red';
    } else {
        signupMessage.textContent = '✅ Success! Please check your email to confirm your account.';
        signupMessage.style.color = 'green';
        signupForm.reset();
        // Wait for confirmation
    }
});

// Handle LOGIN
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    loginMessage.textContent = 'Logging in...';

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        loginMessage.textContent = `Error: ${error.message}`;
        loginMessage.style.color = 'red';
    } else {
        loginMessage.textContent = '✅ Logged in successfully!';
        loginMessage.style.color = 'green';
        loginForm.reset();
        resetUI(); // UI update karo
    }
});

// Handle LOGOUT
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout Error:', error);
    } else {
        // Reset UI and show logged-out state
        resetUI();
    }
}
