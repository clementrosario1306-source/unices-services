const CHAT_API = 'https://unices-services-1.onrender.com/api/chat';

function toggleChat() {
  document.getElementById('chatbot-box').classList.toggle('open');
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const msg   = input.value.trim();
  if (!msg) return;

  const box = document.getElementById('chat-messages');

  // Add user message
  box.innerHTML += `<div class="msg user">${msg}</div>`;
  input.value = '';
  box.scrollTop = box.scrollHeight;

  // Add typing indicator
  box.innerHTML += `
    <div class="msg bot" id="typing">
      <span class="typing-dots">
        <span></span><span></span><span></span>
      </span>
    </div>`;
  box.scrollTop = box.scrollHeight;

  try {
    const res  = await fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();

    document.getElementById('typing')?.remove();
    box.innerHTML += `<div class="msg bot">${data.reply}</div>`;
  } catch {
    document.getElementById('typing')?.remove();
    box.innerHTML += `<div class="msg bot">😔 Sorry, I'm offline right now. Call us at +91 98765 43210!</div>`;
  }

  box.scrollTop = box.scrollHeight;
}

function handleKey(e) {
  if (e.key === 'Enter') sendMessage();
}