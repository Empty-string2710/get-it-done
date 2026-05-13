import { createFileRoute, useParams } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { LandingHeader } from "@/components/LandingHeader";
import { SkillCard } from "@/components/SkillCard";
import { authors, skills } from "@/lib/mockData";

export const Route = createFileRoute("/author/$username")({
  component: AuthorPage,
});

function AuthorPage() {
  const { username } = useParams({ from: "/author/$username" });
  const author = authors.find((a) => a.id === username);
  const authorSkills = skills.filter((s) => s.authorUsername === username && s.status === "published");

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      {!author ? (
        <div className="pt-32 text-center text-text-secondary">Автор не найден</div>
      ) : (
        <>
          <section className="pt-20 border-b" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
              <div className="flex items-start gap-5">
                <div className="w-24 h-24 rounded-full avatar-gradient text-3xl border-2 shrink-0" style={{ borderColor: "var(--primary)" }}>
                  {author.name[0]}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-text-primary">{author.name}</h1>
                  <span className="badge-base badge-category mt-2 inline-flex">{author.specialty}</span>
                  <p className="mt-3 text-base text-text-secondary leading-relaxed">{author.bio}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: author.skillsCount, l: "навыка" },
                  { v: "1 240", l: "запусков" },
                  { v: author.rating, l: "рейтинг" },
                  { v: "89", l: "учеников" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <div className="text-2xl font-bold text-text-primary">{s.v}</div>
                    <div className="text-sm text-text-muted">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-[22px] font-bold text-text-primary mb-6">Навыки автора</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {authorSkills.map((s) => <SkillCard key={s.id} skill={s} />)}
              </div>
            </div>
          </section>

          <section className="py-12 border-y" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-[22px] font-bold text-text-primary mb-6">Отзывы</h2>
              <div className="grid md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-base p-5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-warning text-warning" />)}
                    </div>
                    <p className="text-sm text-text-secondary mt-3 leading-relaxed italic">
                      «Подробный и точный результат. Объяснил сложные вещи простым языком.»
                    </p>
                    <div className="mt-4 text-xs text-text-muted">— Пользователь {i}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
