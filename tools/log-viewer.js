// ── Type definitions ──────────────────────────────────────────────────────────
const TYPES = {
  spawn:     { label: 'Spawn',     color: '#3b82f6' },
  result:    { label: 'Result',    color: '#22c55e' },
  decision:  { label: 'Decision',  color: '#a855f7' },
  note:      { label: 'Note',      color: '#94a3b8' },
  synthesis: { label: 'Synthesis', color: '#14b8a6' },
  error:     { label: 'Error',     color: '#ef4444' },
  user:      { label: 'User',      color: '#fb923c' },
};

const STATUS_COLOR = {
  success: '#22c55e',
  partial: '#f59e0b',
  failed:  '#ef4444',
};

// ── State ─────────────────────────────────────────────────────────────────────
let allEntries = [];
let currentFileHandle = null; // File System Access API handle (for reload)
let currentFileFallback = null; // Fallback File object when API unavailable

// ── File loading ──────────────────────────────────────────────────────────────
const openBtn   = document.getElementById('open-btn');
const reloadBtn = document.getElementById('reload-btn');
const fileInfo  = document.getElementById('file-info');

const USE_PICKER = typeof window.showOpenFilePicker === 'function';

// Hide the legacy file input entirely when the modern API is available
if (!USE_PICKER) {
  document.getElementById('file-input').style.display = 'inline';
  openBtn.style.display = 'none';
}

// Modern path — File System Access API
openBtn.addEventListener('click', async () => {
  try {
    const [handle] = await window.showOpenFilePicker({
      suggestedName: 'log.jsonl',
      types: [{ description: 'Log files', accept: { 'text/plain': ['.jsonl', '.json', '.log', '.txt'] } }],
    });
    currentFileHandle   = handle;
    currentFileFallback = null;
    reloadBtn.disabled  = false;
    await readFromHandle(handle);
  } catch (e) {
    if (e.name !== 'AbortError') console.error(e);
  }
});

// Fallback path — legacy <input type="file">
document.getElementById('file-input').addEventListener('change', e => {
  currentFileFallback = e.target.files[0];
  currentFileHandle   = null;
  if (currentFileFallback) readFromFile(currentFileFallback);
});

reloadBtn.addEventListener('click', async () => {
  if (currentFileHandle) await readFromHandle(currentFileHandle);
  else if (currentFileFallback) readFromFile(currentFileFallback);
});

// ── Auto-refresh ──────────────────────────────────────────────────────────────
let refreshTimer = null;

document.getElementById('auto-refresh').addEventListener('change', function() {
  this.checked ? startAutoRefresh() : stopAutoRefresh();
});

startAutoRefresh();
buildChips();

document.getElementById('refresh-interval').addEventListener('change', () => {
  if (document.getElementById('auto-refresh').checked) {
    stopAutoRefresh();
    startAutoRefresh();
  }
});

function startAutoRefresh() {
  const secs = parseInt(document.getElementById('refresh-interval').value) || 10;
  refreshTimer = setInterval(async () => {
    if (currentFileHandle) await readFromHandle(currentFileHandle);
    else if (currentFileFallback) readFromFile(currentFileFallback);
  }, secs * 1000);
}

function stopAutoRefresh() {
  clearInterval(refreshTimer);
  refreshTimer = null;
}

async function readFromHandle(handle) {
  const file = await handle.getFile();
  fileInfo.textContent = `${file.name} · loaded ${new Date().toLocaleTimeString()}`;
  const text = await file.text();
  onLoaded(text);
}

function readFromFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    fileInfo.textContent = `${file.name} · loaded ${new Date().toLocaleTimeString()}`;
    onLoaded(e.target.result);
  };
  reader.readAsText(file);
}

function onLoaded(text) {
  allEntries = parseJsonl(text);
  buildChips();
  applyFilters();
}

function parseJsonl(text) {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('{'))
    .map((l, i) => {
      try { return JSON.parse(l); }
      catch { return { type: 'error', msg: `Parse error on line ${i + 1}: ${l}` }; }
    });
}

// ── Type chips ────────────────────────────────────────────────────────────────
function buildChips() {
  const present = new Set(allEntries.map(e => e.type).filter(Boolean));
  // Always show all known types; append any unknown types found in the data after
  const order   = [...Object.keys(TYPES),
                   ...[...present].filter(t => !TYPES[t])];
  const row = document.getElementById('chip-row');
  row.innerHTML = '';

  order.forEach(type => {
    const { label, color } = TYPES[type] || { label: type, color: '#64748b' };
    const chip = document.createElement('label');
    chip.className = 'chip';
    chip.style.cssText = `border-color:${color};color:${color}`;
    chip.innerHTML = `<input type="checkbox" value="${type}" checked> ${label}`;
    chip.querySelector('input').addEventListener('change', function() {
      chip.classList.toggle('off', !this.checked);
    });
    row.appendChild(chip);
  });
}

// ── Apply filters ─────────────────────────────────────────────────────────────
document.getElementById('apply-btn').addEventListener('click', applyFilters);

function applyFilters() {
  const now      = new Date();
  const fromMode = document.querySelector('input[name="from-mode"]:checked').value;
  const toMode   = document.querySelector('input[name="to-mode"]:checked').value;

  let fromMs = 0;
  let toMs   = now.getTime();

  if (fromMode === 'last') {
    const mins = parseInt(document.getElementById('last-min').value) || 60;
    fromMs = now.getTime() - mins * 60_000;
  } else {
    fromMs = dateTimeMs('from-date', 'from-time', 0);
  }

  if (toMode === 'custom') {
    toMs = dateTimeMs('to-date', 'to-time', now.getTime());
  }

  const checkedTypes = new Set(
    [...document.querySelectorAll('#chip-row input:checked')].map(i => i.value)
  );

  const filtered = allEntries.filter(e => {
    if (!checkedTypes.has(e.type)) return false;
    if (!e.ts) return true;
    const t = new Date(e.ts).getTime();
    return t >= fromMs && t <= toMs;
  });

  render(filtered);
}

function dateTimeMs(dateId, timeId, fallback) {
  const d = document.getElementById(dateId).value;
  if (!d) return fallback;
  const t = document.getElementById(timeId).value || '00:00';
  return new Date(`${d}T${t}`).getTime();
}

// ── Render ────────────────────────────────────────────────────────────────────
function render(entries) {
  const list  = document.getElementById('log-list');
  const stats = document.getElementById('stats');

  stats.textContent = `Showing ${entries.length} of ${allEntries.length} entries`;

  if (!entries.length) {
    list.innerHTML = '<div class="empty">No entries match the current filters.</div>';
    return;
  }

  list.innerHTML = '';
  [...entries].reverse().forEach(e => list.appendChild(buildEntry(e)));
}

function buildEntry(e) {
  const type  = e.type || 'unknown';
  const def   = TYPES[type] || { label: type, color: '#64748b' };
  const color = (type === 'result' && e.status && STATUS_COLOR[e.status])
                  ? STATUS_COLOR[e.status]
                  : def.color;

  const badgeLabel = type === 'result' && e.status
    ? `${e.status} ${def.label}`
    : def.label;

  const ts   = e.ts ? fmtTs(e.ts) : '—';
  const msg  = e.msg || '(no msg)';
  const meta = [e.worker, e.task].filter(Boolean).join(' / ');

  const el = document.createElement('div');
  el.className = 'entry';
  el.innerHTML = `
    <div class="entry-head">
      <span class="entry-ts">${ts}</span>
      <span class="entry-badge"
            style="background:${color}22;color:${color};border:1px solid ${color}55">
        ${esc(badgeLabel)}
      </span>
      ${meta ? `<span class="entry-meta">${esc(meta)}</span>` : ''}
      <span class="entry-msg">${esc(msg)}</span>
      <span class="chevron">▼</span>
    </div>
    <div class="entry-detail">
      <pre>${esc(JSON.stringify(e, null, 2))}</pre>
    </div>`;

  el.querySelector('.entry-head').addEventListener('click', () =>
    el.classList.toggle('open')
  );

  return el;
}

function fmtTs(ts) {
  try { return new Date(ts).toISOString().replace('T', ' ').slice(0, 19); }
  catch { return ts; }
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
