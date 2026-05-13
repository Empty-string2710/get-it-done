import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Check, Shield, RefreshCw, FileText, X } from "lucide-react";
import { LandingHeader } from "@/components/LandingHeader";
import { skills, authors } from "@/lib/mockData";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/skill/$id")({
  component: SkillPage,
});

const sampleResults: Record<string, { result: string; full: string }> = {
  mbti: { result: "INTJ", full: "Стратег — высокая интроверсия, интуиция, логическое мышление и склонность к долгосрочному планированию." },
  contract: { result: "Средний риск", full: "Найдено 4 спорных пункта и 2 пункта высокого риска. Рекомендуется правка." },
  seo: { result: "62 / 100", full: "Технические проблемы с индексацией. План улучшений сформирован." },
  bigfive: { result: "Открытость 87%", full: "Открытость 87%, Добросовестность 72%, Экстраверсия 44%, Доброжелательность 61%, Нейротизм 35%." },
  luscher: { result: "Спокойствие", full: "Стабильное эмоциональное состояние. Уровень стресса — низкий." },
  finance: { result: "Стабильно", full: "Финансовая устойчивость — выше среднего." },
};

function SkillPage() {
  const { id } = useParams({ from: "/skill/$id" });
  const navigate = useNavigate();
  const skill = skills.find((s) => s.id === id);
  const user = useStore((s) => s.user);
  const runSkill = useStore((s) => s.runSkill);
  const topUp = useStore((s) => s.topUp);
  const ensureChat = useStore((s) => s.ensureSkillChat);
  const setRedirect = useStore((s) => s.setRedirect);

  const [step, setStep] = useState<"closed" | "confirm" | "topup" | "running" | "success" | "error">("closed");
  const [topupAmount, setTopupAmount] = useState(500);
  const [resultData, setResultData] = useState<{ result: string; full: string } | null>(null);

  if (!skill) {
    return (
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="pt-32 text-center text-text-secondary">Навык не найден</div>
      </div>
    );
  }
  const author = authors.find((a) => a.id === skill.authorUsername);
  const enough = user.balance >= skill.price;

  const startRun = () => {
    if (!user.isAuthed) {
      setRedirect(`/skill/${skill.id}`);
      navigate({ to: "/login" });
      return;
    }
    setStep("confirm");
  };

  const confirmRun = () => {
    if (!enough) { setStep("topup"); return; }
    setStep("running");
    setTimeout(() => {
      const sample = sampleResults[skill.id] || { result: "Готово", full: "Результат обработан." };
      runSkill(skill.id, skill.title, skill.category, skill.price, sample.result, sample.full);
      setResultData(sample);
      setStep("success");
    }, 1800);
  };

  const topupAndRun = () => {
    topUp(topupAmount);
    setStep("running");
    setTimeout(() => {
      const sample = sampleResults[skill.id] || { result: "Готово", full: "Результат обработан." };
      runSkill(skill.id, skill.title, skill.category, skill.price, sample.result, sample.full);
      setResultData(sample);
      setStep("success");
    }, 1800);
  };

  const discuss = () => {
    const chatId = ensureChat(skill.id, skill.title, skill.author);
    setStep("closed");
    navigate({ to: "/dashboard", search: { tab: "messages", chat: chatId } });
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <div className="pt-20 max-w-6xl mx-auto px-6 pb-16">
        <div className="text-[13px] text-text-muted py-4">
          <Link to="/" className="hover:text-text-primary">Главная</Link>
          <span className="mx-2">/</span>
          <span>Каталог</span>
          <span className="mx-2">/</span>
          <span>{skill.category}</span>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">{skill.title}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 pt-4">
          <div>
            <span className="badge-base badge-category">{skill.category}</span>
            <h1 className="mt-2 text-3xl md:text-[32px] font-bold text-text-primary tracking-tight">{skill.title}</h1>

            <div className="mt-4 flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-11 h-11 rounded-full avatar-gradient text-base border-2" style={{ borderColor: "var(--primary)" }}>
                {skill.author[0]}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-text-primary">{skill.author}</div>
                <div className="text-[13px] text-text-secondary">{skill.specialty}</div>
              </div>
              <span className="ml-auto text-[13px] text-text-muted">{author?.skillsCount ?? 1} навыка</span>
              {author && (
                <Link to="/author/$username" params={{ username: author.id }} className="btn-ghost !text-[13px]">
                  Профиль автора →
                </Link>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="text-base font-semibold text-text-primary">{skill.rating}</span>
              <span className="text-text-muted text-sm">({skill.reviews} отзыва)</span>
            </div>

            <p className="mt-6 text-base text-text-secondary leading-loose">{skill.description}</p>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-text-primary">Что вы получите</h2>
              <ul className="mt-4 space-y-3">
                {skill.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[15px] text-text-secondary">{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-text-primary">Отзывы</h2>
                <span className="text-text-muted text-sm">({skill.reviews})</span>
              </div>
              <div className="mt-6 grid sm:grid-cols-[160px_1fr] gap-6 items-start">
                <div className="text-center">
                  <div className="text-[40px] font-bold text-primary leading-none">{skill.rating}</div>
                  <div className="flex justify-center gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <div className="text-xs text-text-muted mt-1">{skill.reviews} оценок</div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star, i) => {
                    const w = [78, 15, 5, 1, 1][i];
                    return (
                      <div key={star} className="flex items-center gap-3 text-[13px]">
                        <span className="text-text-muted w-4">{star}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
                          <div className="h-full" style={{ width: `${w}%`, background: "var(--primary)" }} />
                        </div>
                        <span className="text-text-muted w-10 text-right">{w}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { author: "Мария К.", text: "Очень точный результат, прямо в десятку. Рекомендации полезные." },
                  { author: "Андрей П.", text: "За 5 минут получил детальный отчёт. Отличная работа AI." },
                ].map((r, i) => (
                  <div key={i} className="card-base p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full avatar-gradient text-sm">{r.author[0]}</div>
                      <div>
                        <div className="text-sm font-semibold">{r.author}</div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-[14px] text-text-secondary leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {author && (
              <div className="card-base p-6 mt-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full avatar-gradient text-xl border-2" style={{ borderColor: "var(--primary)" }}>
                    {author.name[0]}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-text-primary">{author.name}</div>
                    <div className="text-sm text-text-muted">{author.specialty}</div>
                    <p className="text-sm text-text-secondary mt-2">{author.bio}</p>
                  </div>
                </div>
                <Link to="/author/$username" params={{ username: author.id }} className="btn-ghost mt-4 inline-flex">
                  Все навыки автора
                </Link>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="card-base p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-[40px] font-extrabold text-text-primary leading-none">{skill.price} ₽</span>
                <span className="text-[15px] text-text-muted">/ один запуск</span>
              </div>

              <button
                onClick={startRun}
                className="btn-primary w-full !py-3.5 !text-base mt-5"
                style={{ boxShadow: "0 6px 24px rgba(99,102,241,0.4)" }}
              >
                Начать тест
              </button>
              <p className="text-xs text-text-muted text-center mt-3">
                Списание происходит только при успешном запуске
              </p>

              <div className="my-5 border-t border-border" />

              <ul className="space-y-2.5">
                {[
                  { i: <Shield className="w-3.5 h-3.5" />, t: "Безопасный платёж" },
                  { i: <RefreshCw className="w-3.5 h-3.5" />, t: "Автовозврат при технической ошибке" },
                  { i: <FileText className="w-3.5 h-3.5" />, t: "Результат доступен в личном кабинете" },
                ].map((x, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] text-text-secondary">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--success-light)", color: "var(--success)" }}>
                      {x.i}
                    </span>
                    {x.t}
                  </li>
                ))}
              </ul>

              <div className="my-4 border-t border-border" />
              <div>
                <div className="text-[11px] uppercase font-semibold text-text-muted tracking-wider">Автор навыка</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full avatar-gradient text-xs">{skill.author[0]}</div>
                  <div>
                    <div className="text-sm font-semibold">{skill.author}</div>
                    <div className="text-xs text-text-muted">{skill.specialty}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {step !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => step !== "running" && setStep("closed")}>
          <div className="card-base p-6 max-w-[440px] w-full relative" onClick={(e) => e.stopPropagation()}>
            {step !== "running" && (
              <button onClick={() => setStep("closed")} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            )}

            {step === "confirm" && (
              <>
                <h3 className="text-xl font-bold">Запустить навык?</h3>
                <span className="badge-base badge-category mt-3 inline-flex">{skill.category}</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{skill.price} ₽</span>
                  <span className="text-text-muted text-sm">будет списано с баланса</span>
                </div>
                <p className="text-[13px] text-text-muted mt-2">Текущий баланс: {user.balance} ₽</p>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep("closed")} className="btn-secondary flex-1">Отмена</button>
                  <button onClick={confirmRun} className="btn-primary flex-1">Да, начать</button>
                </div>
              </>
            )}

            {step === "topup" && (
              <>
                <h3 className="text-xl font-bold">Недостаточно средств</h3>
                <p className="text-sm text-text-secondary mt-2">Пополните баланс, чтобы запустить навык</p>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[500, 1000, 2000].map((a) => (
                    <button
                      key={a}
                      onClick={() => setTopupAmount(a)}
                      className="rounded-xl p-3 text-center border transition-all"
                      style={
                        topupAmount === a
                          ? { background: "var(--primary-light)", borderColor: "var(--primary)" }
                          : { background: "var(--surface)", borderColor: "var(--border)" }
                      }
                    >
                      <div className="text-base font-bold text-text-primary">{a} ₽</div>
                      <div className="text-[11px] text-text-muted mt-1">≈ {Math.floor(a / skill.price)} запусков</div>
                    </button>
                  ))}
                </div>
                <button onClick={topupAndRun} className="btn-primary w-full mt-5 !py-3">Пополнить и запустить</button>
              </>
            )}

            {step === "running" && (
              <div className="text-center py-4">
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
                  <div className="h-full animate-pulse" style={{ width: "70%", background: "var(--gradient-primary)" }} />
                </div>
                <p className="mt-4 text-[15px] text-text-secondary">Выполняется запуск...</p>
              </div>
            )}

            {step === "success" && resultData && (
              <>
                <div className="text-[11px] uppercase tracking-wider text-success font-semibold">Результат готов</div>
                <h3 className="text-xl font-bold mt-2">{skill.title}</h3>
                <div className="mt-4 p-5 rounded-xl text-center" style={{ background: "var(--surface)" }}>
                  <div className="text-3xl font-bold text-primary">{resultData.result}</div>
                </div>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">{resultData.full}</p>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep("closed")} className="btn-secondary flex-1">Закрыть</button>
                  <button onClick={discuss} className="btn-primary flex-1">Обсудить результат</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
