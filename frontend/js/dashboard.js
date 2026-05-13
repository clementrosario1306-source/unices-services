const API = 'https://unices-services-1.onrender.com/api';
let allBookings = [];
let cancelId = null;

// ===== ON PAGE LOAD =====
window.addEventListener('DOMContentLoaded', async () => {
  loadUserInfo();
  await loadBookings();
});

// ===== LOAD USER INFO =====
function loadUserInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  // Sidebar
  const nameEl   = document.getElementById('user-name-display');
  const emailEl  = document.getElementById('user-email-display');
  const avatarEl = document.getElementById('user-avatar');
  const bigAvatar = document.getElementById('profile-avatar-big');
  const referCode = document.getElementById('refer-code');

  if (nameEl)   nameEl.textContent  = user.name;
  if (emailEl)  emailEl.textContent = user.email;
  if (avatarEl) avatarEl.textContent = user.name?.charAt(0).toUpperCase();
  if (bigAvatar) bigAvatar.textContent = user.name?.charAt(0).toUpperCase();
  if (referCode) referCode.textContent = 'REF-' + user.id?.slice(-6).toUpperCase();

  // Profile tab
  const nameParts = user.name?.split(' ') || [];
  if (document.getElementById('p-fname')) document.getElementById('p-fname').value = nameParts[0] || '';
  if (document.getElementById('p-lname')) document.getElementById('p-lname').value = nameParts[1] || '';
  if (document.getElementById('p-email')) document.getElementById('p-email').value = user.email || '';
  if (document.getElementById('p-joined')) document.getElementById('p-joined').value = 'Member since 2025';
}

// ===== LOAD BOOKINGS =====
async function loadBookings() {
  const list  = document.getElementById('bookings-list');
  const empty = document.getElementById('empty-state');
  list.innerHTML = '<p style="padding:20px;color:#999">⏳ Loading bookings...</p>';

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    const res      = await fetch(`${API}/bookings/user/${user.id}`);
    allBookings    = await res.json();
    updateStats(allBookings);
    renderBookings(allBookings);
  } catch {
    list.innerHTML = '<p style="padding:20px;color:red">❌ Could not load bookings. Is backend running?</p>';
  }
}

// ===== UPDATE STATS =====
function updateStats(bookings) {
  document.getElementById('total-count').textContent     = bookings.length;
  document.getElementById('confirmed-count').textContent = bookings.filter(b => b.status === 'Confirmed').length;
  document.getElementById('pending-count').textContent   = bookings.filter(b => b.status === 'Pending').length;
  document.getElementById('completed-count').textContent = bookings.filter(b => b.status === 'Completed').length;
}

// ===== RENDER BOOKINGS =====
function renderBookings(bookings) {
  const list  = document.getElementById('bookings-list');
  const empty = document.getElementById('empty-state');

  if (!bookings.length) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  list.innerHTML = bookings.map(b => `
    <div class="booking-card" id="bcard-${b._id}">
      <div class="booking-card-header">
        <div class="bc-service">
          <i class="fas fa-concierge-bell"></i>
          <div>
            <h3>${b.service}</h3>
            <small>Booking ID: ${b._id.slice(-8).toUpperCase()}</small>
          </div>
        </div>
        <span class="status-badge ${b.status.toLowerCase()}">${b.status}</span>
      </div>
      <div class="booking-card-body">
        <div class="bc-detail"><i class="fas fa-calendar"></i> ${b.date}</div>
        <div class="bc-detail"><i class="fas fa-clock"></i> ${b.timeSlot}</div>
        <div class="bc-detail"><i class="fas fa-map-marker-alt"></i> ${b.address}</div>
        <div class="bc-detail"><i class="fas fa-phone"></i> ${b.phone}</div>
        <div class="bc-detail"><i class="fas fa-rupee-sign"></i> ₹${b.price}</div>
      </div>
      <div class="booking-card-footer">
        ${b.status === 'Pending' || b.status === 'Confirmed' ? `
          <button class="btn-cancel-booking" onclick="openCancelModal('${b._id}')">
            <i class="fas fa-times"></i> Cancel
          </button>` : ''}
        <button class="btn-rebook" onclick="window.location.href='booking.html'">
          <i class="fas fa-redo"></i> Book Again
        </button>
      </div>
    </div>
  `).join('');
}

// ===== FILTER BOOKINGS =====
function filterBookings(status, btn) {
  document.querySelectorAll('.booking-filters .filter-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const filtered = status === 'all'
    ? allBookings
    : allBookings.filter(b => b.status === status);
  renderBookings(filtered);
}

// ===== CANCEL MODAL =====
function openCancelModal(id) {
  cancelId = id;
  document.getElementById('cancel-modal').style.display = 'flex';
}
function closeModal() {
  document.getElementById('cancel-modal').style.display = 'none';
  cancelId = null;
}
async function confirmCancel() {
  if (!cancelId) return;
  try {
    const res = await fetch(`${API}/bookings/cancel/${cancelId}`, { method: 'PUT' });
    if (res.ok) {
      closeModal();
      await loadBookings();
    }
  } catch {
    alert('❌ Error cancelling booking.');
  }
}

// ===== TABS =====
function showTab(tab, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.side-link').forEach(l => l.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  if (el) el.classList.add('active');
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// ===== SAVE PROFILE =====
function saveProfile() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  user.name  = `${document.getElementById('p-fname').value} ${document.getElementById('p-lname').value}`.trim();
  user.email = document.getElementById('p-email').value;
  localStorage.setItem('user', JSON.stringify(user));
  alert('✅ Profile saved!');
  loadUserInfo();
}

// ===== COPY COUPON =====
function copyCode(code) {
  navigator.clipboard.writeText(code);
  alert(`✅ Code "${code}" copied!`);
}

// ===== FAQ TOGGLE =====
function toggleFaq(el) {
  const ans = el.querySelector('.faq-a');
  const icon = el.querySelector('.fa-chevron-down');
  const isOpen = ans.style.display === 'block';
  ans.style.display = isOpen ? 'none' : 'block';
  icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
}

// ===== ADDRESS FORM =====
function showAddressForm() {
  alert('Address form coming soon!');
}