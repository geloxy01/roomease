import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API = "http://localhost/RoomEase/api";

async function api(endpoint, method = "GET", body = null) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}/${endpoint}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}
function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function today() {
  return new Date().toISOString().split("T")[0];
}
function dayFromDate(s) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][new Date(s + "T00:00:00").getDay()];
}

const Icon = {
  home: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  calendar: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  grid: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  users: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  report: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  user: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  lock: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  logout: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  chevron: (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  plus: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  book: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  search: (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  spinner: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  ),
};

function Spinner() {
  return <div className="spinner-wrap">{Icon.spinner} Loading…</div>;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const nav = (p) => setPage(p);
  const login = (u) => {
    setUser(u);
    setPage(u.role === "admin" ? "admin_dashboard" : "dashboard");
  };
  const logout = () => {
    setUser(null);
    setPage("home");
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s, u] = await Promise.all([
        api("classrooms.php"),
        api("schedules.php"),
        api("users.php"),
      ]);
      setClassrooms(c);
      setSchedules(s);
      setUsers(u);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadAll();
  }, [user, loadAll]);

  const props = {
    page,
    nav,
    user,
    login,
    logout,
    classrooms,
    setClassrooms,
    schedules,
    setSchedules,
    users,
    setUsers,
    loadAll,
    loading,
  };

  if (!user)
    return (
      <div className="app-root">
        {page === "home" && <LandingPage {...props} />}
        {page === "login" && <LoginPage {...props} />}
        {page === "register" && <RegisterPage {...props} />}
        {page === "register_student" && <RegisterStudentPage {...props} />}
        {page === "about" && <AboutPage {...props} />}
      </div>
    );

  return (
    <div className="app-root">
      <AppShell {...props} />
    </div>
  );
}

function AppShell(props) {
  const { user, nav, logout, page } = props;
  const isAdmin = user.role === "admin";
  const isTeacher = user.role === "teacher";
  const isStudent = user.role === "student";

  const adminLinks = [
    { id: "admin_dashboard", label: "Dashboard", icon: Icon.home },
    { id: "dashboard", label: "Availability", icon: Icon.grid },
    { id: "manage_classrooms", label: "Classrooms", icon: Icon.grid },
    { id: "manage_schedules", label: "Schedules", icon: Icon.calendar },
    { id: "manage_teachers", label: "Teachers", icon: Icon.users },
    { id: "reports", label: "Reports", icon: Icon.report },
  ];
  const teacherLinks = [
    { id: "dashboard", label: "Availability", icon: Icon.home },
    { id: "my_schedules", label: "My Schedules", icon: Icon.calendar },
    { id: "add_schedule", label: "Add Schedule", icon: Icon.plus },
  ];
  const studentLinks = [
    { id: "dashboard", label: "Availability", icon: Icon.home },
    { id: "all_schedules", label: "All Schedules", icon: Icon.book },
  ];

  const mainLinks = isAdmin
    ? adminLinks
    : isTeacher
      ? teacherLinks
      : studentLinks;
  const accountLinks = [
    { id: "profile", label: "Profile", icon: Icon.user },
    { id: "change_password", label: "Change Password", icon: Icon.lock },
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Room<span>Ease</span>
        </div>
        {isStudent && <div className="sidebar-role-badge">Student</div>}
        {isTeacher && (
          <div className="sidebar-role-badge sidebar-role-badge--teacher">
            Teacher
          </div>
        )}
        <div className="sidebar-section-label">Main</div>
        <ul>
          {mainLinks.map((l) => (
            <li key={l.id}>
              <button
                className={`sidebar-link${page === l.id ? " active" : ""}`}
                onClick={() => nav(l.id)}
              >
                {l.icon}
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-divider" />
        <div className="sidebar-section-label">Account</div>
        <ul>
          {accountLinks.map((l) => (
            <li key={l.id}>
              <button
                className={`sidebar-link${page === l.id ? " active" : ""}`}
                onClick={() => nav(l.id)}
              >
                {l.icon}
                <span>{l.label}</span>
              </button>
            </li>
          ))}
          <li>
            <button className="sidebar-link" onClick={logout}>
              {Icon.logout}
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </aside>
      <main className="shell-content">
        {page === "admin_dashboard" && <AdminDashboard {...props} />}
        {page === "dashboard" && <DashboardPage {...props} />}
        {page === "all_schedules" && <AllSchedulesPage {...props} />}
        {page === "manage_classrooms" && <ManageClassrooms {...props} />}
        {page === "manage_schedules" && <ManageSchedules {...props} />}
        {page === "manage_teachers" && <ManageTeachers {...props} />}
        {page === "add_schedule" && <AddSchedule {...props} />}
        {page === "my_schedules" && <MySchedules {...props} />}
        {page === "profile" && <ProfilePage {...props} />}
        {page === "change_password" && <ChangePassword {...props} />}
        {page === "reports" && <ReportsPage {...props} />}
        {page === "room_detail" && <RoomDetail {...props} />}
      </main>
    </div>
  );
}

function PublicHeader({ nav, active }) {
  return (
    <header className="pub-header">
      <div className="pub-logo" onClick={() => nav("home")}>
        Room<span>Ease</span>
      </div>
      <nav className="pub-nav">
        <button
          className={`pub-navlink${active === "home" ? " pub-navlink--active" : ""}`}
          onClick={() => nav("home")}
        >
          Home
        </button>
        <button
          className={`pub-navlink${active === "about" ? " pub-navlink--active" : ""}`}
          onClick={() => nav("about")}
        >
          About
        </button>
        <button
          className={`pub-navlink${active === "login" ? " pub-navlink--active" : ""}`}
          onClick={() => nav("login")}
        >
          Login
        </button>
        <div className="pub-register-group">
          <button className="pub-cta" onClick={() => nav("register")}>
            Teacher Register
          </button>
          <button
            className="pub-cta pub-cta--student"
            onClick={() => nav("register_student")}
          >
            Student Register
          </button>
        </div>
      </nav>
    </header>
  );
}

function LandingPage({ nav }) {
  return (
    <div className="landing">
      <PublicHeader nav={nav} active="home" />
      <section className="hero">
        <div className="hero-text">
          <div className="hero-eyebrow">
            <span className="hero-dot" />
            Live Classroom Availability
          </div>
          <h1>
            The Smarter Way to Manage <em>Classrooms</em>
          </h1>
          <p>
            RoomEase lets students, teachers, and administrators monitor room
            availability in real time, organize schedules, and eliminate
            conflicts — all from one centralized platform.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => nav("login")}>
              Login
            </button>
            <button className="btn-outline" onClick={() => nav("register")}>
              Teacher Register
            </button>
            <button
              className="btn-outline btn-outline--student"
              onClick={() => nav("register_student")}
            >
              Student Register
            </button>
          </div>
        </div>
        <div className="hero-img">
          <ClassroomIllustration />
        </div>
      </section>
      <section className="features-section">
        <h2>Built for Everyone on Campus</h2>
        <div className="feature-grid">
          {[
            {
              title: "For Students",
              desc: "Check which classrooms are free, see who's teaching where, and browse the full schedule — all in one place.",
            },
            {
              title: "For Teachers",
              desc: "Add and manage your own class schedules with automatic conflict detection across all rooms.",
            },
            {
              title: "For Admins",
              desc: "Full control over classrooms, schedules, and user accounts with a comprehensive dashboard.",
            },
            {
              title: "Real-Time Data",
              desc: "All availability checks and schedule views are pulled live from the database — always up to date.",
            },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="cta-banner">
        <div>
          <h2>
            Ready to bring <em>order</em> to your classrooms?
          </h2>
          <p>
            Create an account or log in to start managing classrooms and
            schedules today.
          </p>
        </div>
        <div className="cta-btns">
          <button className="btn-primary" onClick={() => nav("register")}>
            Teacher Register
          </button>
          <button className="btn-ghost" onClick={() => nav("register_student")}>
            Student Register
          </button>
        </div>
      </section>
      <footer className="pub-footer">
        <div className="footer-logo">
          Room<span>Ease</span>
        </div>
        <p>
          Classroom Availability & Scheduling System · ©{" "}
          {new Date().getFullYear()} RoomEase
        </p>
      </footer>
    </div>
  );
}

function LoginPage({ nav, login }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const d = await api("auth.php", "POST", { action: "login", ...form });
      login(d.user);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <PublicHeader nav={nav} active="login" />
      <div className="auth-center">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p>Sign in to access the Classroom Availability System.</p>
          {msg && <div className="alert-error">{msg}</div>}
          <form onSubmit={handle}>
            <div className="input-group">
              <label>Username</label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Enter your username"
                required
                autoFocus
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={busy}
            >
              {busy ? "Signing in…" : "Login"}
            </button>
          </form>
          <p className="auth-bottom">
            Teacher?{" "}
            <button className="link-btn" onClick={() => nav("register")}>
              Register here
            </button>
          </p>
          <p className="auth-bottom">
            Student?{" "}
            <button
              className="link-btn"
              onClick={() => nav("register_student")}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ nav }) {
  const [form, setForm] = useState({
    fullname: "",
    teacher_id: "",
    department: "",
    username: "",
    password: "",
    confirm: "",
  });
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handle = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMsg("Passwords do not match.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      await api("auth.php", "POST", { action: "register_teacher", ...form });
      setOk(true);
      setTimeout(() => nav("login"), 1800);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <PublicHeader nav={nav} active="register" />
      <div className="auth-center">
        <div className="auth-card auth-card--wide">
          <div className="auth-role-tag auth-role-tag--teacher">
            Teacher Registration
          </div>
          <h1>Create Teacher Account</h1>
          <p>Register to manage classroom schedules.</p>
          {ok && (
            <div className="alert-success">
              Registration successful! Redirecting…
            </div>
          )}
          {msg && <div className="alert-error">{msg}</div>}
          <form onSubmit={handle}>
            <div className="form-grid-2">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  value={form.fullname}
                  onChange={set("fullname")}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="input-group">
                <label>Teacher ID</label>
                <input
                  value={form.teacher_id}
                  onChange={set("teacher_id")}
                  placeholder="e.g. TCH-001"
                  required
                />
              </div>
              <div className="input-group">
                <label>Department</label>
                <input
                  value={form.department}
                  onChange={set("department")}
                  placeholder="e.g. BSIT"
                  required
                />
              </div>
              <div className="input-group">
                <label>Username</label>
                <input
                  value={form.username}
                  onChange={set("username")}
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Create password"
                  required
                />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              style={{ marginTop: 16 }}
              disabled={busy}
            >
              {busy ? "Creating…" : "Create Teacher Account"}
            </button>
          </form>
          <p className="auth-bottom">
            Already have an account?{" "}
            <button className="link-btn" onClick={() => nav("login")}>
              Login here
            </button>
          </p>
          <p className="auth-bottom">
            Are you a student?{" "}
            <button
              className="link-btn"
              onClick={() => nav("register_student")}
            >
              Register as Student
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterStudentPage({ nav }) {
  const [form, setForm] = useState({
    fullname: "",
    student_id: "",
    department: "",
    username: "",
    password: "",
    confirm: "",
  });
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handle = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMsg("Passwords do not match.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      await api("auth.php", "POST", { action: "register_student", ...form });
      setOk(true);
      setTimeout(() => nav("login"), 1800);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <PublicHeader nav={nav} active="register_student" />
      <div className="auth-center">
        <div className="auth-card auth-card--wide">
          <div className="auth-role-tag auth-role-tag--student">
            Student Registration
          </div>
          <h1>Create Student Account</h1>
          <p>Register to check classroom availability and schedules.</p>
          {ok && (
            <div className="alert-success">
              Registration successful! Redirecting…
            </div>
          )}
          {msg && <div className="alert-error">{msg}</div>}
          <form onSubmit={handle}>
            <div className="form-grid-2">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  value={form.fullname}
                  onChange={set("fullname")}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="input-group">
                <label>Student ID</label>
                <input
                  value={form.student_id}
                  onChange={set("student_id")}
                  placeholder="e.g. STU-2024-001"
                  required
                />
              </div>
              <div className="input-group">
                <label>Department / Course</label>
                <input
                  value={form.department}
                  onChange={set("department")}
                  placeholder="e.g. BSIT"
                  required
                />
              </div>
              <div className="input-group">
                <label>Username</label>
                <input
                  value={form.username}
                  onChange={set("username")}
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Create password"
                  required
                />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary-student w-full"
              style={{ marginTop: 16 }}
              disabled={busy}
            >
              {busy ? "Creating…" : "Create Student Account"}
            </button>
          </form>
          <p className="auth-bottom">
            Already have an account?{" "}
            <button className="link-btn" onClick={() => nav("login")}>
              Login here
            </button>
          </p>
          <p className="auth-bottom">
            Are you a teacher?{" "}
            <button className="link-btn" onClick={() => nav("register")}>
              Register as Teacher
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function AboutPage({ nav }) {
  return (
    <div className="landing">
      <PublicHeader nav={nav} active="about" />
      <section className="page-section">
        <div className="page-title">
          <h1>About RoomEase</h1>
          <p>A Classroom Availability and Scheduling Management System</p>
        </div>
        <div className="form-card" style={{ maxWidth: 860 }}>
          <h2>System Overview</h2>
          <p
            className="muted"
            style={{ lineHeight: 1.8, margin: "16px 0 28px" }}
          >
            RoomEase is a web-based Classroom Availability and Scheduling
            Management System built to simplify room scheduling within
            educational institutions. It serves three types of users: Admins,
            Teachers, and Students.
          </p>
          <h2 style={{ marginBottom: 14 }}>User Roles</h2>
          <div className="role-cards">
            {[
              {
                role: "Admin",
                color: "var(--orange)",
                desc: "Full system access. Manages classrooms, schedules, teacher accounts, and generates reports.",
              },
              {
                role: "Teacher",
                color: "var(--green)",
                desc: "Creates and manages their own class schedules. Can check room availability.",
              },
              {
                role: "Student",
                color: "#3b82f6",
                desc: "View-only access. Can check which rooms are available and view all classroom schedules.",
              },
            ].map((r) => (
              <div
                key={r.role}
                className="role-card"
                style={{ borderTop: `4px solid ${r.color}` }}
              >
                <strong style={{ color: r.color }}>{r.role}</strong>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
          <h2 style={{ marginTop: 28, marginBottom: 14 }}>Tech Stack</h2>
          <div className="stack-tags">
            {["React", "PHP", "MySQL", "Vite", "XAMPP", "CSS3"].map((s) => (
              <span key={s} className="stack-tag">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>
      <footer className="pub-footer">
        <div className="footer-logo">
          Room<span>Ease</span>
        </div>
        <p>© {new Date().getFullYear()} RoomEase. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

function AdminDashboard({ user, nav, schedules, classrooms, users, loading }) {
  const recent = [...schedules].reverse().slice(0, 8);
  return (
    <TopHeader
      title="Dashboard"
      subtitle={`Welcome back, ${user.fullname}`}
      user={user}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="stat-row">
            {[
              {
                label: "Classrooms",
                value: classrooms.length,
                page: "manage_classrooms",
              },
              {
                label: "Schedules",
                value: schedules.length,
                page: "manage_schedules",
              },
              {
                label: "Teachers",
                value: users.filter((u) => u.role === "teacher").length,
                page: "manage_teachers",
              },
              {
                label: "Students",
                value: users.filter((u) => u.role === "student").length,
                page: "manage_teachers",
              },
            ].map((s) => (
              <button
                key={s.label}
                className="stat-box"
                onClick={() => nav(s.page)}
              >
                <div className="stat-box-num">{s.value}</div>
                <div className="stat-box-label">{s.label}</div>
              </button>
            ))}
          </div>
          <div className="action-grid">
            {[
              {
                label: "Facilities",
                title: "Classrooms",
                desc: "Add, edit, and remove classroom records.",
                page: "manage_classrooms",
              },
              {
                label: "Planning",
                title: "Schedules",
                desc: "View and manage all classroom schedules.",
                page: "manage_schedules",
              },
              {
                label: "Personnel",
                title: "Teachers",
                desc: "View registered teacher and student accounts.",
                page: "manage_teachers",
              },
              {
                label: "Analytics",
                title: "Reports",
                desc: "Print and review classroom utilization.",
                page: "reports",
              },
            ].map((c) => (
              <button
                key={c.title}
                className="action-card"
                onClick={() => nav(c.page)}
              >
                <div className="action-label">{c.label}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </button>
            ))}
          </div>
          <div className="section-header">
            <h2>Recent Schedules</h2>
            <p>Latest entries in the system</p>
          </div>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Room</th>
                  <th>Subject</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty-cell">
                      No schedules yet.
                    </td>
                  </tr>
                )}
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td>{r.teacher_name}</td>
                    <td>{r.room_name}</td>
                    <td>{r.subject}</td>
                    <td>{formatDate(r.schedule_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </TopHeader>
  );
}

function DashboardPage({ user, classrooms, schedules, nav, loading }) {
  const [form, setForm] = useState({ date: "", day: "Monday", time: "" });
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const isStudent = user.role === "student";

  const check = (e) => {
    e.preventDefault();
    const result = {};
    classrooms.forEach((room) => {
      const match = schedules.find(
        (s) =>
          s.classroom_id == room.id &&
          s.day === form.day &&
          form.time >= s.start_time &&
          form.time < s.end_time,
      );
      result[room.id] = match || null;
    });
    setStatus(result);
    setChecked(true);
  };

  if (selectedRoom)
    return (
      <RoomDetail
        user={user}
        nav={nav}
        classrooms={classrooms}
        schedules={schedules}
        roomId={selectedRoom}
        onBack={() => setSelectedRoom(null)}
      />
    );

  return (
    <TopHeader
      title={`Welcome, ${user.fullname}`}
      subtitle="Check classroom availability by selecting a date, day, and time."
      user={user}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {isStudent && (
            <div className="student-notice">
              <span>
                👋 You are logged in as a <strong>Student</strong>. You can
                check availability and view schedules. To add schedules, a
                teacher account is required.
              </span>
            </div>
          )}
          <form onSubmit={check} className="search-card">
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => {
                  const d = e.target.value;
                  setForm({
                    ...form,
                    date: d,
                    day: d ? dayFromDate(d) : "Monday",
                  });
                }}
                required
              />
            </div>
            <div className="field">
              <label>Day</label>
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
              >
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className={isStudent ? "btn-primary-student" : "btn-primary"}
              >
                Check
              </button>
            </div>
          </form>
          {classrooms.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏫</div>
              <h2>No classrooms yet</h2>
              <p>Ask the admin to add classrooms first.</p>
            </div>
          ) : (
            <div className="room-grid">
              {classrooms.map((room) => {
                const s = checked ? status[room.id] : undefined;
                return (
                  <div key={room.id} className="room-card">
                    <h2>{room.room_name}</h2>
                    {!checked && (
                      <span className="badge badge-sand">Not Checked</span>
                    )}
                    {checked && !s && (
                      <span className="badge badge-green">Available</span>
                    )}
                    {checked && s && (
                      <span className="badge badge-red">Occupied</span>
                    )}
                    {checked && !s && (
                      <p className="room-meta">No class scheduled.</p>
                    )}
                    {checked && s && (
                      <>
                        <p className="room-meta">
                          <strong>{s.subject}</strong>
                        </p>
                        <p className="room-meta">{s.teacher_name}</p>
                        <p className="room-meta-time">
                          {formatTime(s.start_time)} – {formatTime(s.end_time)}
                        </p>
                      </>
                    )}
                    {!checked && (
                      <p className="room-meta">
                        Select a date and time to check.
                      </p>
                    )}
                    <button
                      className={`view-btn${isStudent ? " view-btn--student" : ""}`}
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      View Schedule
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </TopHeader>
  );
}

function AllSchedulesPage({ user, schedules, classrooms, loading }) {
  const [search, setSearch] = useState("");
  const [filterRoom, setFilterRoom] = useState("all");
  const t = today();

  const filtered = schedules
    .filter((s) => filterRoom === "all" || s.classroom_id == filterRoom)
    .filter(
      (s) =>
        !search ||
        s.subject.toLowerCase().includes(search.toLowerCase()) ||
        s.teacher_name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort(
      (a, b) =>
        a.schedule_date.localeCompare(b.schedule_date) ||
        a.start_time.localeCompare(b.start_time),
    );

  return (
    <TopHeader
      title="All Schedules"
      subtitle="Browse all classroom schedules. You can search by subject or teacher."
      user={user}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="filter-bar">
            <div className="search-input-wrap">
              {Icon.search}
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject or teacher…"
              />
            </div>
            <select
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Rooms</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.room_name}
                </option>
              ))}
            </select>
          </div>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Room</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-cell">
                      No schedules found.
                    </td>
                  </tr>
                )}
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    style={{ opacity: r.schedule_date < t ? 0.5 : 1 }}
                  >
                    <td>
                      <strong>{formatDate(r.schedule_date)}</strong>
                      {r.schedule_date === t && (
                        <span className="today-badge">Today</span>
                      )}
                    </td>
                    <td>
                      <span className="day-badge">{r.day}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{r.subject}</td>
                    <td>{r.teacher_name}</td>
                    <td>{r.room_name}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatTime(r.start_time)} – {formatTime(r.end_time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </TopHeader>
  );
}

function RoomDetail({ user, nav, classrooms, schedules, roomId, onBack }) {
  const room = classrooms.find((r) => r.id == roomId);
  const roomSchedules = schedules
    .filter((s) => s.classroom_id == roomId)
    .sort(
      (a, b) =>
        a.schedule_date.localeCompare(b.schedule_date) ||
        a.start_time.localeCompare(b.start_time),
    );
  const t = today();
  return (
    <TopHeader
      title={room?.room_name || "Room"}
      subtitle="Classroom schedule overview."
      user={user}
    >
      <div style={{ marginBottom: 16 }}>
        <button
          className="btn-outline"
          onClick={onBack || (() => nav("dashboard"))}
        >
          ← Back
        </button>
      </div>
      <div className="table-card">
        {roomSchedules.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <h2>No schedules yet</h2>
            <p>This classroom has no schedules assigned.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Teacher</th>
                <th>Subject</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {roomSchedules.map((r) => (
                <tr
                  key={r.id}
                  style={{ opacity: r.schedule_date < t ? 0.5 : 1 }}
                >
                  <td>
                    <strong>{formatDate(r.schedule_date)}</strong>
                    {r.schedule_date === t && (
                      <span className="today-badge">Today</span>
                    )}
                  </td>
                  <td>
                    <span className="day-badge">{r.day}</span>
                  </td>
                  <td>{r.teacher_name}</td>
                  <td>{r.subject}</td>
                  <td>{formatTime(r.start_time)}</td>
                  <td>{formatTime(r.end_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </TopHeader>
  );
}

function ManageClassrooms({ user, classrooms, setClassrooms, loading }) {
  const [room, setRoom] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);
  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };
  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api("classrooms.php", "POST", { room_name: room });
      setClassrooms((p) => [...p, r]);
      flash("Classroom added.");
      setRoom("");
    } catch (err) {
      flash(err.message, "error");
    } finally {
      setBusy(false);
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Remove this classroom?")) return;
    try {
      await api("classrooms.php", "DELETE", { id });
      setClassrooms((p) => p.filter((c) => c.id !== id));
      flash("Removed.");
    } catch (err) {
      flash(err.message, "error");
    }
  };
  const saveEdit = async (id) => {
    try {
      await api("classrooms.php", "PUT", { id, room_name: editName });
      setClassrooms((p) =>
        p.map((c) => (c.id === id ? { ...c, room_name: editName } : c)),
      );
      setEditing(null);
      flash("Updated.");
    } catch (err) {
      flash(err.message, "error");
    }
  };
  return (
    <TopHeader title="Classrooms" subtitle="Manage room records." user={user}>
      {msg.text && <div className={`alert-${msg.type}`}>{msg.text}</div>}
      <div className="panel" style={{ marginBottom: 24 }}>
        <h3>Add Classroom</h3>
        <form onSubmit={add} className="form-row">
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="e.g. Room 101"
            required
          />
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Adding…" : "Add Classroom"}
          </button>
        </form>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Room Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-cell">
                    No classrooms yet.
                  </td>
                </tr>
              )}
              {classrooms.map((c, i) => (
                <tr key={c.id}>
                  <td className="muted">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>
                    {editing === c.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{
                          padding: "4px 8px",
                          border: "1.5px solid var(--sand)",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      c.room_name
                    )}
                  </td>
                  <td>
                    <span className="badge badge-green">Active</span>
                  </td>
                  <td>
                    {editing === c.id ? (
                      <>
                        <button
                          className="btn-edit"
                          onClick={() => saveEdit(c.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setEditing(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setEditing(c.id);
                            setEditName(c.room_name);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => remove(c.id)}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TopHeader>
  );
}

function ManageSchedules({ user, nav, schedules, setSchedules, loading }) {
  const t = today();
  const sorted = [...schedules].sort(
    (a, b) =>
      a.schedule_date.localeCompare(b.schedule_date) ||
      a.start_time.localeCompare(b.start_time),
  );
  const remove = async (id) => {
    if (!window.confirm("Remove?")) return;
    try {
      await api("schedules.php", "DELETE", { id });
      setSchedules((p) => p.filter((s) => s.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <TopHeader
      title="Schedules"
      subtitle="All classroom schedules."
      user={user}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <button className="btn-primary" onClick={() => nav("add_schedule")}>
          + Add Schedule
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Room</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    No schedules yet.
                  </td>
                </tr>
              )}
              {sorted.map((r) => (
                <tr
                  key={r.id}
                  style={{ opacity: r.schedule_date < t ? 0.5 : 1 }}
                >
                  <td>
                    <strong>{formatDate(r.schedule_date)}</strong>
                    {r.schedule_date === t && (
                      <span className="today-badge">Today</span>
                    )}
                  </td>
                  <td>
                    <span className="day-badge">{r.day}</span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{r.subject}</td>
                  <td>{r.teacher_name}</td>
                  <td>{r.room_name}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatTime(r.start_time)} – {formatTime(r.end_time)}
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => remove(r.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TopHeader>
  );
}

function ManageTeachers({ user, users, setUsers, loading }) {
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState("all");
  const remove = async (id) => {
    if (!window.confirm("Remove?")) return;
    try {
      await api("users.php", "DELETE", { id });
      setUsers((p) => p.filter((u) => u.id !== id));
    } catch (err) {
      setMsg(err.message);
    }
  };
  const filtered = users.filter((u) => filter === "all" || u.role === filter);
  return (
    <TopHeader
      title="Users"
      subtitle="All registered teachers and students."
      user={user}
    >
      {msg && (
        <div className="alert-error" style={{ marginBottom: 16 }}>
          {msg}
        </div>
      )}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        {["all", "teacher", "student", "admin"].map((f) => (
          <button
            key={f}
            className={`filter-tab${filter === f ? " filter-tab--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "all" ? "" : `s`}
          </button>
        ))}
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Department</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    No users found.
                  </td>
                </tr>
              )}
              {filtered.map((t, i) => (
                <tr key={t.id}>
                  <td className="muted">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{t.fullname}</td>
                  <td className="muted">{t.username}</td>
                  <td>{t.department || "—"}</td>
                  <td>
                    <span
                      className={`badge ${t.role === "admin" ? "badge-orange" : t.role === "student" ? "badge-blue" : "badge-green"}`}
                    >
                      {t.role.charAt(0).toUpperCase() + t.role.slice(1)}
                    </span>
                  </td>
                  <td>
                    {t.id !== user.id ? (
                      <button
                        className="btn-delete"
                        onClick={() => remove(t.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="muted" style={{ fontSize: 12 }}>
                        You
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TopHeader>
  );
}

function AddSchedule({ user, nav, classrooms, setSchedules }) {
  const [form, setForm] = useState({
    classroom_id: "",
    subject: "",
    schedule_date: "",
    day: "Monday",
    start_time: "",
    end_time: "",
  });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => {
    const v = e.target.value;
    if (k === "schedule_date")
      setForm((f) => ({
        ...f,
        schedule_date: v,
        day: v ? dayFromDate(v) : "Monday",
      }));
    else setForm((f) => ({ ...f, [k]: v }));
  };
  useEffect(() => {
    if (classrooms.length > 0 && !form.classroom_id)
      setForm((f) => ({ ...f, classroom_id: String(classrooms[0].id) }));
  }, [classrooms]);
  const handle = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ text: "", type: "" });
    try {
      const n = await api("schedules.php", "POST", {
        classroom_id: parseInt(form.classroom_id),
        teacher_id: user.id,
        subject: form.subject,
        schedule_date: form.schedule_date,
        day: form.day,
        start_time: form.start_time,
        end_time: form.end_time,
      });
      setSchedules((p) => [...p, n]);
      setMsg({ text: "Schedule saved!", type: "success" });
      setForm({
        classroom_id: String(classrooms[0]?.id || ""),
        subject: "",
        schedule_date: "",
        day: "Monday",
        start_time: "",
        end_time: "",
      });
    } catch (err) {
      setMsg({ text: err.message, type: "error" });
    } finally {
      setBusy(false);
    }
  };
  return (
    <TopHeader
      title="Add Schedule"
      subtitle="Create a new classroom schedule."
      user={user}
    >
      <div className="panel" style={{ maxWidth: 600 }}>
        {msg.text && (
          <div className={`alert-${msg.type}`} style={{ marginBottom: 20 }}>
            {msg.text}
          </div>
        )}
        {classrooms.length === 0 ? (
          <div className="empty-state">
            <h2>No classrooms</h2>
            <p>Admin must add classrooms first.</p>
          </div>
        ) : (
          <form onSubmit={handle}>
            <div className="input-group">
              <label>Classroom</label>
              <select
                value={form.classroom_id}
                onChange={set("classroom_id")}
                required
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.room_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Subject</label>
              <input
                value={form.subject}
                onChange={set("subject")}
                placeholder="e.g. IT301 — Web Development"
                required
              />
            </div>
            <div className="form-grid-2">
              <div className="input-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.schedule_date}
                  onChange={set("schedule_date")}
                  min={today()}
                  required
                />
                <div className="hint">Auto-sets the day.</div>
              </div>
              <div className="input-group">
                <label>Day</label>
                <select value={form.day} onChange={set("day")}>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-grid-2">
              <div className="input-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={set("start_time")}
                  required
                />
              </div>
              <div className="input-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={set("end_time")}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              style={{ padding: 15, borderRadius: 10, fontSize: 15 }}
              disabled={busy}
            >
              {busy ? "Saving…" : "Save Schedule"}
            </button>
          </form>
        )}
      </div>
    </TopHeader>
  );
}

function MySchedules({ user, nav, schedules, setSchedules, loading }) {
  const t = today();
  const mine = schedules
    .filter((s) => s.teacher_id == user.id)
    .sort(
      (a, b) =>
        a.schedule_date.localeCompare(b.schedule_date) ||
        a.start_time.localeCompare(b.start_time),
    );
  const remove = async (id) => {
    if (!window.confirm("Remove?")) return;
    try {
      await api("schedules.php", "DELETE", { id });
      setSchedules((p) => p.filter((s) => s.id !== id));
    } catch {}
  };
  return (
    <TopHeader
      title="My Schedules"
      subtitle="Your assigned classroom schedules."
      user={user}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <button className="btn-primary" onClick={() => nav("add_schedule")}>
          + Add Schedule
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Subject</th>
                <th>Room</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mine.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    No schedules yet.{" "}
                    <button
                      className="link-btn"
                      onClick={() => nav("add_schedule")}
                    >
                      Add one.
                    </button>
                  </td>
                </tr>
              )}
              {mine.map((r) => (
                <tr
                  key={r.id}
                  style={{ opacity: r.schedule_date < t ? 0.5 : 1 }}
                >
                  <td>
                    <strong>{formatDate(r.schedule_date)}</strong>
                    {r.schedule_date === t && (
                      <span className="today-badge">Today</span>
                    )}
                  </td>
                  <td>
                    <span className="day-badge">{r.day}</span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{r.subject}</td>
                  <td>{r.room_name}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatTime(r.start_time)} – {formatTime(r.end_time)}
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => remove(r.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TopHeader>
  );
}

function ProfilePage({ user, nav, schedules }) {
  const isStudent = user.role === "student";
  const total = schedules.filter((s) => s.teacher_id == user.id).length;
  return (
    <TopHeader title="" user={user}>
      <div
        className={`profile-banner${isStudent ? " profile-banner--student" : ""}`}
      >
        <div className="banner-eyebrow">Account Profile</div>
        <div className="banner-name">{user.fullname}</div>
        <div className="banner-meta">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          {user.department ? ` · ${user.department}` : ""}
        </div>
        <div className="profile-avatar-wrap">
          <div
            className={`profile-avatar-big${isStudent ? " profile-avatar-big--student" : ""}`}
          >
            {user.fullname.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
      <div className="profile-body">
        <div className="info-card">
          <div className="info-card-header">Account Details</div>
          {[
            ["Full Name", user.fullname],
            ["Username", user.username],
            [isStudent ? "Student ID" : "Teacher ID", user.teacher_id],
            ["Department", user.department],
          ]
            .filter(([, v]) => v)
            .map(([l, v]) => (
              <div key={l} className="info-row">
                <span className="info-label">{l}</span>
                <span className="info-value">{v}</span>
              </div>
            ))}
          <div className="info-row">
            <span className="info-label">Role</span>
            <span
              className={`badge ${user.role === "admin" ? "badge-orange" : user.role === "student" ? "badge-blue" : "badge-green"}`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>
        <div>
          {!isStudent && (
            <div className="stat-tile">
              <div className="stat-tile-num">{total}</div>
              <div className="stat-tile-label">Your schedules</div>
              <button
                className="stat-tile-link link-btn"
                onClick={() => nav("my_schedules")}
              >
                View all →
              </button>
            </div>
          )}
          <div className="quick-panel">
            <div className="quick-panel-header">Quick Actions</div>
            {isStudent
              ? [
                  ["Check Availability", "dashboard"],
                  ["All Schedules", "all_schedules"],
                  ["Change Password", "change_password"],
                ].map(([l, p]) => (
                  <button key={l} className="quick-link" onClick={() => nav(p)}>
                    {l} {Icon.chevron}
                  </button>
                ))
              : [
                  ["Add New Schedule", "add_schedule"],
                  ["View My Schedules", "my_schedules"],
                  ["Change Password", "change_password"],
                ].map(([l, p]) => (
                  <button key={l} className="quick-link" onClick={() => nav(p)}>
                    {l} {Icon.chevron}
                  </button>
                ))}
          </div>
        </div>
      </div>
    </TopHeader>
  );
}

function ChangePassword({ user }) {
  const [form, setForm] = useState({ current: "", newp: "", confirm: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const handle = async (e) => {
    e.preventDefault();
    if (form.newp !== form.confirm) {
      setMsg({ text: "Passwords do not match.", type: "error" });
      return;
    }
    setBusy(true);
    setMsg({ text: "", type: "" });
    try {
      await api("users.php", "PUT", {
        id: user.id,
        current_password: form.current,
        new_password: form.newp,
      });
      setMsg({ text: "Password changed!", type: "success" });
      setForm({ current: "", newp: "", confirm: "" });
    } catch (err) {
      setMsg({ text: err.message, type: "error" });
    } finally {
      setBusy(false);
    }
  };
  return (
    <TopHeader
      title="Change Password"
      subtitle="Update your account password."
      user={user}
    >
      <div className="panel" style={{ maxWidth: 480 }}>
        {msg.text && (
          <div className={`alert-${msg.type}`} style={{ marginBottom: 20 }}>
            {msg.text}
          </div>
        )}
        <form onSubmit={handle}>
          <div className="input-group">
            <label>Current Password</label>
            <input
              type="password"
              value={form.current}
              onChange={set("current")}
              required
            />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              value={form.newp}
              onChange={set("newp")}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={set("confirm")}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "Saving…" : "Change Password"}
          </button>
        </form>
      </div>
    </TopHeader>
  );
}

function ReportsPage({ user, schedules, loading }) {
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const sorted = [...schedules].sort(
    (a, b) =>
      dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) ||
      a.start_time.localeCompare(b.start_time),
  );
  return (
    <TopHeader
      title="Schedule Reports"
      subtitle="View and print all classroom schedules."
      user={user}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <button className="btn-primary" onClick={() => window.print()}>
          🖨 Print Report
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Room</th>
                <th>Day</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    No schedules available.
                  </td>
                </tr>
              )}
              {sorted.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.subject}</td>
                  <td>{r.teacher_name}</td>
                  <td>{r.room_name}</td>
                  <td>
                    <span className="day-badge">{r.day}</span>
                  </td>
                  <td>{formatDate(r.schedule_date)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatTime(r.start_time)} – {formatTime(r.end_time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TopHeader>
  );
}

function TopHeader({ title, subtitle, user, children }) {
  return (
    <div>
      <div className="top-header">
        <div>
          {title && <h1 className="page-title-text">{title}</h1>}
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {user && (
          <div className="admin-profile">
            <div
              className={`avatar${user.role === "student" ? " avatar--student" : ""}`}
            >
              {user.fullname.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="admin-name">{user.fullname}</div>
              <div className="admin-role">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>
          </div>
        )}
      </div>
      {children}
      <div className="page-footer">RoomEase · © {new Date().getFullYear()}</div>
    </div>
  );
}

function ClassroomIllustration() {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: 480, width: "100%" }}
    >
      <rect
        x="20"
        y="40"
        width="440"
        height="280"
        rx="16"
        fill="#0C5446"
        opacity=".08"
      />
      <rect
        x="40"
        y="60"
        width="400"
        height="240"
        rx="12"
        fill="white"
        stroke="#DBD0BE"
        strokeWidth="2"
      />
      <rect x="60" y="80" width="360" height="60" rx="8" fill="#0C5446" />
      <text
        x="240"
        y="117"
        textAnchor="middle"
        fill="#FCFAEE"
        fontFamily="Poppins,sans-serif"
        fontWeight="700"
        fontSize="18"
      >
        CLASSROOM SCHEDULE
      </text>
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={68 + col * 95}
            y={165 + row * 45}
            width="82"
            height="34"
            rx="6"
            fill={row === 0 && col === 1 ? "#FF6801" : "#FCFAEE"}
            stroke="#DBD0BE"
            strokeWidth="1.5"
          />
        )),
      )}
      <rect x="180" y="290" width="120" height="6" rx="3" fill="#DBD0BE" />
      <rect x="220" y="296" width="40" height="14" rx="3" fill="#DBD0BE" />
    </svg>
  );
}
