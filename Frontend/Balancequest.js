// ── STARS ──────────────────────────────────────────────────────────────────
const starsEl = document.getElementById('stars');
for (let i = 0; i < 40; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const sz = Math.random() * 2 + 1;
  s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${2+Math.random()*4}s;animation-delay:${Math.random()*4}s`;
  starsEl.appendChild(s);
}

// ── NAVIGATION ──────────────────────────────────────────────────────────────
function switchPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.getElementById('nav-' + name).classList.add('active');
}

// ── TOAST ───────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(icon, msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── MODALS ──────────────────────────────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function openNewMission() {
  document.getElementById('newMissionModal').classList.add('open');
}

// ── MISSION MODAL PRESETS ───────────────────────────────────────────────────
function setPreset(el, val) {
  document.querySelectorAll('.preset-chip').forEach(c => {
    if (c.parentElement === el.parentElement) c.classList.remove('selected');
  });
  el.classList.add('selected');
  document.getElementById('missionAmt').value = val;
}

function setDuration(el, val) {
  el.parentElement.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ── CREATE MISSION ───────────────────────────────────────────────────────────
function createMission() {
  const name = document.getElementById('missionName').value || 'Custom Lock';
  const amt  = document.getElementById('missionAmt').value || '200';
  closeModal('newMissionModal');

  const emojis = ['⚡', '🔒', '✨', '💰', '🎯'];
  emojis.forEach((e, i) => {
    const b = document.createElement('div');
    b.className = 'burst';
    b.textContent = e;
    b.style.cssText = `left:${30 + i * 10}%;top:60%;animation-delay:${i * 0.1}s`;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1400);
  });

  setTimeout(() => showToast('⚡', `"${name}" mission locked on Stellar!`), 300);

  setTimeout(() => {
    const missions = document.querySelectorAll('.missions')[1];
    const card = document.createElement('div');
    card.className = 'mission-card active-mission color-purple';
    card.innerHTML = `
      <div class="mission-top">
        <div class="mission-icon purple">🎯</div>
        <div class="mission-meta">
          <div class="mission-name">${name}</div>
          <div class="mission-desc">Lock ₱${amt} · Custom mission</div>
        </div>
        <span class="mission-badge badge-active">Active</span>
      </div>
      <div class="mission-progress">
        <div class="progress-row">
          <span class="progress-left">Day 1 of 7</span>
          <span class="progress-right purple">1%</span>
        </div>
        <div class="prog-track"><div class="prog-fill purple" style="width:1%"></div></div>
      </div>
      <div class="mission-footer">
        <div class="mission-reward">Reward <span class="reward-pill">+₱${Math.round(amt * 0.1)} + 80 XP</span></div>
        <span class="days-left">6 days left</span>
      </div>`;
    missions.insertBefore(card, missions.children[2]);
  }, 500);
}

// ── MISSION DETAIL MODAL ─────────────────────────────────────────────────────
const missionDetails = {
  food: {
    icon: '🍱', color: 'green', name: 'Food Lock Challenge',
    locked: '₱500', reward: '+₱75 + 120 XP', days: '3 of 5', pct: 60,
    desc: 'Avoid Grab Food and delivery apps for 5 days. Cook or buy from carinderia instead. Soroban contract releases ₱500 + ₱75 reward on Day 5.',
    txHash: 'GD7X...A3KP'
  },
  commute: {
    icon: '🚌', color: 'gold', name: 'Commute Saver',
    locked: '₱300', reward: '+₱50 + 80 XP', days: '5 of 7', pct: 71,
    desc: 'Use jeepney or LRT for all commutes this week. No Grab Car or Angkas. Smart contract verifies completion at Day 7.',
    txHash: 'GC2Y...M9QR'
  }
};

function openMissionDetail(id) {
  const d = missionDetails[id];
  document.getElementById('detailContent').innerHTML = `
    <div style="font-size:48px;text-align:center;margin-bottom:12px">${d.icon}</div>
    <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800;text-align:center;margin-bottom:6px">${d.name}</div>
    <div style="font-size:13px;color:var(--muted);text-align:center;margin-bottom:20px;line-height:1.5">${d.desc}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      <div style="background:var(--surface2);border-radius:12px;padding:12px;text-align:center">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Locked</div>
        <div style="font-size:20px;font-weight:700;color:var(--gold);margin-top:2px">${d.locked}</div>
      </div>
      <div style="background:var(--surface2);border-radius:12px;padding:12px;text-align:center">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Reward</div>
        <div style="font-size:18px;font-weight:700;color:var(--green);margin-top:2px">${d.reward}</div>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:6px">
        <span>Progress: Day ${d.days}</span>
        <span class="progress-right ${d.color}">${d.pct}%</span>
      </div>
      <div class="prog-track"><div class="prog-fill ${d.color}" style="width:${d.pct}%"></div></div>
    </div>
    <div style="background:var(--surface2);border-radius:12px;padding:10px 14px;margin-bottom:16px;font-size:11px;color:var(--muted)">
      🔗 On-chain TX: <span style="color:var(--blue);font-family:monospace">${d.txHash}</span>
    </div>
    <button class="modal-btn" onclick="closeModal('missionDetailModal');showToast('✅','Keep going! Mission tracked.')">✅ Log Today's Progress</button>
  `;
  document.getElementById('missionDetailModal').classList.add('open');
}

// ── XP BAR ANIMATION ─────────────────────────────────────────────────────────
setTimeout(() => {
  document.getElementById('xpFill').style.width = '62%';
}, 300);

// ── BUDGET PLANNER ────────────────────────────────────────────────────────────
function toggleBudget() {
  const body = document.getElementById('budgetBody');
  const chev = document.getElementById('budgetChevron');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  chev.classList.toggle('open', !isOpen);
}

function toggleExtraBills() {
  const wrap   = document.getElementById('extraBillsWrap');
  const toggle = document.getElementById('extraBillsToggle');
  const isHidden = wrap.style.display === 'none';
  wrap.style.display = isHidden ? 'block' : 'none';
  toggle.textContent = isHidden ? '− Remove extra bill' : '+ Add another bill';
  calcBudget();
}

function fmt(n) {
  return '₱' + Math.round(n).toLocaleString('en-PH');
}

function calcBudget() {
  const salary    = parseFloat(document.getElementById('bSalary').value)   || 0;
  const maynilad  = parseFloat(document.getElementById('bMaynilad').value) || 0;
  const meralco   = parseFloat(document.getElementById('bMeralco').value)  || 0;
  const rent      = parseFloat(document.getElementById('bRent').value)     || 0;
  const extraAmt  = parseFloat(document.getElementById('bExtraAmt').value) || 0;
  const extraName = document.getElementById('bExtraName').value || 'Other bill';
  const days      = parseInt(document.getElementById('bDays').value)       || 0;

  // Update Total Wallet Balance with Monthly Salary
  const walletAmtEl = document.getElementById('walletAmt');
  if (walletAmtEl) walletAmtEl.textContent = salary > 0 ? fmt(salary) : '₱3,240';

  if (!salary) {
    document.getElementById('budgetResult').style.display = 'none';
    document.getElementById('walletDynamicInfo').style.display = 'none';
    return;
  }

  const totalBills  = maynilad + meralco + rent + extraAmt;
  const remaining   = salary - totalBills;
  const dailyBudget = days > 0 ? remaining / days : 0;
  const billsPct    = salary > 0 ? Math.min((totalBills / salary) * 100, 100) : 0;

  // Update Wallet Dynamic Subtext under balance
  const walletDynamicInfo = document.getElementById('walletDynamicInfo');
  if (days > 0 && remaining > 0) {
    walletDynamicInfo.style.display = 'block';
    document.getElementById('walletDaysLeft').textContent = days + (days === 1 ? ' day' : ' days');
    document.getElementById('walletDailyBudget').textContent = fmt(dailyBudget);
  } else {
    walletDynamicInfo.style.display = 'none';
  }

  document.getElementById('budgetResult').style.display = 'block';
  document.getElementById('rSalary').textContent    = fmt(salary);
  document.getElementById('rMaynilad').textContent  = maynilad ? '−' + fmt(maynilad) : '₱0';
  document.getElementById('rMeralco').textContent   = meralco  ? '−' + fmt(meralco)  : '₱0';
  document.getElementById('rRent').textContent      = rent     ? '−' + fmt(rent)      : '₱0';
  document.getElementById('rTotalBills').textContent = '−' + fmt(totalBills);

  const extraRow = document.getElementById('rExtraRow');
  if (extraAmt > 0) {
    extraRow.style.display = 'flex';
    document.getElementById('rExtraLabel').textContent = extraName;
    document.getElementById('rExtra').textContent = '−' + fmt(extraAmt);
  } else {
    extraRow.style.display = 'none';
  }

  const remEl = document.getElementById('rRemaining');
  remEl.textContent = fmt(Math.abs(remaining));
  remEl.className = 'result-main-val ' + (remaining < 0 ? 'red' : remaining < salary * 0.3 ? 'gold' : 'green');

  const dailyEl = document.getElementById('rDaily');
  if (days > 0 && remaining > 0) {
    dailyEl.textContent = fmt(dailyBudget) + '/day';
    dailyEl.style.color = dailyBudget < 200 ? 'var(--red)' : dailyBudget < 400 ? 'var(--gold)' : 'var(--green)';
    document.getElementById('rDailyLabel').textContent = '÷ ' + days + ' days = daily budget';
  } else if (remaining <= 0) {
    dailyEl.textContent = 'Deficit!';
    dailyEl.style.color = 'var(--red)';
    document.getElementById('rDailyLabel').textContent = 'Bills exceed salary';
  } else {
    dailyEl.textContent = '';
    document.getElementById('rDailyLabel').textContent = 'Enter days until payday';
  }

  const pctRounded = Math.round(billsPct);
  document.getElementById('rPct').textContent = pctRounded + '%';
  const bar = document.getElementById('rPctBar');
  bar.style.width = pctRounded + '%';
  bar.style.background = billsPct > 75 ? 'linear-gradient(90deg,#a11,var(--red))' : billsPct > 50 ? 'linear-gradient(90deg,var(--gold2),var(--gold))' : 'linear-gradient(90deg,var(--green2),var(--green))';

  const warn = document.getElementById('budgetWarning');
  if (remaining < 0) {
    warn.className = 'budget-warning show warn';
    warn.textContent = '⚠️ Your bills exceed your salary by ' + fmt(Math.abs(remaining)) + '. Review your expenses!';
  } else if (billsPct > 70) {
    warn.className = 'budget-warning show warn';
    warn.textContent = '⚠️ ' + pctRounded + '% of your salary goes to bills. Try to keep it under 50%.';
  } else if (days > 0 && dailyBudget < 200) {
    warn.className = 'budget-warning show warn';
    warn.textContent = "⚠️ Only " + fmt(dailyBudget) + "/day — that's tight! Consider locking some savings now.";
  } else if (remaining > 0 && days > 0) {
    warn.className = 'budget-warning show ok';
    warn.textContent = '✅ Looking good! Try locking at least ' + fmt(remaining * 0.2) + ' (20%) into a mission.';
  } else {
    warn.className = 'budget-warning';
  }

  if (remaining > 0 && days > 0) {
    document.getElementById('budgetHeaderSub').textContent = fmt(dailyBudget) + '/day after bills';
  } else if (salary > 0) {
    document.getElementById('budgetHeaderSub').textContent = fmt(remaining) + ' left after bills';
  }
}

// ── QUESTY AI CHATBOT ────────────────────────────────────────────────────────
function handleChatKeyPress(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  addChatMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    const response = generateBotResponse(text);
    addChatMessage(response, 'bot');
  }, 600);
}

function addChatMessage(text, sender) {
  const container = document.getElementById('chatContainer');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}`;
  msgDiv.textContent = text;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function generateBotResponse(text) {
  const lower = text.toLowerCase();
  
  // Grab current budget values
  const salary    = parseFloat(document.getElementById('bSalary').value)   || 0;
  const maynilad  = parseFloat(document.getElementById('bMaynilad').value) || 0;
  const meralco   = parseFloat(document.getElementById('bMeralco').value)  || 0;
  const rent      = parseFloat(document.getElementById('bRent').value)     || 0;
  const extraAmt  = parseFloat(document.getElementById('bExtraAmt').value) || 0;
  const days      = parseInt(document.getElementById('bDays').value)       || 0;
  
  const totalBills  = maynilad + meralco + rent + extraAmt;
  const remaining   = salary - totalBills;
  const dailyBudget = days > 0 ? remaining / days : 0;

  // Bot logic
  if (lower.includes('lock') || lower.includes('how much')) {
    if (dailyBudget > 0) {
      const suggestedLock = Math.round(dailyBudget * 0.2); // 20% safe lock
      return `Since your computed daily limit is ₱${Math.round(dailyBudget)}, a safe play is locking ₱${suggestedLock} per day. Want to start a 5-day mission for ₱${suggestedLock * 5}?`;
    } else {
      return "Please input your Salary and Days until Payday on the Home page first! Then I can give you exact locking advice based on your real daily budget.";
    }
  }

  if (lower.includes('gastos') || lower.includes('daily') || lower.includes('budget')) {
    if (dailyBudget > 0) {
      return `Right now, considering your ₱${totalBills} bills, you strictly have ₱${Math.round(dailyBudget)} per day to spend for the next ${days} days. Stay below this to avoid a deficit!`;
    }
  }

  if (lower.includes('bill')) {
    return `Your total declared monthly bills are ₱${totalBills}. Keep track of them to prevent overspending!`;
  }

  return "I'm Questy! Ask me 'How much should I lock today?' and I'll compute a safe amount based on your budget planner.";
}