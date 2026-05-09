const API = 'http://localhost:5000/api';

// Booking data object
const bookingData = {
  service: '',
  price: 0,
  date: '',
  timeSlot: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  pincode: '',
  notes: '',
  payment: 'upi'
};

// ===== SET MIN DATE TO TODAY =====
window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('booking-date');
  if (dateInput) dateInput.min = today;

  // Auto-select service from URL param
  const params  = new URLSearchParams(window.location.search);
  const service = params.get('service');
  if (service) {
    document.querySelectorAll('.svc-option').forEach(opt => {
      if (opt.querySelector('h4').textContent === service) {
        opt.click();
      }
    });
  }
});

// ===== STEP NAVIGATION =====
function goToStep(step) {
  // Validate before going forward
  if (step === 2 && !bookingData.service)
    return alert('❌ Please select a service first!');
  if (step === 3) {
    bookingData.date     = document.getElementById('booking-date').value;
    bookingData.timeSlot = document.querySelector('.time-slot.selected')?.textContent || '';
    if (!bookingData.date)     return alert('❌ Please select a date!');
    if (!bookingData.timeSlot) return alert('❌ Please select a time slot!');
  }
  if (step === 4) {
    bookingData.name    = document.getElementById('user-name').value.trim();
    bookingData.phone   = document.getElementById('user-phone').value.trim();
    bookingData.email   = document.getElementById('user-email').value.trim();
    bookingData.address = document.getElementById('user-address').value.trim();
    bookingData.city    = document.getElementById('user-city').value.trim();
    bookingData.pincode = document.getElementById('user-pincode').value.trim();
    bookingData.notes   = document.getElementById('user-notes').value.trim();
    if (!bookingData.name)    return alert('❌ Please enter your name!');
    if (!bookingData.phone)   return alert('❌ Please enter your phone number!');
    if (!bookingData.address) return alert('❌ Please enter your address!');
    fillSummary();
  }

  // Hide all steps
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active'));

  // Show current step
  document.getElementById(`step-${step}`).classList.add('active');
  document.getElementById(`step-indicator-${step}`).classList.add('active');

  // Mark previous steps as completed
  for (let i = 1; i < step; i++) {
    document.getElementById(`step-indicator-${i}`).classList.add('active');
  }

  // Scroll to top of form
  window.scrollTo({ top: 100, behavior: 'smooth' });
}

// ===== SELECT SERVICE =====
function selectService(el, name, price) {
  document.querySelectorAll('.svc-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  bookingData.service = name;
  bookingData.price   = price;
}

// ===== SELECT TIME SLOT =====
function selectTime(el) {
  document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  bookingData.timeSlot = el.textContent;
}

// ===== FILL SUMMARY (Step 4) =====
function fillSummary() {
  document.getElementById('s-service').textContent = bookingData.service;
  document.getElementById('s-date').textContent    = bookingData.date;
  document.getElementById('s-time').textContent    = bookingData.timeSlot;
  document.getElementById('s-name').textContent    = bookingData.name;
  document.getElementById('s-phone').textContent   = bookingData.phone;
  document.getElementById('s-address').textContent = `${bookingData.address}, ${bookingData.city} - ${bookingData.pincode}`;
  document.getElementById('s-price').textContent   = `₹${bookingData.price}`;
}

// ===== CONFIRM BOOKING =====
async function confirmBooking() {
  const payment = document.querySelector('input[name="payment"]:checked')?.value || 'upi';
  bookingData.payment = payment;

  const btn = document.querySelector('.btn-confirm');
  btn.textContent = '⏳ Confirming...';
  btn.disabled = true;

  try {
    const res  = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     bookingData.name,
        phone:    bookingData.phone,
        email:    bookingData.email,
        service:  bookingData.service,
        price:    bookingData.price,
        date:     bookingData.date,
        timeSlot: bookingData.timeSlot,
        address:  `${bookingData.address}, ${bookingData.city} - ${bookingData.pincode}`,
        notes:    bookingData.notes,
        payment:  bookingData.payment
      })
    });
    const data = await res.json();

    if (!res.ok) {
      btn.textContent = 'Confirm Booking';
      btn.disabled = false;
      return alert(`❌ ${data.message}`);
    }

    // Show success popup
    document.getElementById('booking-id-display').textContent = data.booking._id;
    document.getElementById('success-overlay').style.display  = 'flex';

  } catch {
    btn.textContent = 'Confirm Booking';
    btn.disabled = false;
    alert('❌ Server error. Make sure backend is running!');
  }
}