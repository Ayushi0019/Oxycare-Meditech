const createClient = window.supabase.createClient;

 const supabaseUrl = 'https://uvsvlxfadvebcxflvths.supabase.co';
 const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2c3ZseGZhZHZlYmN4Zmx2dGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNjM0MTIsImV4cCI6MjA2NTgzOTQxMn0.XH01e6TwxCAXcT_Z8tXTcehIbyOwJULOdwFi3LZA5Qc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const nameInput = document.getElementById('name-input');
  const phoneInput = document.getElementById('phone-input');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Button loading state
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Signing Up...';

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!name || !phone || !email || !password) {
      alert('Please fill in all fields');
      btn.disabled = false;
      btn.textContent = 'Sign Up';
      return;
    }

    try {
      // ✅ Step 1: Sign up with email & password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: 'http://localhost:5500/welcome.html' // or your deployed URL
  }
});


      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      const session = signUpData.session;

      if (!userId) throw new Error('Signup succeeded, but no user ID returned.');

      // ✅ Step 2: Insert profile if session exists (email confirmed or confirmation disabled)
      if (session) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: name,
            phone: phone
          });

        if (profileError) throw profileError;
      }

      // ✅ Success UI
      successMsg.style.display = 'block';
      errorMsg.style.display = 'none';
      form.reset();
    } catch (err) {
      console.error('Signup error:', err);
      errorMsg.style.display = 'block';
      errorMsg.textContent = err.message || 'Signup failed';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign Up';
    }
    
    // At the bottom of authentication.js
window.supabase = supabase;
window.getUserSession = async function () {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};
window.signIn = async function (email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

window.signOut = async function () {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};


// ✅ 6. Expose Supabase client for debugging if needed
window.supabase = supabase;
  });
});


// ✅ 2. Export functions to global window
window.supabase = supabase;

window.signUp = async function (email, password, name, phone) {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: 'http://localhost:5500/welcome.html'
  }
});

if (signUpError) throw signUpError;

// Store profile info temporarily
localStorage.setItem("tempProfile", JSON.stringify({ name, phone }));


  if (signUpError) throw signUpError;

  const userId = signUpData.user?.id;
  const session = signUpData.session;

  if (session) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: userId, full_name: name, phone });
    if (profileError) throw profileError;
  }

  return signUpData;
};

window.signIn = async function (email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

window.signOut = async function () {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

window.getUserSession = async function () {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};
