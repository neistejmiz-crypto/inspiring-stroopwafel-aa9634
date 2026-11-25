# Agent notes
- Vite + React SPA. Entry `src/main.tsx` → `src/App.tsx` (header, menu, hero, audio player, footer).
- Content/data: `src/data/lectureData.ts` (all texts, nav, media paths, thinkers).
- Chapters: `src/components/ThinkerSections.tsx`, `PracticeSections.tsx`, `DiscussionSection.tsx`.
- Shared UI: `src/components/Blocks.tsx`; video/reveal/chapter cover: `src/components/Media.tsx`.
- Design tokens are in `src/styles.css` `@theme` (dark palette, gold accent, Cormorant Garamond + Onest).
- Videos lazy-load via IntersectionObserver; respect prefers-reduced-motion.
- Audio file path is fixed: `/audio/kurmangazy-konil-tolkyny.mp3`; the UI handles a missing file.
- User progress is localStorage only (no backend).
