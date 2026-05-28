// ─── Teacher Pages ────────────────────────────────────────────────────────────
import { Store } from '../data/store.js'
import { genId, genToken, drawQRCanvas, delay, exportCSV, exportJSON, nowTime, nowDate, toast, getAttPctColor } from '../utils/helpers.js'

let _sessTimer = null, _qrTimer = null, _qrTickTimer = null, _currentToken = '', _qrCd = 2
let _camStream = null, _scanInterval = null

// ─── Session Manager ──────────────────────────────────────────────────────────
export function renderTeacherSession(container, user) {
  const activeSess = Store.getActiveSession()
  container.innerHTML = `
    <div class="g2" style="margin-bottom:16px">
      <div class="metric blue"><div class="mk">Total sessions</div><div class="mv" id="t-total">0</div></div>
      <div class="metric green"><div class="mk">Avg attendance</div><div class="mv" id="t-avg">—</div></div>
    </div>
    <div id="sess-form-wrap">
      <div class="card">
        <div class="card-header"><div><div class="card-title">Start New Session</div><div class="card-sub">Set up a timed QR attendance window</div></div></div>
        <div class="field-row">
          <div class="field"><label>Subject Code</label><input id="sc" placeholder="CS301"></div>
          <div class="field"><label>Subject Name</label><input id="sname" placeholder="Data Structures"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Section</label><input id="scls" placeholder="A"></div>
          <div class="field"><label>Semester</label>
            <select id="ssem">${[1,2,3,4,5,6,7,8].map(n=>`<option ${n===4?'selected':''}>${n}</option>`).join('')}</select>
          </div>
        </div>
        <div class="field-row">
          <div class="field"><label>Department</label>
            <select id="sdept"><option>CSE</option><option>ECE</option><option>EEE</option><option>ME</option><option>CE</option><option>IT</option></select>
          </div>
          <div class="field"><label>Duration</label>
            <select id="sdur"><option value="300">5 min</option><option value="600">10 min</option><option value="900" selected>15 min</option><option value="1800">30 min</option><option value="3600">60 min</option></select>
          </div>
        </div>
        <button class="btn btn-primary btn-block" id="start-btn">▶ Generate QR Session</button>
      </div>
      <div class="card" style="margin-top:14px">
        <div class="card-title" style="margin-bottom:14px">Today's Sessions</div>
        <div id="today-sessions"><div class="empty-state">No sessions today</div></div>
      </div>
    </div>
    <div id="sess-live-wrap" style="display:none">
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">
          <div>
            <div class="text-muted" style="font-size:12px;margin-bottom:3px">Live Session</div>
            <div style="font-size:20px;font-weight:700" id="sl-title"></div>
          </div>
          <div class="timer-pill tp-green" id="sl-timer">00:00</div>
        </div>
        <div class="g4" style="margin-bottom:16px">
          <div class="metric"><div class="mk">Subject</div><div class="mv" id="sl-sub" style="font-size:16px"></div></div>
          <div class="metric"><div class="mk">Section</div><div class="mv" id="sl-cls" style="font-size:16px"></div></div>
          <div class="metric"><div class="mk">Sem</div><div class="mv" id="sl-sem" style="font-size:16px"></div></div>
          <div class="metric"><div class="mk">Dept</div><div class="mv" id="sl-dept" style="font-size:16px"></div></div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;padding:16px 0">
          <div class="qr-frame" style="margin-bottom:10px">
            <canvas id="qr-canvas" width="200" height="200"></canvas>
            <div class="qr-spin" id="qr-spin">↻</div>
          </div>
          <div style="font-size:12px;color:var(--text2);margin-bottom:4px">QR refreshes every <span style="color:var(--accent2)">2 seconds</span> · next in <span id="qr-cd" style="color:var(--accent2)">2s</span></div>
          <div class="qr-token" id="qr-token-disp"></div>
          <button class="btn btn-secondary btn-sm" style="margin-top:8px" id="copy-token-btn">📋 Copy Token</button>
        </div>
        <div class="g2" style="margin-bottom:16px">
          <div class="metric green"><div class="mk">Present</div><div class="mv" id="sl-present">0</div></div>
          <div class="metric amber"><div class="mk">Proxy Flags</div><div class="mv" id="sl-proxy">0</div></div>
        </div>
        <div class="sec-title">Present students</div>
        <div id="sl-list"><div class="empty-state">Waiting for students to scan...</div></div>
        <div class="divider"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-secondary" id="add-manual-btn" style="flex:1">+ Add Manually</button>
          <button class="btn btn-danger" id="end-sess-btn" style="flex:1">■ End Session</button>
        </div>
      </div>
    </div>
  `
  refreshMetrics(container, user)
  renderTodaySessions(container, user)

  if (activeSess && activeSess.teacher === user.name) {
    showLiveSession(container, activeSess)
  }

  container.querySelector('#start-btn').addEventListener('click', () => {
    const code = container.querySelector('#sc').value.trim()
    const cls = container.querySelector('#scls').value.trim()
    if (!code || !cls) { toast('Fill in subject code and section', 'err'); return }
    const sid = genId('sess')
    const sess = {
      id: sid, code, name: container.querySelector('#sname').value.trim() || code,
      cls, sem: container.querySelector('#ssem').value, dept: container.querySelector('#sdept').value,
      duration: parseInt(container.querySelector('#sdur').value),
      teacher: user.name, teacherUsername: user.username,
      startTime: Date.now(), attendance: {}, scanTimes: {}, active: true,
      date: nowDate(), proxyCount: 0
    }
    Store.addSession(sess)
    showLiveSession(container, sess)
    toast('Session started!', 'ok')
  })
}

function showLiveSession(container, sess) {
  container.querySelector('#sess-form-wrap').style.display = 'none'
  container.querySelector('#sess-live-wrap').style.display = 'block'
  container.querySelector('#sl-title').textContent = `${sess.code} · Sem ${sess.sem}`
  container.querySelector('#sl-sub').textContent = sess.code
  container.querySelector('#sl-cls').textContent = 'Sec ' + sess.cls
  container.querySelector('#sl-sem').textContent = 'Sem ' + sess.sem
  container.querySelector('#sl-dept').textContent = sess.dept
  updateLiveList(container, sess)
  rotateQR(container, sess)
  startTimer(container, sess)

  container.querySelector('#copy-token-btn').addEventListener('click', () => {
    navigator.clipboard?.writeText(_currentToken).then(() => toast('Token copied!', 'ok')).catch(() => toast(_currentToken, 'info'))
  })

  container.querySelector('#add-manual-btn').addEventListener('click', () => {
    const name = prompt('Student name to add manually:')
    if (!name) return
    const roll = prompt('Roll number:') || 'Manual'
    const key = 'manual_' + Date.now()
    const sessions = Store.getSessions()
    const idx = sessions.findIndex(s => s.id === sess.id)
    if (idx >= 0) {
      sessions[idx].attendance[key] = { name, roll, time: nowTime(), sessId: sess.id, manual: true }
      localStorage.setItem('ax_sessions', JSON.stringify(sessions))
      updateLiveList(container, sessions[idx])
      toast('Student added', 'ok')
    }
  })

  container.querySelector('#end-sess-btn').addEventListener('click', () => {
    if (!confirm('End this session?')) return
    endSession(container, sess.id)
  })
}

function rotateQR(container, sess) {
  _currentToken = genToken(sess.id)
  const sessions = Store.getSessions()
  const idx = sessions.findIndex(s => s.id === sess.id)
  if (idx >= 0) { sessions[idx].currentToken = _currentToken; localStorage.setItem('ax_sessions', JSON.stringify(sessions)) }
  const cv = container.querySelector('#qr-canvas')
  if (cv) drawQRCanvas(cv, _currentToken, 200)
  const td = container.querySelector('#qr-token-disp')
  if (td) td.textContent = _currentToken
  _qrCd = 2
  const cd = container.querySelector('#qr-cd')
  if (cd) cd.textContent = '2s'
  clearInterval(_qrTickTimer)
  _qrTickTimer = setInterval(() => { _qrCd--; if (_qrCd < 0) _qrCd = 1; if (cd) cd.textContent = _qrCd + 's' }, 1000)
  clearTimeout(_qrTimer)
  const active = Store.getSessions().find(s => s.id === sess.id)
  if (active?.active) _qrTimer = setTimeout(() => rotateQR(container, active), 2000)
}

function startTimer(container, sess) {
  let rem = sess.duration
  const pill = container.querySelector('#sl-timer')
  function tick() {
    if (!pill?.isConnected) return
    const m = Math.floor(rem / 60), s = rem % 60
    pill.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    pill.className = 'timer-pill ' + (rem > 120 ? 'tp-green' : rem > 30 ? 'tp-amber' : 'tp-red')
    if (rem <= 0) { endSession(container, sess.id); return }
    rem--; _sessTimer = setTimeout(tick, 1000)
  }
  clearTimeout(_sessTimer); tick()
}

function updateLiveList(container, sess) {
  const entries = Object.values(sess.attendance || {})
  const el = container.querySelector('#sl-list')
  const countEl = container.querySelector('#sl-present')
  if (countEl) countEl.textContent = entries.length
  if (!el) return
  el.innerHTML = entries.length ? entries.map(e => `
    <div class="row-item">
      <div class="avatar av-sm av-green">${(e.name[0]||'?').toUpperCase()}</div>
      <div class="ri-main"><div class="ri-title">${e.name}</div><div class="ri-sub">${e.roll} · ${e.time}${e.manual?' · Manual':''}</div></div>
      <span class="badge badge-green">Present</span>
    </div>`).join('') : '<div class="empty-state">Waiting for students to scan...</div>'
}

function endSession(container, sessId) {
  clearTimeout(_sessTimer); clearTimeout(_qrTimer); clearInterval(_qrTickTimer)
  Store.updateSession(sessId, { active: false })
  container.querySelector('#sess-live-wrap').style.display = 'none'
  container.querySelector('#sess-form-wrap').style.display = 'block'
  renderTodaySessions(container, { username: Store.getCurrentUser()?.username })
  refreshMetrics(container, Store.getCurrentUser())
  toast('Session ended', 'ok')
}

function renderTodaySessions(container, user) {
  const el = container.querySelector('#today-sessions')
  if (!el) return
  const sessions = Store.getSessions().filter(s => s.teacherUsername === user.username && s.date === nowDate())
  el.innerHTML = sessions.length ? sessions.slice().reverse().map(s => `
    <div class="row-item">
      <div class="ri-main">
        <div class="ri-title">${s.code} · Sec ${s.cls} · Sem ${s.sem}</div>
        <div class="ri-sub">${s.dept} · ${Object.keys(s.attendance || {}).length} present</div>
      </div>
      <span class="badge ${s.active ? 'badge-green' : 'badge-gray'}">${s.active ? 'Live' : 'Done'}</span>
    </div>`).join('') : '<div class="empty-state">No sessions today</div>'
}

function refreshMetrics(container, user) {
  const sessions = Store.getSessions().filter(s => s.teacherUsername === user?.username)
  container.querySelector('#t-total').textContent = sessions.length
  if (sessions.length) {
    const avgPct = Math.round(sessions.reduce((a, s) => a + Object.keys(s.attendance || {}).length, 0) / sessions.length)
    container.querySelector('#t-avg').textContent = avgPct + ' avg'
  }
}

// ─── Records ──────────────────────────────────────────────────────────────────
export function renderTeacherRecords(container, user) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Session Records</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select id="rec-filter-sub" style="font-size:12px;padding:6px 10px;border-radius:var(--r8);background:var(--s2);border:1px solid var(--border);color:var(--text)">
            <option value="">All subjects</option>
          </select>
          <button class="btn btn-secondary btn-sm" id="exp-csv">📥 CSV</button>
          <button class="btn btn-secondary btn-sm" id="exp-json">📋 JSON</button>
        </div>
      </div>
      <div id="rec-list"><div class="empty-state">No sessions recorded</div></div>
    </div>
    <div class="card" id="rec-detail" style="display:none">
      <div class="card-header">
        <div class="card-title" id="rd-title">Session Detail</div>
        <button class="btn btn-secondary btn-sm" id="rd-close">✕ Close</button>
      </div>
      <div id="rd-body"></div>
    </div>
  `
  const sessions = Store.getSessions().filter(s => s.teacherUsername === user.username)
  const subjects = [...new Set(sessions.map(s => s.code))]
  const selSub = container.querySelector('#rec-filter-sub')
  subjects.forEach(sub => { const o = document.createElement('option'); o.value = sub; o.textContent = sub; selSub.appendChild(o) })

  function render() {
    const filterSub = selSub.value
    const filtered = sessions.filter(s => !filterSub || s.code === filterSub).slice().reverse()
    const el = container.querySelector('#rec-list')
    el.innerHTML = filtered.length ? filtered.map(s => `
      <div class="row-item" style="cursor:pointer" data-sid="${s.id}">
        <div class="ri-main">
          <div class="ri-title">${s.code} · ${s.name || ''} · Sec ${s.cls}</div>
          <div class="ri-sub">${s.dept} · Sem ${s.sem} · ${s.date} · ${Object.keys(s.attendance||{}).length} present</div>
        </div>
        <span class="badge ${s.active ? 'badge-green' : 'badge-purple'}">${s.active ? 'Live' : 'Done'}</span>
      </div>`).join('') : '<div class="empty-state">No sessions found</div>'

    el.querySelectorAll('[data-sid]').forEach(row => {
      row.addEventListener('click', () => {
        const sess = sessions.find(s => s.id === row.dataset.sid)
        if (!sess) return
        const detail = container.querySelector('#rec-detail')
        const entries = Object.values(sess.attendance || {})
        detail.style.display = 'block'
        container.querySelector('#rd-title').textContent = `${sess.code} · ${sess.date}`
        container.querySelector('#rd-body').innerHTML = `
          <div class="tbl-wrap"><table>
            <thead><tr><th>#</th><th>Name</th><th>Roll</th><th>Time</th><th>Type</th></tr></thead>
            <tbody>${entries.length ? entries.map((e, i) => `<tr><td>${i + 1}</td><td>${e.name}</td><td>${e.roll}</td><td>${e.time}</td><td>${e.manual ? 'Manual' : 'QR Scan'}</td></tr>`).join('') : '<tr><td colspan="5" style="text-align:center;color:var(--text3)">No attendance recorded</td></tr>'}</tbody>
          </table></div>
          <div style="margin-top:10px;font-size:12px;color:var(--text2)">${entries.length} students present</div>`
        detail.scrollIntoView({ behavior: 'smooth' })
      })
    })
  }
  render()
  selSub.addEventListener('change', render)
  container.querySelector('#rd-close').addEventListener('click', () => { container.querySelector('#rec-detail').style.display = 'none' })

  const getRows = () => sessions.filter(s => !selSub.value || s.code === selSub.value).flatMap(s =>
    Object.values(s.attendance || {}).map(a => ({ subject: s.code, section: s.cls, semester: s.sem, department: s.dept, date: s.date, student: a.name, roll: a.roll, time: a.time, type: a.manual ? 'manual' : 'qr' }))
  )
  container.querySelector('#exp-csv').addEventListener('click', () => { const r = getRows(); if (r.length) exportCSV(r, 'attendance_records.csv'); else toast('No data to export', 'err') })
  container.querySelector('#exp-json').addEventListener('click', () => exportJSON(getRows(), 'attendance_records.json'))
}

// ─── Leaves ───────────────────────────────────────────────────────────────────
export function renderTeacherLeaves(container, user) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">Leave Requests</div></div>
      <div id="leave-list"><div class="empty-state">No leave requests</div></div>
    </div>
  `
  function render() {
    const leaves = Store.getLeaves().filter(l => l.teacherUsername === user.username || !l.teacherUsername)
    const el = container.querySelector('#leave-list')
    el.innerHTML = leaves.length ? leaves.map(l => `
      <div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${l.studentName} (${l.roll})</div>
          <div class="ri-sub">${l.subject} · ${l.from} to ${l.to} · ${l.reason}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <span class="badge ${l.status === 'approved' ? 'badge-green' : l.status === 'rejected' ? 'badge-red' : 'badge-amber'}">${l.status}</span>
          ${l.status === 'pending' ? `<button class="btn btn-success btn-xs" data-lid="${l.id}" data-action="approved">✓</button><button class="btn btn-danger btn-xs" data-lid="${l.id}" data-action="rejected">✕</button>` : ''}
        </div>
      </div>`).join('') : '<div class="empty-state">No leave requests</div>'

    el.querySelectorAll('[data-lid]').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.updateLeave(btn.dataset.lid, btn.dataset.action)
        render(); toast(`Leave ${btn.dataset.action}`, 'ok')
      })
    })
  }
  render()
}

// ─── Announcements ────────────────────────────────────────────────────────────
export function renderTeacherAnnouncements(container, user) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">Post Announcement</div></div>
      <div class="field"><label>Title</label><input id="ann-title" placeholder="Announcement title"></div>
      <div class="field"><label>Message</label><textarea id="ann-body" placeholder="Write your announcement..."></textarea></div>
      <div class="field-row">
        <div class="field"><label>Target</label>
          <select id="ann-target"><option value="all">Everyone</option><option value="student">Students only</option></select>
        </div>
      </div>
      <button class="btn btn-primary" id="post-ann">📢 Post Announcement</button>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Posted Announcements</div>
      <div id="ann-list"></div>
    </div>
  `
  function renderAnns() {
    const el = container.querySelector('#ann-list')
    const anns = Store.getAnnouncements().filter(a => a.author === user.username || a.author === 'admin')
    el.innerHTML = anns.length ? anns.map(a => `
      <div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${a.title}</div>
          <div class="ri-sub">${a.date} · ${a.target === 'all' ? 'All users' : 'Students'}</div>
        </div>
      </div>`).join('') : '<div class="empty-state">No announcements yet</div>'
  }
  renderAnns()
  container.querySelector('#post-ann').addEventListener('click', () => {
    const title = container.querySelector('#ann-title').value.trim()
    const body = container.querySelector('#ann-body').value.trim()
    if (!title || !body) { toast('Fill in title and message', 'err'); return }
    Store.addAnnouncement({ title, body, author: user.username, target: container.querySelector('#ann-target').value })
    container.querySelector('#ann-title').value = ''
    container.querySelector('#ann-body').value = ''
    renderAnns(); toast('Announcement posted!', 'ok')
  })
}
