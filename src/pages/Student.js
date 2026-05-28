// ─── Student Pages ────────────────────────────────────────────────────────────
import { Store } from '../data/store.js'
import { delay, haversine, drawQRCanvas, nowTime, nowDate, toast, getAttPctColor, avatarInitials, genId } from '../utils/helpers.js'

const COLLEGE_LAT = 10.0517, COLLEGE_LNG = 76.3290, COLLEGE_RADIUS = 600
let _camStream = null

// ─── Scan QR ──────────────────────────────────────────────────────────────────
export function renderStudentScan(container, user) {
  let verOk = false

  container.innerHTML = `
    <div class="card" id="verify-card">
      <div class="card-title" style="margin-bottom:14px">Location & Network Verification</div>
      <div id="step-wifi" class="step-item chk">
        <div class="step-ico">📶</div>
        <div><div class="step-tit" style="font-size:13px;font-weight:500">College WiFi</div><div class="step-sub text-muted" id="wifi-sub" style="font-size:12px">Checking connection...</div></div>
      </div>
      <div id="step-loc" class="step-item pend">
        <div class="step-ico">📍</div>
        <div><div class="step-tit" style="font-size:13px;font-weight:500">Campus Location</div><div class="step-sub text-muted" id="loc-sub" style="font-size:12px">Waiting...</div></div>
      </div>
      <button class="btn btn-secondary btn-sm" id="recheck-btn" style="margin-top:10px;display:none">🔄 Retry Verification</button>
    </div>

    <div class="card" id="scan-card" style="display:none">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
        <div class="card-title">Mark Attendance</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" id="cam-btn">📷 Camera</button>
          <button class="btn btn-secondary btn-sm" id="manual-btn">⌨ Manual</button>
        </div>
      </div>

      <div id="cam-section" style="display:none">
        <div class="cam-view" style="margin-bottom:12px">
          <video id="cam-video" autoplay muted playsinline></video>
          <div class="cam-overlay"><div class="cam-box"><div class="scan-line"></div></div></div>
        </div>
        <div class="field">
          <label>Select Session</label>
          <select id="cam-sess-sel"><option value="">— Select session —</option></select>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-success" id="simulate-scan" style="flex:1">✓ Confirm Scan (Demo)</button>
          <button class="btn btn-secondary" id="stop-cam-btn">✕ Stop</button>
        </div>
        <p style="font-size:11px;color:var(--text3);text-align:center;margin-top:8px">Real-time camera scanning requires HTTPS deployment with jsQR library</p>
      </div>

      <div id="manual-section" style="display:none">
        <div class="field">
          <label>Select Active Session</label>
          <select id="sess-sel"><option value="">— Select session —</option></select>
        </div>
        <div class="field">
          <label>QR Token (copy from teacher's screen)</label>
          <input id="qr-in" placeholder="ATTX_sess_..." style="font-family:var(--mono);font-size:12px">
        </div>
        <button class="btn btn-success btn-block" id="mark-btn">✓ Mark Attendance</button>
      </div>

      <div id="att-success" style="display:none;text-align:center;padding:20px">
        <div style="font-size:48px;margin-bottom:10px">✅</div>
        <div style="font-size:18px;font-weight:700;color:var(--green)">Attendance Marked!</div>
        <div style="font-size:13px;color:var(--text2);margin-top:6px" id="att-success-detail"></div>
        <button class="btn btn-secondary" style="margin-top:14px" id="scan-again-btn">Scan Another Session</button>
      </div>
    </div>

    <div class="card" id="blocked-card" style="display:none">
      <div style="text-align:center;padding:20px">
        <div style="font-size:40px;margin-bottom:10px">🚫</div>
        <div style="font-size:15px;font-weight:600;color:var(--red);margin-bottom:6px">Verification Failed</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:16px">You must be on campus WiFi and within the campus boundary to mark attendance.</div>
        <button class="btn btn-secondary" id="retry-btn">🔄 Retry</button>
      </div>
    </div>
  `

  async function runVerify() {
    container.querySelector('#verify-card').style.display = 'block'
    container.querySelector('#scan-card').style.display = 'none'
    container.querySelector('#blocked-card').style.display = 'none'
    container.querySelector('#recheck-btn').style.display = 'none'
    setStep('wifi', 'chk', 'Checking network connection...')
    setStep('loc', 'pend', 'Waiting...')
    await delay(1000)
    setStep('wifi', 'ok', 'Connected to CollegeNet WiFi ✓')
    setStep('loc', 'chk', 'Getting GPS location...')
    await delay(1300)
    const locOk = await checkLocation()
    setStep('loc', locOk ? 'ok' : 'fail', locOk ? 'Inside campus boundary ✓' : 'Outside campus range — move closer')
    verOk = locOk
    if (locOk) {
      container.querySelector('#scan-card').style.display = 'block'
      populateSessSels()
    } else {
      container.querySelector('#blocked-card').style.display = 'block'
      container.querySelector('#recheck-btn').style.display = 'block'
    }
  }

  function setStep(id, state, desc) {
    const marks = { pend: '·', chk: '⏳', ok: '✓', fail: '✕' }
    const el = container.querySelector('#step-' + id)
    el.className = 'step-item ' + state
    el.querySelector('.step-ico').textContent = state === 'pend' ? (id === 'wifi' ? '📶' : '📍') : marks[state]
    el.querySelector('.step-sub').textContent = desc
  }

  async function checkLocation() {
    return new Promise(res => {
      if (!navigator.geolocation) { res(true); return }
      navigator.geolocation.getCurrentPosition(
        pos => res(haversine(pos.coords.latitude, pos.coords.longitude, COLLEGE_LAT, COLLEGE_LNG) <= COLLEGE_RADIUS),
        () => res(true), { timeout: 3000 }
      )
      setTimeout(() => res(true), 3500)
    })
  }

  function populateSessSels() {
    const active = Store.getSessions().filter(s => s.active)
    ;['sess-sel', 'cam-sess-sel'].forEach(id => {
      const sel = container.querySelector('#' + id)
      if (!sel) return
      sel.innerHTML = '<option value="">— Select session —</option>'
      active.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = `${s.code} · ${s.dept} Sec ${s.cls} · Sem ${s.sem}`; sel.appendChild(o) })
    })
  }

  function processAttendance(sessId, token) {
    const sess = Store.getSessions().find(s => s.id === sessId)
    if (!sess) { toast('Session not found', 'err'); return false }
    if (!sess.active) { toast('Session has ended', 'err'); return false }
    if (token !== sess.currentToken) {
      Store.addProxy({ student: user.name, roll: user.roll || user.username, session: sess.code, time: nowTime(), reason: 'Invalid or expired QR token' })
      toast('Invalid or expired token', 'err'); return false
    }
    if (sess.attendance[user.username]) { toast('Already marked for this session', 'err'); return false }
    const scanNow = Date.now()
    if (sess.scanTimes?.[user.username] && scanNow - sess.scanTimes[user.username] < 3000) {
      Store.addProxy({ student: user.name, roll: user.roll || user.username, session: sess.code, time: nowTime(), reason: 'Rapid re-scan detected' })
      toast('Too fast — suspicious activity flagged', 'err'); return false
    }
    const sessions = Store.getSessions()
    const idx = sessions.findIndex(s => s.id === sessId)
    sessions[idx].attendance[user.username] = { name: user.name, roll: user.roll || user.username, time: nowTime(), sessId }
    if (!sessions[idx].scanTimes) sessions[idx].scanTimes = {}
    sessions[idx].scanTimes[user.username] = scanNow
    localStorage.setItem('ax_sessions', JSON.stringify(sessions))
    Store.addAttendance(user.username, { code: sess.code, sessId, date: nowDate(), time: nowTime(), dept: sess.dept, sem: sess.sem })
    checkThreshold(user)
    container.querySelector('#manual-section').style.display = 'none'
    container.querySelector('#cam-section').style.display = 'none'
    container.querySelector('#att-success').style.display = 'block'
    container.querySelector('#att-success-detail').textContent = `${sess.code} · ${sess.dept} · ${nowTime()}`
    stopCam()
    toast('Attendance marked!', 'ok')
    return true
  }

  function checkThreshold(u) {
    const att = Store.getStudentAttendance(u.username)
    const sessions = Store.getSessions().filter(s => !s.active)
    const bySubj = {}
    sessions.forEach(s => { if (!bySubj[s.code]) bySubj[s.code] = { total: 0, present: 0 }; bySubj[s.code].total++ })
    att.forEach(a => { if (bySubj[a.code]) bySubj[a.code].present++ })
    const low = Object.entries(bySubj).filter(([, v]) => v.total > 0 && (v.present / v.total * 100) < 75)
    if (low.length) {
      const recent = Store.getAlerts().find(a => a.studentUsername === u.username && Date.now() - a.ts < 3600000)
      if (!recent) {
        const userInfo = Store.getUser(u.username) || {}
        const parentEmail = userInfo.parentEmail || ''
        Store.addAlert({ studentUsername: u.username, student: u.name, roll: u.roll || u.username, parentEmail: parentEmail || 'Not set', subjects: low.map(([k]) => k).join(', '), ts: Date.now(), time: nowTime(), date: nowDate() })
        toast(parentEmail ? `⚠ Alert sent to ${parentEmail}` : '⚠ Parent email not set — update profile', 'warn')
      }
    }
  }

  function stopCam() {
    if (_camStream) { _camStream.getTracks().forEach(t => t.stop()); _camStream = null }
    const v = container.querySelector('#cam-video')
    if (v) v.srcObject = null
  }

  container.querySelector('#cam-btn').addEventListener('click', async () => {
    container.querySelector('#cam-section').style.display = 'block'
    container.querySelector('#manual-section').style.display = 'none'
    container.querySelector('#att-success').style.display = 'none'
    populateSessSels()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      _camStream = stream; container.querySelector('#cam-video').srcObject = stream
      toast('Camera started', 'ok')
    } catch { toast('Camera unavailable — use manual mode', 'err') }
  })

  container.querySelector('#manual-btn').addEventListener('click', () => {
    container.querySelector('#manual-section').style.display = 'block'
    container.querySelector('#cam-section').style.display = 'none'
    container.querySelector('#att-success').style.display = 'none'
    stopCam(); populateSessSels()
  })

  container.querySelector('#stop-cam-btn').addEventListener('click', () => {
    stopCam(); container.querySelector('#cam-section').style.display = 'none'
  })

  container.querySelector('#simulate-scan').addEventListener('click', () => {
    const sid = container.querySelector('#cam-sess-sel').value
    if (!sid) { toast('Select a session first', 'err'); return }
    const sess = Store.getSessions().find(s => s.id === sid)
    if (!sess?.currentToken) { toast('No active token', 'err'); return }
    processAttendance(sid, sess.currentToken)
  })

  container.querySelector('#mark-btn').addEventListener('click', () => {
    processAttendance(container.querySelector('#sess-sel').value, container.querySelector('#qr-in').value.trim())
  })

  container.querySelector('#scan-again-btn').addEventListener('click', () => {
    container.querySelector('#att-success').style.display = 'none'
    populateSessSels()
  })

  container.querySelector('#retry-btn').addEventListener('click', runVerify)
  container.querySelector('#recheck-btn').addEventListener('click', runVerify)
  runVerify()
}

// ─── My Attendance ────────────────────────────────────────────────────────────
export function renderStudentAttendance(container, user) {
  const records = Store.getStudentAttendance(user.username)
  const sessions = Store.getSessions().filter(s => !s.active)
  const bySubj = {}
  sessions.forEach(s => { if (!bySubj[s.code]) bySubj[s.code] = { total: 0, present: 0, name: s.name || s.code, dept: s.dept, sem: s.sem }; bySubj[s.code].total++ })
  records.forEach(r => { if (bySubj[r.code]) bySubj[r.code].present++ })

  const alerts = Store.getAlerts().filter(a => a.studentUsername === user.username)
  const anyLow = Object.values(bySubj).some(v => v.total > 0 && v.present / v.total * 100 < 75)

  container.innerHTML = `
    ${anyLow ? `<div class="alert-banner"><div class="ab-icon">⚠️</div><div><div class="ab-title">Low Attendance Warning</div><div class="ab-sub">Your attendance has dropped below 75% in one or more subjects. Your parent/guardian has been notified.</div></div></div>` : ''}
    <div class="g3" style="margin-bottom:16px">
      <div class="metric green"><div class="mk">Overall</div><div class="mv">${sessions.length ? Math.round(records.length / sessions.length * 100) + '%' : '—'}</div></div>
      <div class="metric blue"><div class="mk">Classes attended</div><div class="mv">${records.length}</div></div>
      <div class="metric ${anyLow ? 'red' : 'green'}"><div class="mk">At-risk subjects</div><div class="mv">${Object.values(bySubj).filter(v => v.total > 0 && v.present / v.total * 100 < 75).length}</div></div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:16px">Subject-wise Attendance</div>
      ${Object.keys(bySubj).length ? Object.entries(bySubj).map(([code, d]) => {
        const pct = d.total ? Math.round(d.present / d.total * 100) : 0
        const col = getAttPctColor(pct)
        const needed = pct < 75 && d.total > 0 ? Math.max(0, Math.ceil((0.75 * d.total - d.present) / 0.25)) : 0
        return `<div style="margin-bottom:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <div>
              <span style="font-size:14px;font-weight:600">${code}</span>
              <span style="font-size:12px;color:var(--text2);margin-left:8px">${d.name}</span>
            </div>
            <span class="badge badge-${col === 'green' ? 'green' : col === 'amber' ? 'amber' : 'red'}">${pct}%</span>
          </div>
          <div style="font-size:12px;color:var(--text2);margin-bottom:5px">${d.present} / ${d.total} classes attended · Sem ${d.sem} · ${d.dept}</div>
          <div class="pbar"><div class="pbar-fill ${col}" style="width:${pct}%"></div></div>
          ${needed > 0 ? `<div style="font-size:11px;color:var(--red);margin-top:4px">⚠ Need ${needed} more consecutive classes to reach 75%</div>` : ''}
          ${pct >= 75 ? `<div style="font-size:11px;color:var(--green);margin-top:4px">✓ Safe zone — can miss ${Math.floor((d.present - 0.75 * d.total) / 0.75)} more class${Math.floor((d.present - 0.75 * d.total) / 0.75) !== 1 ? 'es' : ''}</div>` : ''}
        </div>`
      }).join('') : '<div class="empty-state">No attendance data yet</div>'}
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Recent Sessions</div>
      ${records.length ? records.slice().reverse().slice(0, 20).map(r => `
        <div class="row-item">
          <div class="ri-main"><div class="ri-title">${r.code}</div><div class="ri-sub">${r.date} · ${r.time} · ${r.dept}</div></div>
          <span class="badge badge-green">✓ Present</span>
        </div>`).join('') : '<div class="empty-state">No records yet</div>'}
    </div>
    ${alerts.length ? `<div class="card">
      <div class="card-title" style="margin-bottom:14px">Parent Alert Log</div>
      ${alerts.map(a => `<div class="row-item">
        <div class="ri-main"><div class="ri-title">Alert sent — ${a.subjects}</div><div class="ri-sub">${a.date} · To: ${a.parentEmail}</div></div>
        <span class="badge badge-amber">Sent</span>
      </div>`).join('')}
    </div>` : ''}
  `
}

// ─── Leave Request ────────────────────────────────────────────────────────────
export function renderStudentLeave(container, user) {
  const subjects = [...new Set(Store.getSessions().filter(s => !s.active).map(s => s.code))]
  container.innerHTML = `
    <div class="card">
      <div class="card-title" style="margin-bottom:16px">Apply for Leave</div>
      <div class="field"><label>Subject</label>
        <select id="lv-sub"><option value="">— Select subject —</option>${subjects.map(s => `<option>${s}</option>`).join('')}</select>
      </div>
      <div class="field-row">
        <div class="field"><label>From Date</label><input type="date" id="lv-from"></div>
        <div class="field"><label>To Date</label><input type="date" id="lv-to"></div>
      </div>
      <div class="field"><label>Reason</label><textarea id="lv-reason" placeholder="Explain the reason for leave..."></textarea></div>
      <button class="btn btn-primary" id="lv-submit">Submit Leave Request</button>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">My Leave Requests</div>
      <div id="lv-list"><div class="empty-state">No leave requests</div></div>
    </div>
  `
  function renderLeaves() {
    const leaves = Store.getLeaves().filter(l => l.studentUsername === user.username)
    const el = container.querySelector('#lv-list')
    el.innerHTML = leaves.length ? leaves.map(l => `
      <div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${l.subject} · ${l.from} to ${l.to}</div>
          <div class="ri-sub">${l.reason}</div>
        </div>
        <span class="badge ${l.status === 'approved' ? 'badge-green' : l.status === 'rejected' ? 'badge-red' : 'badge-amber'}">${l.status}</span>
      </div>`).join('') : '<div class="empty-state">No leave requests</div>'
  }
  renderLeaves()
  container.querySelector('#lv-submit').addEventListener('click', () => {
    const subject = container.querySelector('#lv-sub').value
    const from = container.querySelector('#lv-from').value
    const to = container.querySelector('#lv-to').value
    const reason = container.querySelector('#lv-reason').value.trim()
    if (!subject || !from || !to || !reason) { toast('Fill all fields', 'err'); return }
    Store.addLeave({ studentUsername: user.username, studentName: user.name, roll: user.roll || user.username, subject, from, to, reason, date: nowDate() })
    renderLeaves(); toast('Leave request submitted', 'ok')
    container.querySelector('#lv-reason').value = ''
  })
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export function renderStudentProfile(container, user) {
  const u = Store.getUser(user.username) || {}
  container.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
        <div class="avatar av-lg av-accent">${avatarInitials(user.name)}</div>
        <div>
          <div style="font-size:18px;font-weight:700">${user.name}</div>
          <div style="font-size:13px;color:var(--text2)">${u.roll || ''} · ${u.dept || ''} · Sem ${u.sem || ''}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="field-row">
        <div class="field"><label>Full Name</label><input id="p-name" value="${u.name || ''}"></div>
        <div class="field"><label>Email</label><input type="email" id="p-email" value="${u.email || ''}"></div>
      </div>
      <div class="field"><label>Phone</label><input id="p-phone" value="${u.phone || ''}"></div>
      <div style="font-size:13px;font-weight:600;color:var(--text2);margin-bottom:12px;margin-top:6px">Parent / Guardian Contact</div>
      <div class="field"><label>Parent Name</label><input id="p-par-name" value="${u.parentName || ''}"></div>
      <div class="field-row">
        <div class="field"><label>Parent Email</label><input type="email" id="p-par-email" value="${u.parentEmail || ''}"></div>
        <div class="field"><label>Parent Phone</label><input id="p-par-phone" value="${u.parentPhone || ''}"></div>
      </div>
      <button class="btn btn-primary" id="save-profile-btn">💾 Save Profile</button>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Announcements</div>
      <div id="ann-list">
        ${Store.getAnnouncements().filter(a => a.target === 'all' || a.target === 'student').map(a => `
          <div class="row-item">
            <div class="ri-main"><div class="ri-title">${a.title}</div><div class="ri-sub">${a.body}</div></div>
            <div style="font-size:11px;color:var(--text3);flex-shrink:0">${a.date}</div>
          </div>`).join('') || '<div class="empty-state">No announcements</div>'}
      </div>
    </div>
  `
  container.querySelector('#save-profile-btn').addEventListener('click', () => {
    Store.saveUser(user.username, {
      name: container.querySelector('#p-name').value,
      email: container.querySelector('#p-email').value,
      phone: container.querySelector('#p-phone').value,
      parentName: container.querySelector('#p-par-name').value,
      parentEmail: container.querySelector('#p-par-email').value,
      parentPhone: container.querySelector('#p-par-phone').value,
    })
    toast('Profile saved!', 'ok')
  })
}

// ─── Timetable ────────────────────────────────────────────────────────────────
export function renderStudentTimetable(container, user) {
  const u = Store.getUser(user.username) || {}
  const tt = Store.getTimetable().filter(t => t.dept === u.dept && parseInt(t.sem) === parseInt(u.sem) && t.section === u.section)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">My Timetable</div><div class="card-sub">${u.dept} · Sem ${u.sem} · Sec ${u.section}</div></div>
      </div>
      ${days.map(day => {
        const entry = tt.find(t => t.day === day)
        if (!entry) return ''
        return `<div style="margin-bottom:16px">
          <div style="font-size:12px;font-weight:600;color:var(--accent2);margin-bottom:8px">${day}</div>
          ${entry.periods.map(p => `<div class="row-item" style="margin-bottom:6px">
            <div style="font-family:var(--mono);font-size:12px;color:var(--text2);min-width:110px">${p.time}</div>
            <div class="ri-main"><div class="ri-title">${p.subject}</div></div>
          </div>`).join('')}
        </div>`
      }).join('') || '<div class="empty-state">No timetable available for your class</div>'}
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Upcoming Holidays</div>
      ${Store.getHolidays().filter(h => new Date(h.date) >= new Date()).slice(0, 5).map(h => `
        <div class="row-item">
          <div class="ri-main"><div class="ri-title">${h.name}</div><div class="ri-sub">${h.date}</div></div>
          <span class="badge badge-blue">Holiday</span>
        </div>`).join('') || '<div class="empty-state">No upcoming holidays</div>'}
    </div>
  `
}
