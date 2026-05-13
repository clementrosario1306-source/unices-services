const API = 'https://unices-services-1.onrender.com/api';

// Admin credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'unices@admin123';

let allBookings = [];
let editingId   = null;

// ===== ADMIN LOGIN =====
function adminLogin() {
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value.trim();
  const err  = document.getElementById('admin-error');

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById('admin-login').style.display    = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
    loadStats();
    loadAllBookings();
  } else {
    err.textContent = '❌ Wrong username or password!';
  }
}

// ===== ADMIN LOGOUT =====
function adminLogout() {
  document.getElementById('admin-login').style.display    = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
}

// ===== LOAD STATS =====
async function loadStats() {
  try {
    const res  = await fetch(`${API}/bookings/stats`);
    const data = await res.json();
    document.getElementById('a-total').textContent     = data.total;
    document.getElementById('a-completed').textContent = data.completed;
    document.getElementById('a-pending').textContent   = data.pending;
    document.getElementById('a-revenue').textContent   = `₹${data.revenue}`;
  } catch {
    console.error('Error loading stats');
  }
}

// ===== LOAD ALL BOOKINGS =====
async function loadAllBookings() {
  try {
    const res  = await fetch(`${API}/bookings/all`);
    allBookings = await res.json();
    renderAdminBookings(allBookings);
    renderRecentBookings(allBookings.slice(0, 5));
  } catch {
    document.getElementById('all-bookings-list').innerHTML =
      '<p style="color:red;padding:20px">❌ Error loading bookings</p>';
  }
}

// ===== RENDER ADMIN BOOKINGS =====
function renderAdminBookings(bookings) {
  const list = document.getElementById('all-bookings-list');
  if (!bookings.length) {
    list.innerHTML = '<p style="padding:20px;color:#999">No bookings found!</p>';
    return;
  }
  list.innerHTML = bookings.map(b => `
    <div class="admin-booking-card">
      <div class="abc-header">
        <div>
          <h3>${b.service}</h3>
          <small>ID: ${b._id.slice(-8).toUpperCase()} | ${b.date} | ${b.timeSlot}</small>
        </div>
        <span class="status-badge ${b.status.toLowerCase()}">${b.status}</span>
      </div>
      <div class="abc-body">
        <span><i class="fas fa-user"></i> ${b.name}</span>
        <span><i class="fas fa-phone"></i> ${b.phone}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${b.address}</span>
        <span><i class="fas fa-rupee-sign"></i> ₹${b.price}</span>
        <span><i class="fas fa-user-tie"></i> ${b.staffName || 'Not Assigned'}</span>
      </div>
      <div class="abc-footer">
        <button class="btn-update" onclick="openStatusModal('${b._id}', '${b.status}', '${b.staffName || ''}')">
          <i class="fas fa-edit"></i> Update
        </button>
      </div>
    </div>
  `).join('');
}

// ===== RENDER RECENT BOOKINGS =====
function renderRecentBookings(bookings) {
  const list = document.getElementById('recent-bookings');
  list.innerHTML = bookings.map(b => `
    <div class="recent-row">
      <span><b>${b.service}</b></span>
      <span>${b.name}</span>
      <span>${b.date}</span>
      <span>₹${b.price}</span>
      <span class="status-badge ${b.status.toLowerCase()}">${b.status}</span>
    </div>
  `).join('');
}

// ===== FILTER BOOKINGS =====
function filterAdmin(status, btn) {
  document.querySelectorAll('.booking-filters .filter-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = status === 'all'
    ? allBookings
    : allBookings.filter(b => b.status === status);
  renderAdminBookings(filtered);
}

// ===== STATUS MODAL =====
function openStatusModal(id, status, staff) {
  editingId = id;
  document.getElementById('modal-booking-id').textContent = id.slice(-8).toUpperCase();
  document.getElementById('new-status').value   = status;
  document.getElementById('assign-staff').value = staff;
  document.getElementById('status-modal').style.display = 'flex';
}
function closeStatusModal() {
  document.getElementById('status-modal').style.display = 'none';
  editingId = null;
}

// ===== SAVE STATUS =====
async function saveStatus() {
  const status    = document.getElementById('new-status').value;
  const staffName = document.getElementById('assign-staff').value;

  try {
    const res = await fetch(`${API}/bookings/status/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, staffName })
    });
    if (res.ok) {
      closeStatusModal();
      await loadAllBookings();
      await loadStats();
      alert('✅ Booking updated successfully!');
    }
  } catch {
    alert('❌ Error updating booking!');
  }
}

// ===== SHOW TAB =====
function showAdminTab(tab, el) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-link').forEach(l => l.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  if (el) el.classList.add('active');
}

// Enter key for login
document.addEventListener('keypress', e => {
  if (e.key === 'Enter') adminLogin();
});