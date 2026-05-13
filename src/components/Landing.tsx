import { Link } from "@tanstack/react-router";
import { ChevronDown, Check, Star, Sparkles } from "lucide-react";
import { useState } from "react";
import { LandingHeader } from "@/components/LandingHeader";
import { SkillCard } from "@/components/SkillCard";
import { skills, authors, reviews, categories } from "@/lib/mockData";

export function Landing() {
  const [cat, setCat] = useState("Все");
  const featured = skills.filter((s) => s.status === "published");
  const filtered = cat === "Все" ? featured : featured.filter((s) => s.category === cat);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* HERO */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center px-6 pt-16"
        style={{
          background:
            "var(--gradient-hero), radial-gradient(ellipse 900px 500px at 50% -50px, rgba(99,102,241,0.18), transparent)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 900px 500px at 50% 0px, rgba(99,102,241,0.2), transparent)" }}
        />
        <div className="relative text-center max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border"
            style={{ background: "var(--primary-light)", borderColor: "rgba(99,102,241,0.3)" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Маркетплейс AI-навыков</span>
          </div>

          <h1 className="mt-6 text-[44px] md:text-[56px] font-extrabold tracking-tight leading-[1.05] text-text-primary">
            Запустите экспертизу
            <br />
            <span className="gradient-text">одной кнопкой</span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            Психологи, юристы, аналитики упаковали знания в AI. Без установки, без API-ключей.
            Просто нажмите — и получите результат.
          </p>

          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <Link to="/dashboard" search={{ tab: "catalog" }} className="btn-primary !px-7 !py-3 !text-[15px]">
              Найти навык
            </Link>
            <Link to="/login" className="btn-secondary !px-7 !py-3 !text-[15px]">
              Стать автором
            </Link>
          </div>

          <div className="mt-8 flex gap-8 justify-center text-center">
            {[
              { v: "127", l: "навыков" },
              { v: "43", l: "эксперта" },
              { v: "18 490", l: "запусков" },
            ].map((s, i) => (
              <div key={s.l} className={i > 0 ? "border-l border-border pl-8" : ""}>
                <div className="text-lg font-bold text-text-primary">{s.v}</div>
                <div className="text-[13px] text-text-muted">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <ChevronDown className="w-5 h-5 text-text-muted animate-bounce" />
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="py-20 border-y" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-text-primary">Как это работает</h2>
            <p className="text-base text-text-secondary mt-2">Три шага от выбора до результата</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { n: "01", t: "Найдите навык", d: "Выберите из каталога нужную экспертизу" },
              { n: "02", t: "Пополните кошелёк", d: "Минимум 500 ₽, хватит на несколько запусков" },
              { n: "03", t: "Получите результат", d: "AI выполнит задачу за минуты, результат в кабинете" },
            ].map((s) => (
              <div key={s.n} className="card-base p-7 text-center">
                <div
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-bold text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {s.n}
                </div>
                <h3 className="mt-4 text-[17px] font-semibold text-text-primary">{s.t}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-[26px] font-bold text-text-primary">Популярные навыки</h2>
            <Link to="/dashboard" search={{ tab: "catalog" }} className="btn-ghost">
              Смотреть все навыки →
            </Link>
          </div>
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium border transition-all ${
                  cat === c ? "" : "hover:border-border-hover"
                }`}
                style={
                  cat === c
                    ? { background: "var(--primary-light)", borderColor: "rgba(99,102,241,0.4)", color: "var(--primary)", fontWeight: 600 }
                    : { background: "var(--card)", borderColor: "var(--border)", color: "var(--text-secondary)" }
                }
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => <SkillCard key={s.id} skill={s} />)}
          </div>
        </div>
      </section>

      {/* AUTHORS */}
      <section id="authors-list" className="py-20 border-y" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-[26px] font-bold text-text-primary mb-10">Эксперты платформы</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {authors.map((a) => (
              <Link
                key={a.id}
                to="/author/$username"
                params={{ username: a.id }}
                className="card-base p-6 text-center cursor-pointer"
              >
                <div
                  className="w-[72px] h-[72px] mx-auto rounded-full avatar-gradient text-2xl border-2"
                  style={{ borderColor: "var(--primary)" }}
                >
                  {a.name[0]}
                </div>
                <h3 className="mt-3 text-[17px] font-bold text-text-primary">{a.name}</h3>
                <p className="text-sm text-text-secondary mt-1">{a.specialty}</p>
                <div className="mt-3 flex justify-center gap-3 text-[13px] text-text-muted">
                  <span>{a.skillsCount} навыка</span>
                  <span>·</span>
                  <span>★ {a.rating}</span>
                </div>
                <span className="btn-ghost mt-4 inline-flex">Смотреть навыки</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHORS CTA */}
      <section id="authors" className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span
              className="inline-block text-[11px] uppercase font-semibold tracking-wider text-primary rounded-full px-3 py-1"
              style={{ background: "var(--primary-light)" }}
            >
              Для авторов
            </span>
            <h2 className="mt-4 text-3xl md:text-[32px] font-bold text-text-primary leading-tight">
              Монетизируйте свою экспертизу
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              Превратите знания в продукт, который работает 24/7. Без сайтов, без рассылок, без воронок.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "85% дохода с каждого запуска",
                "Полный контроль над ценой и аудиторией",
                "Аналитика, заявки и результаты в одном месте",
              ].map((b) => (
                <li key={b} className="flex items-center gap-3 text-[15px] text-text-secondary">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "var(--success-light)", color: "var(--success)" }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Link to="/login" className="btn-primary !px-8 !py-3 mt-8 inline-flex">Начать как автор</Link>
          </div>
          <div className="card-base p-10 text-center">
            <div className="text-[80px] font-extrabold gradient-text leading-none">85%</div>
            <p className="text-base text-text-secondary mt-2">дохода с каждого запуска</p>
            <div className="border-t border-border mt-6 pt-6">
              <div className="text-2xl font-bold text-text-primary">18 490 запусков</div>
              <div className="text-sm text-text-muted mt-1">уже выполнено</div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-[26px] font-bold text-text-primary mb-10">Что говорят пользователи</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div key={r.id} className="card-base p-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-[15px] text-text-secondary mt-3 leading-relaxed italic">«{r.text}»</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full avatar-gradient text-sm">{r.author[0]}</div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{r.author}</div>
                    <div className="text-xs text-text-muted">{r.skill}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="pricing" className="py-12 border-t" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-extrabold gradient-text">3-С</div>
              <p className="text-[13px] text-text-muted mt-2">AI-навыки от экспертов. Запуск одной кнопкой.</p>
            </div>
            {[
              { t: "Платформа", l: ["Каталог", "Как работает", "Цены", "FAQ"] },
              { t: "Авторам", l: ["Стать автором", "Документация", "Условия"] },
              { t: "Контакты", l: ["Telegram", "Email", "Поддержка"] },
            ].map((c) => (
              <div key={c.t}>
                <h4 className="text-sm font-semibold text-text-primary mb-3">{c.t}</h4>
                <ul className="space-y-2">
                  {c.l.map((i) => (
                    <li key={i}>
                      <a className="text-[13px] text-text-muted hover:text-text-primary transition-colors">{i}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap justify-between gap-3">
            <span className="text-[13px] text-text-muted">© 2026 3-С. Все права защищены.</span>
            <span className="text-[13px] text-text-muted">Политика конфиденциальности · Оферта</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
