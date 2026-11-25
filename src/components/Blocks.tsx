import { useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronDown, RotateCw } from "lucide-react";
import type { ThinkerProfile } from "@/data/lectureData";
import { Reveal } from "./Media";

export function Body({ children }: { children: ReactNode }) {
  return <div className="relative mx-auto max-w-7xl px-5 pt-4 pb-24 sm:px-10 sm:pb-32">{children}</div>;
}

/** Two-column editorial row: sticky side label + content. */
export function Block({ label, title, hint, children }: { label?: string; title?: ReactNode; hint?: string; children: ReactNode }) {
  return (
    <Reveal className="grid grid-cols-1 gap-6 border-t border-line py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          {label && <p className="font-mono text-[11px] tracking-[0.24em] text-ink-faint uppercase">{label}</p>}
          {title && <h3 className="mt-3 text-3xl font-semibold text-ink sm:text-[2.5rem]">{title}</h3>}
          {hint && (
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-gold">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              {hint}
            </p>
          )}
        </div>
      </div>
      <div className="text-base leading-relaxed text-ink-dim sm:text-[1.075rem] lg:col-span-8 [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </Reveal>
  );
}

export function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="my-6 flex flex-wrap gap-2.5">
      {items.map((item, i) => (
        <li
          key={item}
          className="group flex items-center gap-2.5 rounded-full border border-line-strong bg-panel/60 px-4 py-2 text-sm font-medium text-ink transition-colors duration-300 hover:border-gold hover:bg-gold/10"
        >
          <span className="font-mono text-[10px] text-gold">{String(i + 1).padStart(2, "0")}</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ShiftBanner({ from, to }: { from: string; to: string }) {
  return (
    <div className="card my-8 grid grid-cols-1 items-center gap-5 overflow-hidden p-6 sm:grid-cols-[1fr_auto_1.6fr] sm:p-8">
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-ink-faint uppercase">Было</p>
        <p className="mt-2 text-ink-dim line-through decoration-bad/60">{from}</p>
      </div>
      <ArrowUpRight className="h-8 w-8 rotate-45 text-gold sm:rotate-0" aria-hidden="true" />
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">Стало</p>
        <p className="mt-2 font-display text-xl leading-snug font-semibold text-ink sm:text-2xl">{to}</p>
      </div>
    </div>
  );
}

export function ThinkerProfileCard({ thinker, reverse = false }: { thinker: ThinkerProfile; reverse?: boolean }) {
  return (
    <Reveal className="grid grid-cols-1 items-end gap-8 py-10 lg:grid-cols-12 lg:gap-12">
      <div className={`relative lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}>
        <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-panel">
          <img
            src={thinker.photo}
            alt={`${thinker.fullName} — фотография`}
            loading="lazy"
            className="h-full w-full object-cover object-top grayscale-[35%] transition-all duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
          <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-ink uppercase">
            {thinker.badge}
          </span>
        </div>
        {thinker.stagePhoto && (
          <div
            className={`absolute -bottom-8 hidden aspect-[3/2] w-[58%] overflow-hidden rounded-2xl border-4 border-bg shadow-2xl sm:block ${
              reverse ? "-left-8" : "-right-8"
            }`}
          >
            <img src={thinker.stagePhoto} alt={`${thinker.name} выступает`} loading="lazy" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
      <div className={`lg:col-span-7 ${reverse ? "lg:order-1" : ""}`}>
        <p className="font-mono text-[11px] tracking-[0.24em] text-ink-faint uppercase">{thinker.role}</p>
        <h3 className="mt-3 text-5xl font-semibold text-ink sm:text-6xl">{thinker.fullName}</h3>
        <p className="mt-6 max-w-2xl font-display text-2xl leading-snug text-ink/90 italic sm:text-[1.9rem]">
          «{thinker.thesis}»
        </p>
        <p className="mt-8 text-[11px] text-ink-faint">{thinker.photoCredit}</p>
      </div>
    </Reveal>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="inline-flex rounded-full border border-line-strong bg-panel/70 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
            value === t.id ? "bg-ink text-bg shadow" : "text-ink-dim hover:text-ink"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Compare({ left, right }: { left: { title: string; text: string }; right: { title: string; text: string } }) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="card p-6">
        <h4 className="font-mono text-[11px] tracking-[0.18em] text-ink-faint uppercase">{left.title}</h4>
        <p className="mt-3 text-ink-dim">{left.text}</p>
      </div>
      <div className="card relative overflow-hidden border-gold/40 p-6">
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
        <h4 className="font-mono text-[11px] tracking-[0.18em] text-gold uppercase">{right.title}</h4>
        <p className="mt-3 text-ink">{right.text}</p>
      </div>
    </div>
  );
}

interface FlipItem {
  frontLabel: string;
  frontText: string;
  backLabel: string;
  backText: string;
}

export function FlipCardGrid({ items }: { items: FlipItem[] }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, idx) => {
        const isFlipped = Boolean(flipped[idx]);
        return (
          <button
            key={item.frontLabel + idx}
            type="button"
            aria-pressed={isFlipped}
            onClick={() => setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }))}
            className="flip-perspective min-h-[290px] cursor-pointer text-left"
          >
            <span className={`flip-inner relative block h-full min-h-[290px] w-full ${isFlipped ? "flip-rotated" : ""}`}>
              <span className="flip-face card absolute inset-0 flex flex-col p-6 transition-colors duration-300 hover:border-gold/60">
                <small className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">
                  {String(idx + 1).padStart(2, "0")} · {item.frontLabel}
                </small>
                <span className="mt-3 font-display text-[1.3rem] leading-snug font-semibold text-ink">{item.frontText}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-ink-faint">
                  <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Перевернуть
                </span>
              </span>
              <span className="flip-back absolute inset-0 flex flex-col rounded-[1.25rem] bg-gold p-6 text-bg">
                <small className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-70">{item.backLabel}</small>
                <span className="mt-3 font-display text-xl leading-snug font-semibold">{item.backText}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function NodeExplorer({
  items,
  numbered = false,
  placeholder,
  hubTitle,
}: {
  items: { label: string; info: string }[];
  numbered?: boolean;
  placeholder: string;
  hubTitle?: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const activeText = selected !== null ? (items[selected]?.info ?? placeholder) : placeholder;

  return (
    <div className="my-6">
      {hubTitle && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4">
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="font-display text-2xl font-semibold text-ink">{hubTitle}</span>
        </div>
      )}
      <div className={numbered ? "grid grid-cols-1 gap-2 sm:grid-cols-2" : "flex flex-wrap gap-2"}>
        {items.map((item, idx) => {
          const isSel = selected === idx;
          return (
            <button
              key={item.label}
              type="button"
              aria-pressed={isSel}
              onClick={() => setSelected(idx)}
              className={`group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-300 ${
                isSel
                  ? "border-gold bg-gold text-bg"
                  : "border-line-strong bg-panel/50 text-ink hover:-translate-y-0.5 hover:border-gold/70"
              }`}
            >
              {numbered && (
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${
                    isSel ? "bg-bg text-gold" : "bg-gold/15 text-gold"
                  }`}
                >
                  {idx + 1}
                </span>
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="card mt-3 flex gap-4 p-5">
        <span className="mt-2 h-px w-8 shrink-0 bg-gold" aria-hidden="true" />
        <p key={activeText} className="rise text-ink" style={{ animationDuration: "0.7s" }}>
          {activeText}
        </p>
      </div>
    </div>
  );
}

export function Accordion({
  items,
  defaultOpen,
  renderExtra,
}: {
  items: { title: string; body: string }[];
  defaultOpen?: number;
  renderExtra?: (idx: number) => ReactNode;
}) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, idx) => (
        <details key={item.title} open={idx === defaultOpen} className="group">
          <summary className="flex cursor-pointer list-none items-center gap-5 py-5 text-ink transition-colors hover:text-gold">
            <span className="font-mono text-xs text-gold">{String(idx + 1).padStart(2, "0")}</span>
            <span className="flex-1 font-display text-xl font-semibold sm:text-2xl">{item.title}</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-ink-faint transition-transform duration-500 group-open:rotate-180" />
          </summary>
          <div className="pb-6 pl-10 text-ink-dim">
            <p>{item.body}</p>
            {renderExtra?.(idx)}
          </div>
        </details>
      ))}
    </div>
  );
}

export function ProgressMeter({ count, total, prefix, suffix }: { count: number; total: number; prefix: string; suffix: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="mt-5">
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full origin-left rounded-full bg-gradient-to-r from-sage to-gold transition-transform duration-700 ease-[var(--ease-out-expo)]"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
      <p className="mt-2 font-mono text-[11px] tracking-wider text-ink-faint">
        {prefix} {count} из {total} {suffix} · {pct}%
      </p>
    </div>
  );
}

export function Checklist({ items, checked, onToggle }: { items: string[]; checked: boolean[]; onToggle: (i: number) => void }) {
  return (
    <div className="space-y-2">
      {items.map((label, idx) => (
        <label
          key={label}
          className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-5 py-4 transition-all duration-300 ${
            checked[idx] ? "border-gold/60 bg-gold/10" : "border-line hover:border-line-strong"
          }`}
        >
          <input type="checkbox" checked={Boolean(checked[idx])} onChange={() => onToggle(idx)} className="peer sr-only" />
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold ${
              checked[idx] ? "border-gold bg-gold text-bg" : "border-line-strong"
            }`}
            aria-hidden="true"
          >
            {checked[idx] && (
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M2.5 6.5l2.2 2.2L9.5 3.8" />
              </svg>
            )}
          </span>
          <span className={checked[idx] ? "text-ink" : "text-ink-dim"}>{label}</span>
        </label>
      ))}
    </div>
  );
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <Reveal className="mx-auto my-6 max-w-4xl py-10">
      <blockquote className="editorial-quote">{children}</blockquote>
    </Reveal>
  );
}
