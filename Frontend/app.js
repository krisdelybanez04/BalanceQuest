/* ─── BalanceQuest App.js ─── */

const state = {
  balance: 10000, income: 35000, expense: 25000,
  xp: 420, level: 4, streak: 7,
  xlmRate: 22.46, missionDur: 5,
  user: { name: 'Kayla L.', email: '', role: 'student' }
};

// ── Page/View Router ──────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) { t.classList.add('active'); window.scrollTo(0, 0); }
}

function switchView(btn) {
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
  btn.classList.add('active');
  const viewId = btn.dataset.view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');
}

function switchViewById(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');
  const btn = document.querySelector(`[data-view="${viewId}"]`);
  if (btn) btn.classList.add('active');
}

// ── Auth ───────────────────────────────────────────────────────────────────
function selectRole(btn) {
  document.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
}

function doRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pw = document.getElementById('reg-pw').value;
  if (!name) { showToast('⚠️ Please enter your name'); return; }
  if (!email.includes('@')) { showToast('⚠️ Enter a valid email'); return; }
  if (pw.length < 8) { showToast('⚠️ Password must be at least 8 characters'); return; }
  state.user.name = name;
  state.user.email = email;
  state.xp += 50;
  showPage('page-dashboard');
  showToast('🎉 Welcome! +50 XP earned for signing up!');
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-pw').value;
  if (!email || !pw) { showToast('⚠️ Please fill in all fields'); return; }
  showPage('page-dashboard');
  showToast('👋 Welcome back! Streak intact 🔥');
}

// ── Mini Chat (Dashboard) ──────────────────────────────────────────────────
const miniAI = [
  'Got it! I\'ve logged that for you. You\'re doing great with tracking! 🎯',
  'I\'ve recorded your expense. Want me to suggest a savings mission based on your spending? ⭐',
  'Logged! You\'re currently 64% through your food budget this month. Keep it up! 🍱',
  'Nice one! That brings your total tracked expenses to ₱25,450 this month. 📊',
];
let miniIdx = 0;

function sendMiniChat() {
  const input = document.getElementById('mini-chat-input');
  const text = input.value.trim();
  if (!text) return;
  appendMiniMsg(text, 'user');
  input.value = '';
  setTimeout(() => appendMiniMsg(miniAI[miniIdx++ % miniAI.length], 'bot'), 600);
}

function appendMiniMsg(text, role) {
  const win = document.getElementById('mini-chat');
  const div = document.createElement('div');
  div.className = `mc-msg ${role}`;
  const now = new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = `<p>${text}</p><span class="mc-time">${now}</span>`;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

// ── Full Chat (Chat View) ──────────────────────────────────────────────────
const fullAI = [
  'Based on your spending patterns, you usually run out around Day 24. I suggest locking ₱300 for exam week — you\'ll earn +10 bonus XP! 🚀',
  'For your ₱5,000 monthly allowance: 40% daily expenses (₱2,000) · 20% locked savings (₱1,000) · 20% food (₱1,000) · 20% buffer (₱1,000). That\'s a solid quest build! ⭐',
  'You\'ve completed 3 missions this month! Your savings rate is 19%, above the student average of 11%. You\'re on track to reach Level 5 this month! 🏆',
  'I noticed you have ₱10,000 available. Want me to create a Bills First Lock mission for ₱800? It takes 5 days and earns +20 XP. Just say the word! 💡',
  'Your top spending category is Food at 65% of your budget. Try the Food Lock mission — lock ₱200 for 3 days and earn +5 XP on completion! 🍱',
];
let fullIdx = 0;

function chatSuggest(text) {
  switchViewById('view-chat');
  setTimeout(() => {
    appendFullMsg(text, 'user');
    setTimeout(() => appendFullMsg(fullAI[fullIdx++ % fullAI.length], 'bot'), 700);
  }, 100);
}

function sendFullChat() {
  const input = document.getElementById('full-chat-input');
  const text = input.value.trim();
  if (!text) return;
  appendFullMsg(text, 'user');
  input.value = '';
  setTimeout(() => appendFullMsg(fullAI[fullIdx++ % fullAI.length], 'bot'), 700);
}

function appendFullMsg(text, role) {
  const win = document.getElementById('full-chat-window');
  const now = new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `fcm ${role}`;
  div.style.animation = 'fadeUp 0.25s ease both';
  if (role === 'bot') {
    div.innerHTML = `<div class="fcm-bot-icon"><div class="bot-face xs"><div class="bot-eye l"></div><div class="bot-eye r"></div></div></div><div class="fcm-bubble"><p>${text}</p><span class="fcm-time">${now}</span></div>`;
  } else {
    div.innerHTML = `<div class="fcm-bubble"><p>${text}</p><span class="fcm-time">${now}</span></div>`;
  }
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

// ── Budget Modal ───────────────────────────────────────────────────────────
function openAddBudgetModal() {
  document.getElementById('budget-modal').classList.remove('hidden');
}
function closeBudgetModal() {
  document.getElementById('budget-modal').classList.add('hidden');
  showToast('✅ Budget category added!');
}

// ── Mission Modal ──────────────────────────────────────────────────────────
function openMissionModal() {
  document.getElementById('mission-modal').classList.remove('hidden');
}
function closeMissionModal() {
  document.getElementById('mission-modal').classList.add('hidden');
}
function confirmMission() {
  const name = document.getElementById('mm-name').value.trim();
  const amount = parseFloat(document.getElementById('mm-amount').value);
  if (!name) { showToast('⚠️ Please enter a mission name'); return; }
  if (!amount || amount < 50) { showToast('⚠️ Minimum lock is ₱50'); return; }
  closeMissionModal();
  state.balance -= amount;
  document.getElementById('dash-balance').textContent = `₱${state.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  showToast(`🔒 Mission "${name}" locked! Funds secured on Stellar ✦`);
  document.getElementById('mm-name').value = '';
  document.getElementById('mm-amount').value = '';
}

function selDur(btn, days) {
  document.querySelectorAll('.dur-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  state.missionDur = days;
}

// ── Transactions Filter ────────────────────────────────────────────────────
function filterTx(btn, type) {
  document.querySelectorAll('.tx-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tx-item').forEach(item => {
    if (type === 'all' || type === 'week') { item.style.display = 'flex'; return; }
    item.style.display = item.dataset.type === type ? 'flex' : 'none';
  });
}

// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(msg) {
  const overlay = document.getElementById('toast-modal');
  const el = document.getElementById('toast-msg');
  el.textContent = msg;
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('hidden'), 3000);
}

// ── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
  const sub = document.getElementById('dash-date');
  if (sub) sub.textContent = `Here's your financial overview for ${dateStr}`;
});