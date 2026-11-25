import { BookOpen, ChevronDown, Headphones, MessageCircle, PenLine } from "lucide-react";
import { LEARNING_ACTIVITIES, MEDIA } from "@/data/lectureData";
import { BackgroundVideo } from "./Media";

const activityIcons = { Speaking: MessageCircle, Reading: BookOpen, Listening: Headphones, Writing: PenLine };
const activityTints = { Speaking: "bg-peach", Reading: "bg-bg-2", Listening: "bg-honey", Writing: "bg-lilac" };

export function LearningActivitiesSection() {
  return (
    <section id="english-lab" aria-labelledby="english-lab-title" className="mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
        <div>
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] text-gold uppercase">От идеи к действию</p>
          <h2 id="english-lab-title" className="text-5xl font-semibold sm:text-6xl">Практикум</h2>
          <p className="mt-4 max-w-md text-ink-dim">Четыре задания о том, как мы учимся. Выполняйте их самостоятельно, обсуждайте с друзьями или адаптируйте для занятий по любому предмету.</p>
          <div className="relative isolate mt-6 flex aspect-[16/9] max-w-xl items-end overflow-hidden rounded-2xl border border-line bg-bg-2 p-4 sm:mt-8">
            <BackgroundVideo src={MEDIA.mitra.video} poster={MEDIA.mitra.poster} />
            <p className="relative rounded-full bg-panel/95 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-gold uppercase">Учимся вместе</p>
          </div>
        </div>
        <div className="grid content-start gap-3">
          {LEARNING_ACTIVITIES.map((activity) => {
            const Icon = activityIcons[activity.skill];
            return (
              <details key={activity.skill} className="group rounded-2xl border border-line bg-panel open:border-gold/40">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl p-4 hover:bg-bg-2/50 sm:gap-4 sm:p-5">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-ink ${activityTints[activity.skill]}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">{activity.label}</span>
                    <span className="font-display text-2xl leading-tight font-semibold">{activity.title}</span>
                  </span>
                  <span className="shrink-0 text-right font-mono text-[10px] text-ink-dim sm:text-xs">{activity.format}<br />{activity.time}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-gold transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="mx-4 border-t border-line pt-4 pb-5 text-sm sm:mx-5">
                  <p>{activity.prompt}</p>
                  <p className={`mt-3 rounded-xl px-4 py-3 font-medium ${activityTints[activity.skill]}`}>{activity.scaffold}</p>
                  <p className="mt-3 text-ink-dim"><strong className="text-ink">Для самопроверки:</strong> {activity.checkpoint}</p>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
