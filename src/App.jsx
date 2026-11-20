import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import LandingPage from "./LandingPage";   // Landing page yang sudah kita buat sebelumnya
import AuthPage from "./AuthPage";         // Halaman login/register yang elegan
import Dashboard from "./Dashboard";       // File dashboard terpisah Anda

export default function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState("landing"); // "landing" | "auth" | "dashboard"
  const [loading, setLoading] = useState(true);

  // Cek status sesi login Supabase saat aplikasi dimuat
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setView("dashboard");
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setView("dashboard");
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D18] flex items-center justify-center text-white text-sm">
        Memuat SELARAS...
      </div>
    );
  }

  // 1. Jika sudah login, tampilkan Dashboard
  if (session && view === "dashboard") {
    return (
      <Dashboard
        session={session}
        onLogout={async () => {
          await supabase.auth.signOut();
          setSession(null);
          setView("landing");
        }}
      />
    );
  }

  // 2. Jika memilih menu login/auth dari landing page
  if (view === "auth") {
    return (
      <AuthPage
        onBack={() => setView("landing")}
        onAuthSuccess={(user) => {
          setView("dashboard");
        }}
      />
    );
  }

  // 3. Default: Tampilkan Landing Page
  return (
    <LandingPage
      onEnter={() => {
        if (session) {
          setView("dashboard");
        } else {
          setView("auth");
        }
      }}
    />
  );
}