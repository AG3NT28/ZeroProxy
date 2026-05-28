// ─── Admin Pages ──────────────────────────────────────────────────────────────
import { Store } from '../data/store.js'
import { exportCSV, exportJSON, toast, getAttPctColor, avatarInitials, nowDate, nowTime } from '../utils/helpers.js'

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function renderAdminDashboard(container) {
  const users = Store.getUsers()
  const sessions = Store.getSessions()
  const alerts = Store.getAlerts()
  const proxy = Store.getProxy()
  const students = Object.entries(users).filter(([, u]) => u.role === 'student')
  const teachers = Object.entries(users).filter(([, u]) => u.role === 'teacher')

  let totalPresent = 0, totalPossible = 0, riskCount = 0
  students.forEach(([uname]) => {
    const att = Store.getStudentAttendance(uname)
    const sess = sessions.filter(s => !s.active)
    totalPresent += att.length; totalPossible += sess.length
    const bySubj = {}
    sess.forEach(s => { if (!bySubj[s.code]) bySubj[s.code] = { p: 0, t: 0 }; bySubj[s.code].t++ })
    att.forEach(a => { if (bySubj[a.code]) bySubj[a.code].p++ })
    if (Object.values(bySubj).some(v => v.t > 0 && v.p / v.t * 100 < 75)) riskCount++
  })
  const overallPct = totalPossible ? Math.round(totalPresent / totalPossible * 100) : 0

  const depts = [...new Set(Object.values(users).filter(u => u.role === 'student').map(u => u.dept).filter(Boolean))]

  container.innerHTML = `
    <div class="g4" style="margin-bottom:16px">
      <div class="metric green"><div class="mk">Overall attendance</div><div class="mv">${overallPct}%</div><div class="ms">across all classes</div></div>
      <div class="metric blue"><div class="mk">Total students</div><div class="mv">${students.length}</div></div>
      <div class="metric purple"><div class="mk">Total teachers</div><div class="mv">${teachers.length}</div></div>
      <div class="metric"><div class="mk">Total sessions</div><div class="mv">${sessions.length}</div></div>
    </div>
    <div class="g2" style="margin-bottom:16px">
      <div class="metric red"><div class="mk">Students at risk</div><div class="mv">${riskCount}</div><div class="ms">below 75% threshold</div></div>
      <div class="metric amber"><div class="mk">Proxy flags</div><div class="mv">${proxy.length}</div><div class="ms">suspicious activities</div></div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:16px">Department-wise Attendance</div>
      <div class="chart-container"><canvas id="dept-chart" role="img" aria-label="Department attendance percentages">Department attendance data</canvas></div>
    </div>
    <div class="g2">
      <div class="card">
        <div class="card-title" style="margin-bottom:14px">At-Risk Students <span class="badge badge-red">${riskCount}</span></div>
        <div id="risk-list">${renderRiskList(students)}</div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:14px">Recent Parent Alerts</div>
        <div>${alerts.slice(0, 5).map(a => `
          <div class="row-item">
            <div class="ri-main"><div class="ri-title">${a.student}</div><div class="ri-sub">${a.subjects} · ${a.date}</div></div>
            <span class="badge badge-amber">Alert</span>
          </div>`).join('') || '<div class="empty-state">No alerts</div>'}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Live & Recent Sessions</div>
        <span class="badge badge-green" id="live-badge">${sessions.filter(s => s.active).length} live</span>
      </div>
      <div>${sessions.slice().reverse().slice(0, 8).map(s => `
        <div class="row-item">
          <div class="ri-main">
            <div class="ri-title">${s.code} · ${s.dept} Sec ${s.cls} · Sem ${s.sem}</div>
            <div class="ri-sub">${s.teacher} · ${s.date} · ${Object.keys(s.attendance || {}).length} present</div>
          </div>
          <span class="badge ${s.active ? 'badge-green' : 'badge-gray'}">${s.active ? 'Live' : 'Done'}</span>
        </div>`).join('') || '<div class="empty-state">No sessions</div>'}
      </div>
    </div>
  `

  // Chart
  setTimeout(() => {
    const deptPcts = depts.map(dept => {
      const deptStudents = students.filter(([, u]) => u.dept === dept)
      if (!deptStudents.length) return 0
      let p = 0, t = 0
      deptStudents.forEach(([uname]) => {
        const att = Store.getStudentAttendance(uname)
        const sess = sessions.filter(s => !s.active)
        p += att.length; t += sess.length
      })
      return t ? Math.round(p / t * 100) : 0
    })

    if (window._adminChart) window._adminChart.destroy()
    window._adminChart = new Chart(document.getElementById('dept-chart'), {
      type: 'bar',
      data: {
        labels: depts.length ? depts : ['CSE', 'ECE', 'ME', 'CE'],
        datasets: [{
          label: 'Attendance %',
          data: depts.length ? deptPcts : [82, 78, 74, 88],
          backgroundColor: ['#6366f1', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6'].slice(0, Math.max(depts.length, 4)),
          borderRadius: 8, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#64748b', callback: v => v + '%' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    })
  }, 100)
}

function renderRiskList(students) {
  const riskStudents = students.filter(([uname]) => {
    const att = Store.getStudentAttendance(uname)
    const sess = Store.getSessions().filter(s => !s.active)
    const bySubj = {}
    sess.forEach(s => { if (!bySubj[s.code]) bySubj[s.code] = { p: 0, t: 0 }; bySubj[s.code].t++ })
    att.forEach(a => { if (bySubj[a.code]) bySubj[a.code].p++ })
    return Object.values(bySubj).some(v => v.t > 0 && v.p / v.t * 100 < 75)
  })
  if (!riskStudents.length) return '<div class="empty-state">No at-risk students</div>'
  return riskStudents.map(([, u]) => `
    <div class="row-item">
      <div class="avatar av-sm av-red">${avatarInitials(u.name)}</div>
      <div class="ri-main"><div class="ri-title">${u.name}</div><div class="ri-sub">${u.roll || ''} · ${u.dept}</div></div>
      <span class="badge badge-red">At risk</span>
    </div>`).join('')
}

// ─── Manage Students ──────────────────────────────────────────────────────────
export function renderAdminStudents(container) {
  container.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <input id="stu-search" placeholder="Search by name, roll, dept..." style="flex:1;min-width:180px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);padding:9px 13px;color:var(--text);font-family:var(--font);font-size:13px;outline:none">
      <select id="stu-dept-filter" style="padding:9px 13px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);color:var(--text);font-size:13px">
        <option value="">All depts</option>
        <option>CSE</option><option>ECE</option><option>EEE</option><option>ME</option><option>CE</option><option>IT</option>
      </select>
      <button class="btn btn-primary" id="add-stu-btn">+ Add Student</button>
      <button class="btn btn-secondary" id="bulk-stu-btn">📤 Bulk Import</button>
      <button class="btn btn-secondary" id="exp-stu-btn">📥 Export</button>
    </div>
    <div class="card">
      <div class="tbl-wrap"><table>
        <thead><tr><th>Name</th><th>Roll</th><th>Dept</th><th>Sem</th><th>Section</th><th>Attendance</th><th>Parent</th><th>Actions</th></tr></thead>
        <tbody id="stu-tbody"></tbody>
      </table></div>
    </div>

    <!-- Add Modal -->
    <div class="modal-backdrop" id="add-stu-modal" style="display:none">
      <div class="modal">
        <div class="modal-header"><div class="modal-title" id="stu-modal-title">Add Student</div><button class="modal-close" id="close-stu-modal">✕</button></div>
        <div class="field-row"><div class="field"><label>Username</label><input id="m-uname" placeholder="john.doe"></div><div class="field"><label>Full Name</label><input id="m-name" placeholder="John Doe"></div></div>
        <div class="field-row"><div class="field"><label>Roll Number</label><input id="m-roll" placeholder="CS21001"></div><div class="field"><label>Password</label><input id="m-pass" placeholder="pass123" value="pass123"></div></div>
        <div class="field-row">
          <div class="field"><label>Department</label><select id="m-dept"><option>CSE</option><option>ECE</option><option>EEE</option><option>ME</option><option>CE</option><option>IT</option></select></div>
          <div class="field"><label>Semester</label><select id="m-sem">${[1,2,3,4,5,6,7,8].map(n=>`<option ${n===4?'selected':''}>${n}</option>`).join('')}</select></div>
        </div>
        <div class="field-row"><div class="field"><label>Section</label><input id="m-sec" value="A"></div><div class="field"><label>Email</label><input type="email" id="m-email" placeholder="john@student.edu"></div></div>
        <div class="field"><label>Phone</label><input id="m-phone" placeholder="9XXXXXXXXX"></div>
        <div style="font-size:13px;font-weight:600;color:var(--text2);margin:12px 0 8px">Parent / Guardian</div>
        <div class="field-row"><div class="field"><label>Parent Name</label><input id="m-pname" placeholder="Robert Doe"></div><div class="field"><label>Parent Email</label><input type="email" id="m-pemail" placeholder="parent@email.com"></div></div>
        <div class="field"><label>Parent Phone</label><input id="m-pphone" placeholder="9XXXXXXXXX"></div>
        <div class="modal-footer"><button class="btn btn-secondary" id="cancel-stu-modal">Cancel</button><button class="btn btn-primary" id="save-stu-btn">Save Student</button></div>
      </div>
    </div>

    <!-- Bulk Import Modal -->
    <div class="modal-backdrop" id="bulk-modal" style="display:none">
      <div class="modal">
        <div class="modal-header"><div class="modal-title">Bulk Import Students</div><button class="modal-close" id="close-bulk">✕</button></div>
        <div class="upload-area" id="csv-drop">
          <div class="upload-icon">📂</div>
          <p>Drag & drop CSV file or click to browse</p>
          <span>Columns: username, name, roll, dept, sem, section, email, phone, parentName, parentEmail, parentPhone, password</span>
          <input type="file" id="csv-file" accept=".csv" style="display:none">
        </div>
        <div class="field" style="margin-top:14px">
          <label>Or paste CSV data</label>
          <textarea id="csv-paste" placeholder="username,name,roll,dept,sem,section&#10;alice.j,Alice Johnson,CS21010,CSE,4,A" style="height:120px;font-family:var(--mono);font-size:12px"></textarea>
        </div>
        <div id="bulk-preview" style="display:none;margin-top:10px"></div>
        <div class="modal-footer"><button class="btn btn-secondary" id="cancel-bulk">Cancel</button><button class="btn btn-secondary" id="preview-bulk">Preview</button><button class="btn btn-primary" id="import-bulk">Import</button></div>
      </div>
    </div>
  `

  let editingUsername = null

  function renderTable() {
    const search = container.querySelector('#stu-search').value.toLowerCase()
    const deptF = container.querySelector('#stu-dept-filter').value
    const users = Store.getUsers()
    const students = Object.entries(users).filter(([, u]) => u.role === 'student').filter(([uname, u]) => {
      const matchSearch = !search || u.name?.toLowerCase().includes(search) || u.roll?.toLowerCase().includes(search) || u.dept?.toLowerCase().includes(search) || uname.includes(search)
      const matchDept = !deptF || u.dept === deptF
      return matchSearch && matchDept
    })
    const sessions = Store.getSessions().filter(s => !s.active)
    const tbody = container.querySelector('#stu-tbody')
    tbody.innerHTML = students.map(([uname, u]) => {
      const att = Store.getStudentAttendance(uname)
      const pct = sessions.length ? Math.round(att.length / sessions.length * 100) : null
      const col = pct == null ? 'gray' : getAttPctColor(pct)
      return `<tr>
        <td><div style="display:flex;align-items:center;gap:8px"><div class="avatar av-sm av-accent">${avatarInitials(u.name)}</div>${u.name}</div></td>
        <td style="font-family:var(--mono);font-size:12px">${u.roll || ''}</td>
        <td>${u.dept || ''}</td>
        <td>${u.sem || ''}</td>
        <td>${u.section || ''}</td>
        <td><span class="badge badge-${col}">${pct == null ? '—' : pct + '%'}</span></td>
        <td><div style="font-size:12px">${u.parentName || '—'}</div><div style="font-size:11px;color:var(--text3)">${u.parentEmail || ''}</div></td>
        <td><div style="display:flex;gap:6px">
          <button class="btn-icon btn-xs" data-edit="${uname}" title="Edit">✏️</button>
          <button class="btn-icon btn-xs btn-danger-icon" data-del="${uname}" title="Delete">🗑️</button>
          <button class="btn-icon btn-xs" data-alert="${uname}" title="Send parent alert">📧</button>
        </div></td>
      </tr>`
    }).join('') || `<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px">No students found</td></tr>`

    tbody.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = Store.getUser(btn.dataset.edit)
        editingUsername = btn.dataset.edit
        openModal(u, btn.dataset.edit)
      })
    })
    tbody.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm(`Delete student ${btn.dataset.del}?`)) { Store.deleteUser(btn.dataset.del); renderTable(); toast('Student deleted', 'ok') }
      })
    })
    tbody.querySelectorAll('[data-alert]').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = Store.getUser(btn.dataset.alert)
        Store.addAlert({ studentUsername: btn.dataset.alert, student: u.name, roll: u.roll, parentEmail: u.parentEmail || 'Not set', subjects: 'Manual alert', ts: Date.now(), time: nowTime(), date: nowDate() })
        toast(`Alert queued for ${u.parentEmail || 'no email set'}`, u.parentEmail ? 'ok' : 'warn')
      })
    })
  }

  function openModal(u = {}, username = null) {
    editingUsername = username
    container.querySelector('#stu-modal-title').textContent = username ? 'Edit Student' : 'Add Student'
    container.querySelector('#m-uname').value = username || ''
    container.querySelector('#m-uname').disabled = !!username
    container.querySelector('#m-name').value = u.name || ''
    container.querySelector('#m-roll').value = u.roll || ''
    container.querySelector('#m-pass').value = u.password || 'pass123'
    container.querySelector('#m-dept').value = u.dept || 'CSE'
    container.querySelector('#m-sem').value = u.sem || 4
    container.querySelector('#m-sec').value = u.section || 'A'
    container.querySelector('#m-email').value = u.email || ''
    container.querySelector('#m-phone').value = u.phone || ''
    container.querySelector('#m-pname').value = u.parentName || ''
    container.querySelector('#m-pemail').value = u.parentEmail || ''
    container.querySelector('#m-pphone').value = u.parentPhone || ''
    container.querySelector('#add-stu-modal').style.display = 'flex'
  }

  container.querySelector('#add-stu-btn').addEventListener('click', () => openModal())
  container.querySelector('#close-stu-modal').addEventListener('click', () => { container.querySelector('#add-stu-modal').style.display = 'none' })
  container.querySelector('#cancel-stu-modal').addEventListener('click', () => { container.querySelector('#add-stu-modal').style.display = 'none' })

  container.querySelector('#save-stu-btn').addEventListener('click', () => {
    const uname = container.querySelector('#m-uname').value.trim().toLowerCase().replace(/\s+/g, '.')
    if (!uname) { toast('Username required', 'err'); return }
    const data = {
      role: 'student',
      name: container.querySelector('#m-name').value.trim(),
      roll: container.querySelector('#m-roll').value.trim(),
      password: container.querySelector('#m-pass').value,
      dept: container.querySelector('#m-dept').value,
      sem: parseInt(container.querySelector('#m-sem').value),
      section: container.querySelector('#m-sec').value.trim(),
      email: container.querySelector('#m-email').value.trim(),
      phone: container.querySelector('#m-phone').value.trim(),
      parentName: container.querySelector('#m-pname').value.trim(),
      parentEmail: container.querySelector('#m-pemail').value.trim(),
      parentPhone: container.querySelector('#m-pphone').value.trim(),
    }
    if (editingUsername) { Store.saveUser(editingUsername, data); toast('Student updated', 'ok') }
    else { if (!Store.addUser(uname, data)) { toast('Username already exists', 'err'); return }; toast('Student added', 'ok') }
    container.querySelector('#add-stu-modal').style.display = 'none'
    editingUsername = null; renderTable()
  })

  // Bulk import
  container.querySelector('#bulk-stu-btn').addEventListener('click', () => { container.querySelector('#bulk-modal').style.display = 'flex' })
  container.querySelector('#close-bulk').addEventListener('click', () => { container.querySelector('#bulk-modal').style.display = 'none' })
  container.querySelector('#cancel-bulk').addEventListener('click', () => { container.querySelector('#bulk-modal').style.display = 'none' })

  const dropArea = container.querySelector('#csv-drop')
  const fileInput = container.querySelector('#csv-file')
  dropArea.addEventListener('click', () => fileInput.click())
  dropArea.addEventListener('dragover', e => { e.preventDefault(); dropArea.classList.add('dragover') })
  dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'))
  dropArea.addEventListener('drop', e => { e.preventDefault(); dropArea.classList.remove('dragover'); const f = e.dataTransfer.files[0]; if (f) readCSVFile(f) })
  fileInput.addEventListener('change', () => { if (fileInput.files[0]) readCSVFile(fileInput.files[0]) })

  function readCSVFile(file) {
    const reader = new FileReader()
    reader.onload = e => { container.querySelector('#csv-paste').value = e.target.result }
    reader.readAsText(file)
    toast('File loaded — click Preview to review', 'ok')
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n').map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, '')))
    const headers = lines[0].map(h => h.toLowerCase().replace(/\s+/g, ''))
    return lines.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] || ''])))
  }

  container.querySelector('#preview-bulk').addEventListener('click', () => {
    const text = container.querySelector('#csv-paste').value.trim()
    if (!text) { toast('No data to preview', 'err'); return }
    const rows = parseCSV(text)
    const preview = container.querySelector('#bulk-preview')
    preview.style.display = 'block'
    preview.innerHTML = `<div style="font-size:12px;color:var(--text2);margin-bottom:8px">${rows.length} rows detected</div>
      <div class="tbl-wrap" style="max-height:180px;overflow-y:auto"><table>
        <thead><tr>${Object.keys(rows[0] || {}).map(k => `<th>${k}</th>`).join('')}</tr></thead>
        <tbody>${rows.slice(0, 10).map(r => `<tr>${Object.values(r).map(v => `<td style="font-size:12px">${v}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>${rows.length > 10 ? `<div style="font-size:11px;color:var(--text3);margin-top:6px">...and ${rows.length - 10} more rows</div>` : ''}`
  })

  container.querySelector('#import-bulk').addEventListener('click', () => {
    const text = container.querySelector('#csv-paste').value.trim()
    if (!text) { toast('No data to import', 'err'); return }
    const rows = parseCSV(text)
    const result = Store.bulkImportUsers(rows)
    container.querySelector('#bulk-modal').style.display = 'none'
    renderTable()
    toast(`Imported ${result.added} students, skipped ${result.skipped}`, 'ok')
  })

  container.querySelector('#exp-stu-btn').addEventListener('click', () => {
    const users = Store.getUsers()
    const rows = Object.entries(users).filter(([, u]) => u.role === 'student').map(([uname, u]) => ({
      username: uname, name: u.name, roll: u.roll, dept: u.dept, semester: u.sem, section: u.section,
      email: u.email, phone: u.phone, parentName: u.parentName, parentEmail: u.parentEmail, parentPhone: u.parentPhone
    }))
    exportCSV(rows, 'students.csv')
  })

  container.querySelector('#stu-search').addEventListener('input', renderTable)
  container.querySelector('#stu-dept-filter').addEventListener('change', renderTable)
  renderTable()
}

// ─── Manage Teachers ──────────────────────────────────────────────────────────
export function renderAdminTeachers(container) {
  container.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <input id="tch-search" placeholder="Search teachers..." style="flex:1;min-width:180px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);padding:9px 13px;color:var(--text);font-size:13px;outline:none">
      <button class="btn btn-primary" id="add-tch-btn">+ Add Teacher</button>
      <button class="btn btn-secondary" id="exp-tch-btn">📥 Export</button>
    </div>
    <div class="card">
      <div class="tbl-wrap"><table>
        <thead><tr><th>Name</th><th>Dept</th><th>Email</th><th>Subjects</th><th>Sessions</th><th>Actions</th></tr></thead>
        <tbody id="tch-tbody"></tbody>
      </table></div>
    </div>

    <div class="modal-backdrop" id="add-tch-modal" style="display:none">
      <div class="modal">
        <div class="modal-header"><div class="modal-title" id="tch-modal-title">Add Teacher</div><button class="modal-close" id="close-tch-modal">✕</button></div>
        <div class="field-row"><div class="field"><label>Username</label><input id="t-uname" placeholder="prof.sharma"></div><div class="field"><label>Full Name</label><input id="t-name" placeholder="Prof. Ravi Sharma"></div></div>
        <div class="field-row">
          <div class="field"><label>Department</label><select id="t-dept"><option>CSE</option><option>ECE</option><option>EEE</option><option>ME</option><option>CE</option><option>IT</option></select></div>
          <div class="field"><label>Password</label><input id="t-pass" value="pass123"></div>
        </div>
        <div class="field"><label>Email</label><input type="email" id="t-email" placeholder="prof@college.edu"></div>
        <div class="field"><label>Phone</label><input id="t-phone" placeholder="9XXXXXXXXX"></div>
        <div class="field"><label>Subjects (comma separated)</label><input id="t-subjects" placeholder="CS301, CS302"></div>
        <div class="modal-footer"><button class="btn btn-secondary" id="cancel-tch-modal">Cancel</button><button class="btn btn-primary" id="save-tch-btn">Save Teacher</button></div>
      </div>
    </div>
  `
  let editingTeacher = null

  function renderTable() {
    const search = container.querySelector('#tch-search').value.toLowerCase()
    const sessions = Store.getSessions()
    const teachers = Object.entries(Store.getUsers()).filter(([, u]) => u.role === 'teacher').filter(([uname, u]) => !search || u.name?.toLowerCase().includes(search) || u.dept?.toLowerCase().includes(search) || uname.includes(search))
    container.querySelector('#tch-tbody').innerHTML = teachers.map(([uname, u]) => {
      const sessCount = sessions.filter(s => s.teacherUsername === uname).length
      return `<tr>
        <td><div style="display:flex;align-items:center;gap:8px"><div class="avatar av-sm av-accent">${avatarInitials(u.name)}</div>${u.name}</div></td>
        <td>${u.dept || ''}</td>
        <td style="font-size:12px">${u.email || '—'}</td>
        <td style="font-size:12px">${(u.subjects || []).join(', ') || '—'}</td>
        <td>${sessCount}</td>
        <td><div style="display:flex;gap:6px">
          <button class="btn-icon btn-xs" data-edit="${uname}">✏️</button>
          <button class="btn-icon btn-xs" data-del="${uname}">🗑️</button>
        </div></td>
      </tr>`
    }).join('') || `<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:24px">No teachers found</td></tr>`

    container.querySelector('#tch-tbody').querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => { const u = Store.getUser(btn.dataset.edit); editingTeacher = btn.dataset.edit; openTchModal(u, btn.dataset.edit) })
    })
    container.querySelector('#tch-tbody').querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => { if (confirm('Delete teacher?')) { Store.deleteUser(btn.dataset.del); renderTable(); toast('Teacher deleted', 'ok') } })
    })
  }

  function openTchModal(u = {}, username = null) {
    editingTeacher = username
    container.querySelector('#tch-modal-title').textContent = username ? 'Edit Teacher' : 'Add Teacher'
    container.querySelector('#t-uname').value = username || ''; container.querySelector('#t-uname').disabled = !!username
    container.querySelector('#t-name').value = u.name || ''; container.querySelector('#t-dept').value = u.dept || 'CSE'
    container.querySelector('#t-pass').value = u.password || 'pass123'; container.querySelector('#t-email').value = u.email || ''
    container.querySelector('#t-phone').value = u.phone || ''; container.querySelector('#t-subjects').value = (u.subjects || []).join(', ')
    container.querySelector('#add-tch-modal').style.display = 'flex'
  }

  container.querySelector('#add-tch-btn').addEventListener('click', () => openTchModal())
  container.querySelector('#close-tch-modal').addEventListener('click', () => { container.querySelector('#add-tch-modal').style.display = 'none' })
  container.querySelector('#cancel-tch-modal').addEventListener('click', () => { container.querySelector('#add-tch-modal').style.display = 'none' })
  container.querySelector('#save-tch-btn').addEventListener('click', () => {
    const uname = container.querySelector('#t-uname').value.trim().toLowerCase().replace(/\s+/g, '.')
    if (!uname) { toast('Username required', 'err'); return }
    const data = { role: 'teacher', name: container.querySelector('#t-name').value.trim(), dept: container.querySelector('#t-dept').value, password: container.querySelector('#t-pass').value, email: container.querySelector('#t-email').value.trim(), phone: container.querySelector('#t-phone').value.trim(), subjects: container.querySelector('#t-subjects').value.split(',').map(s => s.trim()).filter(Boolean) }
    if (editingTeacher) { Store.saveUser(editingTeacher, data); toast('Teacher updated', 'ok') }
    else { if (!Store.addUser(uname, data)) { toast('Username exists', 'err'); return }; toast('Teacher added', 'ok') }
    container.querySelector('#add-tch-modal').style.display = 'none'
    editingTeacher = null; renderTable()
  })

  container.querySelector('#exp-tch-btn').addEventListener('click', () => {
    const rows = Object.entries(Store.getUsers()).filter(([, u]) => u.role === 'teacher').map(([uname, u]) => ({ username: uname, name: u.name, dept: u.dept, email: u.email, subjects: (u.subjects || []).join(';') }))
    exportCSV(rows, 'teachers.csv')
  })
  container.querySelector('#tch-search').addEventListener('input', renderTable)
  renderTable()
}

// ─── Attendance Report ────────────────────────────────────────────────────────
export function renderAdminAttendance(container) {
  const sessions = Store.getSessions()
  const users = Store.getUsers()
  const students = Object.entries(users).filter(([, u]) => u.role === 'student')
  const subjects = [...new Set(sessions.map(s => s.code))]
  const depts = [...new Set(students.map(([, u]) => u.dept).filter(Boolean))]

  container.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <select id="att-dept-f" style="padding:9px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);color:var(--text);font-size:13px">
        <option value="">All depts</option>${depts.map(d => `<option>${d}</option>`).join('')}
      </select>
      <select id="att-sub-f" style="padding:9px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);color:var(--text);font-size:13px">
        <option value="">All subjects</option>${subjects.map(s => `<option>${s}</option>`).join('')}
      </select>
      <select id="att-thresh-f" style="padding:9px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);color:var(--text);font-size:13px">
        <option value="">All students</option>
        <option value="below75">Below 75%</option>
        <option value="below60">Below 60%</option>
        <option value="above75">Above 75%</option>
      </select>
      <button class="btn btn-secondary" id="att-exp-csv">📥 Export CSV</button>
      <button class="btn btn-amber" id="send-all-alerts">📧 Send All Parent Alerts</button>
    </div>
    <div class="card">
      <div class="tbl-wrap"><table>
        <thead><tr><th>Student</th><th>Roll</th><th>Dept</th><th>Subject</th><th>Present</th><th>Total</th><th>%</th><th>Status</th></tr></thead>
        <tbody id="att-tbody"></tbody>
      </table></div>
    </div>
  `

  function getRows() {
    const deptF = container.querySelector('#att-dept-f').value
    const subF = container.querySelector('#att-sub-f').value
    const thresh = container.querySelector('#att-thresh-f').value
    const rows = []
    students.filter(([, u]) => !deptF || u.dept === deptF).forEach(([uname, u]) => {
      const att = Store.getStudentAttendance(uname)
      const subs = subF ? [subF] : subjects
      subs.forEach(code => {
        const subjSess = sessions.filter(s => !s.active && s.code === code)
        if (!subjSess.length) return
        const present = att.filter(a => a.code === code).length
        const pct = Math.round(present / subjSess.length * 100)
        if (thresh === 'below75' && pct >= 75) return
        if (thresh === 'below60' && pct >= 60) return
        if (thresh === 'above75' && pct < 75) return
        rows.push({ student: u.name, roll: u.roll || uname, dept: u.dept, subject: code, present, total: subjSess.length, pct, parentEmail: u.parentEmail || '' })
      })
    })
    return rows
  }

  function renderTable() {
    const rows = getRows()
    container.querySelector('#att-tbody').innerHTML = rows.length ? rows.map(r => `<tr>
      <td>${r.student}</td><td style="font-family:var(--mono);font-size:12px">${r.roll}</td><td>${r.dept}</td><td>${r.subject}</td>
      <td>${r.present}</td><td>${r.total}</td>
      <td><span class="badge badge-${getAttPctColor(r.pct)}">${r.pct}%</span></td>
      <td><span class="badge badge-${r.pct >= 75 ? 'green' : r.pct >= 60 ? 'amber' : 'red'}">${r.pct >= 75 ? 'Safe' : r.pct >= 60 ? 'Warning' : 'Critical'}</span></td>
    </tr>`).join('') : `<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px">No data</td></tr>`
  }

  container.querySelector('#att-exp-csv').addEventListener('click', () => { const r = getRows(); if (r.length) exportCSV(r, 'attendance_report.csv'); else toast('No data', 'err') })
  container.querySelector('#send-all-alerts').addEventListener('click', () => {
    let sent = 0
    students.forEach(([uname, u]) => {
      const att = Store.getStudentAttendance(uname)
      const bySubj = {}
      sessions.filter(s => !s.active).forEach(s => { if (!bySubj[s.code]) bySubj[s.code] = { p: 0, t: 0 }; bySubj[s.code].t++ })
      att.forEach(a => { if (bySubj[a.code]) bySubj[a.code].p++ })
      const lowSubjects = Object.entries(bySubj).filter(([, v]) => v.t > 0 && v.p / v.t * 100 < 75).map(([k]) => k)
      if (lowSubjects.length) {
        Store.addAlert({ studentUsername: uname, student: u.name, roll: u.roll, parentEmail: u.parentEmail || 'Not set', subjects: lowSubjects.join(', '), ts: Date.now(), time: nowTime(), date: nowDate() })
        sent++
      }
    })
    renderTable(); toast(sent ? `${sent} parent alerts sent` : 'No at-risk students', sent ? 'ok' : 'info')
  })

  ;['att-dept-f', 'att-sub-f', 'att-thresh-f'].forEach(id => container.querySelector('#' + id).addEventListener('change', renderTable))
  renderTable()
}

// ─── Sessions (all) ───────────────────────────────────────────────────────────
export function renderAdminSessions(container) {
  container.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <input id="sess-search" placeholder="Search sessions..." style="flex:1;min-width:180px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);padding:9px 13px;color:var(--text);font-size:13px;outline:none">
      <button class="btn btn-secondary" id="exp-sess">📥 Export</button>
    </div>
    <div class="card">
      <div class="tbl-wrap"><table>
        <thead><tr><th>Subject</th><th>Teacher</th><th>Dept</th><th>Section</th><th>Date</th><th>Present</th><th>Status</th><th>Details</th></tr></thead>
        <tbody id="sess-tbody"></tbody>
      </table></div>
    </div>
    <div class="card" id="sess-detail-card" style="display:none">
      <div class="card-header"><div class="card-title" id="sd-title">Session Detail</div><button class="btn btn-secondary btn-sm" id="sd-close">✕</button></div>
      <div id="sd-body"></div>
    </div>
  `
  const sessions = Store.getSessions()

  function renderTable() {
    const search = container.querySelector('#sess-search').value.toLowerCase()
    const filtered = sessions.filter(s => !search || s.code?.toLowerCase().includes(search) || s.teacher?.toLowerCase().includes(search) || s.dept?.toLowerCase().includes(search)).slice().reverse()
    container.querySelector('#sess-tbody').innerHTML = filtered.map(s => `<tr>
      <td style="font-weight:500">${s.code}</td><td>${s.teacher}</td><td>${s.dept}</td>
      <td>Sec ${s.cls} · Sem ${s.sem}</td><td>${s.date}</td>
      <td>${Object.keys(s.attendance || {}).length}</td>
      <td><span class="badge ${s.active ? 'badge-green' : 'badge-gray'}">${s.active ? 'Live' : 'Done'}</span></td>
      <td><button class="btn btn-secondary btn-xs" data-sid="${s.id}">View</button></td>
    </tr>`).join('') || `<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px">No sessions</td></tr>`

    container.querySelector('#sess-tbody').querySelectorAll('[data-sid]').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = sessions.find(x => x.id === btn.dataset.sid)
        const entries = Object.values(s.attendance || {})
        container.querySelector('#sess-detail-card').style.display = 'block'
        container.querySelector('#sd-title').textContent = `${s.code} · ${s.date}`
        container.querySelector('#sd-body').innerHTML = `
          <div class="tbl-wrap"><table>
            <thead><tr><th>#</th><th>Student</th><th>Roll</th><th>Time</th><th>Type</th></tr></thead>
            <tbody>${entries.map((e, i) => `<tr><td>${i + 1}</td><td>${e.name}</td><td>${e.roll}</td><td>${e.time}</td><td>${e.manual ? 'Manual' : 'QR'}</td></tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text3)">No attendance</td></tr>'}</tbody>
          </table></div>`
        container.querySelector('#sess-detail-card').scrollIntoView({ behavior: 'smooth' })
      })
    })
  }
  container.querySelector('#sess-search').addEventListener('input', renderTable)
  container.querySelector('#sd-close').addEventListener('click', () => { container.querySelector('#sess-detail-card').style.display = 'none' })
  container.querySelector('#exp-sess').addEventListener('click', () => {
    const rows = sessions.flatMap(s => Object.values(s.attendance || {}).map(a => ({ date: s.date, subject: s.code, teacher: s.teacher, dept: s.dept, section: s.cls, sem: s.sem, student: a.name, roll: a.roll, time: a.time })))
    if (rows.length) exportCSV(rows, 'all_sessions.csv'); else toast('No data', 'err')
  })
  renderTable()
}

// ─── Proxy / Alerts / Timetable / Holidays ────────────────────────────────────
export function renderAdminProxy(container) {
  const proxy = Store.getProxy()
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">Suspicious Activity Log <span class="badge badge-red">${proxy.length}</span></div><button class="btn btn-secondary btn-sm" id="exp-proxy">📥 Export</button></div>
      ${proxy.length ? `<div class="tbl-wrap"><table>
        <thead><tr><th>Student</th><th>Roll</th><th>Session</th><th>Time</th><th>Reason</th></tr></thead>
        <tbody>${proxy.map(p => `<tr><td>${p.student}</td><td style="font-family:var(--mono);font-size:12px">${p.roll}</td><td>${p.session}</td><td>${p.time}</td><td><span class="badge badge-red">${p.reason}</span></td></tr>`).join('')}</tbody>
      </table></div>` : '<div class="empty-state">No suspicious activity detected</div>'}
    </div>
  `
  container.querySelector('#exp-proxy')?.addEventListener('click', () => { if (proxy.length) exportCSV(proxy, 'proxy_log.csv'); else toast('No data', 'err') })
}

export function renderAdminAlerts(container) {
  const alerts = Store.getAlerts()
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">Parent Alert History <span class="badge badge-amber">${alerts.length}</span></div><button class="btn btn-secondary btn-sm" id="exp-alerts">📥 Export</button></div>
      ${alerts.length ? `<div class="tbl-wrap"><table>
        <thead><tr><th>Student</th><th>Roll</th><th>Parent Email</th><th>Subjects</th><th>Date</th></tr></thead>
        <tbody>${alerts.map(a => `<tr><td>${a.student}</td><td style="font-family:var(--mono);font-size:12px">${a.roll}</td><td>${a.parentEmail}</td><td>${a.subjects}</td><td>${a.date}</td></tr>`).join('')}</tbody>
      </table></div>` : '<div class="empty-state">No alerts sent yet</div>'}
    </div>
  `
  container.querySelector('#exp-alerts')?.addEventListener('click', () => { if (alerts.length) exportCSV(alerts.map(a => ({ student: a.student, roll: a.roll, parentEmail: a.parentEmail, subjects: a.subjects, date: a.date })), 'parent_alerts.csv'); else toast('No data', 'err') })
}

export function renderAdminTimetable(container) {
  const tt = Store.getTimetable()
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">Timetable Manager</div><button class="btn btn-secondary btn-sm" id="exp-tt">📥 Export JSON</button></div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:12px">Timetable entries: ${tt.length}</div>
      ${tt.map((t, i) => `<div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${t.dept} · Sem ${t.sem} · Sec ${t.section} · ${t.day}</div>
          <div class="ri-sub">${t.periods.map(p => `${p.time}: ${p.subject}`).join(' | ')}</div>
        </div>
        <button class="btn btn-danger btn-xs" data-del="${i}">✕</button>
      </div>`).join('') || '<div class="empty-state">No timetable data</div>'}
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Add Timetable Entry</div>
      <div class="field-row">
        <div class="field"><label>Dept</label><select id="tt-dept"><option>CSE</option><option>ECE</option><option>ME</option><option>CE</option><option>IT</option></select></div>
        <div class="field"><label>Semester</label><select id="tt-sem">${[1,2,3,4,5,6,7,8].map(n=>`<option ${n===4?'selected':''}>${n}</option>`).join('')}</select></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Section</label><input id="tt-sec" value="A"></div>
        <div class="field"><label>Day</label><select id="tt-day"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option></select></div>
      </div>
      <div class="field"><label>Period (format: 09:00-10:00|CS301|prof.sharma)</label><input id="tt-period" placeholder="09:00-10:00|CS301|prof.sharma"></div>
      <button class="btn btn-primary" id="add-tt-btn">Add Entry</button>
    </div>
  `
  container.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => { const tt2 = Store.getTimetable(); tt2.splice(parseInt(btn.dataset.del), 1); Store.saveTimetable(tt2); renderAdminTimetable(container); toast('Entry removed', 'ok') })
  })
  container.querySelector('#add-tt-btn').addEventListener('click', () => {
    const period = container.querySelector('#tt-period').value.split('|')
    if (period.length < 2) { toast('Invalid period format', 'err'); return }
    const entry = { dept: container.querySelector('#tt-dept').value, sem: container.querySelector('#tt-sem').value, section: container.querySelector('#tt-sec').value, day: container.querySelector('#tt-day').value, periods: [{ time: period[0], subject: period[1], teacher: period[2] || '' }] }
    const tt2 = Store.getTimetable(); tt2.push(entry); Store.saveTimetable(tt2); renderAdminTimetable(container); toast('Entry added', 'ok')
  })
  container.querySelector('#exp-tt').addEventListener('click', () => exportJSON(Store.getTimetable(), 'timetable.json'))
}

export function renderAdminHolidays(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">Holiday Calendar</div></div>
      <div id="hol-list"></div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Add Holiday</div>
      <div class="field-row">
        <div class="field"><label>Date</label><input type="date" id="hol-date"></div>
        <div class="field"><label>Holiday Name</label><input id="hol-name" placeholder="Republic Day"></div>
      </div>
      <button class="btn btn-primary" id="add-hol-btn">+ Add Holiday</button>
    </div>
  `
  function renderHols() {
    const hols = Store.getHolidays().sort((a, b) => a.date.localeCompare(b.date))
    container.querySelector('#hol-list').innerHTML = hols.length ? hols.map(h => `
      <div class="row-item">
        <div class="ri-main"><div class="ri-title">${h.name}</div><div class="ri-sub">${h.date}</div></div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge ${new Date(h.date) >= new Date() ? 'badge-blue' : 'badge-gray'}">${new Date(h.date) >= new Date() ? 'Upcoming' : 'Past'}</span>
          <button class="btn btn-danger btn-xs" data-date="${h.date}">✕</button>
        </div>
      </div>`).join('') : '<div class="empty-state">No holidays configured</div>'

    container.querySelector('#hol-list').querySelectorAll('[data-date]').forEach(btn => {
      btn.addEventListener('click', () => { Store.removeHoliday(btn.dataset.date); renderHols(); toast('Holiday removed', 'ok') })
    })
  }
  renderHols()
  container.querySelector('#add-hol-btn').addEventListener('click', () => {
    const date = container.querySelector('#hol-date').value
    const name = container.querySelector('#hol-name').value.trim()
    if (!date || !name) { toast('Fill date and name', 'err'); return }
    Store.addHoliday({ date, name }); renderHols(); container.querySelector('#hol-name').value = ''; toast('Holiday added', 'ok')
  })
}

export function renderAdminAnnouncements(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Post Announcement</div>
      <div class="field"><label>Title</label><input id="a-title" placeholder="Announcement title"></div>
      <div class="field"><label>Message</label><textarea id="a-body" placeholder="Write your announcement..."></textarea></div>
      <div class="field-row">
        <div class="field"><label>Target audience</label>
          <select id="a-target"><option value="all">Everyone</option><option value="student">Students only</option><option value="teacher">Teachers only</option></select>
        </div>
      </div>
      <button class="btn btn-primary" id="post-ann-btn">📢 Post Announcement</button>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">All Announcements</div>
      <div id="ann-list"><div class="empty-state">No announcements</div></div>
    </div>
  `
  function renderAnns() {
    const el = container.querySelector('#ann-list')
    const anns = Store.getAnnouncements()
    el.innerHTML = anns.length ? anns.map(a => `
      <div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${a.title}</div>
          <div class="ri-sub">${a.body.substring(0, 80)}${a.body.length > 80 ? '...' : ''}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${a.date} · ${a.target === 'all' ? 'All users' : a.target}</div>
        </div>
        <button class="btn btn-danger btn-xs" data-id="${a.id}">✕</button>
      </div>`).join('') : '<div class="empty-state">No announcements</div>'

    el.querySelectorAll('[data-id]').forEach(btn => {
      btn.addEventListener('click', () => { Store.deleteAnnouncement(btn.dataset.id); renderAnns(); toast('Announcement deleted', 'ok') })
    })
  }
  renderAnns()
  container.querySelector('#post-ann-btn').addEventListener('click', () => {
    const title = container.querySelector('#a-title').value.trim()
    const body = container.querySelector('#a-body').value.trim()
    if (!title || !body) { toast('Fill title and message', 'err'); return }
    Store.addAnnouncement({ title, body, author: 'admin', target: container.querySelector('#a-target').value })
    container.querySelector('#a-title').value = ''; container.querySelector('#a-body').value = ''
    renderAnns(); toast('Announcement posted!', 'ok')
  })
}

export function renderAdminSettings(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-title" style="margin-bottom:16px">System Settings</div>
      <div class="field"><label>College Name</label><input id="set-cname" value="Demo Engineering College" placeholder="College name"></div>
      <div class="field"><label>Attendance Threshold (%)</label><input id="set-thresh" type="number" value="75" min="50" max="100"></div>
      <div class="field-row">
        <div class="field"><label>Campus WiFi SSID</label><input id="set-ssid" value="CollegeNet" placeholder="WiFi SSID"></div>
        <div class="field"><label>Campus GPS Radius (m)</label><input id="set-radius" type="number" value="600"></div>
      </div>
      <button class="btn btn-primary" id="save-settings">💾 Save Settings</button>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:16px;color:var(--red)">Danger Zone</div>
      <div class="field-row">
        <button class="btn btn-danger" id="reset-att">Reset All Attendance</button>
        <button class="btn btn-danger" id="reset-all">Factory Reset</button>
      </div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Export All Data</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-secondary" id="exp-all-csv">📥 All Attendance CSV</button>
        <button class="btn btn-secondary" id="exp-users-json">👥 Users JSON</button>
        <button class="btn btn-secondary" id="exp-sessions-json">📋 Sessions JSON</button>
      </div>
    </div>
  `
  container.querySelector('#save-settings').addEventListener('click', () => toast('Settings saved (demo)', 'ok'))
  container.querySelector('#reset-att').addEventListener('click', () => {
    if (confirm('Reset ALL attendance data? This cannot be undone.')) { localStorage.removeItem('ax_attendance'); localStorage.removeItem('ax_alerts'); localStorage.removeItem('ax_proxy'); toast('Attendance reset', 'ok') }
  })
  container.querySelector('#reset-all').addEventListener('click', () => {
    if (confirm('Factory reset? ALL data will be wiped and defaults restored.')) { Store.resetAll(); toast('Reset complete', 'ok') }
  })
  container.querySelector('#exp-all-csv').addEventListener('click', () => {
    const rows = Store.getSessions().flatMap(s => Object.values(s.attendance || {}).map(a => ({ date: s.date, subject: s.code, dept: s.dept, section: s.cls, teacher: s.teacher, student: a.name, roll: a.roll, time: a.time })))
    if (rows.length) exportCSV(rows, 'all_attendance.csv'); else toast('No data', 'err')
  })
  container.querySelector('#exp-users-json').addEventListener('click', () => exportJSON(Store.getUsers(), 'users.json'))
  container.querySelector('#exp-sessions-json').addEventListener('click', () => exportJSON(Store.getSessions(), 'sessions.json'))
}
