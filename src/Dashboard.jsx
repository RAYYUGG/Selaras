import { useState, useEffect } from "react";
import {
  LayoutDashboard, CalendarDays, Activity, BrainCircuit,
  ListChecks, Coffee, Settings, Bell, Plus, ArrowUpRight,
  ArrowRight, Clock3, Check, ChevronRight, Sparkles,
  Menu, X, Search, Heart, TrendingUp, Send, LogOut, Loader2
} from "lucide-react";
import { supabase } from "./supabaseClient";
import "./dashboard.css"; // Menggunakan file CSS kustom terpisah

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Planner", icon: CalendarDays },
  { label: "Daily Check-in", icon: Heart },
  { label: "My Insights", icon: Activity },
  { label: "Action Center", icon: ListChecks },
  { label: "Ruang Jeda", icon: Coffee },
];

export default function Dashboard({ session, onLogout }) {
  const [active, setActive] = useState("Overview");
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Form State untuk Tambah Tugas Baru
  const [taskName, setTaskName] = useState("");
  const [taskCategory, setTaskCategory] = useState("Programming");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [submittingTask, setSubmittingTask] = useState(false);

  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState("");
  const greeting = "Good morning";

  // Ambil data tugas dari Supabase saat komponen dimuat
  useEffect(() => {
    fetchTasks();
  }, [session]);

  async function fetchTasks() {
    try {
      setLoadingTasks(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error("Gagal memuat tugas:", err.message);
    } finally {
      setLoadingTasks(false);
    }
  }

  // Ubah status selesai / belum selesai (Update ke Supabase)
  async function toggleTask(id, currentDone) {
    try {
      const updatedStatus = !currentDone;
      // Optimistic UI update
      setTasks(old => old.map(t => t.id === id ? { ...t, done: updatedStatus } : t));

      const { error } = await supabase
        .from("tasks")
        .update({ done: updatedStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Gagal memperbarui status tugas:", err.message);
      fetchTasks(); // Rollback jika gagal
    }
  }

  // Tambah tugas baru ke Supabase
  async function addTask(e) {
    e.preventDefault();
    if (!taskName.trim() || !session) return;

    try {
      setSubmittingTask(true);
      const newTask = {
        user_id: session.user.id,
        title: taskName.trim(),
        category: taskCategory,
        time: "09:00",
        priority: taskPriority,
        done: false
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert([newTask])
        .select();

      if (error) throw error;

      if (data) {
        setTasks(old => [data[0], ...old]);
      }

      setTaskName("");
      setShowModal(false);
    } catch (err) {
      console.error("Gagal menambah tugas:", err.message);
      alert("Terjadi kesalahan saat menyimpan tugas.");
    } finally {
      setSubmittingTask(false);
    }
  }

  const completed = tasks.filter(t => t.done).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date());

  return (
    <div className="dashboard-root">
      {/* Background atmosphere glow */}
      <div className="dashboard-atmosphere">
        <div className="glow-1" />
        <div className="glow-2" />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dash-brand">
          <div className="dash-brand-icon">
            <Activity size={20} />
          </div>
          <div>
            <h1>SELARAS</h1>
            <p>Beyond productivity</p>
          </div>
        </div>

        <p className="dash-nav-title">Workspace</p>

        <nav className="dash-nav-list">
          {navigation.map(item => {
            const Icon = item.icon;
            const selected = active === item.label;

            return (
              <button
                key={item.label}
                onClick={() => {
                  setActive(item.label);
                  setSidebarOpen(false);
                }}
                className={`dash-nav-item ${selected ? "active" : ""}`}
              >
                {selected && <span className="dash-nav-indicator" />}
                <Icon size={18} />
                <span>{item.label}</span>
                {selected && <ChevronRight className="ml-auto text-blue-600" size={15} />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-slate-200">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-600 hover:bg-rose-50 transition font-medium"
          >
            <LogOut size={18} /> Keluar (Logout)
          </button>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-900">
              {session?.user?.email ? session.user.email[0].toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">{session?.user?.email || "User Account"}</p>
              <p className="text-[11px] text-slate-500">Connected to Supabase</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button className="lg:hidden text-slate-700 p-1" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <p>Your workspace</p>
              <p>{active}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 shadow-sm">
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
              {session?.user?.email ? session.user.email[0].toUpperCase() : "U"}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1450px] space-y-8 p-5 md:p-9">
          <section className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">{date}</p>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight md:text-4xl">
                {greeting}, <span className="text-blue-600">{session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || "there"}</span>.
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Make room for what matters today.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="group flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 hover:translate-y-[-1px]"
            >
              <Plus size={17} /> New activity
            </button>
          </section>

          {/* Overview metrics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Total activities" value={String(tasks.length).padStart(2, "0")} note="In your database" icon={CalendarDays} />
            <Metric label="Completed" value={`${completed}/${tasks.length}`} note="Your task progress" icon={Check} />
            <Metric label="Completion rate" value={`${progress}%`} note="Based on current tasks" icon={TrendingUp} />
            <Metric label="Daily check-in" value="Pending" note="How are you feeling?" icon={Heart} />
          </section>

          {/* Task panel */}
          <section className="grid gap-5 xl:grid-cols-[1.5fr_0.85fr]">
            <div className="dash-panel">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Your schedule</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">Today's focus</h3>
                </div>
              </div>

              {loadingTasks ? (
                <div className="flex py-12 justify-center items-center text-slate-500 gap-2 text-sm">
                  <Loader2 size={20} className="animate-spin text-blue-600" /> Memuat tugas dari Supabase...
                </div>
              ) : tasks.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Belum ada aktivitas. Klik "New activity" untuk mulai menambahkan.
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm">
                      <button 
                        onClick={() => toggleTask(task.id, task.done)} 
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                          task.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-blue-500"
                        }`}
                      >
                        <Check size={13} />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-medium ${task.done ? "text-slate-400 line-through" : "text-slate-800"}`}>{task.title}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">{task.category}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        task.priority === "High" ? "bg-rose-50 text-rose-600 border border-rose-200" :
                        task.priority === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                        "bg-blue-50 text-blue-600 border border-blue-200"
                      }`}>{task.priority}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="dash-panel bg-gradient-to-br from-white to-blue-50/50">
                <h3 className="text-lg font-bold text-slate-900">A moment for you.</h3>
                <p className="mt-2 text-sm text-slate-600">Take a moment to check in with yourself.</p>
                <button onClick={() => setShowCheckin(true)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/15 transition hover:bg-blue-700">
                  Start daily check-in <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modal Add Task */}
      {showModal && (
        <div className="dash-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="dash-modal-card" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Create new activity</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-2 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={addTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Aktivitas</label>
                <input
                  autoFocus
                  value={taskName}
                  onChange={e => setTaskName(e.target.value)}
                  placeholder="Contoh: Belajar Pemrograman Web"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
                <select 
                  value={taskCategory} 
                  onChange={e => setTaskCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  <option value="Programming">Programming</option>
                  <option value="Praktikum">Praktikum</option>
                  <option value="Project">Project</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Prioritas</label>
                <select 
                  value={taskPriority} 
                  onChange={e => setTaskPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={submittingTask}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50 mt-2"
              >
                {submittingTask ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                <span>Simpan Aktivitas</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Check-in */}
      {showCheckin && (
        <div className="dash-modal-overlay" onClick={() => setShowCheckin(false)}>
          <div className="dash-modal-card" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Daily check-in</h3>
              <button onClick={() => setShowCheckin(false)} className="rounded-lg p-2 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <p className="text-sm font-medium text-slate-700">How are you feeling today?</p>
              <div className="grid grid-cols-3 gap-2">
                {["Good", "Okay", "Tired"].map(m => (
                  <button key={m} type="button" onClick={() => setMood(m)} className={`rounded-xl border py-3 text-xs font-semibold transition ${mood === m ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    {m}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setShowCheckin(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/15">
                Save check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, note, icon: Icon }) {
  return (
    <div className="dash-metric-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          <Icon size={18} />
        </div>
      </div>
      <h3 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
      <p className="mt-1 text-[11px] text-slate-500">{note}</p>
    </div>
  );
}