export type Skill = {
  id: string;
  title: string;
  author: string;
  authorUsername: string;
  specialty: string;
  rating: number;
  reviews: number;
  price: number;
  category: string;
  status: "published" | "draft" | "pending" | "rejected";
  runs: number;
  earnings: number;
  description: string;
  outcomes: string[];
};

export const initialUser = {
  id: "u1",
  name: "Алексей Смирнов",
  phone: "+7 999 ***-**-01",
  balance: 340,
  hasSkills: true,
};

export const skills: Skill[] = [
  { id: "mbti", title: "MBTI Тест личности", author: "Михаил Петров", authorUsername: "mikhail", specialty: "Психолог", rating: 4.9, reviews: 124, price: 100, category: "Психология", status: "published", runs: 342, earnings: 34200, description: "Определите свой тип личности по системе Майерс-Бриггс. Подробный отчёт с рекомендациями по карьере и отношениям.", outcomes: ["Детальное описание типа личности","Рекомендации по карьере","Советы по коммуникации","Персональный PDF-отчёт"] },
  { id: "contract", title: "Анализ договора", author: "Анна Козлова", authorUsername: "anna", specialty: "Юрист", rating: 4.7, reviews: 89, price: 250, category: "Право", status: "published", runs: 156, earnings: 39000, description: "Загрузите договор — получите анализ рисков, спорных пунктов и рекомендации по правке.", outcomes: ["Анализ рисков по каждому пункту","Список спорных формулировок","Рекомендации по правкам","Итоговое заключение"] },
  { id: "seo", title: "SEO-аудит сайта", author: "Дмитрий Волков", authorUsername: "dmitry", specialty: "Маркетолог", rating: 4.8, reviews: 203, price: 180, category: "Маркетинг", status: "published", runs: 521, earnings: 93780, description: "Полный аудит технического SEO, контента и ссылочного профиля.", outcomes: ["Технический аудит","Анализ контента","Ссылочный профиль","Приоритетный план"] },
  { id: "bigfive", title: "Тест Большая пятёрка", author: "Михаил Петров", authorUsername: "mikhail", specialty: "Психолог", rating: 4.8, reviews: 67, price: 120, category: "Психология", status: "published", runs: 198, earnings: 23760, description: "Оценка личности по пяти факторам: открытость, добросовестность, экстраверсия, доброжелательность, нейротизм.", outcomes: ["Профиль по 5 факторам","Сравнение с нормой","Рекомендации","Радар-диаграмма"] },
  { id: "finance", title: "Финансовый анализ", author: "Сергей Никитин", authorUsername: "sergey", specialty: "Аналитик", rating: 4.6, reviews: 45, price: 300, category: "Аналитика", status: "draft", runs: 0, earnings: 0, description: "Анализ финансовой отчётности компании.", outcomes: ["Анализ ликвидности","Рентабельность","Риск-профиль","Итоговый отчёт"] },
  { id: "luscher", title: "Цветовой тест Люшера", author: "Михаил Петров", authorUsername: "mikhail", specialty: "Психолог", rating: 4.7, reviews: 312, price: 80, category: "Психология", status: "published", runs: 891, earnings: 71280, description: "Экспресс-диагностика психоэмоционального состояния через выбор цветов.", outcomes: ["Психоэмоциональный профиль","Уровень стресса","Актуальные потребности","Рекомендации"] },
];

export const authors = [
  { id: "mikhail", name: "Михаил Петров", specialty: "Психолог", skillsCount: 3, rating: 4.8, bio: "Практикующий психолог, 10 лет опыта. Типология личности и карьерное консультирование." },
  { id: "anna", name: "Анна Козлова", specialty: "Юрист", skillsCount: 1, rating: 4.7, bio: "Корпоративный юрист, 8 лет практики. Договорное право и трудовые споры." },
  { id: "dmitry", name: "Дмитрий Волков", specialty: "Маркетолог", skillsCount: 2, rating: 4.8, bio: "Digital-маркетолог, ex-Яндекс. SEO и контентная стратегия." },
];

export type UserResult = {
  id: string; skillId: string; skillTitle: string; category: string; result: string; resultFull: string; date: string; amount: number;
};

export const initialUserResults: UserResult[] = [
  { id: "r1", skillId: "mbti", skillTitle: "MBTI Тест личности", category: "Психология", result: "INTJ", resultFull: "Стратег. Высокая интроверсия, интуиция, логическое мышление, планирование.", date: "2026-05-03", amount: 100 },
  { id: "r2", skillId: "bigfive", skillTitle: "Тест Большая пятёрка", category: "Психология", result: "Открытость 87%", resultFull: "Открытость 87%, Добросовестность 72%, Экстраверсия 44%, Доброжелательность 61%, Нейротизм 35%.", date: "2026-05-01", amount: 120 },
];

export type Application = {
  id: string; userName: string; date: string; skillId: string; skillTitle: string; status: "pending" | "approved" | "rejected"; answers: string[]; rejectComment?: string;
};

export const initialApplications: Application[] = [
  { id: "a1", userName: "Елена Морозова", date: "2026-05-12", skillId: "mbti", skillTitle: "MBTI Тест", status: "pending", answers: ["Хочу лучше понять свои сильные стороны","Проходила тест 5 лет назад"] },
  { id: "a2", userName: "Игорь Павлов", date: "2026-05-11", skillId: "mbti", skillTitle: "MBTI Тест", status: "pending", answers: ["Нужно для профориентации"] },
  { id: "a3", userName: "Ольга Ким", date: "2026-05-10", skillId: "luscher", skillTitle: "Тест Люшера", status: "pending", answers: ["Психолог рекомендовал перед сессией"] },
  { id: "a4", userName: "Максим Орлов", date: "2026-05-08", skillId: "mbti", skillTitle: "MBTI Тест", status: "approved", answers: ["Для личного развития"] },
  { id: "a5", userName: "Татьяна Белова", date: "2026-05-07", skillId: "mbti", skillTitle: "MBTI Тест", status: "approved", answers: ["Рекомендация HR"] },
  { id: "a6", userName: "Виктор Зайцев", date: "2026-05-05", skillId: "luscher", skillTitle: "Тест Люшера", status: "rejected", answers: ["Просто интересно"], rejectComment: "Тест временно на обслуживании" },
];

export const authorResults = [
  { id: "ar1", userName: "Елена М.", skillTitle: "MBTI Тест", result: "ENFJ", date: "2026-05-03", status: "viewed" },
  { id: "ar2", userName: "Анонимно", skillTitle: "MBTI Тест", result: "INTJ", date: "2026-05-02", status: "new" },
  { id: "ar3", userName: "Игорь П.", skillTitle: "Тест Люшера", result: "Тревожность средняя", date: "2026-05-01", status: "viewed" },
];

export const earningsData = Array.from({ length: 30 }, (_, i) => ({
  date: `2026-04-${String((14 + i) % 31 + 1).padStart(2, "0")}`,
  amount: 200 + ((i * 137) % 700),
}));

export const payouts = [
  { id: "p1", date: "2026-05-01", amount: 4200, status: "paid" },
  { id: "p2", date: "2026-04-01", amount: 3800, status: "paid" },
  { id: "p3", date: "2026-05-13", amount: 2000, status: "processing" },
];

export type ChatMessage = { role: "ai" | "user"; text: string; time: string };
export type Chat = { id: string; name: string; type: "assistant" | "skill"; unread: number; lastMessage: string; lastTime: string; subtitle?: string; messages: ChatMessage[]; };

export const initialChats: Chat[] = [
  { id: "assistant", name: "Помощник 3-С", type: "assistant", unread: 0, lastMessage: "Рекомендую начать с MBTI.", lastTime: "10:01", subtitle: "AI-ассистент платформы",
    messages: [
      { role: "ai", text: "Привет. Я помогу найти нужный навык или разобраться с платформой.", time: "10:00" },
      { role: "user", text: "Какие тесты есть по психологии?", time: "10:01" },
      { role: "ai", text: "В каталоге три психологических теста: MBTI, Большая пятёрка и тест Люшера. Все от Михаила Петрова. Рекомендую начать с MBTI — самый подробный результат.", time: "10:01" },
    ] },
  { id: "mbti-chat", name: "MBTI Тест личности", type: "skill", unread: 1, lastMessage: "INTJ — стратег...", lastTime: "03.05", subtitle: "Михаил Петров",
    messages: [
      { role: "ai", text: "Ваш результат — INTJ. Хотите разобрать подробнее?", time: "03.05" },
      { role: "user", text: "Да, что это значит для карьеры?", time: "03.05" },
      { role: "ai", text: "INTJ — стратег. Хорошо подходят роли: архитектор решений, аналитик, независимый консультант. Вы склонны к системному мышлению и предпочитаете работать автономно.", time: "03.05" },
    ] },
];

export type Notification = { id: string; type: "application" | "result" | "payout"; text: string; time: string; read: boolean; };

export const initialNotifications: Notification[] = [
  { id: "n1", type: "application", text: "Елена Морозова подала заявку на MBTI Тест", time: "5 мин назад", read: false },
  { id: "n2", type: "result", text: "Ваш результат по тесту Большая пятёрка готов", time: "2 часа назад", read: false },
  { id: "n3", type: "application", text: "Игорь Павлов подал заявку на MBTI Тест", time: "3 часа назад", read: true },
  { id: "n4", type: "payout", text: "Выплата 4 200 ₽ успешно переведена", time: "1 мая", read: true },
  { id: "n5", type: "result", text: "Ваш результат по MBTI готов", time: "3 мая", read: true },
];

export const reviews = [
  { id: 1, author: "Мария К.", skill: "MBTI Тест личности", text: "Очень точный результат, прямо в десятку. Рекомендации по карьере оказались полезными." },
  { id: 2, author: "Андрей П.", skill: "SEO-аудит сайта", text: "Получил структурированный отчёт за 5 минут. Внедрил рекомендации — трафик вырос на 30%." },
  { id: 3, author: "Ольга С.", skill: "Анализ договора", text: "Юрист обошёлся бы в 5000 ₽. Здесь — 250. Все ключевые риски подсвечены." },
];

export const categories = ["Все", "Психология", "Право", "Маркетинг", "Аналитика", "Финансы"];
