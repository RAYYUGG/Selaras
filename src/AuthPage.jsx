import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import "./auth.css";

export default function AuthPage({ onBack, onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (onAuthSuccess) onAuthSuccess(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) throw error;

        if (data?.session) {
          if (onAuthSuccess) onAuthSuccess(data.user);
        } else {
          setMessage({
            type: "success",
            text: "Akun berhasil dibuat! Silakan cek email untuk verifikasi atau langsung masuk.",
          });
          setMode("login");
        }
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Terjadi kesalahan. Periksa kembali data Anda.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Dekorasi Geometris Background */}
      <div className="auth-shape auth-shape-1" />
      <div className="auth-shape auth-shape-2" />

      {/* Tombol Kembali */}
      <button type="button" className="auth-back-btn" onClick={onBack}>
        <ArrowLeft size={16} />
        <span>Kembali ke Beranda</span>
      </button>

      <div className="auth-container">
        {/* Panel Kiri: Informasi & Branding */}
        <div className="auth-showcase">
          <div className="auth-brand">
            <span className="auth-brand-mark">
              <Sparkles size={18} />
            </span>
            <span>SELARAS.</span>
          </div>

          <div className="auth-showcase-copy">
            <span className="auth-badge">Academic Wellbeing</span>
            <h2>Kelola ritme belajarmu dengan lebih sadar.</h2>
            <p>
              Masuk ke ruang personalmu untuk memantau prioritas tugas, analisis
              beban harian, dan menjaga keseimbangan aktivitas akademik.
            </p>
          </div>

          <div className="auth-highlights">
            <div className="auth-highlight-item">
              <CheckCircle2 size={18} />
              <span>Perencanaan tugas & jadwal terintegrasi</span>
            </div>
            <div className="auth-highlight-item">
              <CheckCircle2 size={18} />
              <span>Insight pola aktivitas harian otomatis</span>
            </div>
          </div>
        </div>

        {/* Panel Kanan: Form Interaktif */}
        <div className="auth-form-side">
          {/* Tab Switcher */}
          <div className="auth-tabs">
            <div className={`auth-tab-indicator ${mode}`} />
            <button
              type="button"
              className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Masuk
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === "register" ? "active" : ""}`}
              onClick={() => switchMode("register")}
            >
              Daftar Akun
            </button>
          </div>

          <div className="auth-header">
            <h1>
              {mode === "login" ? "Selamat datang kembali" : "Mulai perjalananmu"}
            </h1>
            <p>
              {mode === "login"
                ? "Masukkan email dan kata sandi untuk membuka workspace."
                : "Buat akun baru untuk mulai menata aktivitas akademikmu."}
            </p>
          </div>

          {message.text && (
            <div className={`auth-alert ${message.type}`}>
              {message.type === "error" ? (
                <AlertCircle size={17} />
              ) : (
                <CheckCircle2 size={17} />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="input-group">
                <label htmlFor="fullName">Nama Lengkap</label>
                <div className="input-wrapper">
                  <User size={17} className="input-icon" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Contoh: Nadia Putri"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Alamat Email</label>
              <div className="input-wrapper">
                <Mail size={17} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@kampus.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Kata Sandi</label>
              <div className="input-wrapper">
                <Lock size={17} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="toggle-pass-btn"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin-icon" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === "login" ? "Masuk ke Workspace" : "Buat Akun SELARAS"}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}