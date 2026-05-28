// ─── Login Page ───────────────────────────────────────────────────────────────
import { Store } from '../data/store.js'
import { toast } from '../utils/helpers.js'

export function renderLogin(onLogin) {
  let selectedRole = 'teacher'

  const el = document.createElement('div')
  el.className = 'login-page'
  el.innerHTML = `
    <div class="login-box">
      <div class="login-logo">
        <div class="logo-ring">🎓</div>
        <h1>ZeroProxy</h1>
        <p>Smart Attendance Management System · v2.0</p>
      </div>
      <div class="card">
        <div class="role-grid">
          <div class="role-btn sel" data-role="teacher">
            <div class="rb-icon">👨‍🏫</div>
            <div class="rb-label">Teacher</div>
            <div class="rb-sub">Manage sessions</div>
          </div>
          <div class="role-btn" data-role="student">
            <div class="rb-icon">👨‍🎓</div>
            <div class="rb-label">Student</div>
            <div class="rb-sub">Mark attendance</div>
          </div>
          <div class="role-btn" data-role="admin">
            <div class="rb-icon">🛡️</div>
            <div class="rb-label">Admin</div>
            <div class="rb-sub">Full control</div>
          </div>
        </div>
        <div class="field">
          <label>Username</label>
          <input id="l-user" value="prof.sharma" placeholder="Enter username" autocomplete="username">
        </div>
        <div class="field">
          <label>Password</label>
          <input id="l-pass" type="password" value="pass123" placeholder="Enter password" autocomplete="current-password">
        </div>
        <button class="btn btn-primary btn-block" id="l-btn" style="margin-top:4px">Sign In →</button>
      </div>
      
    </div>
  `

  el.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.role-btn').forEach(b => b.classList.remove('sel'))
      btn.classList.add('sel')
      selectedRole = btn.dataset.role
      const defaults = { teacher: 'prof.sharma', student: 'john.doe', admin: 'admin' }
      el.querySelector('#l-user').value = defaults[selectedRole]
    })
  })

  const doLogin = () => {
    const username = el.querySelector('#l-user').value.trim()
    const password = el.querySelector('#l-pass').value.trim()
    if (!username || !password) { toast('Enter username and password', 'err'); return }
    const user = Store.login(username, password)
    if (!user) {
      // auto-create demo user
      const fallback = { role: selectedRole, name: username.replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()), roll: 'DEMO001', dept: 'CSE', sem: 4, section: 'A', parentEmail: '', password }
      Store.addUser(username, fallback)
      const u2 = Store.login(username, password)
      if (u2) { onLogin(u2); return }
      toast('Invalid credentials', 'err'); return
    }
    onLogin(user)
  }

  el.querySelector('#l-btn').addEventListener('click', doLogin)
  el.querySelector('#l-pass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin() })
  return el
}
