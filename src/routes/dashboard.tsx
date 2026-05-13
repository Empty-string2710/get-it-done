import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Home, ListChecks, Compass, Wallet as WalletIcon, MessageSquare,
  Layers, ClipboardList, BarChart3, Banknote, Settings, LogOut,
  Bell, Plus, Star, Search, Check, X, Send, ChevronDown, Sparkles, Copy,
} from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import { useStore } from "@/lib/store";
import { skills, categories, earningsData, payouts } from "@/lib/mockData";
import { SkillCard } from "@/components/SkillCard";

type Tab = "home" | "results" | "catalog" | "wallet" | "messages"
  | "my-skills" | "applications" | "author-results" | "finance" | "settings";

type SearchParams = { tab?: Tab; chat?: string };

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    tab: (s.tab as Tab) || "home",
    chat: s.chat as string | undefined,
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/dashboard" });
  const tab = (search.tab || "home") as Tab;

  const user = useStore((s) => s.user);
  const isAuthed = useStore((s) => s.user.isAuthed);
  const login = useStore((s) => s.login);

  // Auto-login for demo if not authed
  useEffect(() => { if (!isAuthed) login(); }, [isAuthed, login]);

  const setTab = (t: Tab, extra?: Record<string, any>) =>
    navigate({ to: "/dashboard", search: { tab: t, ...extra } as any });

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Sidebar tab={tab} setTab={setTab} />
      <Header tab={tab} setTab={setTab} />
      <main className="ml-[256px] pt-[60px] min-h-screen">
        {tab === "messages" ? (
          <MessagesTab />
        ) : (
          <div className="p-6">
            {tab === "home" && <HomeTab setTab={setTab} />}
            {tab === "results" && <ResultsTab setTab={setTab} />}
            {tab === "catalog" && <CatalogTab />}
            {tab === "wallet" && <WalletTab />}
            {tab === "my-skills" && <MySkillsTab />}
            {tab === "applications" && <ApplicationsTab />}
            {tab === "author-results" && <AuthorResultsTab />}
            {tab === "finance" && <FinanceTab />}
            {tab === "settings" && <SettingsTab />}
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}

/* ───────────── SIDEBAR ───────────── */

function Sidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const user = useStore((s) => s.user);
  const unread = useStore((s) => s.chats.reduce((a, c) => a + c.unread, 0));
  const pending = useStore((s) => s.applications.filter((a) => a.status === "pending").length);
  const setHasSkills = useStore((s) => s.setHasSkills);
  const logout = useStore((s) => s.logout);

  const userItems: { id: Tab; icon: any; label: string; badge?: number }[] = [
    { id: "home", icon: Home, label: "Главная" },
    { id: "results", icon: ListChecks, label: "Мои результаты" },
    { id: "catalog", icon: Compass, label: "Каталог" },
    { id: "wallet", icon: WalletIcon, label: "Кошелёк" },
    { id: "messages", icon: MessageSquare, label: "Сообщения", badge: unread },
  ];

  const authorItems: { id: Tab; icon: any; label: string; badge?: number }[] = [
    { id: "my-skills", icon: Layers, label: "Мои навыки" },
    { id: "applications", icon: ClipboardList, label: "Заявки", badge: pending },
    { id: "author-results", icon: BarChart3, label: "Результаты" },
    { id: "finance", icon: Banknote, label: "Финансы" },
  ];

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[256px] z-30 flex flex-col"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      <Link to="/" className="px-5 h-[60px] flex items-center border-b border-border">
        <span className="text-lg font-extrabold gradient-text">3-С</span>
      </Link>

      <div className="px-4 py-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full avatar-gradient text-sm border-2" style={{ borderColor: "var(--primary)" }}>
          {user.name[0]}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{user.name}</div>
          <div className="text-xs text-text-muted">Пользователь</div>
        </div>
      </div>

      <nav className="px-3 pt-4 flex-1 overflow-y-auto">
        <div className="text-[10px] uppercase font-semibold text-text-muted px-2 mb-2 tracking-wider">Меню</div>
        {userItems.map((it) => (
          <NavBtn key={it.id} {...it} active={tab === it.id} onClick={() => setTab(it.id)} />
        ))}

        {user.hasSkills && (
          <>
            <div className="border-t border-border my-3 mx-3" />
            <div className="text-[10px] uppercase font-semibold text-accent px-2 mb-2 tracking-wider">Автор</div>
            {authorItems.map((it) => (
              <NavBtn key={it.id} {...it} active={tab === it.id} onClick={() => setTab(it.id)} accent />
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-border p-3">
        <NavBtn id="settings" icon={Settings} label="Настройки" active={tab === "settings"} onClick={() => setTab("settings")} />
        {!user.hasSkills && (
          <button onClick={() => setHasSkills(true)} className="nav-item w-full text-primary">
            <Sparkles className="w-4 h-4" />
            Стать автором
          </button>
        )}
        <button onClick={logout} className="nav-item w-full">
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
}

function NavBtn({
  icon: Icon, label, active, onClick, badge, accent,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`nav-item w-full ${active ? (accent ? "active-accent" : "active") : ""}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge && badge > 0 ? (
        <span
          className="rounded-full px-1.5 text-[11px] font-semibold text-white"
          style={{ background: accent ? "var(--warning)" : "var(--primary)", minWidth: 20, textAlign: "center" }}
        >{badge}</span>
      ) : null}
    </button>
  );
}

/* ───────────── HEADER ───────────── */

const tabTitles: Record<Tab, string> = {
  home: "Главная", results: "Мои результаты", catalog: "Каталог", wallet: "Кошелёк",
  messages: "Сообщения", "my-skills": "Мои навыки", applications: "Заявки",
  "author-results": "Результаты пользователей", finance: "Финансы", settings: "Настройки",
};

function Header({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const user = useStore((s) => s.user);
  const notifs = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotifRead);
  const [open, setOpen] = useState(false);
  const unread = notifs.filter((n) => !n.read).length;

  const dotColor = (t: string) =>
    t === "application" ? "var(--warning)" : t === "payout" ? "var(--success)" : "var(--primary)";

  return (
    <header
      className="fixed top-0 left-[256px] right-0 h-[60px] z-20 flex items-center justify-between px-6 backdrop-blur-md border-b"
      style={{ background: "rgba(15,15,24,0.9)", borderColor: "var(--border)" }}
    >
      <h1 className="text-[17px] font-semibold text-text-primary">{tabTitles[tab]}</h1>

      <div className="flex items-center gap-3 relative">
        <button onClick={() => setOpen(!open)} className="relative w-10 h-10 rounded-lg hover:bg-card flex items-center justify-center">
          <Bell className="w-5 h-5 text-text-secondary" />
          {unread > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />}
        </button>

        {open && (
          <div className="absolute top-12 right-0 w-80 card-base p-0 overflow-hidden shadow-xl z-50" onMouseLeave={() => setOpen(false)}>
            <div className="px-4 py-3 border-b border-border flex justify-between items-center">
              <span className="text-sm font-semibold">Уведомления</span>
              <button onClick={() => markRead()} className="btn-ghost !px-2 !py-1 !text-xs">Отметить все</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifs.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className="w-full text-left px-4 py-3 border-b border-border hover:bg-surface flex gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: n.read ? "var(--text-muted)" : dotColor(n.type) }} />
                  <div className="flex-1">
                    <div className="text-sm text-text-primary">{n.text}</div>
                    <div className="text-xs text-text-muted mt-0.5">{n.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setTab("wallet")}
          className="flex items-center gap-2 rounded-full px-4 py-1.5 border hover:border-border-hover transition-colors"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <WalletIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold">{user.balance} ₽</span>
        </button>

        <div className="w-9 h-9 rounded-full avatar-gradient text-sm border-2" style={{ borderColor: "var(--primary)" }}>
          {user.name[0]}
        </div>
      </div>
    </header>
  );
}

/* ───────────── HOME TAB ───────────── */

function HomeTab({ setTab }: { setTab: (t: Tab) => void }) {
  const user = useStore((s) => s.user);
  const results = useStore((s) => s.results);
  const last = results[0];
  const totalSpent = results.reduce((a, r) => a + r.amount, 0);
  const avgRating = 4.9;
  const recommended = skills.filter((s) => s.author === "Михаил Петров" && s.status === "published");

  return (
    <div className="max-w-6xl">
      <h2 className="text-[26px] font-bold tracking-tight">Добрый день, {user.name.split(" ")[0]}</h2>
      <p className="text-sm text-text-muted mb-8">Среда, 13 мая 2026</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon={Sparkles} label="Всего запусков" value={String(results.length)} />
        <StatCard icon={WalletIcon} label="Потрачено" value={`${totalSpent} ₽`} />
        <StatCard icon={Star} label="Средний рейтинг" value={String(avgRating)} />
      </div>

      {last && (
        <div className="card-base p-6 mb-6">
          <div className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Последний запуск</div>
          <div className="mt-2 text-lg font-semibold">{last.skillTitle}</div>
          <div className="text-2xl font-bold text-primary mt-1">{last.result}</div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center flex-wrap gap-3">
            <span className="text-[13px] text-text-muted">{last.date} · {last.amount} ₽</span>
            <div className="flex gap-2">
              <button className="btn-secondary !text-[13px] !px-3 !py-1.5" onClick={() => setTab("results")}>Открыть результат</button>
              <Link to="/skill/$id" params={{ id: last.skillId }} className="btn-primary !text-[13px] !px-3 !py-1.5">Запустить снова</Link>
            </div>
          </div>
        </div>
      )}

      <div className="card-base p-5 mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="text-sm font-semibold text-text-secondary">Кошелёк</div>
          <div className="text-3xl font-bold mt-1">{user.balance} ₽</div>
        </div>
        <div className="text-right">
          <div className="text-[13px] text-text-muted">Хватит ещё на {Math.floor(user.balance / 100)} запуска</div>
          <button onClick={() => setTab("wallet")} className="btn-primary !text-[13px] !px-4 !py-1.5 mt-2">Пополнить</button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[17px] font-semibold">Другие навыки от Михаила</h3>
          <button onClick={() => setTab("catalog")} className="btn-ghost !text-[13px]">Все навыки</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recommended.map((s) => (
            <div key={s.id} className="w-[300px] shrink-0">
              <SkillCard skill={s} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="card-base p-5">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="text-[11px] uppercase font-semibold text-text-muted tracking-wider mt-3">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

/* ───────────── RESULTS ───────────── */

function ResultsTab({ setTab }: { setTab: (t: Tab) => void }) {
  const results = useStore((s) => s.results);

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-[17px] font-semibold mt-4">Вы ещё не запускали навыков</h3>
        <p className="text-sm text-text-muted mt-2">Перейдите в каталог и выберите первый навык</p>
        <button onClick={() => setTab("catalog")} className="btn-primary mt-6">Перейти в каталог</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[22px] font-bold">Мои результаты</h2>
        <button className="btn-secondary !text-[13px] !py-2">Все навыки <ChevronDown className="w-3 h-3" /></button>
      </div>
      <div className="space-y-3">
        {results.map((r) => (
          <div key={r.id} className="card-base p-5 flex items-center gap-4 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--primary)" }} />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold">{r.skillTitle} <span className="text-primary ml-2">{r.result}</span></div>
              <div className="text-xs text-text-muted mt-1">{r.date} · {r.amount} ₽</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost !text-[13px]">Открыть</button>
              <Link to="/skill/$id" params={{ id: r.skillId }} className="btn-primary !text-[13px] !px-3 !py-1.5">Повторить</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── CATALOG ───────────── */

function CatalogTab() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Все");
  const filtered = skills.filter(
    (s) => s.status === "published"
      && (cat === "Все" || s.category === cat)
      && s.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <div className="card-base !p-0 px-4 py-3 mb-6 flex gap-3 items-center">
        <Search className="w-4 h-4 text-text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск навыков..."
          className="bg-transparent outline-none flex-1 text-sm"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="rounded-full px-4 py-2 text-[13px] font-medium border transition-all"
            style={
              cat === c
                ? { background: "var(--primary-light)", borderColor: "rgba(99,102,241,0.4)", color: "var(--primary)", fontWeight: 600 }
                : { background: "var(--card)", borderColor: "var(--border)", color: "var(--text-secondary)" }
            }
          >{c}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => <SkillCard key={s.id} skill={s} />)}
      </div>
    </div>
  );
}

/* ───────────── WALLET ───────────── */

function WalletTab() {
  const user = useStore((s) => s.user);
  const txs = useStore((s) => s.transactions);
  const topUp = useStore((s) => s.topUp);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(500);

  const handleTopUp = () => {
    topUp(amount);
    pushToast(`Баланс пополнен на ${amount} ₽`);
    setOpen(false);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-[22px] font-bold mb-6">Кошелёк</h2>

      <div className="card-base p-8 text-center mb-6">
        <div className="text-[13px] uppercase tracking-wider text-text-muted font-semibold">Ваш баланс</div>
        <div className="text-[52px] font-extrabold mt-2 leading-none">{user.balance} ₽</div>
        <p className="text-sm text-text-muted mt-2">Хватит ещё на {Math.floor(user.balance / 100)} запуска MBTI теста</p>
        <button
          onClick={() => setOpen(true)}
          className="btn-primary !px-8 !py-3 mt-6"
          style={{ boxShadow: "0 6px 24px rgba(99,102,241,0.4)" }}
        >Пополнить баланс</button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">История операций</h3>
        <div className="card-base !p-0 overflow-hidden">
          <div className="grid grid-cols-[120px_1fr_120px_120px] px-5 py-3 border-b border-border text-[12px] uppercase font-semibold text-text-muted tracking-wider" style={{ background: "var(--surface)" }}>
            <div>Дата</div><div>Описание</div><div className="text-right">Сумма</div><div className="text-right">Остаток</div>
          </div>
          {txs.map((t) => (
            <div key={t.id} className="grid grid-cols-[120px_1fr_120px_120px] px-5 py-4 border-b border-border hover:bg-surface text-sm">
              <div className="text-text-secondary text-[13px]">{t.date}</div>
              <div>{t.description}</div>
              <div className="text-right font-semibold font-mono" style={{ color: t.amount > 0 ? "var(--success)" : "var(--danger)" }}>
                {t.amount > 0 ? "+" : ""}{t.amount} ₽
              </div>
              <div className="text-right text-text-muted text-[13px]">{t.balance} ₽</div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setOpen(false)}>
          <div className="card-base p-6 max-w-[460px] w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold">Пополнить кошелёк</h3>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[500, 1000, 2000].map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className="rounded-xl p-4 text-center border transition-all"
                  style={
                    amount === a
                      ? { background: "var(--primary-light)", borderColor: "var(--primary)" }
                      : { background: "var(--surface)", borderColor: "var(--border)" }
                  }
                >
                  <div className="text-lg font-bold">{a} ₽</div>
                  <div className="text-xs text-text-muted mt-1">≈ {Math.floor(a / 100)} запусков</div>
                </button>
              ))}
            </div>
            <input
              type="number"
              className="input-base mt-4"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              placeholder="Своя сумма"
            />
            <p className="mt-3 text-[13px] text-text-muted">{amount} ₽ хватит на {Math.floor(amount / 100)} запусков MBTI теста (100 ₽/запуск)</p>
            <button onClick={handleTopUp} className="btn-primary w-full !py-3 mt-5">Перейти к оплате</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────── MESSAGES ───────────── */

function MessagesTab() {
  const search = useSearch({ from: "/dashboard" });
  const navigate = useNavigate();
  const chats = useStore((s) => s.chats);
  const sendMessage = useStore((s) => s.sendMessage);
  const markRead = useStore((s) => s.markChatRead);

  const activeId = search.chat || chats[0]?.id;
  const active = chats.find((c) => c.id === activeId);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (active) markRead(active.id); }, [active?.id]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [active?.messages.length]);

  const send = () => {
    if (!draft.trim() || !active) return;
    sendMessage(active.id, draft.trim());
    setDraft("");
  };

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Left */}
      <div className="w-[300px] flex flex-col border-r border-border" style={{ background: "var(--surface)" }}>
        <div className="px-4 py-4 border-b border-border">
          <div className="text-[17px] font-bold">Сообщения</div>
          <input className="input-base !py-2 !text-[13px] mt-3" placeholder="Поиск" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate({ to: "/dashboard", search: { tab: "messages", chat: c.id } as any })}
              className="w-full text-left px-4 py-3 hover:bg-card transition-colors flex items-center gap-3 cursor-pointer"
              style={activeId === c.id ? { background: "var(--primary-light)", borderLeft: "3px solid var(--primary)" } : {}}
            >
              <div className="w-11 h-11 rounded-full avatar-gradient text-sm shrink-0">
                {c.type === "assistant" ? "AI" : c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <span className="text-sm font-semibold truncate">{c.name}</span>
                  <span className="text-[11px] text-text-muted shrink-0">{c.lastTime}</span>
                </div>
                <div className="flex justify-between gap-2 mt-0.5">
                  <span className="text-[13px] text-text-secondary truncate flex-1">{c.lastMessage}</span>
                  {c.unread > 0 && (
                    <span className="rounded-full text-[11px] font-bold text-white px-1.5" style={{ background: "var(--primary)", minWidth: 20, textAlign: "center" }}>
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col bg-background">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-[17px] font-semibold mt-3">Выберите чат</h3>
              <p className="text-[13px] text-text-muted mt-1">Или начните с помощником</p>
            </div>
          </div>
        ) : (
          <>
            <div className="h-14 border-b border-border px-5 flex items-center gap-3" style={{ background: "var(--surface)" }}>
              <div className="w-10 h-10 rounded-full avatar-gradient text-sm">{active.type === "assistant" ? "AI" : active.name[0]}</div>
              <div>
                <div className="text-[15px] font-bold">{active.name}</div>
                <div className="text-xs text-text-muted">{active.subtitle}</div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
              <div className="text-center text-[11px] text-text-muted py-2">Сегодня</div>
              {active.messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-xl text-sm leading-relaxed ${m.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm border border-border"}`}
                    style={
                      m.role === "user"
                        ? { background: "var(--gradient-primary)", color: "white" }
                        : { background: "var(--card)", color: "var(--text-primary)" }
                    }
                  >
                    {m.text}
                    <div className={`text-[11px] mt-1 ${m.role === "user" ? "text-white/60 text-right" : "text-text-muted"}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-4 py-3" style={{ background: "var(--surface)" }}>
              <div className="flex items-end gap-3">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  rows={1}
                  placeholder="Написать сообщение..."
                  className="input-base flex-1 resize-none min-h-[44px] max-h-[140px] !rounded-xl"
                />
                <button
                  onClick={send}
                  disabled={!draft.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={
                    draft.trim()
                      ? { background: "var(--gradient-primary)", boxShadow: "0 4px 15px rgba(99,102,241,0.35)" }
                      : { background: "var(--surface)", border: "1px solid var(--border)" }
                  }
                >
                  <Send className={`w-4 h-4 ${draft.trim() ? "text-white" : "text-text-muted"}`} />
                </button>
              </div>
              <div className="text-[11px] text-text-muted mt-1.5">Enter — отправить · Shift+Enter — новая строка</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────────── AUTHOR: MY SKILLS ───────────── */

function MySkillsTab() {
  const mySkills = skills.filter((s) => s.authorUsername === "mikhail");

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[22px] font-bold">Мои навыки</h2>
        <button className="btn-primary"><Plus className="w-4 h-4" />Создать навык</button>
      </div>
      <div className="space-y-4">
        {mySkills.map((s) => (
          <div key={s.id} className="card-base p-6">
            <div className="flex justify-between items-start gap-3">
              <h3 className="text-[17px] font-semibold">{s.title}</h3>
              <span className={`badge-base badge-${s.status}`}>
                {s.status === "published" ? "Опубликован" : s.status === "draft" ? "Черновик" : s.status}
              </span>
            </div>
            <span className="badge-base badge-category mt-2 inline-flex">{s.category}</span>

            <div className="border-t border-border mt-4 pt-4 flex gap-6 flex-wrap">
              {[
                { v: `${s.runs}`, l: "запусков", icon: Sparkles },
                { v: `${s.earnings.toLocaleString("ru-RU")} ₽`, l: "заработано", icon: WalletIcon },
                { v: s.rating, l: "рейтинг", icon: Star },
              ].map((st, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-text-secondary">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--surface)" }}>
                    <st.icon className="w-3.5 h-3.5 text-text-muted" />
                  </span>
                  <span className="text-sm font-semibold text-text-primary">{st.v}</span>
                  <span className="text-xs text-text-muted">{st.l}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <button className="btn-secondary !text-[13px] !py-1.5">Редактировать</button>
              <button className="btn-ghost !text-[13px]">Статистика</button>
              <button className="btn-ghost !text-[13px]" onClick={() => { navigator.clipboard?.writeText(`${location.origin}/skill/${s.id}`); pushToast("Ссылка скопирована"); }}>
                <Copy className="w-3.5 h-3.5" /> Скопировать ссылку
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── AUTHOR: APPLICATIONS ───────────── */

function ApplicationsTab() {
  const apps = useStore((s) => s.applications);
  const approve = useStore((s) => s.approveApp);
  const reject = useStore((s) => s.rejectApp);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  const counts = {
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };
  const filtered = apps.filter((a) => a.status === filter);

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[22px] font-bold">Заявки</h2>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold border"
          style={{ background: "var(--warning-light)", color: "var(--warning)", borderColor: "rgba(245,158,11,0.3)" }}
        >
          {counts.pending} новых
        </span>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit mb-6" style={{ background: "var(--card)" }}>
        {(["pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
            style={
              filter === f
                ? { background: "var(--surface)", color: "var(--text-primary)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }
                : { color: "var(--text-secondary)" }
            }
          >
            {f === "pending" ? `Новые (${counts.pending})` : f === "approved" ? `Одобренные (${counts.approved})` : `Отклонённые (${counts.rejected})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted text-sm">Здесь пусто</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.id} className="card-base p-6">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-10 h-10 rounded-full avatar-gradient text-sm">{a.userName[0]}</div>
                <div>
                  <div className="text-[15px] font-semibold">{a.userName}</div>
                  <div className="text-xs text-text-muted">{a.date}</div>
                </div>
                <span className="badge-base badge-category ml-auto">{a.skillTitle}</span>
              </div>

              <button
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                className="btn-ghost !text-[13px] mt-4 !px-0"
              >
                Показать ответы <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded === a.id ? "rotate-180" : ""}`} />
              </button>

              {expanded === a.id && (
                <div className="rounded-xl p-4 mt-2 space-y-2" style={{ background: "var(--surface)" }}>
                  {a.answers.map((ans, i) => (
                    <div key={i}>
                      <div className="text-xs text-text-muted">Вопрос {i + 1}</div>
                      <div className="text-sm text-text-primary mt-0.5">{ans}</div>
                    </div>
                  ))}
                </div>
              )}

              {a.rejectComment && (
                <div className="mt-3 text-[13px] text-danger">Причина отклонения: {a.rejectComment}</div>
              )}

              {a.status === "pending" && (
                <div className="mt-5 pt-4 border-t border-border">
                  {rejectingId === a.id ? (
                    <div>
                      <textarea
                        className="input-base text-[13px]"
                        rows={2}
                        placeholder="Причина отклонения"
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                      />
                      <div className="mt-3 flex gap-3">
                        <button onClick={() => setRejectingId(null)} className="btn-secondary">Отмена</button>
                        <button
                          onClick={() => { reject(a.id, rejectComment || "Не указано"); setRejectingId(null); setRejectComment(""); pushToast("Заявка отклонена"); }}
                          className="btn-danger"
                        >Подтвердить отклонение</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => { approve(a.id); pushToast("Заявка одобрена"); }}
                        className="btn-base inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-semibold text-sm transition-all"
                        style={{ background: "var(--success-light)", border: "1px solid rgba(34,197,94,0.3)", color: "var(--success)" }}
                      >
                        <Check className="w-4 h-4" /> Одобрить
                      </button>
                      <button onClick={() => setRejectingId(a.id)} className="btn-secondary">
                        <X className="w-4 h-4" /> Отклонить
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────── AUTHOR: RESULTS ───────────── */

function AuthorResultsTab() {
  const [view, setView] = useState<"summary" | "users">("summary");
  const data = [
    { name: "INTJ", value: 32, color: "#6366F1" },
    { name: "ENFJ", value: 24, color: "#8B5CF6" },
    { name: "INFP", value: 18, color: "#A78BFA" },
    { name: "ESTP", value: 14, color: "#22C55E" },
    { name: "Другие", value: 12, color: "#F59E0B" },
  ];

  const tableData = [
    { user: "Елена М.", skill: "MBTI Тест", result: "ENFJ", date: "2026-05-03", status: "viewed" },
    { user: "Анонимно", skill: "MBTI Тест", result: "INTJ", date: "2026-05-02", status: "new" },
    { user: "Игорь П.", skill: "Тест Люшера", result: "Тревожность", date: "2026-05-01", status: "viewed" },
  ];
  const [selected, setSelected] = useState<typeof tableData[0] | null>(null);

  return (
    <div className="max-w-6xl">
      <div className="flex gap-1 p-1 rounded-xl w-fit mb-6" style={{ background: "var(--card)" }}>
        {(["summary", "users"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setView(f)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={view === f ? { background: "var(--surface)", color: "var(--text-primary)" } : { color: "var(--text-secondary)" }}
          >
            {f === "summary" ? "Сводка" : "По пользователям"}
          </button>
        ))}
      </div>

      {view === "summary" ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="text-base font-semibold mb-4">Распределение результатов</h3>
            <div style={{ height: 240 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={3}>
                    {data.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#222235", border: "1px solid #2E2E4A", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {data.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-[13px]">
                  <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-text-secondary">{d.name}</span>
                  <span className="ml-auto text-text-muted">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base p-6">
            <h3 className="text-base font-semibold mb-4">Топ результатов</h3>
            <div className="space-y-3">
              {data.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium w-24">{d.name}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--primary-light)" }}>
                    <div className="h-full" style={{ width: `${d.value * 3}%`, background: "var(--primary)" }} />
                  </div>
                  <span className="text-sm text-text-muted w-10 text-right">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card-base !p-0 overflow-hidden">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_120px_120px] px-5 py-3 border-b border-border text-[12px] uppercase font-semibold text-text-muted tracking-wider" style={{ background: "var(--surface)" }}>
              <div>Пользователь</div><div>Навык</div><div>Результат</div><div>Дата</div><div>Статус</div>
            </div>
            {tableData.map((r, i) => (
              <button
                key={i}
                onClick={() => setSelected(r)}
                className="w-full text-left grid grid-cols-[1.2fr_1fr_1fr_120px_120px] items-center px-5 py-4 border-b border-border hover:bg-surface text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full avatar-gradient text-xs">{r.user[0]}</div>
                  <span>{r.user}</span>
                </div>
                <span className="text-text-secondary text-[13px]">{r.skill}</span>
                <span className="text-primary font-semibold">{r.result}</span>
                <span className="text-text-muted text-[13px]">{r.date}</span>
                <span className={`badge-base ${r.status === "new" ? "badge-pending" : "badge-published"}`}>
                  {r.status === "new" ? "Новый" : "Просмотрен"}
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="fixed top-0 right-0 bottom-0 w-[320px] z-40 border-l border-border" style={{ background: "var(--surface)" }}>
              <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                <h3 className="text-base font-bold">Результат</h3>
                <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-text-muted hover:text-text-primary" /></button>
              </div>
              <div className="px-5 py-4">
                <div className="text-2xl font-bold text-primary">{selected.result}</div>
                <div className="text-xs text-text-muted mt-1">{selected.date}</div>
                <div className="mt-4 text-sm text-text-secondary">{selected.skill}</div>
                <div className="mt-1 text-sm">{selected.user}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ───────────── FINANCE ───────────── */

function FinanceTab() {
  const total = 8450;
  const available = 6200;

  return (
    <div className="max-w-6xl">
      <h2 className="text-[22px] font-bold mb-6">Финансы</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon={WalletIcon} label="Заработано в мае" value={`${total.toLocaleString("ru-RU")} ₽`} />
        <StatCard icon={Sparkles} label="Всего запусков" value="342" />
        <StatCard icon={Banknote} label="Доступно к выводу" value={`${available.toLocaleString("ru-RU")} ₽`} />
      </div>

      <div className="card-base p-6 mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="text-sm text-text-muted">Доступно к выводу</div>
          <div className="text-4xl font-extrabold mt-1">{available.toLocaleString("ru-RU")} ₽</div>
        </div>
        <button onClick={() => pushToast("Запрос на выплату отправлен")} className="btn-primary !px-6 !py-3">Запросить выплату</button>
      </div>

      <div className="card-base p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Доходы за 30 дней</h3>
          <button className="btn-ghost !text-[13px]">30 дней <ChevronDown className="w-3 h-3" /></button>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={earningsData}>
              <XAxis dataKey="date" hide />
              <YAxis stroke="#5A5A7A" tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip
                contentStyle={{ background: "#222235", border: "1px solid #2E2E4A", borderRadius: 8 }}
                labelStyle={{ color: "#A0A0B8" }}
              />
              <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-base !p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold">История выплат</h3>
        </div>
        <div className="grid grid-cols-3 px-5 py-3 border-b border-border text-[12px] uppercase font-semibold text-text-muted tracking-wider" style={{ background: "var(--surface)" }}>
          <div>Дата</div><div>Сумма</div><div>Статус</div>
        </div>
        {payouts.map((p) => (
          <div key={p.id} className="grid grid-cols-3 px-5 py-4 border-b border-border text-sm">
            <div className="text-text-secondary text-[13px]">{p.date}</div>
            <div className="font-semibold">{p.amount.toLocaleString("ru-RU")} ₽</div>
            <div>
              <span className={`badge-base ${p.status === "paid" ? "badge-published" : "badge-pending"}`}>
                {p.status === "paid" ? "Выплачено" : "В обработке"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── SETTINGS ───────────── */

function SettingsTab() {
  const user = useStore((s) => s.user);
  const setHasSkills = useStore((s) => s.setHasSkills);
  return (
    <div className="max-w-2xl">
      <h2 className="text-[22px] font-bold mb-6">Настройки</h2>
      <div className="card-base p-6 space-y-4">
        <div>
          <label className="text-xs uppercase text-text-muted font-semibold tracking-wider">Имя</label>
          <input className="input-base mt-2" defaultValue={user.name} />
        </div>
        <div>
          <label className="text-xs uppercase text-text-muted font-semibold tracking-wider">Телефон</label>
          <input className="input-base mt-2" defaultValue={user.phone} />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <div>
            <div className="text-sm font-semibold">Режим автора</div>
            <div className="text-xs text-text-muted">Доступ к панели создателя навыков</div>
          </div>
          <button onClick={() => setHasSkills(!user.hasSkills)} className={user.hasSkills ? "btn-secondary" : "btn-primary"}>
            {user.hasSkills ? "Отключить" : "Включить"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── TOAST ───────────── */

let toastListeners: ((msg: string) => void)[] = [];
function pushToast(msg: string) { toastListeners.forEach((cb) => cb(msg)); }

function Toaster() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  useEffect(() => {
    const cb = (msg: string) => {
      const id = Date.now() + Math.random();
      setItems((s) => [...s, { id, msg }]);
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 2800);
    };
    toastListeners.push(cb);
    return () => { toastListeners = toastListeners.filter((c) => c !== cb); };
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {items.map((i) => (
        <div key={i.id} className="card-base px-4 py-3 text-sm shadow-xl animate-in fade-in slide-in-from-bottom-2">
          {i.msg}
        </div>
      ))}
    </div>
  );
}
