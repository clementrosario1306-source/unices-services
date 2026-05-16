const API = 'https://unices-services-1.onrender.com/api';

async function trackBooking() {
  const input = document.getElementById('booking-id-input').value.trim();
  if (!input) return alert('❌ Please enter a booking ID!');

  document.getElementById('track-result').style.display = 'none';
  document.getElementById('track-error').style.display  = 'none';

  try {
    const res      = await fetch(`${API}/bookings/all`);
    const bookings = await res.json();

    // Find booking by last 8 chars of ID
    const booking = bookings.find(b =>
      b._id.slice(-8).toUpperCase() === input.toUpperCase() ||
      b._id === input
    );

    if (!booking) {
      document.getElementById('track-error').style.display = 'flex';
      return;
    }

    // Fill booking info
    document.getElementById('t-service').textContent  = booking.service;
    document.getElementById('t-id').textContent       = `Booking ID: ${booking._id.slice(-8).toUpperCase()}`;
    document.getElementById('t-date').textContent     = booking.date;
    document.getElementById('t-time').textContent     = booking.timeSlot;
    document.getElementById('t-address').textContent  = booking.address;
    document.getElementById('t-staff').textContent    = booking.staffName || 'Being Assigned...';
    document.getElementById('t-price').textContent    = `₹${booking.price}`;

    // Status badge
    const badge = document.getElementById('t-status-badge');
    badge.textContent  = booking.status;
    badge.className    = `status-badge ${booking.status.toLowerCase()}`;

    // Update timeline
    updateTimeline(booking.status);

    document.getElementById('track-result').style.display = 'block';

  } catch {
    alert('❌ Error fetching booking. Try again!');
  }
}

function updateTimeline(status) {
  const steps = ['pending', 'confirmed', 'onway', 'completed'];
  const statusMap = {
    'Pending':   0,
    'Confirmed': 1,
    'On the Way': 2,
    'Completed': 3
  };

  const activeIndex = statusMap[status] ?? 0;

  steps.forEach((step, i) => {
    const el = document.getElementById(`tl-${step}`);
    if (i <= activeIndex) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

// Allow Enter key & auto search from URL param
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('booking-id-input')
    .addEventListener('keypress', e => {
      if (e.key === 'Enter') trackBooking();
    });

  // Auto search if ID in URL
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  if (id) {
    document.getElementById('booking-id-input').value = id;
    trackBooking();
  }
});