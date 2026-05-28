// ─── ZeroProxy · Utilities ─────────────────────────────────────────────────

export function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function nowDate() {
  return new Date().toLocaleDateString()
}

export function genId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
}

export function genToken(sessionId) {
  const r = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `ATTX_${sessionId}_${Date.now()}_${r}`
}

export function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function drawQRCanvas(canvas, token, size = 200) {
  const ctx = canvas.getContext('2d')
  canvas.width = size; canvas.height = size
  const cell = 6, cols = Math.floor(size / cell)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  const seed = token.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  function prng(n) { let x = (seed * n * 2654435761) | 0; x ^= x >>> 17; x *= 0x36f6287; x ^= x >>> 32; return Math.abs(x) % 256 }
  ctx.fillStyle = '#1a1a2e'
  for (let i = 0; i < cols; i++) for (let j = 0; j < cols; j++) {
    if (prng(i * cols + j + 1) < 128) ctx.fillRect(i * cell, j * cell, cell, cell)
  }
  const q = Math.floor(cols / 3)
  function corner(x, y) {
    ctx.fillStyle = '#fff'; ctx.fillRect(x * cell, y * cell, q * cell, q * cell)
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(x * cell, y * cell, q * cell, q * cell)
    ctx.fillStyle = '#fff'; ctx.fillRect((x + 1) * cell, (y + 1) * cell, (q - 2) * cell, (q - 2) * cell)
    ctx.fillStyle = '#6366f1'; ctx.fillRect((x + 2) * cell, (y + 2) * cell, (q - 4) * cell, (q - 4) * cell)
  }
  corner(0, 0); corner(cols - q, 0); corner(0, cols - q)
  const cx = Math.floor(cols / 2)
  ctx.fillStyle = '#6366f1'; ctx.fillRect((cx - 1) * cell, (cx - 1) * cell, 2 * cell, 2 * cell)
}

export function exportCSV(rows, filename) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))].join('\n')
  downloadBlob(csv, filename, 'text/csv')
}

export function exportJSON(data, filename) {
  downloadBlob(JSON.stringify(data, null, 2), filename, 'application/json')
}

export function downloadBlob(content, filename, mime) {
  const a = document.createElement('a')
  a.href = 'data:' + mime + ';charset=utf-8,' + encodeURIComponent(content)
  a.download = filename; a.click()
}

export function getAttPctColor(pct) {
  if (pct >= 75) return 'green'
  if (pct >= 60) return 'amber'
  return 'red'
}

export function formatPct(pct) {
  return pct == null ? '—' : pct + '%'
}

export function avatarInitials(name) {
  return (name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function toast(msg, type = 'ok') {
  const existing = document.querySelector('.ax-toast')
  if (existing) existing.remove()
  const t = document.createElement('div')
  t.className = 'ax-toast ax-toast-' + type
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.classList.add('ax-toast-show'), 10)
  setTimeout(() => { t.classList.remove('ax-toast-show'); setTimeout(() => t.remove(), 300) }, 3000)
}
