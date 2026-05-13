import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Skill } from "@/lib/mockData";

const initials = (name: string) => name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link
      to="/skill/$id"
      params={{ id: skill.id }}
      className="card-base p-5 cursor-pointer block group"
      style={{ borderRadius: 16 }}
    >
      <div className="flex items-start justify-between">
        <span className="badge-base badge-category">{skill.category}</span>
        <div className="text-right">
          <span className="text-[15px] font-bold text-text-primary">{skill.price} ₽</span>
          <span className="text-xs text-text-muted ml-1">/запуск</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
          style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
          {initials(skill.author)}
        </div>
        <span className="text-[13px] text-text-secondary">{skill.author}</span>
        <span className="text-text-muted">·</span>
        <span className="text-[13px] text-text-muted">{skill.specialty}</span>
      </div>

      <h3 className="mt-2 text-base font-semibold text-text-primary line-clamp-2">{skill.title}</h3>
      <p className="mt-1 text-[13px] text-text-secondary line-clamp-2">{skill.description}</p>

      <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-warning text-warning" />
          <span className="text-[13px] font-semibold text-text-primary">{skill.rating}</span>
          <span className="text-xs text-text-muted">({skill.reviews})</span>
        </div>
        <button
          className="btn-primary !px-3 !py-1.5 !text-[13px]"
          onClick={(e) => { e.preventDefault(); window.location.href = `/skill/${skill.id}`; }}
        >
          Запустить
        </button>
      </div>
    </Link>
  );
}
