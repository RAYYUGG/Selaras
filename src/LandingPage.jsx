import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  HeartPulse,
  Menu,
  Moon,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import "./landing.css";

const features = [
  {
    icon: CalendarDays,
    number: "01",
    title: "Academic Planner",
    description:
      "Atur tugas, deadline, jadwal kuliah, dan aktivitas organisasi dalam satu ruang yang terstruktur.",
    color: "violet",
  },
  {
    icon: BrainCircuit,
    number: "02",
    title: "Wellbeing Intelligence",
    description:
      "Pahami pola aktivitas dan beban akademik melalui analisis yang mudah dimengerti.",
    color: "cyan",
  },
  {
    icon: Target,
    number: "03",
    title: "Smart Recommendation",
    description:
      "Dapatkan saran langkah berikutnya berdasarkan aktivitas dan prioritasmu.",
    color: "blue",
  },
  {
    icon: HeartPulse,
    number: "04",
    title: "Daily Check-in",
    description:
      "Luangkan waktu untuk mengenali kondisi dan energi harianmu.",
    color: "pink",
  },
];

function DashboardPreview() {
  return (
    <div className="preview-scene">
      <div className="preview-glow" />

      <div className="floating-note note-left">
        <div className="note-icon">
          <Sparkles size={17} />
        </div>
        <div>
          <strong>Insight ditemukan</strong>
          <span>Jadwalmu mulai padat</span>
        </div>
      </div>

      <div className="preview-window">
        <div className="preview-topbar">
          <div className="preview-dots">
            <i />
            <i />
            <i />
          </div>
          <span>SELARAS / OVERVIEW</span>
          <div className="preview-avatar">S</div>
        </div>

        <div className="preview-content">
          <div className="preview-greeting">
            <div>
              <span className="preview-eyebrow">YOUR PERSONAL SPACE</span>
              <h3>Find your balance.</h3>
              <p>Small steps create meaningful progress.</p>
            </div>
            <div className="preview-date">MON, 20 NOV</div>
          </div>

          <div className="preview-insight">
            <div className="insight-symbol">
              <BrainCircuit size={21} />
            </div>
            <div>
              <span>SELARAS INTELLIGENCE</span>
              <strong>Let's make today manageable.</strong>
              <p>
                Kamu memiliki beberapa aktivitas yang perlu diprioritaskan.
              </p>
            </div>
            <ArrowUpRight size={18} />
          </div>

          <div className="preview-stats">
            <div>
              <span>ACTIVITIES</span>
              <strong>08</strong>
              <small>Aktivitas minggu ini</small>
            </div>
            <div>
              <span>COMPLETED</span>
              <strong>05</strong>
              <small>Sudah diselesaikan</small>
            </div>
            <div>
              <span>PROGRESS</span>
              <strong>68%</strong>
              <div className="mini-progress">
                <i />
              </div>
            </div>
          </div>

          <div className="preview-bottom">
            <div>
              <span className="preview-eyebrow">TODAY'S FOCUS</span>
              <strong>Keep your priorities clear.</strong>
            </div>
            <div className="preview-checks">
              <span><Check size={12} /> Review assignment</span>
              <span><Clock3 size={12} /> Prepare presentation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="floating-note note-right">
        <div className="note-icon cyan-icon">
          <CircleCheck size={17} />
        </div>
        <div>
          <strong>Progress updated</strong>
          <span>One step at a time.</span>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({ onEnter }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // 1. Custom Cursor Movement
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
        ringRef.current.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleMouseOver = (e) => {
      if (e.target.tagName === "BUTTON" || e.target.tagName === "A" || e.target.closest("button") || e.target.closest("a")) {
        setIsHovered(true);
      }
    };
    const handleMouseOut = (e) => {
      if (e.target.tagName === "BUTTON" || e.target.tagName === "A" || e.target.closest("button") || e.target.closest("a")) {
        setIsHovered(false);
      }
    };
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    // 2. Scroll Reveal Observer (Per Element & Agak Lambat)
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => revealObserver.observe(el));

    // 3. Active Section Observer untuk Navbar Melayang
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((sec) => sectionObserver.observe(sec));

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    setMenuOpen(false);
  };

  return (
    <main className={`landing-page ${isHovered ? "cursor-hover" : ""}`}>
      {/* Custom Cursor */}
      <div ref={dotRef} className="custom-cursor cursor-dot" />
      <div ref={ringRef} className="custom-cursor cursor-ring" />

      {/* Elemen Latar Belakang Geometris Bertekstur (Tidak Flat) */}
      <div className="bg-shape shape-1" />
      <div className="bg-shape shape-2" />
      <div className="bg-shape shape-3" />

      {/* Navbar Melayang Pintar dengan Active State */}
      <header className="landing-nav">
        <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); goTo("home"); }}>
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>SELARAS<span className="brand-period">.</span></span>
        </a>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#home" className={activeSection === "home" ? "active" : ""} onClick={(e) => { e.preventDefault(); goTo("home"); }}>Home</a>
          <a href="#about" className={activeSection === "about" ? "active" : ""} onClick={(e) => { e.preventDefault(); goTo("about"); }}>About</a>
          <a href="#features" className={activeSection === "features" ? "active" : ""} onClick={(e) => { e.preventDefault(); goTo("features"); }}>Features</a>
          <a href="#how-it-works" className={activeSection === "how-it-works" ? "active" : ""} onClick={(e) => { e.preventDefault(); goTo("how-it-works"); }}>How it works</a>
          <button className="mobile-nav-cta" onClick={onEnter}>
            Open workspace <ArrowRight size={16} />
          </button>
        </nav>

        <button className="nav-cta" onClick={onEnter}>
          Open workspace <ArrowUpRight size={16} />
        </button>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Hero Section */}
      <section className="landing-hero" id="home">
        <div className="hero-copy reveal-on-scroll">
          <div className="hero-label">
            <span className="live-dot" />
            YOUR ACADEMIC WELLBEING COMPANION
          </div>

          <h1>
            Productivity
            <br />
            with <span className="gradient-text">purpose.</span>
            <br />
            Balance with
            <br />
            <span className="serif-text">meaning.</span>
          </h1>

          <p className="hero-description">
            Bukan tentang melakukan semuanya sekaligus.
            SELARAS membantumu memahami pola aktivitas, mengatur prioritas,
            dan menemukan ritme belajar yang lebih seimbang.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={onEnter}>
              Explore SELARAS <ArrowRight size={18} />
            </button>
            <button className="secondary-button" onClick={() => goTo("about")}>
              Discover more <ChevronDown size={17} />
            </button>
          </div>

          <div className="hero-footnote">
            <div className="footnote-icon"><Moon size={15} /></div>
            <span>Work smarter. Rest mindfully. Grow consistently.</span>
          </div>
        </div>

        <div className="reveal-on-scroll reveal-delay-1">
          <DashboardPreview />
        </div>
      </section>

      {/* Manifesto / About Section */}
      <section className="manifesto-section reveal-on-scroll" id="about">
        <div className="section-kicker">01 / THE IDEA</div>
        <div className="manifesto-content">
          <h2>
            You don't need
            <br />
            to do <span className="muted-text">everything.</span>
            <br />
            You need to know
            <br />
            <span className="gradient-text">what matters.</span>
          </h2>
          <div className="manifesto-description">
            <div className="accent-line" />
            <p>
              Tugas, ujian, organisasi, dan berbagai tanggung jawab sering
              datang bersamaan. Tanpa memahami pola aktivitas, sulit untuk
              menentukan mana yang perlu dikerjakan lebih dulu.
            </p>
            <p>
              SELARAS hadir untuk mengubah data aktivitas menjadi insight
              dan langkah nyata, sehingga kamu bisa mengelola waktu dengan
              lebih sadar.
            </p>
          </div>
        </div>
        <div className="manifesto-bottom">
          <span>LESS OVERWHELM.</span>
          <span>MORE CLARITY.</span>
          <span>BETTER BALANCE.</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section reveal-on-scroll" id="features">
        <div className="section-heading">
          <div>
            <div className="section-kicker">02 / WHAT YOU GET</div>
            <h2>
              Everything you need.
              <br />
              <span className="muted-text">Nothing you don't.</span>
            </h2>
          </div>
          <p>
            Satu ekosistem untuk merencanakan aktivitas,
            memahami pola, dan mengambil langkah yang lebih terarah.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <article className={`feature-card reveal-on-scroll reveal-delay-${(idx % 3) + 1}`} key={feature.number}>
                <div className="feature-top">
                  <span>{feature.number} / FEATURE</span>
                  <ArrowUpRight size={18} />
                </div>
                <div className="feature-icon"><Icon size={24} /></div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-bottom-line" />
              </article>
            );
          })}
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section reveal-on-scroll" id="how-it-works">
        <div className="section-kicker">03 / THE PROCESS</div>
        <div className="process-heading">
          <h2>
            From awareness
            <br />
            to <span className="gradient-text">action.</span>
          </h2>
          <p>
            SELARAS tidak mengambil keputusan untukmu.
            Sistem membantu membaca pola dan memberi rekomendasi,
            sementara kamu tetap memegang kendali.
          </p>
        </div>

        <div className="process-track">
          {[
            ["01", "Input", "Catat aktivitas dan lakukan check-in."],
            ["02", "Analyze", "Pahami pola beban dan prioritas."],
            ["03", "Discover", "Lihat insight dari aktivitasmu."],
            ["04", "Take action", "Pilih langkah yang paling sesuai."],
          ].map(([number, title, description], index) => (
            <div className={`process-step reveal-on-scroll reveal-delay-${index + 1}`} key={number}>
              <div className="process-number">{number}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Section */}
      <section className="closing-section reveal-on-scroll">
        <div className="closing-content">
          <div className="section-kicker">
            <span className="live-dot" />
            YOUR NEXT CHAPTER STARTS HERE
          </div>
          <h2>
            Find your rhythm.
            <br />
            <span className="gradient-text">Make it meaningful.</span>
          </h2>
          <p>
            Mulai bangun kebiasaan yang lebih terarah.
            Satu langkah kecil hari ini bisa membuat perbedaan.
          </p>
          <button className="primary-button" onClick={onEnter}>
            Get started with SELARAS <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer reveal-on-scroll">
        <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); goTo("home"); }}>
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>SELARAS<span className="brand-period">.</span></span>
        </a>
        <span>© 2026 SELARAS. Find your balance.</span>
        <span>Built for a more mindful academic life.</span>
      </footer>
    </main>
  );
}