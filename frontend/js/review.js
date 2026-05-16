const API = 'https://unices-services-1.onrender.com/api';

let selectedRating = 0;
let reviewBookingId = null;

// Show review modal for completed bookings
function showReviewModal(bookingId, serviceName) {
  reviewBookingId = bookingId;
  document.getElementById('review-service-name').textContent = serviceName;
  document.getElementById('review-modal').style.display = 'flex';
  selectedRating = 0;
  updateStars(0);
  document.getElementById('review-text').value = '';
}

function closeReviewModal() {
  document.getElementById('review-modal').style.display = 'none';
  reviewBookingId = null;
}

// Star rating
function setRating(star) {
  selectedRating = star;
  updateStars(star);
}

function updateStars(count) {
  document.querySelectorAll('.star-btn').forEach((s, i) => {
    s.style.color = i < count ? '#f5a623' : '#ddd';
  });
}

// Submit review
async function submitReview() {
  if (!selectedRating) return alert('❌ Please select a rating!');
  const review = document.getElementById('review-text').value.trim();

  try {
    const res = await fetch(`${API}/bookings/review/${reviewBookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: selectedRating, review })
    });
    if (res.ok) {
      closeReviewModal();
      alert('✅ Thank you for your review!');
      location.reload();
    }
  } catch {
    alert('❌ Error submitting review!');
  }
}