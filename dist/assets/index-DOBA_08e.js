(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))l(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&l(r)}).observe(document,{childList:!0,subtree:!0});function s(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(t){if(t.ep)return;t.ep=!0;const i=s(t);fetch(t.href,i)}})();const b={USERS:"ax_users",SESSIONS:"ax_sessions",ATTENDANCE:"ax_attendance",ALERTS:"ax_alerts",PROXY:"ax_proxy",LEAVES:"ax_leaves",TIMETABLE:"ax_timetable",ANNOUNCEMENTS:"ax_announcements",HOLIDAYS:"ax_holidays",CURRENT_USER:"ax_current_user"};function g(e,a=null){try{return JSON.parse(localStorage.getItem(e))??a}catch{return a}}function x(e,a){localStorage.setItem(e,JSON.stringify(a))}function Y(){g(b.USERS)}const te=[{date:"2025-01-26",name:"Republic Day"},{date:"2025-08-15",name:"Independence Day"},{date:"2025-10-02",name:"Gandhi Jayanti"},{date:"2025-11-01",name:"Kannada Rajyotsava"},{date:"2025-12-25",name:"Christmas"}],se=[{dept:"CSE",sem:4,section:"A",day:"Monday",periods:[{time:"09:00-10:00",subject:"CS301",teacher:"prof.sharma"},{time:"10:00-11:00",subject:"CS302",teacher:"prof.rao"}]},{dept:"CSE",sem:4,section:"A",day:"Wednesday",periods:[{time:"09:00-10:00",subject:"CS401",teacher:"prof.sharma"}]},{dept:"ECE",sem:4,section:"A",day:"Tuesday",periods:[{time:"09:00-10:00",subject:"EC301",teacher:"prof.rao"}]}],ae=[{id:"ann1",title:"Mid-semester exams schedule",body:"Mid-semester exams will be held from Nov 15–20. Attendance mandatory.",author:"admin",date:new Date().toLocaleDateString(),target:"all"},{id:"ann2",title:"Minimum attendance reminder",body:"Students below 75% attendance will not be allowed to appear in final exams.",author:"admin",date:new Date().toLocaleDateString(),target:"student"}];x(b.USERS,users);x(b.SESSIONS,[]);x(b.ATTENDANCE,{});x(b.ALERTS,[]);x(b.PROXY,[]);x(b.LEAVES,[]);x(b.HOLIDAYS,te);x(b.TIMETABLE,se);x(b.ANNOUNCEMENTS,ae);const c={login(e,a){const l=g(b.USERS,{})[e];if(!l||l.password&&l.password!==a&&a!=="pass123"&&e!=="admin")return null;const t={...l,username:e};return x(b.CURRENT_USER,t),t},logout(){localStorage.removeItem(b.CURRENT_USER)},getCurrentUser(){return g(b.CURRENT_USER)},getUsers(){return g(b.USERS,{})},getUser(e){return g(b.USERS,{})[e]},saveUser(e,a){const s=g(b.USERS,{});s[e]={...s[e],...a},x(b.USERS,s)},addUser(e,a){const s=g(b.USERS,{});return s[e]?!1:(s[e]=a,x(b.USERS,s),!0)},deleteUser(e){const a=g(b.USERS,{});delete a[e],x(b.USERS,a)},bulkImportUsers(e){const a=g(b.USERS,{});let s=0,l=0;return e.forEach(t=>{const i=(t.username||t.roll||"").toString().toLowerCase().replace(/\s+/g,".");if(!i){l++;return}if(a[i]){l++;return}a[i]={role:(t.role||"student").toLowerCase(),name:t.name||t.Name||"",roll:t.roll||t.Roll||"",email:t.email||"",phone:t.phone||"",dept:t.dept||t.Department||"CSE",sem:parseInt(t.sem||t.Semester||4),section:t.section||t.Section||"A",parentName:t.parentName||"",parentEmail:t.parentEmail||"",parentPhone:t.parentPhone||"",password:t.password||"pass123"},s++}),x(b.USERS,a),{added:s,skipped:l}},getSessions(){return g(b.SESSIONS,[])},addSession(e){const a=g(b.SESSIONS,[]);a.push(e),x(b.SESSIONS,a)},updateSession(e,a){const s=g(b.SESSIONS,[]),l=s.findIndex(t=>t.id===e);l>=0&&(s[l]={...s[l],...a},x(b.SESSIONS,s))},getActiveSession(){return g(b.SESSIONS,[]).find(e=>e.active)||null},getAttendance(){return g(b.ATTENDANCE,{})},addAttendance(e,a){const s=g(b.ATTENDANCE,{});s[e]||(s[e]=[]),s[e].push(a),x(b.ATTENDANCE,s)},markAbsent(e,a){const s=g(b.ATTENDANCE,{});s[a]||(s[a]=[]),s[a].push({absent:!0,sessId:e,date:new Date().toLocaleDateString()}),x(b.ATTENDANCE,s)},getStudentAttendance(e){return(g(b.ATTENDANCE,{})[e]||[]).filter(a=>!a.absent)},getAttendancePct(e,a){const s=g(b.SESSIONS,[]).filter(i=>!i.active&&(!a||i.code===a));if(!s.length)return null;const l=(g(b.ATTENDANCE,{})[e]||[]).filter(i=>!i.absent),t=s.filter(i=>l.some(r=>r.sessId===i.id)).length;return{present:t,total:s.length,pct:Math.round(t/s.length*100)}},getAlerts(){return g(b.ALERTS,[])},addAlert(e){const a=g(b.ALERTS,[]);a.unshift({...e,id:Date.now(),ts:Date.now()}),x(b.ALERTS,a)},getProxy(){return g(b.PROXY,[])},addProxy(e){const a=g(b.PROXY,[]);a.unshift({...e,ts:Date.now()}),x(b.PROXY,a)},getLeaves(){return g(b.LEAVES,[])},addLeave(e){const a=g(b.LEAVES,[]);a.unshift({...e,id:"lv_"+Date.now(),status:"pending",ts:Date.now()}),x(b.LEAVES,a)},updateLeave(e,a){const s=g(b.LEAVES,[]),l=s.findIndex(t=>t.id===e);l>=0&&(s[l].status=a,x(b.LEAVES,s))},getTimetable(){return g(b.TIMETABLE,[])},saveTimetable(e){x(b.TIMETABLE,e)},getAnnouncements(){return g(b.ANNOUNCEMENTS,[])},addAnnouncement(e){const a=g(b.ANNOUNCEMENTS,[]);a.unshift({...e,id:"ann_"+Date.now(),date:new Date().toLocaleDateString()}),x(b.ANNOUNCEMENTS,a)},deleteAnnouncement(e){const a=g(b.ANNOUNCEMENTS,[]).filter(s=>s.id!==e);x(b.ANNOUNCEMENTS,a)},getHolidays(){return g(b.HOLIDAYS,[])},addHoliday(e){const a=g(b.HOLIDAYS,[]);a.push(e),x(b.HOLIDAYS,a)},removeHoliday(e){x(b.HOLIDAYS,g(b.HOLIDAYS,[]).filter(a=>a.date!==e))},resetAll(){Object.values(b).forEach(e=>localStorage.removeItem(e)),Y()}};Y();function L(){return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function A(){return new Date().toLocaleDateString()}function le(e="id"){return`${e}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`}function ie(e){const a=Math.random().toString(36).substring(2,10).toUpperCase();return`ATTX_${e}_${Date.now()}_${a}`}function z(e){return new Promise(a=>setTimeout(a,e))}function de(e,a,s,l){const i=(s-e)*Math.PI/180,r=(l-a)*Math.PI/180,o=Math.sin(i/2)**2+Math.cos(e*Math.PI/180)*Math.cos(s*Math.PI/180)*Math.sin(r/2)**2;return 6371e3*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}function ne(e,a,s=200){const l=e.getContext("2d");e.width=s,e.height=s;const t=6,i=Math.floor(s/t);l.fillStyle="#ffffff",l.fillRect(0,0,s,s);const r=a.split("").reduce((u,v)=>u+v.charCodeAt(0),0);function o(u){let v=r*u*2654435761|0;return v^=v>>>17,v*=57631367,v^=v>>>32,Math.abs(v)%256}l.fillStyle="#1a1a2e";for(let u=0;u<i;u++)for(let v=0;v<i;v++)o(u*i+v+1)<128&&l.fillRect(u*t,v*t,t,t);const d=Math.floor(i/3);function n(u,v){l.fillStyle="#fff",l.fillRect(u*t,v*t,d*t,d*t),l.fillStyle="#1a1a2e",l.fillRect(u*t,v*t,d*t,d*t),l.fillStyle="#fff",l.fillRect((u+1)*t,(v+1)*t,(d-2)*t,(d-2)*t),l.fillStyle="#6366f1",l.fillRect((u+2)*t,(v+2)*t,(d-4)*t,(d-4)*t)}n(0,0),n(i-d,0),n(0,i-d);const m=Math.floor(i/2);l.fillStyle="#6366f1",l.fillRect((m-1)*t,(m-1)*t,2*t,2*t)}function w(e,a){if(!e.length)return;const s=Object.keys(e[0]),l=[s.join(","),...e.map(t=>s.map(i=>`"${(t[i]??"").toString().replace(/"/g,'""')}"`).join(","))].join(`
`);J(l,a,"text/csv")}function M(e,a){J(JSON.stringify(e,null,2),a,"application/json")}function J(e,a,s){const l=document.createElement("a");l.href="data:"+s+";charset=utf-8,"+encodeURIComponent(e),l.download=a,l.click()}function H(e){return e>=75?"green":e>=60?"amber":"red"}function j(e){return(e||"U").split(" ").map(a=>a[0]).slice(0,2).join("").toUpperCase()}function y(e,a="ok"){const s=document.querySelector(".ax-toast");s&&s.remove();const l=document.createElement("div");l.className="ax-toast ax-toast-"+a,l.textContent=e,document.body.appendChild(l),setTimeout(()=>l.classList.add("ax-toast-show"),10),setTimeout(()=>{l.classList.remove("ax-toast-show"),setTimeout(()=>l.remove(),300)},3e3)}function G(e){let a="teacher";const s=document.createElement("div");s.className="login-page",s.innerHTML=`
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
  `,s.querySelectorAll(".role-btn").forEach(t=>{t.addEventListener("click",()=>{s.querySelectorAll(".role-btn").forEach(r=>r.classList.remove("sel")),t.classList.add("sel"),a=t.dataset.role;const i={teacher:"prof.sharma",student:"john.doe",admin:"admin"};s.querySelector("#l-user").value=i[a]})});const l=()=>{const t=s.querySelector("#l-user").value.trim(),i=s.querySelector("#l-pass").value.trim();if(!t||!i){y("Enter username and password","err");return}const r=c.login(t,i);if(!r){const o={role:a,name:t.replace("."," ").replace(/\b\w/g,n=>n.toUpperCase()),roll:"DEMO001",dept:"CSE",sem:4,section:"A",parentEmail:"",password:i};c.addUser(t,o);const d=c.login(t,i);if(d){e(d);return}y("Invalid credentials","err");return}e(r)};return s.querySelector("#l-btn").addEventListener("click",l),s.querySelector("#l-pass").addEventListener("keydown",t=>{t.key==="Enter"&&l()}),s}function oe(e,a,s,l){var m,u,v;const t=document.createElement("div");t.className="app-shell";const i={admin:"av-red",teacher:"av-accent",student:"av-green"},r={admin:"Administrator",teacher:"Teacher",student:"Student"};t.innerHTML=`
    <div class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">🎓</div>
        <div>
          <div class="logo-text">ZeroProxy</div>
          <div class="logo-sub">v2.0 · ${r[e.role]}</div>
        </div>
      </div>
      <nav class="sidebar-nav" id="sidebar-nav"></nav>
      <div class="sidebar-footer">
        <div class="sidebar-user" id="su-logout" title="Click to sign out">
          <div class="avatar av-sm ${i[e.role]}">${j(e.name)}</div>
          <div>
            <div class="u-name">${e.name}</div>
            <div class="u-role">${e.dept||r[e.role]}</div>
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
  `;const o=t.querySelector("#sidebar-nav");let d=(m=a[0])==null?void 0:m.key;function n(){o.innerHTML="",a.forEach(S=>{if(S.divider){const p=document.createElement("div");p.className="nav-section",p.innerHTML=`<div class="nav-section-title">${S.label}</div>`,S.items.forEach(f=>{const h=document.createElement("div");h.className="nav-item"+(f.key===d?" active":""),h.dataset.key=f.key,h.innerHTML=`<span class="nav-icon">${f.icon}</span>${f.label}${f.badge?`<span class="nav-badge" id="badge-${f.key}">${f.badge}</span>`:""}`,h.addEventListener("click",()=>{d=f.key,n(),t.querySelector("#sidebar").classList.remove("open"),t.querySelector("#sidebar-overlay").classList.remove("show"),t.querySelector("#topbar-title").textContent=f.label,s(f.key,t.querySelector("#page-body"),t.querySelector("#topbar-actions"))}),p.appendChild(h)}),o.appendChild(p)}})}if(n(),t.querySelector("#menu-toggle").addEventListener("click",()=>{t.querySelector("#sidebar").classList.toggle("open"),t.querySelector("#sidebar-overlay").classList.toggle("show")}),t.querySelector("#sidebar-overlay").addEventListener("click",()=>{t.querySelector("#sidebar").classList.remove("open"),t.querySelector("#sidebar-overlay").classList.remove("show")}),t.querySelector("#su-logout").addEventListener("click",()=>{confirm("Sign out?")&&(c.logout(),l())}),(v=(u=a[0])==null?void 0:u.items)!=null&&v[0]){const S=a[0].items[0];d=S.key,n(),t.querySelector("#topbar-title").textContent=S.label,setTimeout(()=>s(S.key,t.querySelector("#page-body"),t.querySelector("#topbar-actions")),0)}return t.updateBadge=(S,p)=>{const f=t.querySelector(`#badge-${S}`);f&&(f.textContent=p,f.style.display=p?"":"none")},t}let D=null,P=null,U=null,T="",C=2;function re(e,a){const s=c.getActiveSession();e.innerHTML=`
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
            <select id="ssem">${[1,2,3,4,5,6,7,8].map(l=>`<option ${l===4?"selected":""}>${l}</option>`).join("")}</select>
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
  `,ee(e,a),Z(e,a),s&&s.teacher===a.name&&_(e,s),e.querySelector("#start-btn").addEventListener("click",()=>{const l=e.querySelector("#sc").value.trim(),t=e.querySelector("#scls").value.trim();if(!l||!t){y("Fill in subject code and section","err");return}const r={id:le("sess"),code:l,name:e.querySelector("#sname").value.trim()||l,cls:t,sem:e.querySelector("#ssem").value,dept:e.querySelector("#sdept").value,duration:parseInt(e.querySelector("#sdur").value),teacher:a.name,teacherUsername:a.username,startTime:Date.now(),attendance:{},scanTimes:{},active:!0,date:A(),proxyCount:0};c.addSession(r),_(e,r),y("Session started!","ok")})}function _(e,a){e.querySelector("#sess-form-wrap").style.display="none",e.querySelector("#sess-live-wrap").style.display="block",e.querySelector("#sl-title").textContent=`${a.code} · Sem ${a.sem}`,e.querySelector("#sl-sub").textContent=a.code,e.querySelector("#sl-cls").textContent="Sec "+a.cls,e.querySelector("#sl-sem").textContent="Sem "+a.sem,e.querySelector("#sl-dept").textContent=a.dept,X(e,a),Q(e,a),ce(e,a),e.querySelector("#copy-token-btn").addEventListener("click",()=>{var s;(s=navigator.clipboard)==null||s.writeText(T).then(()=>y("Token copied!","ok")).catch(()=>y(T,"info"))}),e.querySelector("#add-manual-btn").addEventListener("click",()=>{const s=prompt("Student name to add manually:");if(!s)return;const l=prompt("Roll number:")||"Manual",t="manual_"+Date.now(),i=c.getSessions(),r=i.findIndex(o=>o.id===a.id);r>=0&&(i[r].attendance[t]={name:s,roll:l,time:L(),sessId:a.id,manual:!0},localStorage.setItem("ax_sessions",JSON.stringify(i)),X(e,i[r]),y("Student added","ok"))}),e.querySelector("#end-sess-btn").addEventListener("click",()=>{confirm("End this session?")&&K(e,a.id)})}function Q(e,a){T=ie(a.id);const s=c.getSessions(),l=s.findIndex(d=>d.id===a.id);l>=0&&(s[l].currentToken=T,localStorage.setItem("ax_sessions",JSON.stringify(s)));const t=e.querySelector("#qr-canvas");t&&ne(t,T,200);const i=e.querySelector("#qr-token-disp");i&&(i.textContent=T),C=2;const r=e.querySelector("#qr-cd");r&&(r.textContent="2s"),clearInterval(U),U=setInterval(()=>{C--,C<0&&(C=1),r&&(r.textContent=C+"s")},1e3),clearTimeout(P);const o=c.getSessions().find(d=>d.id===a.id);o!=null&&o.active&&(P=setTimeout(()=>Q(e,o),2e3))}function ce(e,a){let s=a.duration;const l=e.querySelector("#sl-timer");function t(){if(!(l!=null&&l.isConnected))return;const i=Math.floor(s/60),r=s%60;if(l.textContent=`${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`,l.className="timer-pill "+(s>120?"tp-green":s>30?"tp-amber":"tp-red"),s<=0){K(e,a.id);return}s--,D=setTimeout(t,1e3)}clearTimeout(D),t()}function X(e,a){const s=Object.values(a.attendance||{}),l=e.querySelector("#sl-list"),t=e.querySelector("#sl-present");t&&(t.textContent=s.length),l&&(l.innerHTML=s.length?s.map(i=>`
    <div class="row-item">
      <div class="avatar av-sm av-green">${(i.name[0]||"?").toUpperCase()}</div>
      <div class="ri-main"><div class="ri-title">${i.name}</div><div class="ri-sub">${i.roll} · ${i.time}${i.manual?" · Manual":""}</div></div>
      <span class="badge badge-green">Present</span>
    </div>`).join(""):'<div class="empty-state">Waiting for students to scan...</div>')}function K(e,a){var s;clearTimeout(D),clearTimeout(P),clearInterval(U),c.updateSession(a,{active:!1}),e.querySelector("#sess-live-wrap").style.display="none",e.querySelector("#sess-form-wrap").style.display="block",Z(e,{username:(s=c.getCurrentUser())==null?void 0:s.username}),ee(e,c.getCurrentUser()),y("Session ended","ok")}function Z(e,a){const s=e.querySelector("#today-sessions");if(!s)return;const l=c.getSessions().filter(t=>t.teacherUsername===a.username&&t.date===A());s.innerHTML=l.length?l.slice().reverse().map(t=>`
    <div class="row-item">
      <div class="ri-main">
        <div class="ri-title">${t.code} · Sec ${t.cls} · Sem ${t.sem}</div>
        <div class="ri-sub">${t.dept} · ${Object.keys(t.attendance||{}).length} present</div>
      </div>
      <span class="badge ${t.active?"badge-green":"badge-gray"}">${t.active?"Live":"Done"}</span>
    </div>`).join(""):'<div class="empty-state">No sessions today</div>'}function ee(e,a){const s=c.getSessions().filter(l=>l.teacherUsername===(a==null?void 0:a.username));if(e.querySelector("#t-total").textContent=s.length,s.length){const l=Math.round(s.reduce((t,i)=>t+Object.keys(i.attendance||{}).length,0)/s.length);e.querySelector("#t-avg").textContent=l+" avg"}}function ve(e,a){e.innerHTML=`
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
  `;const s=c.getSessions().filter(o=>o.teacherUsername===a.username),l=[...new Set(s.map(o=>o.code))],t=e.querySelector("#rec-filter-sub");l.forEach(o=>{const d=document.createElement("option");d.value=o,d.textContent=o,t.appendChild(d)});function i(){const o=t.value,d=s.filter(m=>!o||m.code===o).slice().reverse(),n=e.querySelector("#rec-list");n.innerHTML=d.length?d.map(m=>`
      <div class="row-item" style="cursor:pointer" data-sid="${m.id}">
        <div class="ri-main">
          <div class="ri-title">${m.code} · ${m.name||""} · Sec ${m.cls}</div>
          <div class="ri-sub">${m.dept} · Sem ${m.sem} · ${m.date} · ${Object.keys(m.attendance||{}).length} present</div>
        </div>
        <span class="badge ${m.active?"badge-green":"badge-purple"}">${m.active?"Live":"Done"}</span>
      </div>`).join(""):'<div class="empty-state">No sessions found</div>',n.querySelectorAll("[data-sid]").forEach(m=>{m.addEventListener("click",()=>{const u=s.find(p=>p.id===m.dataset.sid);if(!u)return;const v=e.querySelector("#rec-detail"),S=Object.values(u.attendance||{});v.style.display="block",e.querySelector("#rd-title").textContent=`${u.code} · ${u.date}`,e.querySelector("#rd-body").innerHTML=`
          <div class="tbl-wrap"><table>
            <thead><tr><th>#</th><th>Name</th><th>Roll</th><th>Time</th><th>Type</th></tr></thead>
            <tbody>${S.length?S.map((p,f)=>`<tr><td>${f+1}</td><td>${p.name}</td><td>${p.roll}</td><td>${p.time}</td><td>${p.manual?"Manual":"QR Scan"}</td></tr>`).join(""):'<tr><td colspan="5" style="text-align:center;color:var(--text3)">No attendance recorded</td></tr>'}</tbody>
          </table></div>
          <div style="margin-top:10px;font-size:12px;color:var(--text2)">${S.length} students present</div>`,v.scrollIntoView({behavior:"smooth"})})})}i(),t.addEventListener("change",i),e.querySelector("#rd-close").addEventListener("click",()=>{e.querySelector("#rec-detail").style.display="none"});const r=()=>s.filter(o=>!t.value||o.code===t.value).flatMap(o=>Object.values(o.attendance||{}).map(d=>({subject:o.code,section:o.cls,semester:o.sem,department:o.dept,date:o.date,student:d.name,roll:d.roll,time:d.time,type:d.manual?"manual":"qr"})));e.querySelector("#exp-csv").addEventListener("click",()=>{const o=r();o.length?w(o,"attendance_records.csv"):y("No data to export","err")}),e.querySelector("#exp-json").addEventListener("click",()=>M(r(),"attendance_records.json"))}function ue(e,a){e.innerHTML=`
    <div class="card">
      <div class="card-header"><div class="card-title">Leave Requests</div></div>
      <div id="leave-list"><div class="empty-state">No leave requests</div></div>
    </div>
  `;function s(){const l=c.getLeaves().filter(i=>i.teacherUsername===a.username||!i.teacherUsername),t=e.querySelector("#leave-list");t.innerHTML=l.length?l.map(i=>`
      <div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${i.studentName} (${i.roll})</div>
          <div class="ri-sub">${i.subject} · ${i.from} to ${i.to} · ${i.reason}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <span class="badge ${i.status==="approved"?"badge-green":i.status==="rejected"?"badge-red":"badge-amber"}">${i.status}</span>
          ${i.status==="pending"?`<button class="btn btn-success btn-xs" data-lid="${i.id}" data-action="approved">✓</button><button class="btn btn-danger btn-xs" data-lid="${i.id}" data-action="rejected">✕</button>`:""}
        </div>
      </div>`).join(""):'<div class="empty-state">No leave requests</div>',t.querySelectorAll("[data-lid]").forEach(i=>{i.addEventListener("click",()=>{c.updateLeave(i.dataset.lid,i.dataset.action),s(),y(`Leave ${i.dataset.action}`,"ok")})})}s()}function pe(e,a){e.innerHTML=`
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
  `;function s(){const l=e.querySelector("#ann-list"),t=c.getAnnouncements().filter(i=>i.author===a.username||i.author==="admin");l.innerHTML=t.length?t.map(i=>`
      <div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${i.title}</div>
          <div class="ri-sub">${i.date} · ${i.target==="all"?"All users":"Students"}</div>
        </div>
      </div>`).join(""):'<div class="empty-state">No announcements yet</div>'}s(),e.querySelector("#post-ann").addEventListener("click",()=>{const l=e.querySelector("#ann-title").value.trim(),t=e.querySelector("#ann-body").value.trim();if(!l||!t){y("Fill in title and message","err");return}c.addAnnouncement({title:l,body:t,author:a.username,target:e.querySelector("#ann-target").value}),e.querySelector("#ann-title").value="",e.querySelector("#ann-body").value="",s(),y("Announcement posted!","ok")})}const me=10.0517,be=76.329,ye=600;let N=null;function fe(e,a){e.innerHTML=`
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
  `;async function s(){e.querySelector("#verify-card").style.display="block",e.querySelector("#scan-card").style.display="none",e.querySelector("#blocked-card").style.display="none",e.querySelector("#recheck-btn").style.display="none",l("wifi","chk","Checking network connection..."),l("loc","pend","Waiting..."),await z(1e3),l("wifi","ok","Connected to CollegeNet WiFi ✓"),l("loc","chk","Getting GPS location..."),await z(1300);const n=await t();l("loc",n?"ok":"fail",n?"Inside campus boundary ✓":"Outside campus range — move closer"),n?(e.querySelector("#scan-card").style.display="block",i()):(e.querySelector("#blocked-card").style.display="block",e.querySelector("#recheck-btn").style.display="block")}function l(n,m,u){const v={pend:"·",chk:"⏳",ok:"✓",fail:"✕"},S=e.querySelector("#step-"+n);S.className="step-item "+m,S.querySelector(".step-ico").textContent=m==="pend"?n==="wifi"?"📶":"📍":v[m],S.querySelector(".step-sub").textContent=u}async function t(){return new Promise(n=>{if(!navigator.geolocation){n(!0);return}navigator.geolocation.getCurrentPosition(m=>n(de(m.coords.latitude,m.coords.longitude,me,be)<=ye),()=>n(!0),{timeout:3e3}),setTimeout(()=>n(!0),3500)})}function i(){const n=c.getSessions().filter(m=>m.active);["sess-sel","cam-sess-sel"].forEach(m=>{const u=e.querySelector("#"+m);u&&(u.innerHTML='<option value="">— Select session —</option>',n.forEach(v=>{const S=document.createElement("option");S.value=v.id,S.textContent=`${v.code} · ${v.dept} Sec ${v.cls} · Sem ${v.sem}`,u.appendChild(S)}))})}function r(n,m){var f;const u=c.getSessions().find(h=>h.id===n);if(!u)return y("Session not found","err"),!1;if(!u.active)return y("Session has ended","err"),!1;if(m!==u.currentToken)return c.addProxy({student:a.name,roll:a.roll||a.username,session:u.code,time:L(),reason:"Invalid or expired QR token"}),y("Invalid or expired token","err"),!1;if(u.attendance[a.username])return y("Already marked for this session","err"),!1;const v=Date.now();if((f=u.scanTimes)!=null&&f[a.username]&&v-u.scanTimes[a.username]<3e3)return c.addProxy({student:a.name,roll:a.roll||a.username,session:u.code,time:L(),reason:"Rapid re-scan detected"}),y("Too fast — suspicious activity flagged","err"),!1;const S=c.getSessions(),p=S.findIndex(h=>h.id===n);return S[p].attendance[a.username]={name:a.name,roll:a.roll||a.username,time:L(),sessId:n},S[p].scanTimes||(S[p].scanTimes={}),S[p].scanTimes[a.username]=v,localStorage.setItem("ax_sessions",JSON.stringify(S)),c.addAttendance(a.username,{code:u.code,sessId:n,date:A(),time:L(),dept:u.dept,sem:u.sem}),o(a),e.querySelector("#manual-section").style.display="none",e.querySelector("#cam-section").style.display="none",e.querySelector("#att-success").style.display="block",e.querySelector("#att-success-detail").textContent=`${u.code} · ${u.dept} · ${L()}`,d(),y("Attendance marked!","ok"),!0}function o(n){const m=c.getStudentAttendance(n.username),u=c.getSessions().filter(p=>!p.active),v={};u.forEach(p=>{v[p.code]||(v[p.code]={total:0,present:0}),v[p.code].total++}),m.forEach(p=>{v[p.code]&&v[p.code].present++});const S=Object.entries(v).filter(([,p])=>p.total>0&&p.present/p.total*100<75);if(S.length&&!c.getAlerts().find(f=>f.studentUsername===n.username&&Date.now()-f.ts<36e5)){const h=(c.getUser(n.username)||{}).parentEmail||"";c.addAlert({studentUsername:n.username,student:n.name,roll:n.roll||n.username,parentEmail:h||"Not set",subjects:S.map(([E])=>E).join(", "),ts:Date.now(),time:L(),date:A()}),y(h?`⚠ Alert sent to ${h}`:"⚠ Parent email not set — update profile","warn")}}function d(){N&&(N.getTracks().forEach(m=>m.stop()),N=null);const n=e.querySelector("#cam-video");n&&(n.srcObject=null)}e.querySelector("#cam-btn").addEventListener("click",async()=>{e.querySelector("#cam-section").style.display="block",e.querySelector("#manual-section").style.display="none",e.querySelector("#att-success").style.display="none",i();try{const n=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});N=n,e.querySelector("#cam-video").srcObject=n,y("Camera started","ok")}catch{y("Camera unavailable — use manual mode","err")}}),e.querySelector("#manual-btn").addEventListener("click",()=>{e.querySelector("#manual-section").style.display="block",e.querySelector("#cam-section").style.display="none",e.querySelector("#att-success").style.display="none",d(),i()}),e.querySelector("#stop-cam-btn").addEventListener("click",()=>{d(),e.querySelector("#cam-section").style.display="none"}),e.querySelector("#simulate-scan").addEventListener("click",()=>{const n=e.querySelector("#cam-sess-sel").value;if(!n){y("Select a session first","err");return}const m=c.getSessions().find(u=>u.id===n);if(!(m!=null&&m.currentToken)){y("No active token","err");return}r(n,m.currentToken)}),e.querySelector("#mark-btn").addEventListener("click",()=>{r(e.querySelector("#sess-sel").value,e.querySelector("#qr-in").value.trim())}),e.querySelector("#scan-again-btn").addEventListener("click",()=>{e.querySelector("#att-success").style.display="none",i()}),e.querySelector("#retry-btn").addEventListener("click",s),e.querySelector("#recheck-btn").addEventListener("click",s),s()}function Se(e,a){const s=c.getStudentAttendance(a.username),l=c.getSessions().filter(o=>!o.active),t={};l.forEach(o=>{t[o.code]||(t[o.code]={total:0,present:0,name:o.name||o.code,dept:o.dept,sem:o.sem}),t[o.code].total++}),s.forEach(o=>{t[o.code]&&t[o.code].present++});const i=c.getAlerts().filter(o=>o.studentUsername===a.username),r=Object.values(t).some(o=>o.total>0&&o.present/o.total*100<75);e.innerHTML=`
    ${r?'<div class="alert-banner"><div class="ab-icon">⚠️</div><div><div class="ab-title">Low Attendance Warning</div><div class="ab-sub">Your attendance has dropped below 75% in one or more subjects. Your parent/guardian has been notified.</div></div></div>':""}
    <div class="g3" style="margin-bottom:16px">
      <div class="metric green"><div class="mk">Overall</div><div class="mv">${l.length?Math.round(s.length/l.length*100)+"%":"—"}</div></div>
      <div class="metric blue"><div class="mk">Classes attended</div><div class="mv">${s.length}</div></div>
      <div class="metric ${r?"red":"green"}"><div class="mk">At-risk subjects</div><div class="mv">${Object.values(t).filter(o=>o.total>0&&o.present/o.total*100<75).length}</div></div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:16px">Subject-wise Attendance</div>
      ${Object.keys(t).length?Object.entries(t).map(([o,d])=>{const n=d.total?Math.round(d.present/d.total*100):0,m=H(n),u=n<75&&d.total>0?Math.max(0,Math.ceil((.75*d.total-d.present)/.25)):0;return`<div style="margin-bottom:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <div>
              <span style="font-size:14px;font-weight:600">${o}</span>
              <span style="font-size:12px;color:var(--text2);margin-left:8px">${d.name}</span>
            </div>
            <span class="badge badge-${m==="green"?"green":m==="amber"?"amber":"red"}">${n}%</span>
          </div>
          <div style="font-size:12px;color:var(--text2);margin-bottom:5px">${d.present} / ${d.total} classes attended · Sem ${d.sem} · ${d.dept}</div>
          <div class="pbar"><div class="pbar-fill ${m}" style="width:${n}%"></div></div>
          ${u>0?`<div style="font-size:11px;color:var(--red);margin-top:4px">⚠ Need ${u} more consecutive classes to reach 75%</div>`:""}
          ${n>=75?`<div style="font-size:11px;color:var(--green);margin-top:4px">✓ Safe zone — can miss ${Math.floor((d.present-.75*d.total)/.75)} more class${Math.floor((d.present-.75*d.total)/.75)!==1?"es":""}</div>`:""}
        </div>`}).join(""):'<div class="empty-state">No attendance data yet</div>'}
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Recent Sessions</div>
      ${s.length?s.slice().reverse().slice(0,20).map(o=>`
        <div class="row-item">
          <div class="ri-main"><div class="ri-title">${o.code}</div><div class="ri-sub">${o.date} · ${o.time} · ${o.dept}</div></div>
          <span class="badge badge-green">✓ Present</span>
        </div>`).join(""):'<div class="empty-state">No records yet</div>'}
    </div>
    ${i.length?`<div class="card">
      <div class="card-title" style="margin-bottom:14px">Parent Alert Log</div>
      ${i.map(o=>`<div class="row-item">
        <div class="ri-main"><div class="ri-title">Alert sent — ${o.subjects}</div><div class="ri-sub">${o.date} · To: ${o.parentEmail}</div></div>
        <span class="badge badge-amber">Sent</span>
      </div>`).join("")}
    </div>`:""}
  `}function he(e,a){const s=[...new Set(c.getSessions().filter(t=>!t.active).map(t=>t.code))];e.innerHTML=`
    <div class="card">
      <div class="card-title" style="margin-bottom:16px">Apply for Leave</div>
      <div class="field"><label>Subject</label>
        <select id="lv-sub"><option value="">— Select subject —</option>${s.map(t=>`<option>${t}</option>`).join("")}</select>
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
  `;function l(){const t=c.getLeaves().filter(r=>r.studentUsername===a.username),i=e.querySelector("#lv-list");i.innerHTML=t.length?t.map(r=>`
      <div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${r.subject} · ${r.from} to ${r.to}</div>
          <div class="ri-sub">${r.reason}</div>
        </div>
        <span class="badge ${r.status==="approved"?"badge-green":r.status==="rejected"?"badge-red":"badge-amber"}">${r.status}</span>
      </div>`).join(""):'<div class="empty-state">No leave requests</div>'}l(),e.querySelector("#lv-submit").addEventListener("click",()=>{const t=e.querySelector("#lv-sub").value,i=e.querySelector("#lv-from").value,r=e.querySelector("#lv-to").value,o=e.querySelector("#lv-reason").value.trim();if(!t||!i||!r||!o){y("Fill all fields","err");return}c.addLeave({studentUsername:a.username,studentName:a.name,roll:a.roll||a.username,subject:t,from:i,to:r,reason:o,date:A()}),l(),y("Leave request submitted","ok"),e.querySelector("#lv-reason").value=""})}function ge(e,a){const s=c.getUser(a.username)||{};e.innerHTML=`
    <div class="card">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
        <div class="avatar av-lg av-accent">${j(a.name)}</div>
        <div>
          <div style="font-size:18px;font-weight:700">${a.name}</div>
          <div style="font-size:13px;color:var(--text2)">${s.roll||""} · ${s.dept||""} · Sem ${s.sem||""}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="field-row">
        <div class="field"><label>Full Name</label><input id="p-name" value="${s.name||""}"></div>
        <div class="field"><label>Email</label><input type="email" id="p-email" value="${s.email||""}"></div>
      </div>
      <div class="field"><label>Phone</label><input id="p-phone" value="${s.phone||""}"></div>
      <div style="font-size:13px;font-weight:600;color:var(--text2);margin-bottom:12px;margin-top:6px">Parent / Guardian Contact</div>
      <div class="field"><label>Parent Name</label><input id="p-par-name" value="${s.parentName||""}"></div>
      <div class="field-row">
        <div class="field"><label>Parent Email</label><input type="email" id="p-par-email" value="${s.parentEmail||""}"></div>
        <div class="field"><label>Parent Phone</label><input id="p-par-phone" value="${s.parentPhone||""}"></div>
      </div>
      <button class="btn btn-primary" id="save-profile-btn">💾 Save Profile</button>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Announcements</div>
      <div id="ann-list">
        ${c.getAnnouncements().filter(l=>l.target==="all"||l.target==="student").map(l=>`
          <div class="row-item">
            <div class="ri-main"><div class="ri-title">${l.title}</div><div class="ri-sub">${l.body}</div></div>
            <div style="font-size:11px;color:var(--text3);flex-shrink:0">${l.date}</div>
          </div>`).join("")||'<div class="empty-state">No announcements</div>'}
      </div>
    </div>
  `,e.querySelector("#save-profile-btn").addEventListener("click",()=>{c.saveUser(a.username,{name:e.querySelector("#p-name").value,email:e.querySelector("#p-email").value,phone:e.querySelector("#p-phone").value,parentName:e.querySelector("#p-par-name").value,parentEmail:e.querySelector("#p-par-email").value,parentPhone:e.querySelector("#p-par-phone").value}),y("Profile saved!","ok")})}function F(e,a){const s=c.getUser(a.username)||{},l=c.getTimetable().filter(i=>i.dept===s.dept&&parseInt(i.sem)===parseInt(s.sem)&&i.section===s.section),t=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">My Timetable</div><div class="card-sub">${s.dept} · Sem ${s.sem} · Sec ${s.section}</div></div>
      </div>
      ${t.map(i=>{const r=l.find(o=>o.day===i);return r?`<div style="margin-bottom:16px">
          <div style="font-size:12px;font-weight:600;color:var(--accent2);margin-bottom:8px">${i}</div>
          ${r.periods.map(o=>`<div class="row-item" style="margin-bottom:6px">
            <div style="font-family:var(--mono);font-size:12px;color:var(--text2);min-width:110px">${o.time}</div>
            <div class="ri-main"><div class="ri-title">${o.subject}</div></div>
          </div>`).join("")}
        </div>`:""}).join("")||'<div class="empty-state">No timetable available for your class</div>'}
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Upcoming Holidays</div>
      ${c.getHolidays().filter(i=>new Date(i.date)>=new Date).slice(0,5).map(i=>`
        <div class="row-item">
          <div class="ri-main"><div class="ri-title">${i.name}</div><div class="ri-sub">${i.date}</div></div>
          <span class="badge badge-blue">Holiday</span>
        </div>`).join("")||'<div class="empty-state">No upcoming holidays</div>'}
    </div>
  `}function xe(e){const a=c.getUsers(),s=c.getSessions(),l=c.getAlerts(),t=c.getProxy(),i=Object.entries(a).filter(([,v])=>v.role==="student"),r=Object.entries(a).filter(([,v])=>v.role==="teacher");let o=0,d=0,n=0;i.forEach(([v])=>{const S=c.getStudentAttendance(v),p=s.filter(h=>!h.active);o+=S.length,d+=p.length;const f={};p.forEach(h=>{f[h.code]||(f[h.code]={p:0,t:0}),f[h.code].t++}),S.forEach(h=>{f[h.code]&&f[h.code].p++}),Object.values(f).some(h=>h.t>0&&h.p/h.t*100<75)&&n++});const m=d?Math.round(o/d*100):0,u=[...new Set(Object.values(a).filter(v=>v.role==="student").map(v=>v.dept).filter(Boolean))];e.innerHTML=`
    <div class="g4" style="margin-bottom:16px">
      <div class="metric green"><div class="mk">Overall attendance</div><div class="mv">${m}%</div><div class="ms">across all classes</div></div>
      <div class="metric blue"><div class="mk">Total students</div><div class="mv">${i.length}</div></div>
      <div class="metric purple"><div class="mk">Total teachers</div><div class="mv">${r.length}</div></div>
      <div class="metric"><div class="mk">Total sessions</div><div class="mv">${s.length}</div></div>
    </div>
    <div class="g2" style="margin-bottom:16px">
      <div class="metric red"><div class="mk">Students at risk</div><div class="mv">${n}</div><div class="ms">below 75% threshold</div></div>
      <div class="metric amber"><div class="mk">Proxy flags</div><div class="mv">${t.length}</div><div class="ms">suspicious activities</div></div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:16px">Department-wise Attendance</div>
      <div class="chart-container"><canvas id="dept-chart" role="img" aria-label="Department attendance percentages">Department attendance data</canvas></div>
    </div>
    <div class="g2">
      <div class="card">
        <div class="card-title" style="margin-bottom:14px">At-Risk Students <span class="badge badge-red">${n}</span></div>
        <div id="risk-list">${Ee(i)}</div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:14px">Recent Parent Alerts</div>
        <div>${l.slice(0,5).map(v=>`
          <div class="row-item">
            <div class="ri-main"><div class="ri-title">${v.student}</div><div class="ri-sub">${v.subjects} · ${v.date}</div></div>
            <span class="badge badge-amber">Alert</span>
          </div>`).join("")||'<div class="empty-state">No alerts</div>'}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Live & Recent Sessions</div>
        <span class="badge badge-green" id="live-badge">${s.filter(v=>v.active).length} live</span>
      </div>
      <div>${s.slice().reverse().slice(0,8).map(v=>`
        <div class="row-item">
          <div class="ri-main">
            <div class="ri-title">${v.code} · ${v.dept} Sec ${v.cls} · Sem ${v.sem}</div>
            <div class="ri-sub">${v.teacher} · ${v.date} · ${Object.keys(v.attendance||{}).length} present</div>
          </div>
          <span class="badge ${v.active?"badge-green":"badge-gray"}">${v.active?"Live":"Done"}</span>
        </div>`).join("")||'<div class="empty-state">No sessions</div>'}
      </div>
    </div>
  `,setTimeout(()=>{const v=u.map(S=>{const p=i.filter(([,E])=>E.dept===S);if(!p.length)return 0;let f=0,h=0;return p.forEach(([E])=>{const q=c.getStudentAttendance(E),$=s.filter(k=>!k.active);f+=q.length,h+=$.length}),h?Math.round(f/h*100):0});window._adminChart&&window._adminChart.destroy(),window._adminChart=new Chart(document.getElementById("dept-chart"),{type:"bar",data:{labels:u.length?u:["CSE","ECE","ME","CE"],datasets:[{label:"Attendance %",data:u.length?v:[82,78,74,88],backgroundColor:["#6366f1","#22c55e","#f59e0b","#3b82f6","#ec4899","#14b8a6"].slice(0,Math.max(u.length,4)),borderRadius:8,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:0,max:100,grid:{color:"rgba(255,255,255,.05)"},ticks:{color:"#64748b",callback:S=>S+"%"}},x:{grid:{display:!1},ticks:{color:"#94a3b8"}}}}})},100)}function Ee(e){const a=e.filter(([s])=>{const l=c.getStudentAttendance(s),t=c.getSessions().filter(r=>!r.active),i={};return t.forEach(r=>{i[r.code]||(i[r.code]={p:0,t:0}),i[r.code].t++}),l.forEach(r=>{i[r.code]&&i[r.code].p++}),Object.values(i).some(r=>r.t>0&&r.p/r.t*100<75)});return a.length?a.map(([,s])=>`
    <div class="row-item">
      <div class="avatar av-sm av-red">${j(s.name)}</div>
      <div class="ri-main"><div class="ri-title">${s.name}</div><div class="ri-sub">${s.roll||""} · ${s.dept}</div></div>
      <span class="badge badge-red">At risk</span>
    </div>`).join(""):'<div class="empty-state">No at-risk students</div>'}function qe(e){e.innerHTML=`
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
          <div class="field"><label>Semester</label><select id="m-sem">${[1,2,3,4,5,6,7,8].map(d=>`<option ${d===4?"selected":""}>${d}</option>`).join("")}</select></div>
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
  `;let a=null;function s(){const d=e.querySelector("#stu-search").value.toLowerCase(),n=e.querySelector("#stu-dept-filter").value,m=c.getUsers(),u=Object.entries(m).filter(([,p])=>p.role==="student").filter(([p,f])=>{var q,$,k;const h=!d||((q=f.name)==null?void 0:q.toLowerCase().includes(d))||(($=f.roll)==null?void 0:$.toLowerCase().includes(d))||((k=f.dept)==null?void 0:k.toLowerCase().includes(d))||p.includes(d),E=!n||f.dept===n;return h&&E}),v=c.getSessions().filter(p=>!p.active),S=e.querySelector("#stu-tbody");S.innerHTML=u.map(([p,f])=>{const h=c.getStudentAttendance(p),E=v.length?Math.round(h.length/v.length*100):null,q=E==null?"gray":H(E);return`<tr>
        <td><div style="display:flex;align-items:center;gap:8px"><div class="avatar av-sm av-accent">${j(f.name)}</div>${f.name}</div></td>
        <td style="font-family:var(--mono);font-size:12px">${f.roll||""}</td>
        <td>${f.dept||""}</td>
        <td>${f.sem||""}</td>
        <td>${f.section||""}</td>
        <td><span class="badge badge-${q}">${E==null?"—":E+"%"}</span></td>
        <td><div style="font-size:12px">${f.parentName||"—"}</div><div style="font-size:11px;color:var(--text3)">${f.parentEmail||""}</div></td>
        <td><div style="display:flex;gap:6px">
          <button class="btn-icon btn-xs" data-edit="${p}" title="Edit">✏️</button>
          <button class="btn-icon btn-xs btn-danger-icon" data-del="${p}" title="Delete">🗑️</button>
          <button class="btn-icon btn-xs" data-alert="${p}" title="Send parent alert">📧</button>
        </div></td>
      </tr>`}).join("")||'<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px">No students found</td></tr>',S.querySelectorAll("[data-edit]").forEach(p=>{p.addEventListener("click",()=>{const f=c.getUser(p.dataset.edit);a=p.dataset.edit,l(f,p.dataset.edit)})}),S.querySelectorAll("[data-del]").forEach(p=>{p.addEventListener("click",()=>{confirm(`Delete student ${p.dataset.del}?`)&&(c.deleteUser(p.dataset.del),s(),y("Student deleted","ok"))})}),S.querySelectorAll("[data-alert]").forEach(p=>{p.addEventListener("click",()=>{const f=c.getUser(p.dataset.alert);c.addAlert({studentUsername:p.dataset.alert,student:f.name,roll:f.roll,parentEmail:f.parentEmail||"Not set",subjects:"Manual alert",ts:Date.now(),time:L(),date:A()}),y(`Alert queued for ${f.parentEmail||"no email set"}`,f.parentEmail?"ok":"warn")})})}function l(d={},n=null){a=n,e.querySelector("#stu-modal-title").textContent=n?"Edit Student":"Add Student",e.querySelector("#m-uname").value=n||"",e.querySelector("#m-uname").disabled=!!n,e.querySelector("#m-name").value=d.name||"",e.querySelector("#m-roll").value=d.roll||"",e.querySelector("#m-pass").value=d.password||"pass123",e.querySelector("#m-dept").value=d.dept||"CSE",e.querySelector("#m-sem").value=d.sem||4,e.querySelector("#m-sec").value=d.section||"A",e.querySelector("#m-email").value=d.email||"",e.querySelector("#m-phone").value=d.phone||"",e.querySelector("#m-pname").value=d.parentName||"",e.querySelector("#m-pemail").value=d.parentEmail||"",e.querySelector("#m-pphone").value=d.parentPhone||"",e.querySelector("#add-stu-modal").style.display="flex"}e.querySelector("#add-stu-btn").addEventListener("click",()=>l()),e.querySelector("#close-stu-modal").addEventListener("click",()=>{e.querySelector("#add-stu-modal").style.display="none"}),e.querySelector("#cancel-stu-modal").addEventListener("click",()=>{e.querySelector("#add-stu-modal").style.display="none"}),e.querySelector("#save-stu-btn").addEventListener("click",()=>{const d=e.querySelector("#m-uname").value.trim().toLowerCase().replace(/\s+/g,".");if(!d){y("Username required","err");return}const n={role:"student",name:e.querySelector("#m-name").value.trim(),roll:e.querySelector("#m-roll").value.trim(),password:e.querySelector("#m-pass").value,dept:e.querySelector("#m-dept").value,sem:parseInt(e.querySelector("#m-sem").value),section:e.querySelector("#m-sec").value.trim(),email:e.querySelector("#m-email").value.trim(),phone:e.querySelector("#m-phone").value.trim(),parentName:e.querySelector("#m-pname").value.trim(),parentEmail:e.querySelector("#m-pemail").value.trim(),parentPhone:e.querySelector("#m-pphone").value.trim()};if(a)c.saveUser(a,n),y("Student updated","ok");else{if(!c.addUser(d,n)){y("Username already exists","err");return}y("Student added","ok")}e.querySelector("#add-stu-modal").style.display="none",a=null,s()}),e.querySelector("#bulk-stu-btn").addEventListener("click",()=>{e.querySelector("#bulk-modal").style.display="flex"}),e.querySelector("#close-bulk").addEventListener("click",()=>{e.querySelector("#bulk-modal").style.display="none"}),e.querySelector("#cancel-bulk").addEventListener("click",()=>{e.querySelector("#bulk-modal").style.display="none"});const t=e.querySelector("#csv-drop"),i=e.querySelector("#csv-file");t.addEventListener("click",()=>i.click()),t.addEventListener("dragover",d=>{d.preventDefault(),t.classList.add("dragover")}),t.addEventListener("dragleave",()=>t.classList.remove("dragover")),t.addEventListener("drop",d=>{d.preventDefault(),t.classList.remove("dragover");const n=d.dataTransfer.files[0];n&&r(n)}),i.addEventListener("change",()=>{i.files[0]&&r(i.files[0])});function r(d){const n=new FileReader;n.onload=m=>{e.querySelector("#csv-paste").value=m.target.result},n.readAsText(d),y("File loaded — click Preview to review","ok")}function o(d){const n=d.trim().split(`
`).map(u=>u.split(",").map(v=>v.trim().replace(/^"|"$/g,""))),m=n[0].map(u=>u.toLowerCase().replace(/\s+/g,""));return n.slice(1).map(u=>Object.fromEntries(m.map((v,S)=>[v,u[S]||""])))}e.querySelector("#preview-bulk").addEventListener("click",()=>{const d=e.querySelector("#csv-paste").value.trim();if(!d){y("No data to preview","err");return}const n=o(d),m=e.querySelector("#bulk-preview");m.style.display="block",m.innerHTML=`<div style="font-size:12px;color:var(--text2);margin-bottom:8px">${n.length} rows detected</div>
      <div class="tbl-wrap" style="max-height:180px;overflow-y:auto"><table>
        <thead><tr>${Object.keys(n[0]||{}).map(u=>`<th>${u}</th>`).join("")}</tr></thead>
        <tbody>${n.slice(0,10).map(u=>`<tr>${Object.values(u).map(v=>`<td style="font-size:12px">${v}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>${n.length>10?`<div style="font-size:11px;color:var(--text3);margin-top:6px">...and ${n.length-10} more rows</div>`:""}`}),e.querySelector("#import-bulk").addEventListener("click",()=>{const d=e.querySelector("#csv-paste").value.trim();if(!d){y("No data to import","err");return}const n=o(d),m=c.bulkImportUsers(n);e.querySelector("#bulk-modal").style.display="none",s(),y(`Imported ${m.added} students, skipped ${m.skipped}`,"ok")}),e.querySelector("#exp-stu-btn").addEventListener("click",()=>{const d=c.getUsers(),n=Object.entries(d).filter(([,m])=>m.role==="student").map(([m,u])=>({username:m,name:u.name,roll:u.roll,dept:u.dept,semester:u.sem,section:u.section,email:u.email,phone:u.phone,parentName:u.parentName,parentEmail:u.parentEmail,parentPhone:u.parentPhone}));w(n,"students.csv")}),e.querySelector("#stu-search").addEventListener("input",s),e.querySelector("#stu-dept-filter").addEventListener("change",s),s()}function $e(e){e.innerHTML=`
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
  `;let a=null;function s(){const t=e.querySelector("#tch-search").value.toLowerCase(),i=c.getSessions(),r=Object.entries(c.getUsers()).filter(([,o])=>o.role==="teacher").filter(([o,d])=>{var n,m;return!t||((n=d.name)==null?void 0:n.toLowerCase().includes(t))||((m=d.dept)==null?void 0:m.toLowerCase().includes(t))||o.includes(t)});e.querySelector("#tch-tbody").innerHTML=r.map(([o,d])=>{const n=i.filter(m=>m.teacherUsername===o).length;return`<tr>
        <td><div style="display:flex;align-items:center;gap:8px"><div class="avatar av-sm av-accent">${j(d.name)}</div>${d.name}</div></td>
        <td>${d.dept||""}</td>
        <td style="font-size:12px">${d.email||"—"}</td>
        <td style="font-size:12px">${(d.subjects||[]).join(", ")||"—"}</td>
        <td>${n}</td>
        <td><div style="display:flex;gap:6px">
          <button class="btn-icon btn-xs" data-edit="${o}">✏️</button>
          <button class="btn-icon btn-xs" data-del="${o}">🗑️</button>
        </div></td>
      </tr>`}).join("")||'<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:24px">No teachers found</td></tr>',e.querySelector("#tch-tbody").querySelectorAll("[data-edit]").forEach(o=>{o.addEventListener("click",()=>{const d=c.getUser(o.dataset.edit);a=o.dataset.edit,l(d,o.dataset.edit)})}),e.querySelector("#tch-tbody").querySelectorAll("[data-del]").forEach(o=>{o.addEventListener("click",()=>{confirm("Delete teacher?")&&(c.deleteUser(o.dataset.del),s(),y("Teacher deleted","ok"))})})}function l(t={},i=null){a=i,e.querySelector("#tch-modal-title").textContent=i?"Edit Teacher":"Add Teacher",e.querySelector("#t-uname").value=i||"",e.querySelector("#t-uname").disabled=!!i,e.querySelector("#t-name").value=t.name||"",e.querySelector("#t-dept").value=t.dept||"CSE",e.querySelector("#t-pass").value=t.password||"pass123",e.querySelector("#t-email").value=t.email||"",e.querySelector("#t-phone").value=t.phone||"",e.querySelector("#t-subjects").value=(t.subjects||[]).join(", "),e.querySelector("#add-tch-modal").style.display="flex"}e.querySelector("#add-tch-btn").addEventListener("click",()=>l()),e.querySelector("#close-tch-modal").addEventListener("click",()=>{e.querySelector("#add-tch-modal").style.display="none"}),e.querySelector("#cancel-tch-modal").addEventListener("click",()=>{e.querySelector("#add-tch-modal").style.display="none"}),e.querySelector("#save-tch-btn").addEventListener("click",()=>{const t=e.querySelector("#t-uname").value.trim().toLowerCase().replace(/\s+/g,".");if(!t){y("Username required","err");return}const i={role:"teacher",name:e.querySelector("#t-name").value.trim(),dept:e.querySelector("#t-dept").value,password:e.querySelector("#t-pass").value,email:e.querySelector("#t-email").value.trim(),phone:e.querySelector("#t-phone").value.trim(),subjects:e.querySelector("#t-subjects").value.split(",").map(r=>r.trim()).filter(Boolean)};if(a)c.saveUser(a,i),y("Teacher updated","ok");else{if(!c.addUser(t,i)){y("Username exists","err");return}y("Teacher added","ok")}e.querySelector("#add-tch-modal").style.display="none",a=null,s()}),e.querySelector("#exp-tch-btn").addEventListener("click",()=>{const t=Object.entries(c.getUsers()).filter(([,i])=>i.role==="teacher").map(([i,r])=>({username:i,name:r.name,dept:r.dept,email:r.email,subjects:(r.subjects||[]).join(";")}));w(t,"teachers.csv")}),e.querySelector("#tch-search").addEventListener("input",s),s()}function ke(e){const a=c.getSessions(),s=c.getUsers(),l=Object.entries(s).filter(([,d])=>d.role==="student"),t=[...new Set(a.map(d=>d.code))],i=[...new Set(l.map(([,d])=>d.dept).filter(Boolean))];e.innerHTML=`
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <select id="att-dept-f" style="padding:9px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);color:var(--text);font-size:13px">
        <option value="">All depts</option>${i.map(d=>`<option>${d}</option>`).join("")}
      </select>
      <select id="att-sub-f" style="padding:9px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r8);color:var(--text);font-size:13px">
        <option value="">All subjects</option>${t.map(d=>`<option>${d}</option>`).join("")}
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
  `;function r(){const d=e.querySelector("#att-dept-f").value,n=e.querySelector("#att-sub-f").value,m=e.querySelector("#att-thresh-f").value,u=[];return l.filter(([,v])=>!d||v.dept===d).forEach(([v,S])=>{const p=c.getStudentAttendance(v);(n?[n]:t).forEach(h=>{const E=a.filter(k=>!k.active&&k.code===h);if(!E.length)return;const q=p.filter(k=>k.code===h).length,$=Math.round(q/E.length*100);m==="below75"&&$>=75||m==="below60"&&$>=60||m==="above75"&&$<75||u.push({student:S.name,roll:S.roll||v,dept:S.dept,subject:h,present:q,total:E.length,pct:$,parentEmail:S.parentEmail||""})})}),u}function o(){const d=r();e.querySelector("#att-tbody").innerHTML=d.length?d.map(n=>`<tr>
      <td>${n.student}</td><td style="font-family:var(--mono);font-size:12px">${n.roll}</td><td>${n.dept}</td><td>${n.subject}</td>
      <td>${n.present}</td><td>${n.total}</td>
      <td><span class="badge badge-${H(n.pct)}">${n.pct}%</span></td>
      <td><span class="badge badge-${n.pct>=75?"green":n.pct>=60?"amber":"red"}">${n.pct>=75?"Safe":n.pct>=60?"Warning":"Critical"}</span></td>
    </tr>`).join(""):'<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px">No data</td></tr>'}e.querySelector("#att-exp-csv").addEventListener("click",()=>{const d=r();d.length?w(d,"attendance_report.csv"):y("No data","err")}),e.querySelector("#send-all-alerts").addEventListener("click",()=>{let d=0;l.forEach(([n,m])=>{const u=c.getStudentAttendance(n),v={};a.filter(p=>!p.active).forEach(p=>{v[p.code]||(v[p.code]={p:0,t:0}),v[p.code].t++}),u.forEach(p=>{v[p.code]&&v[p.code].p++});const S=Object.entries(v).filter(([,p])=>p.t>0&&p.p/p.t*100<75).map(([p])=>p);S.length&&(c.addAlert({studentUsername:n,student:m.name,roll:m.roll,parentEmail:m.parentEmail||"Not set",subjects:S.join(", "),ts:Date.now(),time:L(),date:A()}),d++)}),o(),y(d?`${d} parent alerts sent`:"No at-risk students",d?"ok":"info")}),["att-dept-f","att-sub-f","att-thresh-f"].forEach(d=>e.querySelector("#"+d).addEventListener("change",o)),o()}function Le(e){e.innerHTML=`
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
  `;const a=c.getSessions();function s(){const l=e.querySelector("#sess-search").value.toLowerCase(),t=a.filter(i=>{var r,o,d;return!l||((r=i.code)==null?void 0:r.toLowerCase().includes(l))||((o=i.teacher)==null?void 0:o.toLowerCase().includes(l))||((d=i.dept)==null?void 0:d.toLowerCase().includes(l))}).slice().reverse();e.querySelector("#sess-tbody").innerHTML=t.map(i=>`<tr>
      <td style="font-weight:500">${i.code}</td><td>${i.teacher}</td><td>${i.dept}</td>
      <td>Sec ${i.cls} · Sem ${i.sem}</td><td>${i.date}</td>
      <td>${Object.keys(i.attendance||{}).length}</td>
      <td><span class="badge ${i.active?"badge-green":"badge-gray"}">${i.active?"Live":"Done"}</span></td>
      <td><button class="btn btn-secondary btn-xs" data-sid="${i.id}">View</button></td>
    </tr>`).join("")||'<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px">No sessions</td></tr>',e.querySelector("#sess-tbody").querySelectorAll("[data-sid]").forEach(i=>{i.addEventListener("click",()=>{const r=a.find(d=>d.id===i.dataset.sid),o=Object.values(r.attendance||{});e.querySelector("#sess-detail-card").style.display="block",e.querySelector("#sd-title").textContent=`${r.code} · ${r.date}`,e.querySelector("#sd-body").innerHTML=`
          <div class="tbl-wrap"><table>
            <thead><tr><th>#</th><th>Student</th><th>Roll</th><th>Time</th><th>Type</th></tr></thead>
            <tbody>${o.map((d,n)=>`<tr><td>${n+1}</td><td>${d.name}</td><td>${d.roll}</td><td>${d.time}</td><td>${d.manual?"Manual":"QR"}</td></tr>`).join("")||'<tr><td colspan="5" style="text-align:center;color:var(--text3)">No attendance</td></tr>'}</tbody>
          </table></div>`,e.querySelector("#sess-detail-card").scrollIntoView({behavior:"smooth"})})})}e.querySelector("#sess-search").addEventListener("input",s),e.querySelector("#sd-close").addEventListener("click",()=>{e.querySelector("#sess-detail-card").style.display="none"}),e.querySelector("#exp-sess").addEventListener("click",()=>{const l=a.flatMap(t=>Object.values(t.attendance||{}).map(i=>({date:t.date,subject:t.code,teacher:t.teacher,dept:t.dept,section:t.cls,sem:t.sem,student:i.name,roll:i.roll,time:i.time})));l.length?w(l,"all_sessions.csv"):y("No data","err")}),s()}function we(e){var s;const a=c.getProxy();e.innerHTML=`
    <div class="card">
      <div class="card-header"><div class="card-title">Suspicious Activity Log <span class="badge badge-red">${a.length}</span></div><button class="btn btn-secondary btn-sm" id="exp-proxy">📥 Export</button></div>
      ${a.length?`<div class="tbl-wrap"><table>
        <thead><tr><th>Student</th><th>Roll</th><th>Session</th><th>Time</th><th>Reason</th></tr></thead>
        <tbody>${a.map(l=>`<tr><td>${l.student}</td><td style="font-family:var(--mono);font-size:12px">${l.roll}</td><td>${l.session}</td><td>${l.time}</td><td><span class="badge badge-red">${l.reason}</span></td></tr>`).join("")}</tbody>
      </table></div>`:'<div class="empty-state">No suspicious activity detected</div>'}
    </div>
  `,(s=e.querySelector("#exp-proxy"))==null||s.addEventListener("click",()=>{a.length?w(a,"proxy_log.csv"):y("No data","err")})}function Ae(e){var s;const a=c.getAlerts();e.innerHTML=`
    <div class="card">
      <div class="card-header"><div class="card-title">Parent Alert History <span class="badge badge-amber">${a.length}</span></div><button class="btn btn-secondary btn-sm" id="exp-alerts">📥 Export</button></div>
      ${a.length?`<div class="tbl-wrap"><table>
        <thead><tr><th>Student</th><th>Roll</th><th>Parent Email</th><th>Subjects</th><th>Date</th></tr></thead>
        <tbody>${a.map(l=>`<tr><td>${l.student}</td><td style="font-family:var(--mono);font-size:12px">${l.roll}</td><td>${l.parentEmail}</td><td>${l.subjects}</td><td>${l.date}</td></tr>`).join("")}</tbody>
      </table></div>`:'<div class="empty-state">No alerts sent yet</div>'}
    </div>
  `,(s=e.querySelector("#exp-alerts"))==null||s.addEventListener("click",()=>{a.length?w(a.map(l=>({student:l.student,roll:l.roll,parentEmail:l.parentEmail,subjects:l.subjects,date:l.date})),"parent_alerts.csv"):y("No data","err")})}function R(e){const a=c.getTimetable();e.innerHTML=`
    <div class="card">
      <div class="card-header"><div class="card-title">Timetable Manager</div><button class="btn btn-secondary btn-sm" id="exp-tt">📥 Export JSON</button></div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:12px">Timetable entries: ${a.length}</div>
      ${a.map((s,l)=>`<div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${s.dept} · Sem ${s.sem} · Sec ${s.section} · ${s.day}</div>
          <div class="ri-sub">${s.periods.map(t=>`${t.time}: ${t.subject}`).join(" | ")}</div>
        </div>
        <button class="btn btn-danger btn-xs" data-del="${l}">✕</button>
      </div>`).join("")||'<div class="empty-state">No timetable data</div>'}
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">Add Timetable Entry</div>
      <div class="field-row">
        <div class="field"><label>Dept</label><select id="tt-dept"><option>CSE</option><option>ECE</option><option>ME</option><option>CE</option><option>IT</option></select></div>
        <div class="field"><label>Semester</label><select id="tt-sem">${[1,2,3,4,5,6,7,8].map(s=>`<option ${s===4?"selected":""}>${s}</option>`).join("")}</select></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Section</label><input id="tt-sec" value="A"></div>
        <div class="field"><label>Day</label><select id="tt-day"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option></select></div>
      </div>
      <div class="field"><label>Period (format: 09:00-10:00|CS301|prof.sharma)</label><input id="tt-period" placeholder="09:00-10:00|CS301|prof.sharma"></div>
      <button class="btn btn-primary" id="add-tt-btn">Add Entry</button>
    </div>
  `,e.querySelectorAll("[data-del]").forEach(s=>{s.addEventListener("click",()=>{const l=c.getTimetable();l.splice(parseInt(s.dataset.del),1),c.saveTimetable(l),R(e),y("Entry removed","ok")})}),e.querySelector("#add-tt-btn").addEventListener("click",()=>{const s=e.querySelector("#tt-period").value.split("|");if(s.length<2){y("Invalid period format","err");return}const l={dept:e.querySelector("#tt-dept").value,sem:e.querySelector("#tt-sem").value,section:e.querySelector("#tt-sec").value,day:e.querySelector("#tt-day").value,periods:[{time:s[0],subject:s[1],teacher:s[2]||""}]},t=c.getTimetable();t.push(l),c.saveTimetable(t),R(e),y("Entry added","ok")}),e.querySelector("#exp-tt").addEventListener("click",()=>M(c.getTimetable(),"timetable.json"))}function V(e){e.innerHTML=`
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
  `;function a(){const s=c.getHolidays().sort((l,t)=>l.date.localeCompare(t.date));e.querySelector("#hol-list").innerHTML=s.length?s.map(l=>`
      <div class="row-item">
        <div class="ri-main"><div class="ri-title">${l.name}</div><div class="ri-sub">${l.date}</div></div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge ${new Date(l.date)>=new Date?"badge-blue":"badge-gray"}">${new Date(l.date)>=new Date?"Upcoming":"Past"}</span>
          <button class="btn btn-danger btn-xs" data-date="${l.date}">✕</button>
        </div>
      </div>`).join(""):'<div class="empty-state">No holidays configured</div>',e.querySelector("#hol-list").querySelectorAll("[data-date]").forEach(l=>{l.addEventListener("click",()=>{c.removeHoliday(l.dataset.date),a(),y("Holiday removed","ok")})})}a(),e.querySelector("#add-hol-btn").addEventListener("click",()=>{const s=e.querySelector("#hol-date").value,l=e.querySelector("#hol-name").value.trim();if(!s||!l){y("Fill date and name","err");return}c.addHoliday({date:s,name:l}),a(),e.querySelector("#hol-name").value="",y("Holiday added","ok")})}function B(e){e.innerHTML=`
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
  `;function a(){const s=e.querySelector("#ann-list"),l=c.getAnnouncements();s.innerHTML=l.length?l.map(t=>`
      <div class="row-item">
        <div class="ri-main">
          <div class="ri-title">${t.title}</div>
          <div class="ri-sub">${t.body.substring(0,80)}${t.body.length>80?"...":""}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${t.date} · ${t.target==="all"?"All users":t.target}</div>
        </div>
        <button class="btn btn-danger btn-xs" data-id="${t.id}">✕</button>
      </div>`).join(""):'<div class="empty-state">No announcements</div>',s.querySelectorAll("[data-id]").forEach(t=>{t.addEventListener("click",()=>{c.deleteAnnouncement(t.dataset.id),a(),y("Announcement deleted","ok")})})}a(),e.querySelector("#post-ann-btn").addEventListener("click",()=>{const s=e.querySelector("#a-title").value.trim(),l=e.querySelector("#a-body").value.trim();if(!s||!l){y("Fill title and message","err");return}c.addAnnouncement({title:s,body:l,author:"admin",target:e.querySelector("#a-target").value}),e.querySelector("#a-title").value="",e.querySelector("#a-body").value="",a(),y("Announcement posted!","ok")})}function Te(e){e.innerHTML=`
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
  `,e.querySelector("#save-settings").addEventListener("click",()=>y("Settings saved (demo)","ok")),e.querySelector("#reset-att").addEventListener("click",()=>{confirm("Reset ALL attendance data? This cannot be undone.")&&(localStorage.removeItem("ax_attendance"),localStorage.removeItem("ax_alerts"),localStorage.removeItem("ax_proxy"),y("Attendance reset","ok"))}),e.querySelector("#reset-all").addEventListener("click",()=>{confirm("Factory reset? ALL data will be wiped and defaults restored.")&&(c.resetAll(),y("Reset complete","ok"))}),e.querySelector("#exp-all-csv").addEventListener("click",()=>{const a=c.getSessions().flatMap(s=>Object.values(s.attendance||{}).map(l=>({date:s.date,subject:s.code,dept:s.dept,section:s.cls,teacher:s.teacher,student:l.name,roll:l.roll,time:l.time})));a.length?w(a,"all_attendance.csv"):y("No data","err")}),e.querySelector("#exp-users-json").addEventListener("click",()=>M(c.getUsers(),"users.json")),e.querySelector("#exp-sessions-json").addEventListener("click",()=>M(c.getSessions(),"sessions.json"))}const W=document.getElementById("app");function O(e){W.innerHTML="",W.appendChild(e)}function Ce(){const e=c.getCurrentUser();if(e)I(e);else{const a=G(s=>I(s));O(a)}}function I(e){const a={teacher:[{divider:!0,label:"Attendance",items:[{key:"session",icon:"▶",label:"Session Manager"},{key:"records",icon:"📋",label:"Records"},{key:"leaves",icon:"📄",label:"Leave Requests"}]},{divider:!0,label:"Communication",items:[{key:"announcements",icon:"📢",label:"Announcements"}]}],student:[{divider:!0,label:"Attendance",items:[{key:"scan",icon:"📷",label:"Scan QR"},{key:"myattendance",icon:"📊",label:"My Attendance"},{key:"leaves",icon:"📄",label:"Leave Request"},{key:"timetable",icon:"🗓",label:"Timetable"}]},{divider:!0,label:"Account",items:[{key:"profile",icon:"👤",label:"Profile & Parents"}]}],admin:[{divider:!0,label:"Overview",items:[{key:"dashboard",icon:"📊",label:"Dashboard"}]},{divider:!0,label:"People",items:[{key:"students",icon:"👨‍🎓",label:"Students"},{key:"teachers",icon:"👨‍🏫",label:"Teachers"}]},{divider:!0,label:"Attendance",items:[{key:"attendance",icon:"✅",label:"Attendance Report"},{key:"sessions",icon:"⏱",label:"All Sessions"}]},{divider:!0,label:"Monitoring",items:[{key:"alerts",icon:"📧",label:"Parent Alerts"},{key:"proxy",icon:"🚨",label:"Proxy Log"}]},{divider:!0,label:"Administration",items:[{key:"timetable",icon:"🗓",label:"Timetable"},{key:"holidays",icon:"🏖",label:"Holidays"},{key:"announcements",icon:"📢",label:"Announcements"},{key:"settings",icon:"⚙️",label:"Settings"}]}]},s={session:t=>re(t,e),records:t=>ve(t,e),leaves:t=>e.role==="teacher"?ue(t,e):he(t,e),announcements:t=>pe(t,e),scan:t=>fe(t,e),myattendance:t=>Se(t,e),timetable:t=>F(t,e),profile:t=>ge(t,e),dashboard:t=>xe(t),students:t=>qe(t),teachers:t=>$e(t),attendance:t=>ke(t),sessions:t=>Le(t),alerts:t=>Ae(t),proxy:t=>we(t),adminleaves:t=>{t.innerHTML='<div class="empty-state">Leave management coming soon</div>'},admintt:t=>R(t),adminhols:t=>V(t),adminann:t=>B(t)};s.timetable=s.timetable||(t=>F(t,e)),e.role==="admin"&&(s.timetable=t=>R(t),s.holidays=t=>V(t),s.announcements=t=>B(t),s.settings=t=>Te(t));const l=oe(e,a[e.role]||a.student,(t,i)=>{i.innerHTML="";const r=s[t];r?r(i):i.innerHTML=`<div class="empty-state">Page "${t}" not found</div>`},()=>{O(G(t=>I(t)))});O(l)}Ce();
