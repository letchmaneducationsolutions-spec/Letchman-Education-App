/*
EduFlow — Fullstack Teaching & Learning App
Single-file React demo + deploy guide

This single-file React component is a production-minded demo of the core UX and features requested:
- Student dashboard (personalized learning, quizzes, progress)
- Teacher dashboard (create assignments, view analytics)
- Admin area (attendance, fees stub)
- Offline support (localStorage caching demonstration)
- Auth stubs with placeholders for Firebase/Auth0 - replace with real keys
- AI tools placeholders (server endpoints) for question generation
- Accessibility and security notes included

How to use this demo:
1. This file is a self-contained React component using Tailwind classes for styling.
   It's meant to be dropped into a simple Create React App or Vite + React project
   as `src/App.jsx` (rename to .tsx if you want TypeScript).

2. Install dependencies for full project (not required to run this demo but for production):
   - react, react-dom
   - firebase (or supabase) for auth & storage
   - axios or fetch for API
   - tailwindcss (setup with PostCSS)
   - workbox or registerServiceWorker for advanced offline

3. Local run (quick):
   - npx create-vite@latest eduflow --template react
   - cd eduflow && npm install
   - replace src/App.jsx with this file, add Tailwind per their docs or use CDN in index.html for quick test
   - npm run dev

4. Deploy options (production-ready):
   - Frontend: Vercel / Netlify / Render
   - Backend: Vercel Serverless / Render / Heroku / Railway
   - Auth & DB: Firebase Auth + Firestore, Supabase, or Postgres on Railway
   - Media + Offline sync: Firebase Storage or S3 + CloudFront

Important security & production items (must configure before go-live):
- Configure HTTPS certificates (Vercel/Netlify do this automatically)
- Use a managed DB (Postgres / Firestore) and rotate credentials with environment variables
- Server-side validation & RBAC for all API endpoints
- Ensure GDPR / POPIA / COPPA compliance depending on users
- Add 2FA and rate-limiting for login routes

Demo limitations:
- This demo uses mocked data and client-side logic to illustrate functionality. Replace mocked functions with real API calls / cloud functions for production behaviour.

---

Below is the single-file React component demo.
*/

import React, { useEffect, useState, useRef } from 'react';

// Simple in-memory/mock persistence layer (replace with real backend)
const mock = {
  users: [
    { id: 's1', role: 'student', name: 'Ama', progress: 0.42, enrolled: ['math101'] },
    { id: 't1', role: 'teacher', name: 'Mr. Kgosi' },
    { id: 'a1', role: 'admin', name: 'Principal' },
  ],
  courses: [
    { id: 'math101', title: 'Mathematics 101', description: 'Foundations of algebra', lessons: 12 },
  ],
};

// Utility: simple local persistence (offline demo)
const storage = {
  get(k, fallback) {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
};

// Simple role-based component wrappers
function RequireRole({ user, role, children }){
  if(!user) return <Auth onLogin={() => {}} />;
  if(user.role !== role) return <div className="p-4">Access denied — wrong role</div>;
  return children;
}

// Minimal Auth demo (mock)
function Auth({ onLogin }){
  const [email, setEmail] = useState('ama@example.com');
  const [role, setRole] = useState('student');
  function login(){
    const user = mock.users.find(u => u.role === role) || mock.users[0];
    storage.set('eduflow_user', user);
    onLogin(user);
  }
  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Demo Sign In</h2>
      <label className="block text-sm">Email</label>
      <input className="w-full p-2 border rounded mb-3" value={email} onChange={e=>setEmail(e.target.value)} />
      <label className="block text-sm">Sign in as</label>
      <select className="w-full p-2 border rounded mb-4" value={role} onChange={e=>setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>
      <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={login}>Sign in (demo)</button>
      <p className="mt-3 text-xs text-gray-500">This is a client-side demo. Replace with Firebase Auth or similar.</p>
    </div>
  );
}

// Student dashboard: personalized learning, quick quiz, progress
function StudentDashboard({ user, onSignOut }){
  const course = mock.courses[0];
  const [progress, setProgress] = useState(user.progress ?? 0);
  useEffect(()=>{ storage.set(`progress_${user.id}`, progress); }, [progress, user.id]);

  function takeQuickQuiz(){
    // immediate feedback demo — replace with grading service
    const correct = Math.random() > 0.4;
    if(correct) setProgress(p => Math.min(1, +(p + 0.07).toFixed(2)));
    alert(correct ? 'Great! ✓ You answered correctly.' : 'Not quite — try again.');
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <div>
          <button className="mr-2 text-sm" onClick={onSignOut}>Sign out</button>
        </div>
      </div>

      <section className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold">Your learning path</h2>
        <p className="text-sm text-gray-600">Course: {course.title} — {course.description}</p>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Progress</label>
          <div className="w-full bg-gray-200 rounded h-4 mt-1 overflow-hidden">
            <div style={{width: `${progress*100}%`}} className="h-4 rounded bg-gradient-to-r from-indigo-500 to-green-400" aria-valuenow={progress*100} aria-label="progress"></div>
          </div>
          <div className="text-xs mt-1">{Math.round(progress*100)}% completed</div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Interactive lesson — Simulations</h3>
          <p className="text-sm text-gray-600">Try a short simulation that adapts difficulty to your progress.</p>
          <button className="mt-3 px-3 py-2 rounded bg-indigo-600 text-white" onClick={()=>alert('Simulation placeholder — integrate an interactive JS module or WebGL scene here.')}>Start simulation</button>
        </article>

        <article className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Quick quiz — immediate feedback</h3>
          <p className="text-sm text-gray-600">A short auto-graded quiz with instant feedback.</p>
          <button className="mt-3 px-3 py-2 rounded bg-green-600 text-white" onClick={takeQuickQuiz}>Take quiz</button>
        </article>
      </section>

      <section className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Collaborate</h3>
        <p className="text-sm text-gray-600">Join study groups and shared projects (demo links)</p>
        <div className="mt-3">
          <button className="px-3 py-2 mr-2 border rounded" onClick={()=>alert('Opens shared whiteboard — integrate an external tool like Miro or Jitsi for realtime collaboration')}>Open group board</button>
          <button className="px-3 py-2 border rounded" onClick={()=>alert('Opens chat — integrate with secure chat backend')}>Open group chat</button>
        </div>
      </section>

    </div>
  );
}

// Teacher dashboard: create assignment, view analytics, AI question generation placeholder
function TeacherDashboard({ user, onSignOut }){
  const [assignments, setAssignments] = useState(storage.get('assignments', []));
  const titleRef = useRef();
  function createAssignment(){
    const title = titleRef.current.value || `Assignment ${assignments.length+1}`;
    const ass = { id: 'a'+Date.now(), title, due: new Date(Date.now()+7*24*3600*1000).toISOString() };
    const next = [ass, ...assignments];
    setAssignments(next); storage.set('assignments', next);
    titleRef.current.value = '';
  }

  async function generateQuestions(){
    // Placeholder: replace with server-side LLM endpoint that takes curriculum & returns questions
    const sample = [{q: 'Explain 2x+3=7', a:'x=2'}, {q: 'Integrate x^2', a:'x^3/3 + C'}];
    alert('AI generated questions (demo): ' + sample.map(s=>s.q).join(' | '));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Teacher workspace — {user.name}</h1>
        <div>
          <button className="mr-2 text-sm" onClick={onSignOut}>Sign out</button>
        </div>
      </div>

      <section className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold">Create assessment</h2>
        <div className="mt-3 flex gap-2">
          <input ref={titleRef} placeholder="Assignment title" className="flex-1 p-2 border rounded" />
          <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={createAssignment}>Create</button>
        </div>
        <div className="mt-3">
          <button className="px-3 py-2 mr-2 border rounded" onClick={generateQuestions}>AI: Generate questions</button>
          <span className="text-sm text-gray-500 ml-2">(Replace with server LLM integration)</span>
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Recent assignments</h3>
        <ul className="mt-3 space-y-2">
          {assignments.length === 0 && <li className="text-sm text-gray-500">No assignments yet</li>}
          {assignments.map(a => (
            <li key={a.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-gray-500">Due {new Date(a.due).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 border rounded text-sm" onClick={()=>alert('Open submissions view (server required)')}>Submissions</button>
                <button className="px-2 py-1 border rounded text-sm" onClick={()=>{ setAssignments(prev => prev.filter(x => x.id !== a.id)); storage.set('assignments', assignments.filter(x=>x.id !== a.id)); }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}

// Admin dashboard: attendance, fees, integrations demo
function AdminDashboard({ user, onSignOut }){
  const [attendance, setAttendance] = useState(storage.get('attendance', {}));
  function mark(id){
    const copy = {...attendance}; copy[id] = !copy[id]; setAttendance(copy); storage.set('attendance', copy);
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Administrator — {user.name}</h1>
        <div>
          <button className="mr-2 text-sm" onClick={onSignOut}>Sign out</button>
        </div>
      </div>

      <section className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold">Attendance tracking</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          {mock.users.filter(u=>u.role==='student').map(s => (
            <div key={s.id} className="p-3 border rounded flex items-center justify-between">
              <div>{s.name}</div>
              <button className="px-3 py-1 border rounded" onClick={()=>mark(s.id)}>{attendance[s.id] ? 'Present' : 'Mark present'}</button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Fees & reports</h3>
        <p className="text-sm text-gray-600 mt-2">Demo exports and integrations — integrate with your SIS via secure APIs.</p>
        <div className="mt-3">
          <button className="px-3 py-2 border rounded" onClick={()=>alert('Exporting CSV — implement server-side export with DB query')}>Export attendance CSV</button>
        </div>
      </section>
    </div>
  );
}

// App shell
export default function App(){
  const [user, setUser] = useState(storage.get('eduflow_user', null));
  const [view, setView] = useState('home');

  useEffect(()=>{
    // quick service-worker registration hint for offline (demo)
    if('serviceWorker' in navigator){
      navigator.serviceWorker.getRegistrations().then(regs => {
        // no-op in demo. For production: register a worker that caches key assets and handles sync.
      });
    }
  },[]);

  function signOut(){ storage.set('eduflow_user', null); setUser(null); }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">EF</div>
            <div>
              <div className="font-semibold">EduFlow</div>
              <div className="text-xs text-gray-500">Teaching & learning platform (demo)</div>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <button className="text-sm" onClick={()=>setView('home')}>Home</button>
            <button className="text-sm" onClick={()=>setView('about')}>About</button>
            {user ? (
              <div className="text-sm px-3 py-1 border rounded">{user.name} • {user.role}</div>
            ) : (
              <button className="px-3 py-1 border rounded text-sm" onClick={()=>setView('signin')}>Sign in</button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {view === 'home' && (
          <div>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Personalized learning</h3>
                <p className="text-sm text-gray-600 mt-1">Adaptive paths, recommendations and AI-driven hints.</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Interactive content</h3>
                <p className="text-sm text-gray-600 mt-1">Multimedia lessons, games and simulations.</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Secure & accessible</h3>
                <p className="text-sm text-gray-600 mt-1">Role based access, encryption & offline access.</p>
              </div>
            </section>

            <section className="bg-white p-4 rounded shadow">
              {!user && <Auth onLogin={(u)=>{ setUser(u); setView('dashboard'); }} />}

              {user && user.role === 'student' && (
                <StudentDashboard user={user} onSignOut={signOut} />
              )}
              {user && user.role === 'teacher' && (
                <TeacherDashboard user={user} onSignOut={signOut} />
              )}
              {user && user.role === 'admin' && (
                <AdminDashboard user={user} onSignOut={signOut} />
              )}
            </section>
          </div>
        )}

        {view === 'signin' && <Auth onLogin={(u)=>{ setUser(u); setView('dashboard'); }} />}

        {view === 'about' && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">About this demo</h2>
            <p className="mt-3 text-sm text-gray-600">This demonstration showcases the UX and core flows for students, teachers and admins. For production please connect the following:</p>
            <ul className="list-disc pl-6 mt-3 text-sm text-gray-600">
              <li>Authentication: Firebase Auth, Auth0, or OIDC provider — implement 2FA.</li>
              <li>Database: Firestore, Postgres (supabase/railway) with server-side APIs and RBAC.</li>
              <li>Media: Cloud storage (Firebase Storage / S3) and CDN for streaming & offline sync.</li>
              <li>LLM & AI: Server-side LLM endpoints (OpenAI/GPT or local) for question generation and personalization — keep keys server-side.</li>
              <li>Security: Enforce HTTPS, encrypt server-side at rest, implement access tokens and role checks.</li>
            </ul>

            <h3 className="mt-4 font-semibold">Deploy quickly</h3>
            <p className="text-sm text-gray-600">1) Create GitHub repo & push code. 2) Create Vercel project and connect the repo. 3) Add environment variables (FIREBASE_API_KEY etc.). 4) Set up backend serverless functions for AI / grading endpoints.</p>
          </div>
        )}
      </main>

      <footer className="bg-white mt-8 py-4 text-center text-sm text-gray-500">EduFlow © {new Date().getFullYear()} — Demo only</footer>
    </div>
  );
}
