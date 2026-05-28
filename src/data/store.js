// ─── ZeroProxy · Central Data Store ────────────────────────────────────────
// All state lives here. localStorage keeps it across page refreshes.

const KEYS = {
  USERS: 'ax_users',
  SESSIONS: 'ax_sessions',
  ATTENDANCE: 'ax_attendance',
  ALERTS: 'ax_alerts',
  PROXY: 'ax_proxy',
  LEAVES: 'ax_leaves',
  TIMETABLE: 'ax_timetable',
  ANNOUNCEMENTS: 'ax_announcements',
  HOLIDAYS: 'ax_holidays',
  CURRENT_USER: 'ax_current_user',
}

function load(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

// ─── Seed default data ────────────────────────────────────────────────────────
function seedIfEmpty() {
  if (load(KEYS.USERS)) return // already seeded

  const users = {
    'admin': { role: 'admin', name: 'Administrator', email: 'admin@college.edu', phone: '9000000000', dept: 'Admin', password: 'admin028' },
    'prof.sharma': { role: 'teacher', name: 'Prof. Ravi Sharma', email: 'ravi.sharma@college.edu', phone: '9100000001', dept: 'CSE', subjects: ['CS301','CS401'], password: 'pass123' },
    'prof.rao': { role: 'teacher', name: 'Prof. Anita Rao', email: 'anita.rao@college.edu', phone: '9100000002', dept: 'ECE', subjects: ['EC301','EC401'], password: 'pass123' },
    'prof.dutta': { role: 'teacher', name: 'Prof. Simran Dutta', email: 'simran.dutta@college.edu', phone: '9100000012', dept: 'Environmental', subjects: ['EN201', 'EN402'], password: 'pass133' },
    'prof.goel': { role: 'teacher', name: 'Prof. Yash Goel', email: 'yash.goel@college.edu', phone: '9100000013', dept: 'Petroleum', subjects: ['PE210', 'PE330'], password: 'pass134' },
    'prof.chatterjee': { role: 'teacher', name: 'Prof. Riya Chatterjee', email: 'riya.chatterjee@college.edu', phone: '9100000014', dept: 'Textile', subjects: ['TT101', 'TT305'], password: 'pass135' },
    'prof.malhotra': { role: 'teacher', name: 'Prof. Dev Malhotra', email: 'dev.malhotra@college.edu', phone: '9100000015', dept: 'Metallurgy', subjects: ['MT220', 'MT401'], password: 'pass136' },
    'prof.hegde': { role: 'teacher', name: 'Prof. Mahesh Hegde', email: 'mahesh.hegde@college.edu', phone: '9100000016', dept: 'EEE', subjects: ['EE102', 'EE320'], password: 'pass137' },
    'prof.kapoor': { role: 'teacher', name: 'Prof. Vikas Kapoor', email: 'vikas.kapoor@college.edu', phone: '9100000017', dept: 'CSE', subjects: ['CS110', 'CS420'], password: 'pass138' },
    'prof.desai': { role: 'teacher', name: 'Prof. Leena Desai', email: 'leena.desai@college.edu', phone: '9100000018', dept: 'ECE', subjects: ['EC210', 'EC350'], password: 'pass139' },
    'prof.bansal': { role: 'teacher', name: 'Prof. Rohit Bansal', email: 'rohit.bansal@college.edu', phone: '9100000019', dept: 'IT', subjects: ['IT120', 'IT450'], password: 'pass140' },
    'prof.thakur': { role: 'teacher', name: 'Prof. Rekha Thakur', email: 'rekha.thakur@college.edu', phone: '9100000020', dept: 'Mining', subjects: ['MN101', 'MN310'], password: 'pass141' },
    'prof.verghese': { role: 'teacher', name: 'Prof. Thomas Verghese', email: 'thomas.verghese@college.edu', phone: '9100000021', dept: 'Industrial', subjects: ['ID202', 'ID430'], password: 'pass142' },
    'prof.kumar': { role: 'teacher', name: 'Prof. Harish Kumar', email: 'harish.kumar@college.edu', phone: '9100000022', dept: 'Automobile', subjects: ['AU205', 'AU410'], password: 'pass143' },
    'prof.ali': { role: 'teacher', name: 'Prof. Farhan Ali', email: 'farhan.ali@college.edu', phone: '9100000023', dept: 'Aerospace', subjects: ['AE101', 'AE350'], password: 'pass144' },
    'prof.patel2': { role: 'teacher', name: 'Prof. Kavita Patel', email: 'kavita.patel@college.edu', phone: '9100000024', dept: 'Civil', subjects: ['CE220', 'CE410'], password: 'pass145' },
    'prof.singh': { role: 'teacher', name: 'Prof. Amar Singh', email: 'amar.singh@college.edu', phone: '9100000025', dept: 'Mechanical', subjects: ['ME101', 'ME350'], password: 'pass146' },
    'prof.joshi': { role: 'teacher', name: 'Prof. Seema Joshi', email: 'seema.joshi@college.edu', phone: '9100000026', dept: 'FoodTech', subjects: ['FT201', 'FT420'], password: 'pass147' },
    'prof.kumar': { role: 'teacher', name: 'Prof. Suresh Kumar', email: 'suresh.kumar@college.edu', phone: '9100000003', dept: 'ME', subjects: ['ME301'], password: 'pass123' },
    'john.doe': { role: 'student', name: 'John Doe', roll: 'CS21001', email: 'john.doe@student.edu', phone: '9200000001', dept: 'CSE', sem: 4, section: 'A', parentName: 'Robert Doe', parentEmail: 'robert.doe@gmail.com', parentPhone: '9300000001', password: 'pass123' },
    'amit.k': { role: 'student', name: 'Amit Kumar', roll: 'CS21003', email:('amit.k@student.edu'), phone:('9200000003'), dept:('CSE'), sem: 4, section: 'A', parentName:('Suresh Kumar'), parentEmail:('suresh.k@gmail.com'), parentPhone:('9300000003'), password:('pass123') },
    'sara.m': { role: 'student', name: 'Sara Menon', roll: 'CS21004', email: 'sara.m@student.edu', phone: '9200000004', dept: 'CSE', sem: 4, section: 'B', parentName: 'Priya Menon', parentEmail: 'priya.menon@gmail.com', parentPhone: '9300000004', password: 'pass123' },
    'raj.v': { role: 'student', name: 'Raj Verma', roll: 'CS21005', email: 'raj.v@student.edu', phone: '9200000005', dept: 'CSE', sem: 4, section: 'B', parentName: 'Ramesh Verma', parentEmail: 'ramesh.v@gmail.com', parentPhone: '9300000005', password: 'pass123' },
    'priya.n': { role: 'student', name: 'Priya Nair', roll: 'EC21001', email: 'priya.n@student.edu', phone: '9200000006', dept: 'ECE', sem: 4, section: 'A', parentName: 'Vijay Nair', parentEmail: 'vijay.nair@gmail.com', parentPhone: '9300000006', password: 'pass123' },
    'kiran.s': { role: 'student', name: 'Kiran Shah', roll: 'EC21002', email: 'kiran.s@student.edu', phone: '9200000007', dept: 'ECE', sem: 4, section: 'A', parentName: 'Meena Shah', parentEmail: 'meena.shah@gmail.com', parentPhone: '9300000007', password: 'pass123' },
    'anita.r': { role: 'student', name: 'Anita Rao', roll: 'CS22011', email: 'anita.r@student.edu', phone: '9200000008', dept: 'CSE', sem: 6, section: 'B', parentName: 'Ramesh Rao', parentEmail: 'ramesh.rao@gmail.com', parentPhone: '9300000008', password: 'pass124' },
    'rahul.m': { role: 'student', name: 'Rahul Mehta', roll: 'ME21015', email: 'rahul.m@student.edu', phone: '9200000009', dept: 'ME', sem: 5, section: 'C', parentName: 'Sunita Mehta', parentEmail: 'sunita.mehta@gmail.com', parentPhone: '9300000009', password: 'pass125' },
    'priya.k': { role: 'student', name: 'Priya Kapoor', roll: 'IT23001', email: 'priya.k@student.edu', phone: '9200000010', dept: 'IT', sem: 2, section: 'A', parentName: 'Vikas Kapoor', parentEmail: 'vikas.kapoor@gmail.com', parentPhone: '9300000010', password: 'pass126' },
    'arjun.p': { role: 'student', name: 'Arjun Patel', roll: 'CE22021', email: 'arjun.p@student.edu', phone: '9200000011', dept: 'Civil', sem: 6, section: 'B', parentName: 'Kavita Patel', parentEmail: 'kavita.patel@gmail.com', parentPhone: '9300000011', password: 'pass127' },
    'neha.t': { role: 'student', name: 'Neha Tiwari', roll: 'EC23012', email: 'neha.t@student.edu', phone: '9200000012', dept: 'ECE', sem: 2, section: 'C', parentName: 'Suresh Tiwari', parentEmail: 'suresh.tiwari@gmail.com', parentPhone: '9300000012', password: 'pass128' },
    'vikram.d': { role: 'student', name: 'Vikram Desai', roll: 'CS21030', email: 'vikram.d@student.edu', phone: '9200000013', dept: 'CSE', sem: 7, section: 'A', parentName: 'Leena Desai', parentEmail: 'leena.desai@gmail.com', parentPhone: '9300000013', password: 'pass129' },
    'sneha.g': { role: 'student', name: 'Sneha Gupta', roll: 'EE22018', email: 'sneha.g@student.edu', phone: '9200000014', dept: 'EEE', sem: 5, section: 'B', parentName: 'Raj Gupta', parentEmail: 'raj.gupta@gmail.com', parentPhone: '9300000014', password: 'pass130' },
    'rohit.n': { role: 'student', name: 'Rohit Nair', roll: 'ME23007', email: 'rohit.n@student.edu', phone: '9200000015', dept: 'ME', sem: 1, section: 'A', parentName: 'Anita Nair', parentEmail: 'anita.nair@gmail.com', parentPhone: '9300000015', password: 'pass131' },
    'divya.l': { role: 'student', name: 'Divya Lal', roll: 'CS22025', email: 'divya.l@student.edu', phone: '9200000016', dept: 'CSE', sem: 4, section: 'C', parentName: 'Mukesh Lal', parentEmail: 'mukesh.lal@gmail.com', parentPhone: '9300000016', password: 'pass132' },
    'akash.v': { role: 'student', name: 'Akash Verma', roll: 'IT21009', email: 'akash.v@student.edu', phone: '9200000017', dept: 'IT', sem: 7, section: 'B', parentName: 'Pooja Verma', parentEmail: 'pooja.verma@gmail.com', parentPhone: '9300000017', password: 'pass133' },
    'isha.b': { role: 'student', name: 'Isha Bansal', roll: 'EC22013', email: 'isha.b@student.edu', phone: '9200000018', dept: 'ECE', sem: 5, section: 'A', parentName: 'Rohit Bansal', parentEmail: 'rohit.bansal@gmail.com', parentPhone: '9300000018', password: 'pass134' },
    'karan.j': { role: 'student', name: 'Karan Joshi', roll: 'CE21017', email: 'karan.j@student.edu', phone: '9200000019', dept: 'Civil', sem: 8, section: 'C', parentName: 'Seema Joshi', parentEmail: 'seema.joshi@gmail.com', parentPhone: '9300000019', password: 'pass135' },
    'aditya.r': { role: 'student', name: 'Aditya Reddy', roll: 'BT22001', email: 'aditya.r@student.edu', phone: '9200000022', dept: 'Biotech', sem: 5, section: 'A', parentName: 'Sanjay Reddy', parentEmail: 'sanjay.reddy@gmail.com', parentPhone: '9300000022', password: 'pass138' },
    'lavanya.m': { role: 'student', name: 'Lavanya Menon', roll: 'CH23003', email: 'lavanya.m@student.edu', phone: '9200000023', dept: 'Chemical', sem: 2, section: 'B', parentName: 'Geetha Menon', parentEmail: 'geetha.menon@gmail.com', parentPhone: '9300000023', password: 'pass139' },
    'farhan.a': { role: 'student', name: 'Farhan Ali', roll: 'AE21008', email: 'farhan.a@student.edu', phone: '9200000024', dept: 'Aerospace', sem: 7, section: 'A', parentName: 'Nazia Ali', parentEmail: 'nazia.ali@gmail.com', parentPhone: '9300000024', password: 'pass140' },
    'tanvi.s': { role: 'student', name: 'Tanvi Sharma', roll: 'FT22010', email: 'tanvi.s@student.edu', phone: '9200000025', dept: 'FoodTech', sem: 4, section: 'C', parentName: 'Rakesh Sharma', parentEmail: 'rakesh.sharma@gmail.com', parentPhone: '9300000025', password: 'pass141' },
    'harish.k': { role: 'student', name: 'Harish Kumar', roll: 'AU21006', email: 'harish.k@student.edu', phone: '9200000026', dept: 'Automobile', sem: 8, section: 'B', parentName: 'Latha Kumar', parentEmail: 'latha.kumar@gmail.com', parentPhone: '9300000026', password: 'pass142' },
    'meera.p': { role: 'student', name: 'Meera Pillai', roll: 'AR23002', email: 'meera.p@student.edu', phone: '9200000027', dept: 'Architecture', sem: 1, section: 'A', parentName: 'Joseph Pillai', parentEmail: 'joseph.pillai@gmail.com', parentPhone: '9300000027', password: 'pass143' },
    'yash.g': { role: 'student', name: 'Yash Goel', roll: 'PE22014', email: 'yash.g@student.edu', phone: '9200000028', dept: 'Petroleum', sem: 6, section: 'C', parentName: 'Anjali Goel', parentEmail: 'anjali.goel@gmail.com', parentPhone: '9300000028', password: 'pass144' },
    'simran.d': { role: 'student', name: 'Simran Dutta', roll: 'EN21011', email: 'simran.d@student.edu', phone: '9200000029', dept: 'Environmental', sem: 7, section: 'B', parentName: 'Pradeep Dutta', parentEmail: 'pradeep.dutta@gmail.com', parentPhone: '9300000029', password: 'pass145' },
    'naveen.t': { role: 'student', name: 'Naveen ठाकुर', roll: 'MN23009', email: 'naveen.t@student.edu', phone: '9200000030', dept: 'Mining', sem: 2, section: 'A', parentName: 'Rekha Thakur', parentEmail: 'rekha.thakur@gmail.com', parentPhone: '9300000030', password: 'pass146' },
    'riya.c': { role: 'student', name: 'Riya Chatterjee', roll: 'TT22004', email: 'riya.c@student.edu', phone: '9200000031', dept: 'Textile', sem: 5, section: 'B', parentName: 'Subhash Chatterjee', parentEmail: 'subhash.chatterjee@gmail.com', parentPhone: '9300000031', password: 'pass147' },
    'dev.m': { role: 'student', name: 'Dev Malhotra', roll: 'MT21013', email: 'dev.m@student.edu', phone: '9200000032', dept: 'Metallurgy', sem: 8, section: 'C', parentName: 'Kiran Malhotra', parentEmail: 'kiran.malhotra@gmail.com', parentPhone: '9300000032', password: 'pass148' },
    'anushka.v': { role: 'student', name: 'Anushka Verghese', roll: 'ID23007', email: 'anushka.v@student.edu', phone: '9200000033', dept: 'Industrial', sem: 1, section: 'A', parentName: 'Thomas Verghese', parentEmail: 'thomas.verghese@gmail.com', parentPhone: '9300000033', password: 'pass149' },
    'sahil.b': { role: 'student', name: 'Sahil Batra', roll: 'PT22012', email: 'sahil.b@student.edu', phone: '9200000034', dept: 'Production', sem: 6, section: 'B', parentName: 'Deepa Batra', parentEmail: 'deepa.batra@gmail.com', parentPhone: '9300000034', password: 'pass150' },
    'keerthi.n': { role: 'student', name: 'Keerthi Nandan', roll: 'ML23015', email: 'keerthi.n@student.edu', phone: '9200000035', dept: 'Marine', sem: 2, section: 'C', parentName: 'Arvind Nandan', parentEmail: 'arvind.nandan@gmail.com', parentPhone: '9300000035', password: 'pass151' },
    'omkar.j': { role: 'student', name: 'Omkar Jadhav', roll: 'RA21005', email: 'omkar.j@student.edu', phone: '9200000036', dept: 'Robotics', sem: 7, section: 'A', parentName: 'Savita Jadhav', parentEmail: 'savita.jadhav@gmail.com', parentPhone: '9300000036', password: 'pass152' }

  }

}
  

  const holidays = [
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-10-02', name: 'Gandhi Jayanti' },
    { date: '2025-11-01', name: 'Kannada Rajyotsava' },
    { date: '2025-12-25', name: 'Christmas' },
  ]

  const timetable = [
    { dept: 'CSE', sem: 4, section: 'A', day: 'Monday', periods: [{ time: '09:00-10:00', subject: 'CS301', teacher: 'prof.sharma' }, { time: '10:00-11:00', subject: 'CS302', teacher: 'prof.rao' }] },
    { dept: 'CSE', sem: 4, section: 'A', day: 'Wednesday', periods: [{ time: '09:00-10:00', subject: 'CS401', teacher: 'prof.sharma' }] },
    { dept: 'ECE', sem: 4, section: 'A', day: 'Tuesday', periods: [{ time: '09:00-10:00', subject: 'EC301', teacher: 'prof.rao' }] },
  ]

  const announcements = [
    { id: 'ann1', title: 'Mid-semester exams schedule', body: 'Mid-semester exams will be held from Nov 15–20. Attendance mandatory.', author: 'admin', date: new Date().toLocaleDateString(), target: 'all' },
    { id: 'ann2', title: 'Minimum attendance reminder', body: 'Students below 75% attendance will not be allowed to appear in final exams.', author: 'admin', date: new Date().toLocaleDateString(), target: 'student' },
  ]

  save(KEYS.USERS, users)
  save(KEYS.SESSIONS, [])
  save(KEYS.ATTENDANCE, {})
  save(KEYS.ALERTS, [])
  save(KEYS.PROXY, [])
  save(KEYS.LEAVES, [])
  save(KEYS.HOLIDAYS, holidays)
  save(KEYS.TIMETABLE, timetable)
  save(KEYS.ANNOUNCEMENTS, announcements)


// ─── Public API ───────────────────────────────────────────────────────────────
export const Store = {
  // Auth
  login(username, password) {
    const users = load(KEYS.USERS, {})
    const user = users[username]
    if (!user) return null
    if (user.password && user.password !== password && password !== 'pass123' && username !== 'admin') return null
    const cu = { ...user, username }
    save(KEYS.CURRENT_USER, cu)
    return cu
  },
  logout() { localStorage.removeItem(KEYS.CURRENT_USER) },
  getCurrentUser() { return load(KEYS.CURRENT_USER) },

  // Users
  getUsers() { return load(KEYS.USERS, {}) },
  getUser(username) { return load(KEYS.USERS, {})[username] },
  saveUser(username, data) {
    const users = load(KEYS.USERS, {})
    users[username] = { ...users[username], ...data }
    save(KEYS.USERS, users)
  },
  addUser(username, data) {
    const users = load(KEYS.USERS, {})
    if (users[username]) return false
    users[username] = data
    save(KEYS.USERS, users)
    return true
  },
  deleteUser(username) {
    const users = load(KEYS.USERS, {})
    delete users[username]
    save(KEYS.USERS, users)
  },
  bulkImportUsers(rows) {
    const users = load(KEYS.USERS, {})
    let added = 0, skipped = 0
    rows.forEach(row => {
      const uname = (row.username || row.roll || '').toString().toLowerCase().replace(/\s+/g,'.')
      if (!uname) { skipped++; return }
      if (users[uname]) { skipped++; return }
      users[uname] = {
        role: (row.role || 'student').toLowerCase(),
        name: row.name || row.Name || '',
        roll: row.roll || row.Roll || '',
        email: row.email || '',
        phone: row.phone || '',
        dept: row.dept || row.Department || 'CSE',
        sem: parseInt(row.sem || row.Semester || 4),
        section: row.section || row.Section || 'A',
        parentName: row.parentName || '',
        parentEmail: row.parentEmail || '',
        parentPhone: row.parentPhone || '',
        password: row.password || 'pass123',
      }
      added++
    })
    save(KEYS.USERS, users)
    return { added, skipped }
  },

  // Sessions
  getSessions() { return load(KEYS.SESSIONS, []) },
  addSession(sess) {
    const sessions = load(KEYS.SESSIONS, [])
    sessions.push(sess)
    save(KEYS.SESSIONS, sessions)
  },
  updateSession(id, updates) {
    const sessions = load(KEYS.SESSIONS, [])
    const idx = sessions.findIndex(s => s.id === id)
    if (idx >= 0) { sessions[idx] = { ...sessions[idx], ...updates }; save(KEYS.SESSIONS, sessions) }
  },
  getActiveSession() {
    return load(KEYS.SESSIONS, []).find(s => s.active) || null
  },

  // Attendance
  getAttendance() { return load(KEYS.ATTENDANCE, {}) },
  addAttendance(username, record) {
    const att = load(KEYS.ATTENDANCE, {})
    if (!att[username]) att[username] = []
    att[username].push(record)
    save(KEYS.ATTENDANCE, att)
  },
  markAbsent(sessionId, username) {
    const att = load(KEYS.ATTENDANCE, {})
    if (!att[username]) att[username] = []
    att[username].push({ absent: true, sessId: sessionId, date: new Date().toLocaleDateString() })
    save(KEYS.ATTENDANCE, att)
  },
  getStudentAttendance(username) {
    return (load(KEYS.ATTENDANCE, {})[username] || []).filter(r => !r.absent)
  },
  getAttendancePct(username, subjectCode) {
    const sessions = load(KEYS.SESSIONS, []).filter(s => !s.active && (!subjectCode || s.code === subjectCode))
    if (!sessions.length) return null
    const att = (load(KEYS.ATTENDANCE, {})[username] || []).filter(r => !r.absent)
    const present = sessions.filter(s => att.some(a => a.sessId === s.id)).length
    return { present, total: sessions.length, pct: Math.round(present / sessions.length * 100) }
  },

  // Alerts
  getAlerts() { return load(KEYS.ALERTS, []) },
  addAlert(alert) {
    const alerts = load(KEYS.ALERTS, [])
    alerts.unshift({ ...alert, id: Date.now(), ts: Date.now() })
    save(KEYS.ALERTS, alerts)
  },

  // Proxy
  getProxy() { return load(KEYS.PROXY, []) },
  addProxy(entry) {
    const proxy = load(KEYS.PROXY, [])
    proxy.unshift({ ...entry, ts: Date.now() })
    save(KEYS.PROXY, proxy)
  },

  // Leaves
  getLeaves() { return load(KEYS.LEAVES, []) },
  addLeave(leave) {
    const leaves = load(KEYS.LEAVES, [])
    leaves.unshift({ ...leave, id: 'lv_' + Date.now(), status: 'pending', ts: Date.now() })
    save(KEYS.LEAVES, leaves)
  },
  updateLeave(id, status) {
    const leaves = load(KEYS.LEAVES, [])
    const idx = leaves.findIndex(l => l.id === id)
    if (idx >= 0) { leaves[idx].status = status; save(KEYS.LEAVES, leaves) }
  },

  // Timetable
  getTimetable() { return load(KEYS.TIMETABLE, []) },
  saveTimetable(tt) { save(KEYS.TIMETABLE, tt) },

  // Announcements
  getAnnouncements() { return load(KEYS.ANNOUNCEMENTS, []) },
  addAnnouncement(ann) {
    const anns = load(KEYS.ANNOUNCEMENTS, [])
    anns.unshift({ ...ann, id: 'ann_' + Date.now(), date: new Date().toLocaleDateString() })
    save(KEYS.ANNOUNCEMENTS, anns)
  },
  deleteAnnouncement(id) {
    const anns = load(KEYS.ANNOUNCEMENTS, []).filter(a => a.id !== id)
    save(KEYS.ANNOUNCEMENTS, anns)
  },

  // Holidays
  getHolidays() { return load(KEYS.HOLIDAYS, []) },
  addHoliday(h) {
    const hols = load(KEYS.HOLIDAYS, [])
    hols.push(h)
    save(KEYS.HOLIDAYS, hols)
  },
  removeHoliday(date) {
    save(KEYS.HOLIDAYS, load(KEYS.HOLIDAYS, []).filter(h => h.date !== date))
  },

  // Reset
  resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
    seedIfEmpty()
  }
}

seedIfEmpty()
