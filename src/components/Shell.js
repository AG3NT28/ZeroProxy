// ─── App Shell (Sidebar + Topbar) ────────────────────────────────────────────
import { Store } from '../data/store.js'
import { avatarInitials, toast } from '../utils/helpers.js'

export function renderShell(user, navItems, onNav, onLogout) {
  const el = document.createElement('div')
  el.className = 'app-shell'

  const roleColors = { admin: 'av-red', teacher: 'av-accent', student: 'av-green' }
  const roleLabels = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' }

  el.innerHTML = `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">🎓</div>
        <div>
          <div class="logo-text">ZeroProxy</div>
          <div class="logo-sub">v2.0 · ${roleLabels[user.role]}</div>
        </div>
      </div>
      <nav class="sidebar-nav" id="sidebar-nav"></nav>
      <div class="sidebar-footer">
        <div class="sidebar-user" id="su-logout" title="Click to sign out">
          <div class="avatar av-sm ${roleColors[user.role]}">${avatarInitials(user.name)}</div>
          <div>
            <div class="u-name">${user.name}</div>
            <div class="u-role">${user.dept || roleLabels[user.role]}</div>
          </div>
          <div style="margin-left:auto;font-size:14px;color:var(--text3)">↩</div>
        </div>
      </div>
    </div>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <div class="main-content" id="main-content">
      <div class="topbar">
        <button class="menu-toggle" id="menu-toggle">☰</button>
        <h1 id="topbar-title">Dashboard</h1>
        <div id="topbar-actions"></div>
      </div>
      <div class="page-body" id="page-body"></div>
    </div>
  `

  // Render nav
  const nav = el.querySelector('#sidebar-nav')
  let activeKey = navItems[0]?.key

  function buildNav() {
    nav.innerHTML = ''
    navItems.forEach(section => {
      if (section.divider) {
        const d = document.createElement('div')
        d.className = 'nav-section'
        d.innerHTML = `<div class="nav-section-title">${section.label}</div>`
        section.items.forEach(item => {
          const ni = document.createElement('div')
          ni.className = 'nav-item' + (item.key === activeKey ? ' active' : '')
          ni.dataset.key = item.key
          ni.innerHTML = `<span class="nav-icon">${item.icon}</span>${item.label}${item.badge ? `<span class="nav-badge" id="badge-${item.key}">${item.badge}</span>` : ''}`
          ni.addEventListener('click', () => {
            activeKey = item.key
            buildNav()
            el.querySelector('#sidebar').classList.remove('open')
            el.querySelector('#sidebar-overlay').classList.remove('show')
            el.querySelector('#topbar-title').textContent = item.label
            onNav(item.key, el.querySelector('#page-body'), el.querySelector('#topbar-actions'))
          })
          d.appendChild(ni)
        })
        nav.appendChild(d)
      }
    })
  }
  buildNav()

  // Toggle sidebar mobile
  el.querySelector('#menu-toggle').addEventListener('click', () => {
    el.querySelector('#sidebar').classList.toggle('open')
    el.querySelector('#sidebar-overlay').classList.toggle('show')
  })
  el.querySelector('#sidebar-overlay').addEventListener('click', () => {
    el.querySelector('#sidebar').classList.remove('open')
    el.querySelector('#sidebar-overlay').classList.remove('show')
  })

  el.querySelector('#su-logout').addEventListener('click', () => {
    if (confirm('Sign out?')) { Store.logout(); onLogout() }
  })

  // First nav
  if (navItems[0]?.items?.[0]) {
    const first = navItems[0].items[0]
    activeKey = first.key
    buildNav()
    el.querySelector('#topbar-title').textContent = first.label
    setTimeout(() => onNav(first.key, el.querySelector('#page-body'), el.querySelector('#topbar-actions')), 0)
  }

  el.updateBadge = (key, val) => {
    const b = el.querySelector(`#badge-${key}`)
    if (b) { b.textContent = val; b.style.display = val ? '' : 'none' }
  }

  return el
}
