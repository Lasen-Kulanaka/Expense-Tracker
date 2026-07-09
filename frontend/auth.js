const API_URL = 'https://expense-tracker-rumm.onrender.com/api/auth';

const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authMessage = document.getElementById('authMessage');

// If already logged in, skip straight to dashboard
if (localStorage.getItem('token')) {
  window.location.href = 'index.html';
}

// Tab switching
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  authMessage.textContent = '';
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  authMessage.textContent = '';
});

// Handle login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authMessage.textContent = '';

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      authMessage.textContent = data.message || 'Login failed';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.user.name);
    window.location.href = 'index.html';

  } catch (err) {
    authMessage.textContent = 'Could not connect to server';
    console.error(err);
  }
});

// Handle signup
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authMessage.textContent = '';

  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      authMessage.textContent = data.message || 'Signup failed';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.user.name);
    window.location.href = 'index.html';

  } catch (err) {
    authMessage.textContent = 'Could not connect to server';
    console.error(err);
  }
});