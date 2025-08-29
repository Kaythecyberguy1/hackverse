import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Flag,
  Search,
  Timer,
  Trophy,
  Dot,
  Filter,
  X,
  ChevronDown,
  Swords,
  ShieldCheck,
  Loader2,
  ExternalLink,
  Lock,
  Settings2,
  Star,
  Flame,
  RefreshCcw,
} from "lucide-react";

/**
 * Hackverse LabsPage.jsx — A fun, interactive labs hub (TryHackMe-style)
 * ---------------------------------------------------------------------
 * Highlights
 *  - Auth gate: hides labs for logged-out users
 *  - Search + filter (difficulty, tags) + sort
 *  - Tabs: All / Unstarted / In Progress / Solved
 *  - Pretty lab cards with progress, points, time, badges
 *  - Launch flow (with status polling) and inline flag submission
 *  - Optimistic UI + toasts + skeletons
 *  - Fully TailwindCSS + Framer Motion animations
 *
 * Backend expectations (adjust endpoints as needed):
 *   GET    /api/labs                              → [{ id, title, slug, summary, difficulty, tags, estTime, points, solved, progressPct, thumbnailUrl }]
 *   POST   /api/labs/:id/launch                   → { instanceUrl, status: "starting"|"running"|"stopped", message? }
 *   GET    /api/labs/:id/status                   → { status, instanceUrl }
 *   POST   /api/labs/:id/submit-flag { flag }     → { correct: boolean, message, pointsAwarded? }
 *
 * Auth: bearer token in localStorage("hackverse_token").
 */

const API_BASE = ""; // same-origin by default

// ----------------------------- Utilities -----------------------------
function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

const DIFFICULTIES = ["Beginner", "Easy", "Medium", "Hard", "Expert"];

const TAGS = [
  "Web",
  "Crypto",
  "Forensics",
  "Pwn",
  "OSINT",
  "Cloud",
  "Linux",
  "Windows",
  "Network",
  "Reverse",
];

const SORTS = [
  { key: "recommended", label: "Recommended" },
  { key: "difficulty", label: "Difficulty" },
  { key: "new", label: "Newest" },
  { key: "points", label: "Points" },
  { key: "time", label: "Estimated Time" },
];

const prettyDiff = (d) =>
  ({
    Beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Easy: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Medium: "text-amber-700 bg-amber-50 border-amber-200",
    Hard: "text-rose-600 bg-rose-50 border-rose-200",
    Expert: "text-violet-600 bg-violet-50 border-violet-200",
  }[d] || "text-slate-600 bg-slate-50 border-slate-200");

// -------------------------- Mock Fallback API ------------------------
const MOCK_LABS = [
  {
    id: "web-101",
    title: "Intro to Web Vulns",
    slug: "intro-to-web",
    summary:
      "Learn the basics: XSS, SQLi, and how to think like a web attacker.",
    difficulty: "Beginner",
    tags: ["Web", "Linux"],
    estTime: 30,
    points: 50,
    solved: false,
    progressPct: 0,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "pwn-lite",
    title: "Binary Exploitation Lite",
    slug: "pwn-lite",
    summary: "Memory safety 101: buffer overflows without the headache.",
    difficulty: "Medium",
    tags: ["Pwn", "Linux"],
    estTime: 60,
    points: 120,
    solved: false,
    progressPct: 20,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "forensics-pcap",
    title: "PCAP Whodunnit",
    slug: "pcap-whodunnit",
    summary: "Follow the packets, catch the culprit. Wireshark to the rescue!",
    difficulty: "Easy",
    tags: ["Forensics", "Network"],
    estTime: 40,
    points: 80,
    solved: true,
    progressPct: 100,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "crypto-baby",
    title: "Crypto Baby Steps",
    slug: "crypto-baby-steps",
    summary: "Break simple ciphers and warm up your number theory muscles.",
    difficulty: "Easy",
    tags: ["Crypto"],
    estTime: 25,
    points: 60,
    solved: false,
    progressPct: 0,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "osint-stalker",
    title: "OSINT Coffee Run",
    slug: "osint-coffee-run",
    summary: "Hunt down clues across the open web—ethically, of course.",
    difficulty: "Beginner",
    tags: ["OSINT"],
    estTime: 20,
    points: 40,
    solved: false,
    progressPct: 0,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "cloud-first-blood",
    title: "Cloud First Blood",
    slug: "cloud-first-blood",
    summary: "Spin up misconfigs and bag those buckets.",
    difficulty: "Hard",
    tags: ["Cloud", "Linux"],
    estTime: 90,
    points: 200,
    solved: false,
    progressPct: 0,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
  },
];

async function api(path, opts = {}) {
  const token = localStorage.getItem("hackverse_token");
  try {
    const res = await fetch(API_BASE + path, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    // Fallbacks for local/dev/demo use
    if (path === "/api/labs" && (!API_BASE || API_BASE === "")) {
      await delay(400);
      return MOCK_LABS;
    }
    if (path.match(/\/api\/labs\/.*\/launch/)) {
      await delay(600);
      return {
        instanceUrl: `https://lab-instance-${Math.random()
          .toString(36)
          .slice(2)}.hackverse.local`,
        status: "starting",
        message: "Spinning up your lab container…",
      };
    }
    if (path.match(/\/api\/labs\/.*\/status/)) {
      await delay(500);
      return {
        status: Math.random() > 0.3 ? "running" : "starting",
        instanceUrl: `https://lab-instance-${Math.random()
          .toString(36)
          .slice(2)}.hackverse.local`,
      };
    }
    if (path.match(/\/api\/labs\/.*\/submit-flag/)) {
      await delay(300);
      const correct = Math.random() > 0.4;
      return {
        correct,
        message: correct ? "Flag correct! GG." : "Nope—try again.",
        pointsAwarded: correct ? 20 : 0,
      };
    }
    throw e;
  }
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ----------------------------- Toasts -----------------------------
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = (t) => {
    const id = crypto.randomUUID();
    setToasts((xs) => [...xs, { id, ...t }]);
    setTimeout(() => {
      setToasts((xs) => xs.filter((x) => x.id !== id));
    }, t.duration ?? 3000);
  };
  return {
    push,
    Toasts: () => (
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={cn(
                "rounded-xl shadow-lg px-4 py-3 text-sm border",
                t.variant === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : t.variant === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              )}
            >
              {t.title && <div className="font-semibold mb-0.5">{t.title}</div>}
              <div>{t.description}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ),
  };
}

// --------------------------- Auth Hook ---------------------------
function useAuth() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const t = localStorage.getItem("hackverse_token");
    const u = localStorage.getItem("hackverse_user");
    setToken(t);
    try {
      setUser(u ? JSON.parse(u) : null);
    } catch {
      setUser(null);
    }
  }, []);
  return { token, user, isAuthed: Boolean(token) };
}

// --------------------------- Main Page ---------------------------
export default function LabsPage() {
  const { isAuthed, user } = useAuth();
  const { push, Toasts } = useToasts();

  const [loading, setLoading] = useState(true);
  const [labs, setLabs] = useState([]);

  const [query, setQuery] = useState("");
  const [activeDifficulties, setActiveDifficulties] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [sort, setSort] = useState("recommended");
  const [tab, setTab] = useState("all"); // all|unstarted|progress|solved

  // Launch & flag state
  const [launchingId, setLaunchingId] = useState(null);
  const [running, setRunning] = useState({}); // id → { status, url }
  const [flagFor, setFlagFor] = useState(null); // lab being flagged
  const [flagText, setFlagText] = useState("");
  const pollingRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api("/api/labs");
        setLabs(data);
      } catch (e) {
        push({ variant: "error", title: "Failed to load labs", description: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let xs = [...labs];
    if (query.trim()) {
      const q = query.toLowerCase();
      xs = xs.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeDifficulties.length) {
      xs = xs.filter((l) => activeDifficulties.includes(l.difficulty));
    }
    if (activeTags.length) {
      xs = xs.filter((l) => activeTags.every((t) => l.tags.includes(t)));
    }
    if (tab === "unstarted") xs = xs.filter((l) => !l.solved && (l.progressPct ?? 0) === 0);
    if (tab === "progress") xs = xs.filter((l) => !l.solved && (l.progressPct ?? 0) > 0);
    if (tab === "solved") xs = xs.filter((l) => l.solved);

    switch (sort) {
      case "difficulty":
        xs.sort((a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty));
        break;
      case "new":
        xs.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        break;
      case "points":
        xs.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
        break;
      case "time":
        xs.sort((a, b) => (a.estTime ?? 0) - (b.estTime ?? 0));
        break;
      default:
        // recommended: solved last, then by progress
        xs.sort((a, b) => (a.solved === b.solved ? (b.progressPct ?? 0) - (a.progressPct ?? 0) : a.solved ? 1 : -1));
    }

    return xs;
  }, [labs, query, activeDifficulties, activeTags, sort, tab]);

  // --------------------------- Actions ---------------------------
  async function launchLab(lab)() {
    setLaunchingId(lab.id);
    try {
      const res = await api(`/api/labs/${lab.id}/launch`, { method: "POST" });
      setRunning((r) => ({ ...r, [lab.id]: { status: res.status, url: res.instanceUrl } }));
      push({ variant: "default", title: "Launching…", description: res.message || "Your instance is starting." });
      startPolling(lab.id);
    } catch (e) {
      push({ variant: "error", title: "Launch failed", description: e.message });
    } finally {
      setLaunchingId(null);
    }
  }

  function startPolling(id) {
    clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await api(`/api/labs/${id}/status`);
        setRunning((r) => ({ ...r, [id]: { status: res.status, url: res.instanceUrl } }));
        if (res.status === "running") {
          clearInterval(pollingRef.current);
          push({ variant: "success", title: "Lab ready!", description: "Your container is running." });
        }
      } catch (e) {
        clearInterval(pollingRef.current);
      }
    }, 2000);
  }

  async function submitFlag(lab) {
    if (!flagText.trim()) return;
    try {
      const res = await api(`/api/labs/${lab.id}/submit-flag`, {
        method: "POST",
        body: JSON.stringify({ flag: flagText.trim() }),
      });
      if (res.correct) {
        push({ variant: "success", title: "Flag correct", description: res.message || "Well played!" });
        setLabs((xs) => xs.map((x) => (x.id === lab.id ? { ...x, solved: true, progressPct: 100 } : x)));
      } else {
        push({ variant: "error", title: "Incorrect flag", description: res.message || "Try again." });
      }
    } catch (e) {
      push({ variant: "error", title: "Submit failed", description: e.message });
    } finally {
      setFlagFor(null);
      setFlagText("");
    }
  }

  // --------------------------- UI ---------------------------
  if (!isAuthed) return <AuthGate />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Toasts />

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70 bg-slate-900/70 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-emerald-500/20 grid place-items-center border border-emerald-400/30">
              <Rocket className="size-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-300/80">Hackverse</div>
              <h1 className="text-xl sm:text-2xl font-bold">Labs & Rooms</h1>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <StreakPill user={user} />
              <XPChip user={user} />
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
              >
                <RefreshCcw className="size-4" /> Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <HeroBanner />

        <div className="mt-6 grid gap-4 sm:grid-cols-12">
          {/* Filters */}
          <div className="sm:col-span-9">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search labs, tags, challenges…"
                  className="w-full rounded-xl bg-slate-800/70 border border-white/10 pl-9 pr-3 py-2 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
              </div>

              <Dropdown
                label={<span className="inline-flex items-center gap-2"><Filter className="size-4" /> Difficulty</span>}
              >
                <div className="grid grid-cols-2 gap-2 p-2">
                  {DIFFICULTIES.map((d) => (
                    <ToggleChip
                      key={d}
                      active={activeDifficulties.includes(d)}
                      onClick={() =>
                        setActiveDifficulties((xs) =>
                          xs.includes(d) ? xs.filter((y) => y !== d) : [...xs, d]
                        )
                      }
                      className={prettyDiff(d)}
                    >
                      {d}
                    </ToggleChip>
                  ))}
                </div>
              </Dropdown>

              <Dropdown label={<span className="inline-flex items-center gap-2"><Settings2 className="size-4" /> Sort</span>}>
                <div className="p-2 grid gap-2">
                  {SORTS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSort(s.key)}
                      className={cn(
                        "text-left rounded-lg px-3 py-2 hover:bg-white/5",
                        sort === s.key ? "bg-white/10 border border-white/10" : ""
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </Dropdown>

              {/* Active tag chips */}
              <div className="flex flex-wrap gap-2">
                {activeDifficulties.map((d) => (
                  <ActiveChip key={d} onRemove={() => setActiveDifficulties((xs) => xs.filter((x) => x !== d))}>
                    {d}
                  </ActiveChip>
                ))}
                {activeTags.map((t) => (
                  <ActiveChip key={t} onRemove={() => setActiveTags((xs) => xs.filter((x) => x !== t))}>
                    {t}
                  </ActiveChip>
                ))}
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
              <div className="text-xs uppercase text-slate-400 mb-2">Quick Tags</div>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <ToggleChip
                    key={t}
                    active={activeTags.includes(t)}
                    onClick={() =>
                      setActiveTags((xs) => (xs.includes(t) ? xs.filter((x) => x !== t) : [...xs, t]))
                    }
                  >
                    {t}
                  </ToggleChip>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { key: "all", label: "All" },
            { key: "unstarted", label: "Unstarted" },
            { key: "progress", label: "In Progress" },
            { key: "solved", label: "Solved" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-xl px-4 py-2 border",
                tab === t.key
                  ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-200"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <LabSkeleton key={i} />)
            : filtered.map((lab, i) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <LabCard
                    lab={lab}
                    running={running[lab.id]}
                    launching={launchingId === lab.id}
                    onLaunch={launchLab(lab)}
                    onFlag={() => setFlagFor(lab)}
                  />
                </motion.div>
              ))}
        </div>

        {/* No results */}
        {!loading && filtered.length === 0 && (
          <div className="mt-16 text-center text-slate-400">
            <p className="text-lg mb-2">No labs match your filters.</p>
            <p className="text-sm">Try clearing some filters or searching a different keyword.</p>
          </div>
        )}
      </main>

      {/* Flag Modal */}
      <AnimatePresence>
        {flagFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
            onClick={() => setFlagFor(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="size-9 rounded-xl bg-emerald-500/20 grid place-items-center border border-emerald-400/30">
                  <Flag className="size-5 text-emerald-300" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">Submit Flag</div>
                  <div className="font-semibold">{flagFor.title}</div>
                </div>
                <button onClick={() => setFlagFor(null)} className="ml-auto opacity-70 hover:opacity-100">
                  <X className="size-4" />
                </button>
              </div>
              <input
                autoFocus
                value={flagText}
                onChange={(e) => setFlagText(e.target.value)}
                placeholder="flag{…}"
                className="w-full rounded-xl bg-slate-800/70 border border-white/10 px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
              <div className="flex items-center gap-2 justify-end">
                <button onClick={() => setFlagFor(null)} className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10">
                  Cancel
                </button>
                <button
                  onClick={() => submitFlag(flagFor)}
                  className="rounded-xl px-3 py-2 bg-emerald-500 text-emerald-950 font-semibold hover:brightness-110"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --------------------------- Subcomponents ---------------------------
function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-900 p-5 md:p-7">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Sharpen your skills. Win the flag. 🏴‍☠️</h2>
          <p className="mt-1 text-slate-300 max-w-2xl">
            Pick a room, launch an isolated container, and hack your way to victory. Earn XP, keep a streak, and climb the Hackverse leaderboard.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <Pill icon={Swords}>Rooms & mini-CTFs</Pill>
            <Pill icon={ShieldCheck}>Safe, sandboxed instances</Pill>
            <Pill icon={Timer}>Bite-sized to 90-min labs</Pill>
          </div>
        </div>
        <motion.div
          initial={{ rotate: -2, y: 6, opacity: 0 }}
          animate={{ rotate: 0, y: 0, opacity: 1 }}
          className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 w-full md:w-80"
        >
          <div className="text-xs uppercase text-slate-400 mb-2">Daily Challenge</div>
          <div className="font-semibold">One-liner XSS</div>
          <div className="text-sm text-slate-300">Pop an alert with a single payload in a quirky filter chain.</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 text-emerald-300"><Star className="size-4" /> +25 XP</div>
            <div className="flex items-center gap-1 text-slate-300"><Timer className="size-4" /> ~10 min</div>
          </div>
          <button className="mt-3 w-full rounded-xl bg-emerald-500 text-emerald-950 font-semibold py-2 hover:brightness-110">
            Try now
          </button>
        </motion.div>
      </div>
      <GlowOrbs />
    </div>
  );
}

function Pill({ children, icon: Icon }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-200">
      {Icon && <Icon className="size-4" />} {children}
    </span>
  );
}

function GlowOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 size-64 rounded-full bg-violet-500/10 blur-3xl" />
    </>
  );
}

function StreakPill({ user }) {
  const streak = user?.streak ?? 3;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-amber-200">
      <Flame className="size-4" /> {streak} day streak
    </span>
  );
}

function XPChip({ user }) {
  const xp = user?.xp ?? 420;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-2.5 py-1 text-fuchsia-200">
      <Trophy className="size-4" /> {xp} XP
    </span>
  );
}

function Dropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
      >
        {label} <ChevronDown className="size-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            onMouseLeave={() => setOpen(false)}
            className="absolute z-20 mt-2 min-w-56 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur p-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToggleChip({ active, className, children, ...props }) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm",
        active
          ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-200"
          : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200",
        className
      )}
    >
      {children}
    </button>
  );
}

function ActiveChip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
      {children}
      <button onClick={onRemove} className="opacity-70 hover:opacity-100">
        <X className="size-3.5" />
      </button>
    </span>
  );
}

function LabSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-900/50">
      <div className="h-36 bg-slate-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-2/3 bg-slate-800 animate-pulse rounded" />
        <div className="h-4 w-full bg-slate-800 animate-pulse rounded" />
        <div className="h-4 w-5/6 bg-slate-800 animate-pulse rounded" />
        <div className="h-8 w-40 bg-slate-800 animate-pulse rounded" />
      </div>
    </div>
  );
}

function LabCard({ lab, running, launching, onLaunch, onFlag }) {
  const solved = lab.solved;

  return (
    <div className="group rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60 hover:bg-slate-900/80 transition-all">
      <div className="relative h-40 overflow-hidden">
        <img
          src={lab.thumbnailUrl}
          alt="thumbnail"
          className="h-full w-full object-cover object-center opacity-90 group-hover:opacity-100 transition"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn("px-2.5 py-1 rounded-full border text-xs", prettyDiff(lab.difficulty))}>{lab.difficulty}</span>
          {solved && (
            <span className="px-2.5 py-1 rounded-full border text-xs bg-emerald-500/20 border-emerald-400/30 text-emerald-200">
              Solved
            </span>
          )}
        </div>
        {!!(lab.progressPct && !solved) && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-emerald-400"
              style={{ width: `${lab.progressPct}%` }}
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold leading-tight">{lab.title}</h3>
            <p className="mt-1 text-sm text-slate-300 line-clamp-2">{lab.summary}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {lab.tags.map((t) => (
                <span key={t} className="text-xs rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right min-w-[88px]">
            <div className="text-sm text-emerald-200 font-semibold">{lab.points} pts</div>
            <div className="text-xs text-slate-400 inline-flex items-center gap-1"><Timer className="size-3.5" />~{lab.estTime}m</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {running?.status === "running" ? (
            <a
              href={running.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-emerald-950 font-semibold px-3 py-2 hover:brightness-110"
            >
              Open Instance <ExternalLink className="size-4" />
            </a>
          ) : (
            <button
              disabled={launching}
              onClick={onLaunch}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-emerald-950 font-semibold px-3 py-2 disabled:opacity-60"
            >
              {launching ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />} Launch
            </button>
          )}

          <button
            onClick={onFlag}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2"
          >
            <Flag className="size-4" /> Submit Flag
          </button>
        </div>

        {running && running.status !== "running" && (
          <div className="mt-3 text-xs text-slate-400 inline-flex items-center gap-2">
            <Loader2 className="size-3.5 animate-spin" /> Instance status: {running.status}
          </div>
        )}
      </div>
    </div>
  );
}

function AuthGate() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center">
        <div className="mx-auto size-12 rounded-2xl grid place-items-center bg-slate-800 border border-white/10">
          <Lock className="size-6 text-slate-300" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Sign in to access Hackverse Labs</h2>
        <p className="mt-1 text-slate-300">Create a free account to launch rooms, earn XP, and track your progress.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="rounded-xl bg-emerald-500 text-emerald-950 font-semibold px-3 py-2 hover:brightness-110">
            Sign up
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
