import { useEffect, useRef, useState } from "react";
import {
  Home, User, Code2, FolderOpen, Rocket, Briefcase, GraduationCap, Trophy,
  Mail, Download, Search, Mic, Send, Sparkles, Sun, Moon, Gamepad2, MapPin,
  BadgeCheck, Menu, X, Settings, Maximize2, Minus, Plus, Volume2, VolumeX, Trash2,
} from "lucide-react";

const API = "http://localhost:8000";

const PROFILE = {
  github: "https://github.com/Fenet254",
  linkedin: "https://www.linkedin.com/in/fenet-gizaw-b47003341",
  email: "",
};

type Card = "journey";
type Msg = { role: "user" | "ai"; text: string; time: string; card?: Card };
type NavItem = { label: string; icon: typeof Home; prompt: string; card?: Card };

const NAV: NavItem[] = [
  { label: "New Chat", icon: Home, prompt: "" },
  { label: "About Me", icon: User, prompt: "Tell me about yourself" },
  { label: "Skills", icon: Code2, prompt: "What are your technical skills?" },
  { label: "My Projects", icon: FolderOpen, prompt: "Show me your projects" },
  { label: "My Journey", icon: Rocket, prompt: "Tell me about your journey", card: "journey" },
  { label: "Experience", icon: Briefcase, prompt: "Tell me about your internships and experience" },
  { label: "Education", icon: GraduationCap, prompt: "Tell me about your education and certifications" },
  { label: "Achievements", icon: Trophy, prompt: "What hackathons and achievements do you have?" },
  { label: "Contact Me", icon: Mail, prompt: "How can I contact you?" },
  { label: "Resume", icon: Download, prompt: "Generate a CV for an AI Engineer role" },
];

const CHIPS: { label: string; prompt: string; card?: Card }[] = [
  { label: "About Fenet", prompt: "Tell me about yourself" },
  { label: "Her Skills", prompt: "What are your technical skills?" },
  { label: "View Projects", prompt: "Show me your projects" },
  { label: "Her Journey", prompt: "Tell me about your journey", card: "journey" },
  { label: "Fun Fact", prompt: "Tell me a fun fact about yourself" },
];

const SKILLS = [
  { label: "Python", value: 95 },
  { label: "AI/ML", value: 92 },
  { label: "Web Dev", value: 90 },
];

const INFO = [
  { icon: GraduationCap, text: "Jimma University", prompt: "Tell me about your education" },
  { icon: User, text: "5th Year Student", prompt: "Which year of your degree are you in and when do you graduate?" },
  { icon: Code2, text: "AI & Cyber Security", prompt: "Tell me about your AI and cybersecurity work" },
  { icon: MapPin, text: "Jimma, Ethiopia", prompt: "Where are you based?" },
];

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const greeting = (): Msg => ({
  role: "ai",
  time: now(),
  text: "Hello there! I'm Elara, Fenet's AI digital twin.\nAsk me anything about her projects, skills, journey, internships, or technical experience.\n\nHow can I help you today?",
});

function Rich({ text }: { text: string }) {
  const clean = text.replace(/^\s*[*-]\s+/gm, "• ");
  return (
    <>
      {clean.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
        p.startsWith("**") && p.endsWith("**") && p.length > 4 ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
      )}
    </>
  );
}

function Robot({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <defs>
        <radialGradient id="rg" cx="40%" cy="30%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#bfe6f5" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="110" rx="28" ry="5" fill="rgba(79,227,255,0.3)" />
      <rect x="34" y="68" width="52" height="34" rx="16" fill="url(#rg)" />
      <circle cx="60" cy="42" r="30" fill="url(#rg)" />
      <rect x="38" y="30" width="44" height="26" rx="13" fill="#06141d" />
      <ellipse cx="50" cy="43" rx="5" ry="6" fill="#4fe3ff" />
      <ellipse cx="70" cy="43" rx="5" ry="6" fill="#4fe3ff" />
      <path d="M54 52 Q60 57 66 52" stroke="#4fe3ff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="27" y="36" width="8" height="16" rx="4" fill="#4fe3ff" />
      <rect x="85" y="36" width="8" height="16" rx="4" fill="#4fe3ff" />
    </svg>
  );
}

function RobotArt({ size }: { size: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Robot size={size} />;
  return (
    <img
      src="/robot.png"
      alt="Elara"
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

function Avatar() {
  return (
    <div className="w-11 h-11 shrink-0 rounded-full overflow-hidden grid place-items-center border border-[var(--accent)] bg-[#06202f] shadow-[0_0_12px_var(--accent-mid)]">
      <RobotArt size={40} />
    </div>
  );
}

function Ring({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 hover:opacity-80" title={`Ask about ${label}`}>
      <svg width="62" height="62" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="5" style={{ stroke: "var(--accent-soft)" }} />
        <circle
          cx="32" cy="32" r={r} fill="none" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 32 32)"
          style={{ stroke: "var(--accent)", filter: "drop-shadow(0 0 4px var(--accent))" }}
        />
        <text x="32" y="37" textAnchor="middle" fontSize="14" fill="currentColor">{value}%</text>
      </svg>
      <span className="text-xs">{label}</span>
    </button>
  );
}

function JourneyCard({ onMore }: { onMore: () => void }) {
  const items = [
    "Software Engineering student, 5th year at Jimma University",
    "AI and cybersecurity enthusiast",
    "Interned at the Ethiopian AI Institute, now interning at INSA",
    "Hackathons: Fayda ID, Reboot the Earth, Gebeta Voice",
    "Projects: Elara, fraud detection, and more",
  ];
  return (
    <div className="jcard flex-wrap">
      <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0 rounded-xl">
        <rect width="96" height="96" rx="12" fill="#06202f" />
        <rect x="14" y="20" width="68" height="44" rx="5" fill="none" stroke="#4fe3ff" strokeWidth="2" />
        <text x="48" y="50" textAnchor="middle" fontSize="20" fill="#4fe3ff">&lt;/&gt;</text>
        <rect x="38" y="68" width="20" height="4" rx="2" fill="#4fe3ff" />
      </svg>
      <div className="flex-1 min-w-[180px]">
        <div className="font-semibold text-sm mb-2 glow">Her Journey Highlights</div>
        <ul className="flex flex-col gap-1 text-[13px]">
          {items.map((t) => <li key={t}>✓ {t}</li>)}
        </ul>
        <button className="chip mt-2" onClick={onMore}>Learn More →</button>
      </div>
    </div>
  );
}

const GithubMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedinMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function App() {
  const [messages, setMessages] = useState<Msg[]>([greeting()]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"professional" | "fun">("professional");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("New Chat");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [voice, setVoice] = useState(false);
  const [listening, setListening] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const say = (text: string) => setMessages((p) => [...p, { role: "ai", text, time: now() }]);

  const speak = (t: string) => {
    if (!voice || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(t.replace(/\*\*/g, "")));
  };

  const send = async (raw: string, card?: Card) => {
    const text = raw.trim();
    if (!text || loading) return;
    setMessages((p) => [...p, { role: "user", text, time: now() }]);
    setInput("");
    setLoading(true);
    setLeftOpen(false);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, mode }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const reply = String(data.response ?? "");
      setMessages((p) => [...p, { role: "ai", text: reply, time: now(), card }]);
      speak(reply);
    } catch {
      say("I can't reach the backend right now. Make sure the API is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages([greeting()]);
    setInput("");
    setActive("New Chat");
    setLeftOpen(false);
    setRightOpen(false);
    setSettingsOpen(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const contact = () => {
    if (PROFILE.email) window.location.href = `mailto:${PROFILE.email}`;
    else send("How can I contact you?");
  };

  const pick = (item: NavItem) => {
    setActive(item.label);
    if (item.label === "New Chat") newChat();
    else if (item.label === "Contact Me") contact();
    else send(item.prompt, item.card);
  };

  const runSearch = () => {
    const v = searchRef.current?.value ?? "";
    if (!v.trim()) return;
    send(v);
    if (searchRef.current) searchRef.current.value = "";
  };

  const startMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      say("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => send(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  };

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  const closeAll = () => {
    setFocus(false);
    setLeftOpen(false);
    setRightOpen(false);
    setSettingsOpen(false);
    if (document.fullscreenElement) document.exitFullscreen();
  };

  const flipTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className={`${theme === "dark" ? "theme-dark" : "theme-light"} frame`}>
      <span className="screw" style={{ top: 2, left: 2 }} />
      <span className="screw" style={{ top: 2, right: 2 }} />
      <span className="screw" style={{ bottom: 2, left: 2 }} />
      <span className="screw" style={{ bottom: 2, right: 2 }} />
      <div className="screen">
        <div className="grid-bg" />
        <div className="code-bg" />
        <div className="relative z-10 h-full w-full p-3 flex gap-3">
          {leftOpen && <div className="fixed inset-0 z-30 bg-black/55 md:hidden" onClick={() => setLeftOpen(false)} />}
          {rightOpen && <div className="fixed inset-0 z-30 bg-black/55 lg:hidden" onClick={() => setRightOpen(false)} />}

          <aside
            className={`drawer-left fixed inset-y-0 left-0 z-40 w-[260px] p-3 flex flex-col gap-3 min-h-0 transition-transform duration-300 md:static md:z-auto md:w-[236px] md:shrink-0 md:p-0 ${
              leftOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 ${focus ? "md:hidden" : "md:flex"}`}
          >
            <div className="md:hidden flex justify-end">
              <button className="icon-btn" aria-label="Close menu" onClick={() => setLeftOpen(false)}><X size={16} /></button>
            </div>

            <div className="panel p-3 flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-full border border-[var(--accent)] grid place-items-center bg-[radial-gradient(circle_at_35%_30%,#4fe3ff,#0b4a66_60%,#031a28)] shadow-[0_0_14px_var(--accent-mid)]">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-lg glow">Elara +</div>
                <div className="text-[11px] muted">Fenet's AI Portfolio</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Online
                </div>
              </div>
            </div>

            <nav className="panel p-2 flex-1 min-h-0 overflow-y-auto scroll flex flex-col gap-1">
              {NAV.map((item) => (
                <button key={item.label} className={`nav-item ${active === item.label ? "active" : ""}`} onClick={() => pick(item)}>
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>

            <div className="panel p-3 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Modes</span>
                <button className="switch" onClick={flipTheme} aria-label="Toggle light and dark theme" title="Light / dark theme">
                  <Sun size={12} />
                  <Moon size={12} />
                  <span className={`knob ${theme === "dark" ? "right" : ""}`} />
                </button>
              </div>
              <div className="text-xs muted mb-2">Personality</div>
              <div className="flex flex-col gap-1">
                <button className={`nav-item ${mode === "professional" ? "active" : ""}`} onClick={() => setMode("professional")}>
                  <Briefcase size={16} /> Professional
                </button>
                <button className={`nav-item ${mode === "fun" ? "active" : ""}`} onClick={() => setMode("fun")}>
                  <Gamepad2 size={16} /> Fun Mode
                </button>
              </div>
            </div>

            <div className="panel p-3 text-center italic glow shrink-0">"Dream Big.<br />Code Bigger."</div>
          </aside>

          <main className="flex-1 min-w-0 min-h-0 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="md:hidden">
                <button className="icon-btn" aria-label="Open menu" onClick={() => setLeftOpen(true)}><Menu size={18} /></button>
              </div>
              <div className="panel flex-1 min-w-0 flex items-center gap-3 px-4 h-[46px]">
                <button onClick={runSearch} aria-label="Search"><Search size={18} className="muted" /></button>
                <input
                  ref={searchRef}
                  placeholder="Ask me anything about Fenet..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm"
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                />
              </div>
              <div className="hidden sm:block">
                <a className="icon-btn" href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubMark /></a>
              </div>
              <div className="hidden sm:block">
                <a className="icon-btn" href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinMark /></a>
              </div>
              <div className="relative">
                <button className="icon-btn" aria-label="Settings" onClick={() => setSettingsOpen(!settingsOpen)}><Settings size={17} /></button>
                {settingsOpen && (
                  <div className="panel pop absolute right-0 top-12 z-50 w-56 p-2 flex flex-col gap-1">
                    <button className="nav-item" onClick={() => setVoice(!voice)}>
                      {voice ? <Volume2 size={16} /> : <VolumeX size={16} />} Voice replies: {voice ? "On" : "Off"}
                    </button>
                    <button className="nav-item" onClick={flipTheme}>
                      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} {theme === "dark" ? "Light theme" : "Dark theme"}
                    </button>
                    <button className="nav-item" onClick={newChat}><Trash2 size={16} /> Clear conversation</button>
                  </div>
                )}
              </div>
              <div className="hidden sm:block">
                <button className="icon-btn" aria-label="Contact" onClick={contact}><Mail size={17} /></button>
              </div>
              {focus && (
                <button className="icon-btn" aria-label="Exit focus mode" title="Exit focus mode" onClick={() => setFocus(false)}><Maximize2 size={16} /></button>
              )}
              <div className="lg:hidden">
                <button className="icon-btn" aria-label="Open profile" onClick={() => setRightOpen(true)}><User size={18} /></button>
              </div>
            </div>

            <div className="panel flex-1 min-h-0 overflow-y-auto scroll p-5 flex flex-col gap-5">
              {messages.map((m, i) =>
                m.role === "ai" ? (
                  <div key={i} className="flex gap-3 items-start">
                    <Avatar />
                    <div className="min-w-0 max-w-[88%] md:max-w-[78%]">
                      <div className="text-xs muted mb-1">Elara &nbsp;{m.time}</div>
                      <div className="bubble-ai px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                        <Rich text={m.text} />
                      </div>
                      {m.card === "journey" && <JourneyCard onMore={() => send("Tell me more about your journey", "journey")} />}
                      {i === 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {CHIPS.map((c) => (
                            <button key={c.label} className="chip" onClick={() => send(c.prompt, c.card)}>{c.label}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3 items-start justify-end">
                    <div className="max-w-[80%] md:max-w-[70%] flex flex-col items-end">
                      <div className="text-xs muted mb-1">{m.time}</div>
                      <div className="bubble-user px-4 py-2 text-[15px] whitespace-pre-wrap break-words">{m.text}</div>
                    </div>
                    <div className="w-10 h-10 shrink-0 rounded-full border border-[var(--line)] bg-[var(--input)] grid place-items-center">
                      <User size={18} />
                    </div>
                  </div>
                )
              )}
              {loading && (
                <div className="flex items-center gap-3">
                  <Avatar />
                  <div className="bubble-ai px-4 py-2 text-sm">
                    Elara is typing <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="panel flex items-center gap-3 px-4 h-[58px] shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Type your message..."
                className="flex-1 min-w-0 bg-transparent outline-none text-[15px]"
              />
              <button className={`icon-btn ${listening ? "listening" : ""}`} onClick={startMic} aria-label="Voice input"><Mic size={18} /></button>
              <button className="send-btn" onClick={() => send(input)} aria-label="Send"><Send size={18} /></button>
            </div>
          </main>

          <aside
            className={`drawer-right fixed inset-y-0 right-0 z-40 w-[290px] p-3 flex flex-col gap-3 min-h-0 overflow-y-auto scroll transition-transform duration-300 lg:static lg:z-auto lg:w-[272px] lg:shrink-0 lg:p-0 ${
              rightOpen ? "translate-x-0" : "translate-x-full"
            } lg:translate-x-0 ${focus ? "lg:hidden" : "lg:flex"}`}
          >
            <div className="lg:hidden flex justify-end">
              <button className="icon-btn" aria-label="Close profile" onClick={() => setRightOpen(false)}><X size={16} /></button>
            </div>

            <div className="panel relative p-3 shrink-0 flex flex-col items-center">
              <div className="absolute right-2 top-2 flex gap-1 z-10">
                <button className="wbtn" onClick={newChat} aria-label="New chat" title="New chat"><Plus size={12} /></button>
                <button className="wbtn" onClick={() => setFocus(!focus)} aria-label="Focus mode" title="Focus mode"><Minus size={12} /></button>
                <button className="wbtn" onClick={toggleFull} aria-label="Fullscreen" title="Fullscreen"><Maximize2 size={11} /></button>
                <button className="wbtn" onClick={closeAll} aria-label="Reset view" title="Reset view"><X size={12} /></button>
              </div>
              <div className="relative bob mt-5 mb-2">
                <div className="orbit" />
                <RobotArt size={140} />
              </div>
            </div>

            <div className="panel p-4 shrink-0">
              <div className="flex items-center gap-2 font-bold text-lg glow">
                Fenet Gizaw <BadgeCheck size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div className="text-sm">Software Engineering Student</div>
              <div className="text-xs muted mt-1">Engineer | Creator | Innovator</div>
            </div>

            <div className="panel p-4 shrink-0">
              <div className="flex justify-between text-sm font-semibold mb-3">
                <span>Skills</span>
                <button className="text-xs" style={{ color: "var(--accent)" }} onClick={() => send("What are your technical skills?")}>View All</button>
              </div>
              <div className="flex justify-between">
                {SKILLS.map((s) => (
                  <Ring key={s.label} {...s} onClick={() => send(`Tell me about your ${s.label} experience`)} />
                ))}
              </div>
            </div>

            <div className="panel p-4 shrink-0">
              <div className="text-sm font-semibold mb-3">Quick Info</div>
              <ul className="flex flex-col gap-2 text-sm">
                {INFO.map((it) => (
                  <li key={it.text}>
                    <button className="flex items-center gap-2 text-left hover:opacity-80" onClick={() => send(it.prompt)}>
                      <it.icon size={15} /> {it.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel relative p-4 pr-24 shrink-0 text-sm glow">
              Building a smarter digital future together
              <button
                className={`dial ${voice ? "on" : ""}`}
                onClick={() => setVoice(!voice)}
                aria-label="Toggle voice replies"
                title={`Voice replies: ${voice ? "On" : "Off"}`}
              >
                {voice ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
