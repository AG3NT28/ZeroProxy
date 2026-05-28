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
