// Filter by category
function filterServices(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.service-card').forEach(card => {
    card.classList.toggle('hidden', cat !== 'all' && card.dataset.category !== cat);
  });
}

// Search services
function searchServices() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('.service-card').forEach(card => {
    const txt = card.innerText.toLowerCase();
    card.classList.toggle('hidden', !txt.includes(q));
  });
}