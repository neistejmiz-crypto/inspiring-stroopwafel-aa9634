import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUp, BookOpen, Headphones, Menu, Pause, Play, Video, VideoOff, Volume2, VolumeX, X } from "lucide-react";
import { AUDIO_SRC, MEDIA, NAV_SECTIONS } from "@/data/lectureData";
import { BackgroundMotionContext, BackgroundVideo, useReducedMotion } from "./components/Media";
import { LearningActivitiesSection } from "./components/LearningActivitiesSection";
import { ThinkerSections } from "./components/ThinkerSections";
import { PracticeSections } from "./components/PracticeSections";
import { DiscussionSection } from "./components/DiscussionSection";

function Eq({ active }: { active: boolean }) {
  return (
    <span className="inline-flex h-3.5 items-end gap-[2.5px]" aria-hidden="true">
      {[0, 0.22, 0.45, 0.1].map((d, i) => (
        <i key={i} className={`eq-bar ${active ? "eq-bar-active" : ""}`} style={active ? { animationDelay: `${d}s` } : undefined} />
      ))}
    </span>
  );
}

function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(25);
  const [muted, setMuted] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  const play = useCallback(() => {
    if (!missing) audioRef.current?.play().catch(() => {});
  }, [missing]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) play();
    else a.pause();
  }, [play]);

  const element = (
    <audio
      ref={audioRef}
      src={AUDIO_SRC}
      preload="metadata"
      loop
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onError={() => setMissing(true)}
    />
  );

  return { element, isPlaying, volume, setVolume, muted, setMuted, missing, play, toggle };
}

export default function App() {
  const audio = useAudio();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("top");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videosPaused, setVideosPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
        setProgress(doc.scrollTop / max);
        setScrolled(doc.scrollTop > 40);
        let current = "top";
        for (const sec of NAV_SECTIONS) {
          const el = document.getElementById(sec.id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = sec.id;
        }
        setActive(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const activeIdx = NAV_SECTIONS.findIndex((s) => s.id === active);
  const activeLabel = activeIdx >= 0 ? NAV_SECTIONS[activeIdx].label : "Начало";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg text-ink">
      {audio.element}

      {/* HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-line bg-bg/90 backdrop-blur-xl" : "bg-bg/85"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 sm:gap-4 sm:px-10">
          <a href="#top" className="flex items-center gap-1.5 font-display text-lg font-semibold whitespace-nowrap text-ink sm:gap-2.5 sm:text-xl">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-bg"><BookOpen className="h-4 w-4" aria-hidden="true" /></span>
            <span>Образование</span>
          </a>

          <div className="ml-auto hidden items-center gap-3 font-mono text-[11px] tracking-[0.16em] text-ink-dim uppercase md:flex">
            <span className="text-gold">{activeIdx >= 0 ? String(activeIdx + 1).padStart(2, "0") : "—"}</span>
            <span className="h-px w-6 bg-line-strong" />
            <span className="w-44 truncate">{activeLabel}</span>
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            {!reducedMotion && (
              <button type="button" onClick={() => setVideosPaused(!videosPaused)} aria-label="Фоновое видео" aria-pressed={!videosPaused} title={videosPaused ? "Включить фоновое видео" : "Приостановить фоновое видео"} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong bg-bg/60 text-ink transition-colors hover:border-gold hover:text-gold">
                {videosPaused ? <VideoOff className="h-4 w-4" aria-hidden="true" /> : <Video className="h-4 w-4" aria-hidden="true" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-bg/60 px-2.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-gold sm:gap-2.5 sm:px-4 sm:text-sm"
              aria-expanded={menuOpen}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
              Содержание
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-transparent">
          <div className="h-full origin-left bg-gold" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      {/* FULLSCREEN MENU */}
      <div
        className={`fixed inset-0 z-[70] transition-all duration-700 ease-[var(--ease-out-expo)] ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Содержание лекции"
      >
        <div className="absolute inset-0 bg-bg/95 backdrop-blur-2xl" onClick={() => setMenuOpen(false)} />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col px-5 py-5 sm:px-10">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] tracking-[0.24em] text-ink-faint uppercase">Содержание · {NAV_SECTIONS.length} разделов</p>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-gold hover:text-gold"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-8 grid flex-1 grid-cols-1 content-start gap-x-12 overflow-y-auto md:grid-cols-2">
            {NAV_SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setMenuOpen(false)}
                className={`group flex items-baseline gap-5 border-b border-line py-4 transition-all duration-700 ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: menuOpen ? `${80 + i * 40}ms` : "0ms" }}
              >
                <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={`font-display text-3xl font-semibold transition-all duration-500 group-hover:translate-x-2 group-hover:text-gold sm:text-4xl ${
                    active === s.id ? "text-gold" : "text-ink"
                  }`}
                >
                  {s.label}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <main>
        <BackgroundMotionContext value={!videosPaused && !reducedMotion}>
        {/* HERO */}
        <section id="top" className="lesson-hero relative isolate overflow-hidden border-b border-line">
          <div className="lesson-hero-motion">
            <BackgroundVideo src={MEDIA.pbl.video} poster={MEDIA.pbl.poster} className="lesson-hero-video" />
          </div>
          <div className="relative mx-auto grid max-w-7xl items-center gap-28 px-5 pt-28 pb-10 sm:px-10 sm:pt-36 lg:min-h-[min(52rem,100svh)] lg:grid-cols-[1.25fr_1fr] lg:gap-12 lg:pb-16">
            <div className="rise">
              <p className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-gold uppercase">
                <span className="h-px w-8 bg-gold" />
                О будущем образования
              </p>
              <h1 className="text-[clamp(3.3rem,8vw,7.8rem)] leading-[0.92] font-semibold">
                Как учиться<br /> <em className="text-gold">завтра?</em>
              </h1>
              <p className="mt-6 max-w-xl text-base text-ink-dim sm:text-lg">
                Как помочь людям задавать вопросы, проверять идеи и мыслить самостоятельно? Интерактивная лекция для тех, кто учится, преподаёт или просто интересуется будущим образования.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href="#english-lab" onClick={audio.play} className="inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-ink">
                  Начать практикум <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href="#vvedenie" className="text-sm font-semibold text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold">К теории обучения</a>
              </div>
            </div>
            <aside className="lesson-sheet rise w-full max-w-md self-end justify-self-end rounded-[1.75rem] border border-line bg-panel/95 p-5 sm:p-7" style={{ "--d": "160ms" } as CSSProperties}>
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4 font-mono text-[11px] tracking-[0.14em] text-gold uppercase">
                <span>Вопрос для размышления</span>
                <span className="rounded-full bg-peach px-3 py-1 text-ink">Дискуссия</span>
              </div>
              <p className="mt-6 font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-none font-semibold">Что помогло бы нам учиться лучше?</p>
              <p className="mt-4 text-sm text-ink-dim">Вспомните свой опыт и предложите одно изменение. Обсудите, кому и чем оно поможет.</p>
              <p className="mt-6 rounded-xl bg-bg-2 px-4 py-3 font-display text-xl leading-snug font-semibold text-gold italic">«Я бы предложил(а) …, потому что … А что думаете вы?»</p>
            </aside>
          </div>
        </section>

        <LearningActivitiesSection />
        <ThinkerSections />
        <PracticeSections />
        <DiscussionSection />
        </BackgroundMotionContext>
      </main>

      <footer className="border-t border-line bg-bg-2 px-5 pt-8 pb-24 text-center sm:px-10">
        <a href="#english-lab" className="font-display text-2xl font-semibold text-gold hover:underline">Вернуться к практикуму</a>
      </footer>

      {/* FLOATING PLAYER */}
      <div className="fixed bottom-4 left-4 z-50 sm:bottom-6 sm:left-6">
        <div className="glass flex items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5 shadow-2xl">
          <button
            type="button"
            onClick={audio.toggle}
            disabled={audio.missing}
            aria-label={audio.missing ? "Аудио недоступно" : audio.isPlaying ? "Приостановить музыку" : "Включить фоновую музыку"}
            aria-pressed={audio.isPlaying}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-bg transition-transform hover:scale-105 disabled:bg-panel-2 disabled:text-ink-faint"
          >
            {audio.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
          </button>
          <span className="text-gold">
            {audio.isPlaying ? <Eq active /> : <Headphones className="h-4 w-4" aria-hidden="true" />}
          </span>
          <span className="hidden text-xs font-medium text-ink sm:inline">{audio.missing ? "Аудио недоступно" : "Фоновая музыка"}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => audio.setMuted(!audio.muted)}
              disabled={audio.missing}
              aria-label={audio.muted ? "Включить звук" : "Выключить звук"}
              className="text-ink-dim hover:text-ink"
            >
              {audio.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={audio.volume}
              disabled={audio.missing}
              onChange={(e) => {
                audio.setVolume(Number(e.target.value));
                audio.setMuted(false);
              }}
              aria-label="Громкость музыки"
              className="hidden w-20 cursor-pointer md:block"
            />
          </div>
        </div>
      </div>

      {/* BACK TO TOP */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Наверх"
        className={`glass fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-ink transition-all duration-500 hover:text-gold sm:right-6 sm:bottom-6 ${
          progress > 0.06 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.5"
            strokeDasharray={138.2}
            strokeDashoffset={138.2 * (1 - progress)}
          />
        </svg>
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}
