import { create } from "zustand";
import {
  initialUser, initialUserResults, initialApplications, initialChats, initialNotifications,
  type UserResult, type Application, type Chat, type Notification, type ChatMessage,
} from "./mockData";

type User = typeof initialUser & { isAuthed: boolean };

type Transaction = { id: string; date: string; description: string; amount: number; balance: number };

type Store = {
  user: User;
  results: UserResult[];
  applications: Application[];
  chats: Chat[];
  notifications: Notification[];
  transactions: Transaction[];
  redirectAfterLogin: string | null;

  login: () => void;
  logout: () => void;
  setHasSkills: (v: boolean) => void;
  topUp: (amount: number) => void;
  runSkill: (skillId: string, skillTitle: string, category: string, price: number, result: string, resultFull: string) => UserResult;
  approveApp: (id: string) => void;
  rejectApp: (id: string, comment: string) => void;
  markNotifRead: (id?: string) => void;
  ensureSkillChat: (skillId: string, skillTitle: string, author: string) => string;
  sendMessage: (chatId: string, text: string) => void;
  markChatRead: (chatId: string) => void;
  setRedirect: (path: string | null) => void;
};

const today = () => new Date().toISOString().slice(0, 10);
const time = () => new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

export const useStore = create<Store>((set, get) => ({
  user: { ...initialUser, isAuthed: false },
  results: initialUserResults,
  applications: initialApplications,
  chats: initialChats,
  notifications: initialNotifications,
  transactions: [
    { id: "t1", date: "2026-05-03", description: "MBTI Тест личности", amount: -100, balance: 340 },
    { id: "t2", date: "2026-05-01", description: "Тест Большая пятёрка", amount: -120, balance: 440 },
    { id: "t3", date: "2026-04-28", description: "Пополнение баланса", amount: 500, balance: 560 },
  ],
  redirectAfterLogin: null,

  login: () => set((s) => ({ user: { ...s.user, isAuthed: true } })),
  logout: () => set((s) => ({ user: { ...s.user, isAuthed: false } })),
  setHasSkills: (v) => set((s) => ({ user: { ...s.user, hasSkills: v } })),
  setRedirect: (path) => set({ redirectAfterLogin: path }),

  topUp: (amount) => set((s) => {
    const newBalance = s.user.balance + amount;
    return {
      user: { ...s.user, balance: newBalance },
      transactions: [{ id: `t${Date.now()}`, date: today(), description: "Пополнение баланса", amount, balance: newBalance }, ...s.transactions],
    };
  }),

  runSkill: (skillId, skillTitle, category, price, result, resultFull) => {
    const newResult: UserResult = {
      id: `r${Date.now()}`, skillId, skillTitle, category, result, resultFull,
      date: today(), amount: price,
    };
    set((s) => {
      const newBalance = s.user.balance - price;
      return {
        user: { ...s.user, balance: newBalance },
        results: [newResult, ...s.results],
        transactions: [{ id: `t${Date.now()}`, date: today(), description: skillTitle, amount: -price, balance: newBalance }, ...s.transactions],
      };
    });
    return newResult;
  },

  approveApp: (id) => set((s) => ({
    applications: s.applications.map((a) => a.id === id ? { ...a, status: "approved" } : a),
  })),
  rejectApp: (id, comment) => set((s) => ({
    applications: s.applications.map((a) => a.id === id ? { ...a, status: "rejected", rejectComment: comment } : a),
  })),

  markNotifRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => (!id || n.id === id) ? { ...n, read: true } : n),
  })),

  ensureSkillChat: (skillId, skillTitle, author) => {
    const chatId = `skill-${skillId}`;
    const existing = get().chats.find((c) => c.id === chatId);
    if (existing) return chatId;
    const newChat: Chat = {
      id: chatId, name: skillTitle, type: "skill", unread: 0,
      lastMessage: "Готово обсудить ваш результат", lastTime: time(),
      subtitle: author,
      messages: [{ role: "ai", text: `Здравствуйте! Я помогу разобрать ваш результат по навыку «${skillTitle}». Задавайте вопросы.`, time: time() }],
    };
    set((s) => ({ chats: [...s.chats, newChat] }));
    return chatId;
  },

  sendMessage: (chatId, text) => set((s) => ({
    chats: s.chats.map((c) => {
      if (c.id !== chatId) return c;
      const userMsg: ChatMessage = { role: "user", text, time: time() };
      const aiReply: ChatMessage = { role: "ai", text: "Понял ваш вопрос. Дайте секунду — анализирую и формирую развёрнутый ответ на основе вашего результата.", time: time() };
      return { ...c, messages: [...c.messages, userMsg, aiReply], lastMessage: text, lastTime: time() };
    }),
  })),

  markChatRead: (chatId) => set((s) => ({
    chats: s.chats.map((c) => c.id === chatId ? { ...c, unread: 0 } : c),
  })),
}));
