# ZeroProxy 🎓
**Smart Attendance Management System · v2.0**

A complete, production-ready attendance system built with vanilla JS + Vite. No framework dependencies, just fast modular JavaScript.

---

## Features

### Teacher
- Start timed QR sessions (5–60 min) per subject/class/semester/department
- Dynamic QR code rotates every 2 seconds (screenshots can't be reused)
- Copy token for manual sharing
- Add students manually mid-session
- Session records with CSV/JSON export
- Leave request approval / rejection
- Post announcements

### Student
- Camera QR scan (real device camera on HTTPS)
- Manual token entry
- WiFi + GPS location verification before scanning
- Per-subject attendance % with safe/critical indicators
- "Classes needed to reach 75%" calculator
- Leave requests to teacher
- Profile page with parent contact info
- Timetable view
- Upcoming holidays

### Admin (Separate Full Dashboard)
- Dashboard with department-wise bar chart
- At-risk student list (below 75%)
- **Full CRUD** for students and teachers
- **Bulk CSV import** for students (drag & drop or paste)
- Export students/teachers to CSV
- Full attendance report with filtering (dept, subject, threshold)
- Send parent alerts in bulk
- All sessions viewer with attendance detail drill-down
- Parent alert history log
- Proxy / suspicious activity log
- Timetable manager (add/remove entries)
- Holiday calendar
- Announcements for all/students/teachers
- Settings (threshold, WiFi SSID, GPS radius)
- Export all data (CSV/JSON)
- Factory reset

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Build for Production

```bash
npm run build
# Output in /dist folder — deploy to any static host
```

## Deploy Free

**Netlify (recommended):**
1. Push folder to GitHub
2. Connect repo on netlify.com → auto deploy

**Vercel:**
```bash
npm install -g vercel
vercel
```

**GitHub Pages:**
```bash
npm run build
# Upload /dist contents to your gh-pages branch
```

---

## Demo Accounts

| Role    | Username      | Password |
|---------|---------------|----------|
| Admin   | admin         | pass123  |
| Teacher | prof.sharma   | pass123  |
| Teacher | prof.rao      | pass123  |
| Student | john.doe      | pass123  |
| Student | jane.smith    | pass123  |
| Student | amit.k        | pass123  |
| Student | sara.m        | pass123  |
| Student | raj.v         | pass123  |

---

## Bulk CSV Import Format

Upload a CSV file with these columns (header row required):

```csv
username,name,roll,dept,sem,section,email,phone,parentName,parentEmail,parentPhone,password
alice.j,Alice Johnson,CS21010,CSE,4,A,alice@student.edu,9876543210,Bob Johnson,bob@gmail.com,9876543211,pass123
```

Only `username` and `name` are required. Missing fields default to blank.

---

## File Structure

```
ZeroProxy/
├── index.html              # Entry HTML
├── main.js                 # App bootstrap & routing
├── package.json
├── vite.config.js
└── src/
    ├── styles/
    │   └── main.css        # Global design system
    ├── data/
    │   └── store.js        # Central data store (localStorage)
    ├── utils/
    │   └── helpers.js      # QR, export, location utilities
    ├── components/
    │   └── Shell.js        # Sidebar + topbar layout
    └── pages/
        ├── Login.js        # Login page
        ├── Teacher.js      # Teacher pages
        ├── Student.js      # Student pages
        └── Admin.js        # Admin pages (full CRUD)
```

---

## Adding Real Backend

All data lives in `localStorage` for demo. To connect a real database:

1. Replace functions in `src/data/store.js` with API calls
2. Use `fetch('/api/sessions')` instead of localStorage reads
3. Add JWT auth in `login()` / `getCurrentUser()`
4. Recommended stack: Node.js + Express + PostgreSQL or Firebase

---

## Real Camera QR Scanning

Camera scanning uses `getUserMedia`. For real QR decoding:
1. `npm install jsqr`
2. In `Student.js`, add a `setInterval` that:
   - Draws `video` to an offscreen canvas
   - Calls `jsQR(imageData, width, height)`
   - On result, calls `processAttendance(sessId, result.data)`

This works on any HTTPS deployment automatically.

---

## Planned Features (Next Steps)

- [ ] SMS alerts via Twilio
- [ ] Face recognition liveness check
- [ ] Biometric attendance via Web Authentication API
- [ ] Push notifications (PWA)
- [ ] Student leaderboard / gamification
- [ ] AI-powered attendance pattern analysis
- [ ] Multi-campus / multi-branch support
- [ ] Mobile app (React Native wrapper)

---

## License
MIT — free to use, modify, and deploy.
