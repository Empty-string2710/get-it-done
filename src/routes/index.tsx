import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "3-С — Маркетплейс AI-навыков от экспертов" },
      { name: "description", content: "Психологи, юристы, аналитики упаковали знания в AI. Запустите экспертизу одной кнопкой." },
    ],
  }),
  component: Landing,
});
