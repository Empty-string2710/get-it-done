import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";

export function LandingHeader() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const unread = useStore((s) => s.notifications.filter(n => !n.read).length);

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-50 backdrop-blur-md border-b"
      style={{ background: "rgba(15,15,24,0.85)", borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold gradient-text tracking-tight">3-С</Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <Link to="/" hash="catalog" className="hover:text-text-primary transition-colors">Каталог</Link>
          <a href="/#authors" className="hover:text-text-primary transition-colors">Авторам</a>
          <a href="/#how" className="hover:text-text-primary transition-colors">Как работает</a>
          <a href="/#pricing" className="hover:text-text-primary transition-colors">Цены</a>
        </nav>

        {user.isAuthed ? (
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-lg flex items-center justify-center hover:bg-card transition-colors">
              <Bell className="w-5 h-5 text-text-secondary" />
              {unread > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />}
            </button>
            <button
              onClick={() => navigate({ to: "/dashboard", search: { tab: "wallet" } })}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-[13px] font-bold text-text-primary">{user.balance} ₽</span>
            </button>
            <Link to="/dashboard" search={{ tab: "home" }}
              className="w-9 h-9 rounded-full avatar-gradient text-sm border-2"
              style={{ borderColor: "var(--primary)" }}
            >
              {user.name[0]}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">Войти</Link>
            <Link to="/login" className="btn-primary">Начать бесплатно</Link>
          </div>
        )}
      </div>
    </header>
  );
}
