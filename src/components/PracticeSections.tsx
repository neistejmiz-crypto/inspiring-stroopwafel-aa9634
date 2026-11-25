import { useEffect, useState } from "react";
import { AI_FLIPS, CASE_ASPECTS, MEDIA, PBL_CHECKLIST, SEVEN_PRINCIPLES, THINKERS, WATER_DISCIPLINES } from "@/data/lectureData";
import { Accordion, Block, Body, Checklist, ChipList, Compare, FlipCardGrid, NodeExplorer, ProgressMeter, Quote, ShiftBanner, Tabs } from "./Blocks";
import { ChapterCover, Reveal } from "./Media";

function useStoredChecks(key: string, length: number) {
  const [checks, setChecks] = useState<boolean[]>(() => Array(length).fill(false));
  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) ?? "null");
      if (Array.isArray(parsed) && parsed.length === length) setChecks(parsed.map(Boolean));
    } catch {
      /* ignore */
    }
  }, [key, length]);
  const toggle = (idx: number) =>
    setChecks((prev) => {
      const next = prev.map((v, i) => (i === idx ? !v : v));
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  return [checks, toggle] as const;
}

export function PracticeSections() {
  const [pblTab, setPblTab] = useState<"lang" | "social">("lang");
  const [pblChecked, togglePbl] = useStoredChecks("lecture-pbl-checks", PBL_CHECKLIST.length);
  const [prChecked, togglePrinciple] = useStoredChecks("lecture-principles-checks", SEVEN_PRINCIPLES.length);
  const thinkersList = [THINKERS.robinson, THINKERS.mitra, THINKERS.haidt, THINKERS.loh];

  return (
    <>
      {/* 5. ПРОБЛЕМНОЕ ОБУЧЕНИЕ */}
      <section>
        <ChapterCover
          id="problemnoe"
          number="05"
          kicker="Глава 5 · Проблемное обучение"
          media={MEDIA.pbl}
          title={
            <>
              От готового ответа к <em className="text-gold">правильному вопросу</em>
            </>
          }
          lead="Познавательное противоречие — точка старта глубокого диалога."
        />
        <Body>
          <Block label="Механизм" title="Познавательное противоречие">
            <p>
              В центре проблемного обучения находится <strong>познавательное противоречие</strong> или задача, решение
              которой нельзя найти мгновенно. Оно побуждает учащегося:
            </p>
            <ChipList items={["актуализировать прошлые знания", "определить, какой информации не хватает", "выдвинуть гипотезу", "искать доказательства"]} />
          </Block>
          <Block label="Практика" title="Два примера" hint="Переключите пример">
            <Tabs
              tabs={[
                { id: "lang", label: "Урок языка" },
                { id: "social", label: "Социальная педагогика" },
              ]}
              value={pblTab}
              onChange={setPblTab}
            />
            {pblTab === "lang" ? (
              <Compare
                left={{ title: "Обычный подход", text: "Объяснить грамматическое правило и дать типовое упражнение на закрепление." }}
                right={{
                  title: "Проблемный подход",
                  text: "Выразить одну и ту же мысль разными грамматическими конструкциями и сравнить, как меняются смысл и оттенок — ученик начинает пользоваться языком осознанно.",
                }}
              />
            ) : (
              <div className="mt-5">
                <p>
                  <strong>Кейс:</strong> «Если ученик отказывается участвовать в уроке, как должен поступить учитель?»
                  Единственного готового ответа здесь нет. Нажмите на аспекты, которые важно учесть:
                </p>
                <NodeExplorer items={CASE_ASPECTS} placeholder="Студент обосновывает своё решение с опорой на теорию и конкретные аргументы." />
              </div>
            )}
          </Block>
          <Quote>
            Задача учителя — не оставлять ученика один на один с трудностями, а создавать продуктивный интеллектуальный
            поиск между его текущими возможностями и новой задачей.
          </Quote>
          <Block label="Самодиагностика" title="Проверьте своё задание" hint="Отметьте признаки">
            <p className="mb-5">
              Вспомните одно из своих учебных заданий и отметьте признаки качественной проблемной задачи. При
              необходимости учитель предлагает опорные вопросы, дополнительные факты, примеры или поэтапную поддержку.
            </p>
            <Checklist items={PBL_CHECKLIST} checked={pblChecked} onToggle={togglePbl} />
            <ProgressMeter count={pblChecked.filter(Boolean).length} total={PBL_CHECKLIST.length} prefix="Соответствует" suffix="признаков" />
          </Block>
        </Body>
      </section>

      {/* 6. ИИ */}
      <section>
        <ChapterCover
          id="ai"
          number="06"
          kicker="Глава 6 · Эпоха искусственного интеллекта"
          media={MEDIA.ai}
          title={
            <>
              Роль учителя в эпоху <em className="text-gold">искусственного интеллекта</em>
            </>
          }
        />
        <Body>
          <Block label="Вызов" title="Ответ за секунду">
            <p>
              Искусственный интеллект объясняет тексты, приводит примеры, находит языковые ошибки, составляет упражнения и
              даёт мгновенную обратную связь. Отсюда закономерный вопрос — если система способна выдать ответ за секунду,
              чему тогда должен учиться сам ученик?
            </p>
            <ChipList items={["задавать точные вопросы", "проверять информацию", "оценивать аргументы", "принимать решения", "нести ответственность за результат"]} />
            <p>
              Ответ ИИ нельзя принимать как готовую истину: его необходимо{" "}
              <strong>проверять, сопоставлять и оценивать в контексте задачи</strong>.
            </p>
          </Block>
          <Block label="Приёмы" title="ИИ — не исполнитель, а инструмент обогащения обучения" hint="Переверните карточку">
            <FlipCardGrid items={AI_FLIPS} />
          </Block>
          <Block label="Этика" title="Что важно учитывать обязательно">
            <ChipList items={["академическая честность", "конфиденциальность данных", "авторское право", "ИИ может ошибаться"]} />
            <p>
              Ученик должен открыто указывать, какие инструменты он использовал, и самостоятельно отвечать за содержание
              итоговой работы.
            </p>
          </Block>
          <Block label="Итог главы" title="Новая ценность учителя">
            <ChipList items={["постановка целей", "отбор содержания", "глубокие вопросы", "организация учебной среды", "развитие качества мышления"]} />
          </Block>
        </Body>
      </section>

      {/* 7. МЕЖПРЕДМЕТНОСТЬ */}
      <section>
        <ChapterCover
          id="mezhpredmet"
          number="07"
          kicker="Глава 7 · Межпредметные связи"
          media={MEDIA.lab}
          title={
            <>
              Связывая мышление с <em className="text-gold">реальной жизнью</em>
            </>
          }
          lead="Реальные задачи объединяют сразу несколько научных дисциплин."
        />
        <Body>
          <Block label="Тезис" title="Мир не делится на предметы">
            <p>
              Интеллектуальная самостоятельность не раскрывается полностью, если предметы изучаются изолированно. Проблемы
              реальной жизни почти никогда не укладываются в рамки одной дисциплины.
            </p>
          </Block>
          <Block label="Задача" title="«Как эффективно использовать водные ресурсы города?»" hint="Нажмите на предмет">
            <NodeExplorer items={WATER_DISCIPLINES} hubTitle="Водные ресурсы города" placeholder="Каждый предмет отвечает на одну общую проблему со своей стороны." />
          </Block>
          <Block label="Ещё пример" title="Достоверность информации в социальных сетях">
            <ChipList items={["языковая грамотность", "логическое мышление", "понимание статистики", "проверка источников", "цифровая культура"]} />
          </Block>
          <Quote>
            Межпредметные связи не должны ослаблять глубину отдельных предметов. Они помогают ученику увидеть, что знания —
            не просто материал к экзамену, а инструмент понимания мира.
          </Quote>
        </Body>
      </section>

      {/* 8. ПРИНЦИПЫ */}
      <section>
        <ChapterCover
          id="principy"
          number="08"
          kicker="Глава 8 · Практика"
          media={MEDIA.principles}
          title={
            <>
              Семь конкретных принципов <em className="text-gold">обновления практики</em>
            </>
          }
          lead="Небольшие, но системные шаги меняют культуру урока."
        />
        <Body>
          <Block label="Ваш план" title="Начните с малого" hint="Раскройте принцип и отметьте свои">
            <p className="mb-6">
              Необязательно менять всю систему за один день. Учитель может начать с{" "}
              <strong>небольших, но последовательных шагов</strong>.
            </p>
            <Accordion
              items={SEVEN_PRINCIPLES}
              defaultOpen={0}
              renderExtra={(idx) => (
                <label
                  className={`mt-4 inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    prChecked[idx] ? "border-gold bg-gold text-bg" : "border-line-strong text-ink hover:border-gold"
                  }`}
                >
                  <input type="checkbox" checked={Boolean(prChecked[idx])} onChange={() => togglePrinciple(idx)} className="sr-only" />
                  {prChecked[idx] ? "✓ В моём плане" : "+ Попробую на практике"}
                </label>
              )}
            />
            <ProgressMeter count={prChecked.filter(Boolean).length} total={SEVEN_PRINCIPLES.length} prefix="Выбрано" suffix="принципов" />
          </Block>
        </Body>
      </section>

      {/* 9. ЗАКЛЮЧЕНИЕ */}
      <section>
        <ChapterCover
          id="zaklyuchenie"
          number="09"
          kicker="Заключение"
          media={MEDIA.conclusion}
          title={
            <>
              Цель образования — воспитать <em className="text-gold">независимо мыслящего</em> человека
            </>
          }
        />
        <Body>
          <Block label="Синтез" title="Архитектор познавательного развития">
            <p>
              Новая философия отказывается от взгляда на учителя как на единственный источник знаний и видит в нём{" "}
              <strong>архитектора познавательного развития</strong>. Это не умаляет значения предметных знаний — напротив,
              направляет их на глубокое понимание, перенос в новые ситуации и самостоятельные выводы.
            </p>
          </Block>

          <Reveal className="border-t border-line py-14 lg:py-20">
            <p className="font-mono text-[11px] tracking-[0.24em] text-ink-faint uppercase">Четыре мыслителя — один вектор</p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {thinkersList.map((t, i) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="group card relative block overflow-hidden"
                  style={{ marginTop: i % 2 ? "2.5rem" : 0 }}
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={t.photo}
                      alt={t.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top grayscale transition-all duration-[1200ms] group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/85 to-transparent p-5 pt-16">
                    <p className="font-mono text-[10px] text-gold">0{i + 1}</p>
                    <h4 className="mt-1 text-2xl font-semibold text-ink">{t.name}</h4>
                    <p className="mt-1 text-sm text-ink-dim">{t.summary}</p>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          <Quote>
            Ученик должен быть не пассивным получателем знаний, а активной личностью, которая ищет, объясняет, проверяет и
            применяет их.
          </Quote>
          <Block label="Новый вопрос" title="Сменим главный вопрос">
            <ShiftBanner
              from="«Сколько информации знает ученик?»"
              to="«Почему он так думает?» · «Как он доказывает свою позицию?» · «Как применяет знания в новой ситуации?» · «Какие вопросы способен поставить сам?»"
            />
            <p>
              В будущем найти информацию станет ещё проще. Но способность задать точный вопрос, отличить надёжный аргумент,
              разобраться в сложной проблеме и принять ответственное решение не формируется сама собой. Для этого необходимы
              профессиональное мастерство учителя, содержательная учебная среда и интеллектуальная свобода учащегося.
            </p>
          </Block>
          <Quote>
            Подлинный результат образования — не человек, воспроизводящий готовый ответ, а личность, способная мыслить,
            исследовать и действовать, опираясь на доказательства, даже в условиях неопределённости.
          </Quote>
        </Body>
      </section>
    </>
  );
}
