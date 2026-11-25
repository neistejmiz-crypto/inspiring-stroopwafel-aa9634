import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { DISCUSSION_QUESTIONS, QUIZ_QUESTIONS, THINKERS } from "@/data/lectureData";
import { Block, Body } from "./Blocks";
import { Reveal } from "./Media";

export function DiscussionSection() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savedId, setSavedId] = useState<string | null>(null);
  const savedTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const loaded: Record<string, string> = {};
    for (const q of DISCUSSION_QUESTIONS) {
      try {
        const v = localStorage.getItem(`lecture-note-${q.id}`);
        if (v) loaded[q.id] = v;
      } catch {
        /* ignore */
      }
    }
    setNotes(loaded);
  }, []);

  const handleNoteChange = (id: string, value: string) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
    try {
      localStorage.setItem(`lecture-note-${id}`, value);
      setSavedId(id);
      window.clearTimeout(savedTimer.current);
      savedTimer.current = window.setTimeout(() => setSavedId(null), 1600);
    } catch {
      /* ignore */
    }
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUIZ_QUESTIONS.filter((q, idx) => answers[idx] === q.correctIndex).length;
  const done = answeredCount === QUIZ_QUESTIONS.length;
  const thinkersList = [THINKERS.robinson, THINKERS.mitra, THINKERS.haidt, THINKERS.loh];

  return (
    <section id="diskussiya" className="relative bg-bg pt-28 sm:pt-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <Reveal>
          <p className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-gold uppercase">
            <span className="h-px w-10 bg-gold" />
            Обсуждение и рефлексия
          </p>
          <h2 className="max-w-4xl text-5xl font-semibold text-ink sm:text-7xl">
            Вопросы для дискуссии и <em className="text-gold">самопроверка</em>
          </h2>
        </Reveal>
      </div>
      <Body>
        <Block label="Тест" title="Быстрая самопроверка" hint={`${answeredCount} из ${QUIZ_QUESTIONS.length} отвечено`}>
          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, qIdx) => {
              const chosen = answers[qIdx];
              const isAnswered = chosen !== undefined;
              const isRight = chosen === q.correctIndex;
              return (
                <div key={q.question} className="card p-6">
                  <p className="font-display text-xl font-semibold text-ink sm:text-2xl">{q.question}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    {q.options.map((opt, oIdx) => {
                      let state = "border-line-strong text-ink hover:border-gold hover:bg-gold/5";
                      if (isAnswered) {
                        if (oIdx === q.correctIndex) state = "border-ok bg-ok/10 text-ok";
                        else if (oIdx === chosen) state = "border-bad bg-bad/10 text-bad";
                        else state = "border-line text-ink-faint";
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${state}`}
                        >
                          <span className="font-mono text-[11px] opacity-60">{String.fromCharCode(1040 + oIdx)}</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {isAnswered && (
                    <p aria-live="polite" className={`rise mt-3 text-sm font-semibold ${isRight ? "text-ok" : "text-bad"}`}>
                      {isRight ? "Верно! Отличная работа." : "Не совсем. Правильный ответ выделен зелёным."}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {answeredCount > 0 && (
            <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-ink-faint uppercase">{done ? "Итог" : "Промежуточный результат"}</p>
                <p className="mt-1 font-display text-4xl font-semibold text-ink">
                  {correctCount} <span className="text-ink-faint">/ {QUIZ_QUESTIONS.length}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAnswers({})}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Пройти снова
              </button>
            </div>
          )}
        </Block>

        <Block label="Рефлексия" title="Вопросы для обсуждения" hint="Заметки сохраняются в браузере">
          <div className="space-y-7">
            {DISCUSSION_QUESTIONS.map((item, idx) => (
              <div key={item.id}>
                <label htmlFor={item.id} className="flex gap-3 text-ink">
                  <span className="font-mono text-xs leading-7 text-gold">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{item.text}</span>
                </label>
                <textarea
                  id={item.id}
                  value={notes[item.id] ?? ""}
                  onChange={(e) => handleNoteChange(item.id, e.target.value)}
                  placeholder="Ваши мысли…"
                  rows={3}
                  className="mt-3 w-full resize-y rounded-2xl border border-line-strong bg-panel/60 px-5 py-4 text-sm text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none"
                />
                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-xs font-medium text-ok transition-opacity duration-500 ${
                    savedId === item.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  сохранено
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block label="Источники" title="Идейные основы и авторы">
          <ul className="divide-y divide-line border-y border-line">
            {thinkersList.map((t) => (
              <li key={t.id} className="py-4 text-sm">
                <strong>{t.name}</strong> — {t.sourceNote}
              </li>
            ))}
          </ul>
        </Block>
      </Body>
    </section>
  );
}
