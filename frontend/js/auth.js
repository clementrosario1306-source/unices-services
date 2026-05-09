const API = 'http://localhost:5000/api';

// ===== SIGNUP =====
async function handleSignup() {
  const fname    = document.getElementById('signup-fname').value.trim();
  const lname    = document.getElementById('signup-lname').value.trim();
  const name     = `${fname} ${lname}`;
  const email    = document.getElementById('signup-email').value.trim();
  const phone    = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const confirm  = document.getElementById('signup-confirm').value.trim();
  const agreed   = document.getElementById('agree-terms').checked;

  if (!fname || !email || !phone || !password)
    return showMsg('signup-error', '❌ Please fill all fields!', 'error');
  if (password !== confirm)
    return showMsg('signup-error', '❌ Passwords do not match!', 'error');
  if (!agreed)
    return showMsg('signup-error', '❌ Please agree to terms!', 'error');

  showMsg('signup-error', '⏳ Creating account...', 'info');

  try {
    const res  = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    const data = await res.json();

    if (!res.ok) return showMsg('signup-error', `❌ ${data.message}`, 'error');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    showMsg('signup-error', '✅ Account created! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1500);
  } catch {
    showMsg('signup-error', '❌ Server error. Is backend running?', 'error');
  }
}

// ===== LOGIN =====
async function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password)
    return showMsg('login-error', '❌ Please fill all fields!', 'error');

  showMsg('login-error', '⏳ Logging in...', 'info');

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) return showMsg('login-error', `❌ ${data.message}`, 'error');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    showMsg('login-error', '✅ Login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1500);
  } catch {
    showMsg('login-error', '❌ Server error. Is backend running?', 'error');
  }
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// ===== OTP (UI only for now) =====
function showOTP() {
  const s = document.getElementById('otp-section');
  if (s) s.style.display = s.style.display === 'none' ? 'block' : 'none';
}
function sendOTP() {
  const phone = document.getElementById('otp-phone')?.value.trim();
  if (!phone) return alert('❌ Enter your mobile number!');
  document.getElementById('otp-inputs').style.display = 'block';
  alert('✅ OTP sent! (Demo: use any 6 digits)');
}
function verifyOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  const otp   = [...boxes].map(b => b.value).join('');
  if (otp.length < 6) return alert('❌ Enter complete 6-digit OTP!');
  alert('✅ OTP Verified! (Demo mode)');
  window.location.href = 'dashboard.html';
}
function otpNext(el, idx) {
  if (el.value && idx < 6) el.nextElementSibling?.focus();
}
function socialLogin(provider) {
  alert(`${provider} login coming soon!`);
}

// ===== PASSWORD STRENGTH =====
function checkStrength(val) {
  const fill = document.getElementById('strength-fill');
  const text = document.getElementById('strength-text');
  if (!fill) return;
  let strength = 0;
  if (val.length >= 6) strength++;
  if (val.match(/[A-Z]/)) strength++;
  if (val.match(/[0-9]/)) strength++;
  if (val.match(/[^A-Za-z0-9]/)) strength++;
  const colors = ['#ff4444', '#ff8800', '#ffcc00', '#00cc44'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  fill.style.width = `${strength * 25}%`;
  fill.style.background = colors[strength - 1] || '#eee';
  if (text) text.textContent = strength > 0 ? labels[strength - 1] : '';
}

// ===== TOGGLE PASSWORD VISIBILITY =====
function togglePwd(id, icon) {
  const input = document.getElementById(id);
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// ===== SHOW MESSAGE =====
function showMsg(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.style.color = type === 'error' ? '#e53935' : type === 'success' ? '#00c853' : '#1a73e8';
}

// ===== Show username in navbar if logged in =====
window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    const loginBtn  = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    if (loginBtn)  loginBtn.textContent  = user.name;
    if (signupBtn) { signupBtn.textContent = 'Logout'; signupBtn.onclick = logout; }
  }
});