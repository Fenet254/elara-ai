import { useEffect, useRef, useState } from "react";
import {
  Home, User, Code2, FolderOpen, Rocket, Briefcase, GraduationCap, Trophy,
  Mail, Download, Search, Mic, Send, Sparkles, Sun, Moon, Gamepad2, MapPin,
  BadgeCheck, Menu, X, Maximize2, Minus, Plus, Volume2, VolumeX,
} from "lucide-react";
import { profile } from "./profile";

const API = "http://localhost:8000";

type Extra = "journey";
type Message = { from: "me" | "elara"; text: string; time: string; extra?: Extra; files?: { name: string; url: string }[]; options?: string[] };
type NavEntry = { label: string; icon: typeof Home; ask: string; extra?: Extra };

const NAV: NavEntry[] = [
  { label: "New Chat", icon: Home, ask: "" },
  { label: "About Me", icon: User, ask: "Tell me about yourself" },
  { label: "Skills", icon: Code2, ask: "What are your technical skills?" },
  { label: "My Projects", icon: FolderOpen, ask: "Show me your projects" },
  { label: "My Journey", icon: Rocket, ask: "Tell me about your journey", extra: "journey" },
  { label: "Experience", icon: Briefcase, ask: "Tell me about your internships and experience" },
  { label: "Education", icon: GraduationCap, ask: "Tell me about your education and certifications" },
  { label: "Achievements", icon: Trophy, ask: "What hackathons and achievements do you have?" },
  { label: "Contact Me", icon: Mail, ask: "" },
  { label: "Resume", icon: Download, ask: "Can I get her CV?" },
];

const CHIPS: { label: string; ask: string; extra?: Extra }[] = [
  { label: "About Fenet", ask: "Tell me about yourself" },
  { label: "Her Skills", ask: "What are your technical skills?" },
  { label: "View Projects", ask: "Show me your projects" },
  { label: "Her Journey", ask: "Tell me about your journey", extra: "journey" },
  { label: "Fun Fact \u{1F609}", ask: "Tell me a fun fact about yourself" },
];

const SKILLS = [
  { label: "Python", value: 95 },
  { label: "AI/ML", value: 92 },
  { label: "Web Dev", value: 90 },
];

const QUICK_INFO = [
  { icon: GraduationCap, text: "Jimma University", ask: "Tell me about your education" },
  { icon: User, text: "5th Year Student", ask: "Which year of your degree are you in and when do you graduate?" },
  { icon: Code2, text: "AI & Cyber Security", ask: "Tell me about your AI and cybersecurity work" },
  { icon: MapPin, text: "Jimma, Ethiopia", ask: "Where are you based?" },
];

const JOURNEY_POINTS = [
  "Software Engineering Student (5th Year)",
  "AI & Cyber Security Enthusiast",
  "Internships: Ethiopian AI Institute & INSA",
  "Hackathons: Fayda ID, Reboot the Earth, Gebeta Voice",
  "Projects: Elara, Fraud Detection, and more...",
];

const clock = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const firstMessage = (): Message => ({
  from: "elara",
  time: clock(),
  text: "Hello there! \u{1F44B}\nI'm Elara, Fenet's AI digital twin.\nAsk me anything about her projects, skills, journey, internships, or technical experience.\n\nHow can I help you today? \u{1F499}",
});

function RichText({ text }: { text: string }) {
  const cleaned = text.replace(/^\s*[*-]\s+/gm, "\u2022 ");
  const pieces = cleaned.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {pieces.map((piece, i) =>
        piece.startsWith("**") && piece.endsWith("**") && piece.length > 4
          ? <strong key={i}>{piece.slice(2, -2)}</strong>
          : <span key={i}>{piece}</span>
      )}
    </>
  );
}

function RobotDrawing({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160">
      <defs>
        <radialGradient id="shell" cx="38%" cy="28%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9dff0" />
        </radialGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0c3a52" />
          <stop offset="1" stopColor="#06202f" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="148" rx="34" ry="6" fill="rgba(85,226,247,.3)" />
      <rect x="46" y="92" width="58" height="44" rx="22" fill="url(#shell)" />
      <g transform="rotate(-12 112 108)">
        <rect x="92" y="88" width="40" height="30" rx="5" fill="url(#glass)" stroke="#55e2f7" strokeWidth="2" />
        <text x="112" y="108" textAnchor="middle" fontSize="13" fill="#55e2f7" fontFamily="monospace">&lt;/&gt;</text>
      </g>
      <ellipse cx="96" cy="112" rx="9" ry="7" fill="url(#shell)" />
      <circle cx="78" cy="56" r="38" fill="url(#shell)" />
      <rect x="50" y="40" width="56" height="34" rx="17" fill="#06141d" />
      <path d="M60 56 Q66 47 72 56" stroke="#55e2f7" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M84 56 Q90 47 96 56" stroke="#55e2f7" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M69 63 Q78 70 87 63" stroke="#55e2f7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M42 54 Q42 14 78 14 Q114 14 114 54" stroke="#55e2f7" strokeWidth="4" fill="none" />
      <rect x="34" y="44" width="12" height="24" rx="6" fill="#55e2f7" />
      <rect x="110" y="44" width="12" height="24" rx="6" fill="#55e2f7" />
    </svg>
  );
}

function RobotArt({ size }: { size: number }) {
  const [missing, setMissing] = useState(false);
  if (missing) return <RobotDrawing size={size} />;
  return (
    <img src="/robot.png" alt="Elara" onError={() => setMissing(true)} style={{ width: size, height: size, objectFit: "contain" }} />
  );
}

function JourneyArt() {
  const [missing, setMissing] = useState(false);
  if (!missing) {
    return (
      <img
        src="/journey.png"
        alt=""
        onError={() => setMissing(true)}
        className="w-[112px] h-[112px] shrink-0 rounded-xl object-cover"
      />
    );
  }
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" className="shrink-0 rounded-xl">
      <rect width="112" height="112" rx="12" fill="#061c2a" />
      <rect x="18" y="22" width="76" height="46" rx="5" fill="#0a3248" stroke="#55e2f7" strokeWidth="2" />
      <text x="56" y="52" textAnchor="middle" fontSize="20" fill="#55e2f7" fontFamily="monospace">&lt;/&gt;</text>
      <rect x="50" y="68" width="12" height="8" fill="#55e2f7" opacity=".7" />
      <rect x="36" y="76" width="40" height="4" rx="2" fill="#55e2f7" opacity=".7" />
      <circle cx="56" cy="92" r="7" fill="#02090e" />
      <path d="M40 112 Q40 98 56 98 Q72 98 72 112 Z" fill="#02090e" />
    </svg>
  );
}

function JourneyCard({ onMore }: { onMore: () => void }) {
  return (
    <div className="journey-card">
      <JourneyArt />
      <div className="flex-1 min-w-[190px]">
        <div className="font-semibold text-sm mb-2 glow">{"\u2605"} Her Journey Highlights</div>
        <ul className="flex flex-col gap-1 text-[13px]">
          {JOURNEY_POINTS.map((point) => <li key={point}>{"\u2713"} {point}</li>)}
        </ul>
        <button className="chip mt-3" onClick={onMore}>Learn More {"\u2192"}</button>
      </div>
    </div>
  );
}

function SkillRing({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 hover:opacity-80" title={`Ask about ${label}`}>
      <svg width="62" height="62" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="5" style={{ stroke: "var(--cyan-faint)" }} />
        <circle
          cx="32" cy="32" r={radius} fill="none" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)}
          transform="rotate(-90 32 32)"
          style={{ stroke: "var(--cyan)", filter: "drop-shadow(0 0 4px var(--cyan))" }}
        />
        <text x="32" y="37" textAnchor="middle" fontSize="14" fill="currentColor">{value}%</text>
      </svg>
      <span className="text-xs">{label}</span>
    </button>
  );
}

function SmallAvatar() {
  return (
    <div className="w-11 h-11 shrink-0 rounded-full overflow-hidden grid place-items-center border border-[var(--cyan)] bg-[#06202f] shadow-[0_0_12px_var(--cyan-mid)]">
      <RobotArt size={42} />
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

const SoundBars = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" className="soft">
    {[2, 6, 10, 14, 18].map((x, i) => (
      <rect key={x} x={x} y={8 - [3, 6, 4, 7, 3][i]} width="2" height={[6, 12, 8, 14, 6][i]} rx="1" fill="currentColor" />
    ))}
  </svg>
);

export default function App() {
  const [messages, setMessages] = useState<Message[]>([firstMessage()]);
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<"professional" | "fun">("professional");
  const [waiting, setWaiting] = useState(false);
  const [activeNav, setActiveNav] = useState("New Chat");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [voiceOn, setVoiceOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, waiting]);

  const addElaraLine = (text: string) =>
    setMessages((prev) => [...prev, { from: "elara", text, time: clock() }]);

  const speak = (text: string) => {
    if (!voiceOn || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\*\*/g, "")));
  };

  const ask = async (raw: string, extra?: Extra) => {
    const text = raw.trim();
    if (!text || waiting) return;
    setMessages((prev) => [...prev, { from: "me", text, time: clock() }]);
    setDraft("");
    setWaiting(true);
    setLeftOpen(false);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, mode, session_id: sessionId }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      const reply = String(data.response ?? "");
      setMessages((prev) => [...prev, { from: "elara", text: reply, time: clock(), extra, files: data.files ?? [], options: data.options ?? [] }]);
      speak(reply);
    } catch {
      addElaraLine("I can't reach the backend right now. Make sure the API is running on port 8000.");
    } finally {
      setWaiting(false);
    }
  };

  const startOver = () => {
    setSessionId(crypto.randomUUID());
    setMessages([firstMessage()]);
    setDraft("");
    setActiveNav("New Chat");
    setLeftOpen(false);
    setRightOpen(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const writeEmail = () => {
    window.location.href = `mailto:${profile.email}?subject=Hello%20Fenet`;
  };

  const openUpwork = () => {
    if (profile.upwork) window.open(profile.upwork, "_blank", "noreferrer");
    else addElaraLine("My Upwork profile link isn't set up yet. You can reach me by email in the meantime.");
  };

  const chooseNav = (entry: NavEntry) => {
    setActiveNav(entry.label);
    if (entry.label === "New Chat") startOver();
    else if (entry.label === "Contact Me") writeEmail();
    else ask(entry.ask, entry.extra);
  };

  const runSearch = () => {
    const value = searchRef.current?.value ?? "";
    if (!value.trim()) return;
    ask(value);
    if (searchRef.current) searchRef.current.value = "";
  };

  const startMic = () => {
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) {
      addElaraLine("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    const recognizer = new Recognition();
    recognizer.lang = "en-US";
    recognizer.interimResults = false;
    recognizer.onresult = (event: any) => ask(event.results[0][0].transcript);
    recognizer.onend = () => setListening(false);
    recognizer.onerror = () => setListening(false);
    setListening(true);
    recognizer.start();
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  const resetView = () => {
    setFocusMode(false);
    setLeftOpen(false);
    setRightOpen(false);
    if (document.fullscreenElement) document.exitFullscreen();
  };

  const flipTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className={`${theme === "dark" ? "theme-dark" : "theme-light"} frame`}>
      <span className="screw" style={{ top: 3, left: 3 }} />
      <span className="screw" style={{ top: 3, right: 3 }} />
      <span className="screw" style={{ bottom: 3, left: 3 }} />
      <span className="screw" style={{ bottom: 3, right: 3 }} />

      <div className="hidden md:flex absolute top-[5px] right-7 z-20 gap-1.5">
        <button className="wbtn" onClick={startOver} aria-label="New chat" title="New chat"><Plus size={12} /></button>
        <button className="wbtn" onClick={() => setFocusMode(!focusMode)} aria-label="Focus mode" title="Focus mode"><Minus size={12} /></button>
        <button className="wbtn" onClick={toggleFullscreen} aria-label="Fullscreen" title="Fullscreen"><Maximize2 size={11} /></button>
        <button className="wbtn" onClick={resetView} aria-label="Reset view" title="Reset view"><X size={12} /></button>
      </div>

      <div className="screen">
        <div className="grid-lines" />
        <div className="code-rain" />

        <div className="relative z-10 h-full w-full p-3 flex gap-3">
          {leftOpen && <div className="fixed inset-0 z-30 bg-black/55 md:hidden" onClick={() => setLeftOpen(false)} />}
          {rightOpen && <div className="fixed inset-0 z-30 bg-black/55 lg:hidden" onClick={() => setRightOpen(false)} />}

          <aside
            className={`drawer-left fixed inset-y-0 left-0 z-40 w-[260px] p-3 flex flex-col gap-3 min-h-0 transition-transform duration-300 md:static md:z-auto md:w-[236px] md:shrink-0 md:p-0 md:translate-x-0 ${
              leftOpen ? "translate-x-0" : "-translate-x-full"
            } ${focusMode ? "md:hidden" : ""}`}
          >
            <div className="md:hidden flex justify-end">
              <button className="icon-btn" aria-label="Close menu" onClick={() => setLeftOpen(false)}><X size={16} /></button>
            </div>

            <div className="panel p-3 flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 shrink-0 rounded-full border border-[var(--cyan)] grid place-items-center bg-[radial-gradient(circle_at_35%_30%,#55e2f7,#0b4a66_60%,#031a28)] shadow-[0_0_14px_var(--cyan-mid)]">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="leading-tight flex-1 min-w-0">
                <div className="font-bold text-lg glow">Elara +</div>
                <div className="text-[11px] soft">Fenet's AI Portfolio</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Online
                </div>
              </div>
              <SoundBars />
            </div>

            <nav className="panel p-2 flex-1 min-h-0 overflow-y-auto scroll flex flex-col gap-1">
              {NAV.map((entry) => (
                <button key={entry.label} className={`nav-item ${activeNav === entry.label ? "active" : ""}`} onClick={() => chooseNav(entry)}>
                  <entry.icon size={18} /> {entry.label}
                </button>
              ))}
            </nav>

            <div className="panel p-3 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Modes</span>
                <button className="switch" onClick={flipTheme} aria-label="Switch light and dark theme" title="Light / dark theme">
                  <Sun size={12} />
                  <Moon size={12} />
                  <span className={`knob ${theme === "dark" ? "right" : ""}`} />
                </button>
              </div>
              <div className="text-xs soft mb-2">Personality</div>
              <div className="flex flex-col gap-1">
                <button className={`nav-item ${mode === "professional" ? "active" : ""}`} onClick={() => setMode("professional")}>
                  <Briefcase size={16} /> Professional
                </button>
                <button className={`nav-item ${mode === "fun" ? "active" : ""}`} onClick={() => setMode("fun")}>
                  <Gamepad2 size={16} /> Fun Mode
                </button>
              </div>
            </div>

            <div className="panel p-3 text-center shrink-0">
              <div className="neon text-[17px] leading-snug">"Dream Big.<br />Code Bigger."</div>
            </div>
          </aside>

          <main className="flex-1 min-w-0 min-h-0 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="md:hidden">
                <button className="icon-btn" aria-label="Open menu" onClick={() => setLeftOpen(true)}><Menu size={18} /></button>
              </div>
              <div className="panel flex-1 min-w-0 flex items-center gap-3 px-4 h-[46px]">
                <button onClick={runSearch} aria-label="Search"><Search size={18} className="soft" /></button>
                <input
                  ref={searchRef}
                  placeholder="Ask me anything about Fenet..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm"
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                />
              </div>
              <div className="hidden sm:block">
                <a className="icon-btn" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubMark /></a>
              </div>
              <div className="hidden sm:block">
                <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinMark /></a>
              </div>
              <div className="hidden sm:block">
                <button className="icon-btn" onClick={openUpwork} aria-label="Upwork" title="Upwork">
                  <span className="font-extrabold italic text-[15px]">Up</span>
                </button>
              </div>
              <button className="icon-btn" onClick={writeEmail} aria-label="Email" title={profile.email}><Mail size={17} /></button>
              <div className="lg:hidden">
                <button className="icon-btn" aria-label="Open profile" onClick={() => setRightOpen(true)}><User size={18} /></button>
              </div>
            </div>

            <div className="relative flex-1 min-h-0">
              <div className="panel h-full overflow-y-auto scroll p-5 flex flex-col gap-5">
                {messages.map((msg, i) =>
                  msg.from === "elara" ? (
                    <div key={i} className="flex gap-3 items-start">
                      <SmallAvatar />
                      <div className="min-w-0 max-w-[88%] md:max-w-[78%]">
                        <div className="text-xs soft mb-1">Elara &nbsp;{msg.time}</div>
                        <div className="bubble-ai px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          <RichText text={msg.text} />
                        </div>
                        {msg.extra === "journey" && <JourneyCard onMore={() => ask("Tell me more about your journey", "journey")} />}
                        {msg.files?.map((file) => (
                          <a key={file.url} href={`${API}${file.url}`} target="_blank" rel="noreferrer" className="chip mt-3 mr-2 inline-flex items-center gap-2">
                            <Download size={14} /> {file.name}
                          </a>
                        ))}
                        {i === messages.length - 1 && msg.options && msg.options.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.options.map((option) => (
                              <button key={option} className="chip" onClick={() => ask(option)}>{option}</button>
                            ))}
                          </div>
                        )}
                        {i === 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {CHIPS.map((chip) => (
                              <button key={chip.label} className="chip" onClick={() => ask(chip.ask, chip.extra)}>{chip.label}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex gap-3 items-start justify-end">
                      <div className="max-w-[80%] md:max-w-[70%] flex flex-col items-end">
                        <div className="text-xs soft mb-1">{msg.time}</div>
                        <div className="bubble-me px-4 py-2 text-[15px] whitespace-pre-wrap break-words">{msg.text}</div>
                      </div>
                      <div className="w-10 h-10 shrink-0 rounded-full border border-[var(--edge)] bg-[var(--field)] grid place-items-center">
                        <User size={18} />
                      </div>
                    </div>
                  )
                )}
                {waiting && (
                  <div className="flex items-center gap-3">
                    <SmallAvatar />
                    <div className="bubble-ai px-4 py-2 text-sm">
                      Elara is typing <span className="dot" /><span className="dot" /><span className="dot" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div className="neon absolute right-8 bottom-5 text-2xl pointer-events-none hidden xl:block -rotate-6">
                Keep<br />Coding! {"\u2661"}
              </div>
            </div>

            <div className="panel flex items-center gap-3 px-4 h-[58px] shrink-0">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask(draft)}
                placeholder="Type your message..."
                className="flex-1 min-w-0 bg-transparent outline-none text-[15px]"
              />
              <button className={`icon-btn ${listening ? "listening" : ""}`} onClick={startMic} aria-label="Voice input"><Mic size={18} /></button>
              <button className="send-btn" onClick={() => ask(draft)} aria-label="Send"><Send size={18} /></button>
            </div>
          </main>

          <aside
            className={`drawer-right fixed inset-y-0 right-0 z-40 w-[290px] p-3 flex flex-col gap-3 min-h-0 overflow-y-auto scroll transition-transform duration-300 lg:static lg:z-auto lg:w-[272px] lg:shrink-0 lg:p-0 lg:translate-x-0 ${
              rightOpen ? "translate-x-0" : "translate-x-full"
            } ${focusMode ? "lg:hidden" : ""}`}
          >
            <div className="lg:hidden flex justify-end">
              <button className="icon-btn" aria-label="Close profile" onClick={() => setRightOpen(false)}><X size={16} /></button>
            </div>

            <div className="panel p-3 shrink-0 flex justify-center">
              <div className="relative float mt-1">
                <div className="orbit" />
                <RobotArt size={170} />
              </div>
            </div>

            <div className="panel p-4 shrink-0">
              <div className="flex items-center gap-2 font-bold text-lg glow">
                {profile.name} <BadgeCheck size={16} style={{ color: "var(--cyan)" }} />
              </div>
              <div className="text-sm">Software Engineering Student</div>
              <div className="text-xs soft mt-1">Engineer | Creator | Innovator</div>
            </div>

            <div className="panel p-4 shrink-0">
              <div className="flex justify-between text-sm font-semibold mb-3">
                <span>Skills</span>
                <button className="text-xs" style={{ color: "var(--cyan)" }} onClick={() => ask("What are your technical skills?")}>View All {"\u2192"}</button>
              </div>
              <div className="flex justify-between">
                {SKILLS.map((skill) => (
                  <SkillRing key={skill.label} {...skill} onClick={() => ask(`Tell me about your ${skill.label} experience`)} />
                ))}
              </div>
            </div>

            <div className="panel p-4 shrink-0">
              <div className="text-sm font-semibold mb-3">Quick Info</div>
              <ul className="flex flex-col gap-2 text-sm">
                {QUICK_INFO.map((item) => (
                  <li key={item.text}>
                    <button className="flex items-center gap-2 text-left hover:opacity-80" onClick={() => ask(item.ask)}>
                      <item.icon size={15} /> {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel relative p-4 pr-24 shrink-0 text-sm min-h-[86px] flex items-center glow">
              Building a smarter digital future together
              <button
                className={`dial ${voiceOn ? "on" : ""}`}
                onClick={() => setVoiceOn(!voiceOn)}
                aria-label="Toggle voice replies"
                title={`Voice replies: ${voiceOn ? "on" : "off"}`}
              >
                {voiceOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
