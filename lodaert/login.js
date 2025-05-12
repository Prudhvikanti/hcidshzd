// Initialize Supabase client
const supabaseUrl = 'https://your-supabase-project-url.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'your-anon-public-key'; // Replace with your Supabase anon public key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const loginForm = document.getElementById('loginForm');
const messageEl = document.getElementById('message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    messageEl.textContent = 'Logging in...';

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        messageEl.textContent = 'Login failed: ' + error.message;
    } else {
        messageEl.textContent = 'Login successful! Redirecting...';
        // Redirect to home page or dashboard after login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
});
