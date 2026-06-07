import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import logo from '../assets/Eventflow logo.png';
import backgroundImg from '../assets/background.png';

/* ── Animated Letter component ─────────────────────────────── */
function AnimatedLetter({ char, index }: { char: string; index: number }) {
  if (char === ' ') return <span>&nbsp;</span>;

  return (
    <span
      className="animated-letter"
      style={{ '--i': index } as React.CSSProperties}
    >
      {char}
    </span>
  );
}

/* ── Animated Heading ──────────────────────────────────────── */
function AnimatedHeading({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <AnimatedLetter key={i} char={char} index={i} />
      ))}
    </span>
  );
}

/* ── Input field with enhanced animation ───────────────────── */
function AnimatedInput({
  type,
  name,
  label,
  value,
  onChange,
  delay,
}: {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const hasValue = value.length > 0;

  return (
    <div
      className="input-wrapper"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        className="ef-input"
        required
        autoComplete="off"
      />
      <label htmlFor={name} className={`ef-label ${focused || hasValue ? 'active' : ''}`}>
        {label}
      </label>
      {/* Animated underline */}
      <span className={`ef-underline ${focused ? 'expanded' : ''}`} />
      {/* Glow effect */}
      <span className={`ef-glow ${focused ? 'visible' : ''}`} />
    </div>
  );
}

/* ── Main LoginForm ────────────────────────────────────────── */
export default function LoginForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successFading, setSuccessFading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'info'; visible: boolean } | null>(null);
  const [shakeBtn, setShakeBtn] = useState(false);

  const formData = { nome, email, senha };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'nome') setNome(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'senha') setSenha(value);
  };

  const showToast = (message: string, type: 'error' | 'info' = 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null);
      setTimeout(() => setToast(null), 400);
    }, 4000);
  };

  const triggerShake = () => {
    setShakeBtn(true);
    setTimeout(() => setShakeBtn(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Timeout de 7 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 7000);

    try {
      const response = await fetch('/api/inscricao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 201) {
        setShowSuccess(true);
        setNome('');
        setEmail('');
        setSenha('');

        // Auto-dismiss success overlay after 3s
        setTimeout(() => {
          setSuccessFading(true);
          setTimeout(() => {
            setShowSuccess(false);
            setSuccessFading(false);
          }, 500);
        }, 3000);
      } else {
        triggerShake();
        showToast('Erro ao processar inscrição. Verifique os dados.');
      }
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        showToast('Tempo limite excedido. Tente novamente.');
      } else {
        showToast('Servidor indisponível no momento.');
      }
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-white selection:bg-ef-blue selection:text-white">

        {/* ── Editorial / Description Side ──────────────────── */}
        <div
          className="editorial-side w-full md:w-1/2 flex flex-col justify-between p-10 md:p-16 lg:p-24 relative overflow-hidden"
        >
          {/* Background image layer */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${backgroundImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Very light overlay — just enough for text readability */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#002F62]/30 via-transparent to-[#002F62]/20" />

          {/* Content */}
          <div className="relative z-10">
            <img
              src={logo}
              alt="EventFlow"
              className="w-20 h-20 md:w-24 md:h-24 object-contain mb-12 drop-shadow-lg rounded-2xl"
            />

            <h1 className="heading-hover font-editorial text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-8">
              <AnimatedHeading text="Cultura &" />
              <br />
              <AnimatedHeading text="Conexão." className="italic text-ef-yellow" />
            </h1>

            <p className="font-sans text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-md">
              A principal curadoria e plataforma de gestão de eventos universitários e de tecnologia do Brasil. Criamos a ponte definitiva entre o seu talento e as experiências mais marcantes do país.
            </p>
          </div>

          <div className="relative z-10 mt-16 pt-8 border-t border-white/20 flex items-center justify-between">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-white/60 font-semibold">
              Rio de Janeiro, BR
            </p>
            <p className="font-editorial text-sm italic text-white/60">
              Est. 2026
            </p>
          </div>
        </div>

        {/* ── Form Side ─────────────────────────────────────── */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-16 lg:p-24 bg-white">
          <div className="w-full max-w-sm">
            <h2 className="font-sans text-xs tracking-[0.3em] uppercase text-ef-blue mb-12 font-semibold">
              Criar Conta
            </h2>

            <form onSubmit={handleSubmit} className="space-y-10">
              <AnimatedInput
                type="text"
                name="nome"
                label="Nome Completo"
                value={formData.nome}
                onChange={handleChange}
                delay={200}
              />
              <AnimatedInput
                type="email"
                name="email"
                label="E-mail"
                value={formData.email}
                onChange={handleChange}
                delay={400}
              />
              <AnimatedInput
                type="password"
                name="senha"
                label="Senha"
                value={formData.senha}
                onChange={handleChange}
                delay={600}
              />

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full group flex items-center justify-between bg-ef-green text-ef-cream py-4 px-6 rounded-none hover:bg-ef-blue transition-all duration-500 hover:shadow-lg hover:shadow-ef-blue/20 ${isLoading ? 'ef-btn-loading' : ''} ${shakeBtn ? 'ef-shake' : ''}`}
                >
                  <span className="font-sans text-xs tracking-[0.2em] uppercase font-semibold">
                    {isLoading ? 'Enviando...' : 'Inscrever-se'}
                  </span>
                  {isLoading ? (
                    <span className="ef-spinner" />
                  ) : (
                    <ArrowRight
                      size={18}
                      strokeWidth={1.5}
                      className="group-hover:translate-x-2 transition-transform duration-500"
                    />
                  )}
                </button>
              </div>
            </form>

            <div className="mt-12">
              <a
                href="#"
                className="font-sans text-[11px] tracking-widest uppercase text-ef-blue/60 hover:text-ef-blue transition-colors border-b border-transparent hover:border-ef-blue pb-1"
              >
                Já possui conta? Acessar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Overlay ─────────────────────────────────── */}
      {showSuccess && (
        <div
          className={`ef-success-overlay ${successFading ? 'fade-out' : ''}`}
          onClick={() => {
            setSuccessFading(true);
            setTimeout(() => {
              setShowSuccess(false);
              setSuccessFading(false);
            }, 500);
          }}
        >
          <div className="ef-success-card" onClick={(e) => e.stopPropagation()}>
            <div className="ef-check-circle">
              <svg className="ef-checkmark" viewBox="0 0 32 32">
                <polyline points="8 16 14 22 24 10" />
              </svg>
            </div>
            <p className="ef-success-title">Inscrição Enviada</p>
            <p className="ef-success-message">
              Sua inscrição foi enviada para processamento com sucesso. Você receberá uma confirmação em breve.
            </p>
          </div>
        </div>
      )}

      {/* ── Error / Info Toast ──────────────────────────────── */}
      {toast && (
        <div className={`ef-toast ${toast.type} ${!toast.visible ? 'fade-out' : ''}`}>
          {toast.message}
        </div>
      )}


    </>
  );
}

