// ─── ZeroProxy · Main Entry ─────────────────────────────────────────────────
import './src/styles/main.css'
import { Store } from './src/data/store.js'
import { renderLogin } from './src/pages/Login.js'
import { renderShell } from './src/components/Shell.js'
import {
  renderTeacherSession, renderTeacherRecords,
  renderTeacherLeaves, renderTeacherAnnouncements
} from './src/pages/Teacher.js'
import {
  renderStudentScan, renderStudentAttendance,
  renderStudentLeave, renderStudentProfile, renderStudentTimetable
} from './src/pages/Student.js'
import {
  renderAdminDashboard, renderAdminStudents, renderAdminTeachers,
  renderAdminAttendance, renderAdminSessions, renderAdminProxy,
  renderAdminAlerts, renderAdminTimetable, renderAdminHolidays,
  renderAdminAnnouncements, renderAdminSettings
} from './src/pages/Admin.js'

const app = document.getElementById('app')

function mount(el) {
  app.innerHTML = ''
  app.appendChild(el)
}

function start() {
  const user = Store.getCurrentUser()
  if (user) {
    showDashboard(user)
  } else {
    const loginEl = renderLogin(user => showDashboard(user))
    mount(loginEl)
  }
}

function showDashboard(user) {
  const navMap = {
    teacher: [
      {
        divider: true, label: 'Attendance',
        items: [
          { key: 'session', icon: '▶', label: 'Session Manager' },
          { key: 'records', icon: '📋', label: 'Records' },
          { key: 'leaves', icon: '📄', label: 'Leave Requests' },
        ]
      },
      {
        divider: true, label: 'Communication',
        items: [
          { key: 'announcements', icon: '📢', label: 'Announcements' },
        ]
      }
    ],
    student: [
      {
        divider: true, label: 'Attendance',
        items: [
          { key: 'scan', icon: '📷', label: 'Scan QR' },
          { key: 'myattendance', icon: '📊', label: 'My Attendance' },
          { key: 'leaves', icon: '📄', label: 'Leave Request' },
          { key: 'timetable', icon: '🗓', label: 'Timetable' },
        ]
      },
      {
        divider: true, label: 'Account',
        items: [
          { key: 'profile', icon: '👤', label: 'Profile & Parents' },
        ]
      }
    ],
    admin: [
      {
        divider: true, label: 'Overview',
        items: [
          { key: 'dashboard', icon: '📊', label: 'Dashboard' },
        ]
      },
      {
        divider: true, label: 'People',
        items: [
          { key: 'students', icon: '👨‍🎓', label: 'Students' },
          { key: 'teachers', icon: '👨‍🏫', label: 'Teachers' },
        ]
      },
      {
        divider: true, label: 'Attendance',
        items: [
          { key: 'attendance', icon: '✅', label: 'Attendance Report' },
          { key: 'sessions', icon: '⏱', label: 'All Sessions' },
        ]
      },
      {
        divider: true, label: 'Monitoring',
        items: [
          { key: 'alerts', icon: '📧', label: 'Parent Alerts' },
          { key: 'proxy', icon: '🚨', label: 'Proxy Log' },
        ]
      },
      {
        divider: true, label: 'Administration',
        items: [
          { key: 'timetable', icon: '🗓', label: 'Timetable' },
          { key: 'holidays', icon: '🏖', label: 'Holidays' },
          { key: 'announcements', icon: '📢', label: 'Announcements' },
          { key: 'settings', icon: '⚙️', label: 'Settings' },
        ]
      }
    ]
  }

  const pageRenderers = {
    // Teacher
    session: (c) => renderTeacherSession(c, user),
    records: (c) => renderTeacherRecords(c, user),
    leaves: (c) => user.role === 'teacher' ? renderTeacherLeaves(c, user) : renderStudentLeave(c, user),
    announcements: (c) => renderTeacherAnnouncements(c, user),
    // Student
    scan: (c) => renderStudentScan(c, user),
    myattendance: (c) => renderStudentAttendance(c, user),
    timetable: (c) => renderStudentTimetable(c, user),
    profile: (c) => renderStudentProfile(c, user),
    // Admin
    dashboard: (c) => renderAdminDashboard(c),
    students: (c) => renderAdminStudents(c),
    teachers: (c) => renderAdminTeachers(c),
    attendance: (c) => renderAdminAttendance(c),
    sessions: (c) => renderAdminSessions(c),
    alerts: (c) => renderAdminAlerts(c),
    proxy: (c) => renderAdminProxy(c),
    adminleaves: (c) => { c.innerHTML = '<div class="empty-state">Leave management coming soon</div>' },
    admintt: (c) => renderAdminTimetable(c),
    adminhols: (c) => renderAdminHolidays(c),
    adminann: (c) => renderAdminAnnouncements(c),
  }
  // Patch key names for admin
  pageRenderers['timetable'] = pageRenderers['timetable'] || ((c) => renderStudentTimetable(c, user))
  if (user.role === 'admin') {
    pageRenderers['timetable'] = (c) => renderAdminTimetable(c)
    pageRenderers['holidays'] = (c) => renderAdminHolidays(c)
    pageRenderers['announcements'] = (c) => renderAdminAnnouncements(c)
    pageRenderers['settings'] = (c) => renderAdminSettings(c)
  }

  const shell = renderShell(
    user,
    navMap[user.role] || navMap.student,
    (key, container) => {
      container.innerHTML = ''
      const renderer = pageRenderers[key]
      if (renderer) renderer(container)
      else container.innerHTML = `<div class="empty-state">Page "${key}" not found</div>`
    },
    () => { mount(renderLogin(u => showDashboard(u))) }
  )

  mount(shell)
}

start()
