import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Вход — 3-С" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const redirect = useStore((s) => s.redirectAfterLogin);
  const setRedirect = useStore((s) => s.setRedirect);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const finish = () => {
    login();
    const target = redirect || "/dashboard";
    setRedirect(null);
    navigate({ to: target as any, search: target === "/dashboard" ? { tab: "home" } : undefined });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="card-base p-8 max-w-[420px] w-full">
        <div className="text-center text-2xl font-extrabold gradient-text">3-С</div>
        <h1 className="mt-4 text-center text-[22px] font-bold text-text-primary">Добро пожаловать</h1>
        <p className="mt-1 text-center text-sm text-text-secondary">Войдите, чтобы продолжить</p>

        <div className="mt-8 space-y-3">
          <div>
            <button
              onClick={() => setPhoneOpen(!phoneOpen)}
              className="btn-secondary w-full !py-3 !justify-between"
            >
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Войти через телефон
              </span>
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${phoneOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: phoneOpen ? 240 : 0 }}
            >
              <div className="pt-3 space-y-3">
                {step === "phone" ? (
                  <>
                    <input
                      className="input-base"
                      placeholder="+7 999 000-00-00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button onClick={() => setStep("code")} className="btn-primary w-full !py-3">
                      Получить код
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      className="input-base text-center tracking-[0.6em] text-lg"
                      placeholder="• • • • • •"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={finish} className="btn-primary w-full !py-3">
                      Войти
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <button onClick={finish} className="btn-secondary w-full !py-3">
            <span className="font-bold" style={{ color: "#21A038" }}>Sber</span>
            <span className="font-medium text-text-primary">ID — Войти</span>
          </button>

          <button onClick={finish} className="btn-secondary w-full !py-3">
            <span className="font-bold" style={{ color: "#FC3F1D" }}>Яндекс</span>
            <span className="font-medium text-text-primary"> ID — Войти</span>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-text-muted leading-relaxed">
          Регистрируясь, вы принимаете условия использования и политику конфиденциальности
        </p>
      </div>
    </div>
  );
}
