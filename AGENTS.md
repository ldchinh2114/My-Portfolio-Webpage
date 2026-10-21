# AGENTS.md

Instructions for AI coding agents (and humans) working in this repository.
Read this file first, then open only the `docs/` page that matches your task.

---

## 1. What this project is

A content-first personal portfolio for **L.D.Chinh** — an AI-assisted developer.
One main page plus a Markdown-powered notes section.
Live at <https://ldchinh.vercel.app>, deployed from `master` via Vercel.

| | |
|---|---|
| Framework | Next.js `16.2.4` (App Router, no `src/app/api` routes) |
| Language | TypeScript, `strict: true` |
| UI | React `19.2.3`, Tailwind CSS `v4` (CSS-first config), Framer Motion `12`, lucide-react icons |
| Content | Bilingual **Vietnamese (default) / English**, one dictionary in `src/context/LanguageContext.tsx` |
| Notes | Markdown files in `content/notes/`, rendered by `react-markdown` + `remark-gfm` |
| Hosting | Vercel, with `@vercel/analytics` |
| Tests | None yet. `@playwright/test` is installed but there is no config and no specs |

There is **one main page** at `/`, a notes index at `/notes`, and one statically
generated page per note at `/notes/<slug>`. There is **no backend** and no API.
Everything is static content rendered from a hardcoded dictionary, Markdown
files, and hardcoded data arrays in the components.

---

## 2. Commands

```bash
npm install          # once
npm run dev          # http://localhost:3000
npm run lint         # eslint (flat config, next/core-web-vitals + typescript)
npm run build        # production build — the real gate
npx tsc --noEmit     # typecheck (no npm script exists)
```

`npm run lint`, `npx tsc --noEmit`, and `npm run build` are the three checks that
must pass before you call work "done". There is no formatter configured.

---

## 3. Repository map

```
AGENTS.md                  ← you are here
SKILLS.md                  ← step-by-step recipes for common changes
content/notes/             ← one .md file per note (frontmatter + body)
docs/                      ← deeper reference (start at docs/README.md)
public/downloads/          ← files linked from note frontmatter
src/
  app/
    layout.tsx             metadata + font + <Providers> + <Analytics>   (server)
    page.tsx               section order + fixed background layers       (server)
    notes/
      layout.tsx           notes chrome: background + navbar + footer    (server)
      page.tsx             notes index                                   (server)
      [slug]/page.tsx      note detail, statically generated per file    (server)
    providers.tsx          wraps the tree in LanguageProvider            (client)
    globals.css            Tailwind import, design tokens, utility classes
  components/
    Navbar.tsx  Hero.tsx  About.tsx  Skills.tsx  Projects.tsx  Contact.tsx  Footer.tsx
    SiteBackground.tsx     shared fixed background for / and /notes
    notes/                 NotesList, NoteView, NoteMarkdown, date helper
  lib/
    notes.ts               frontmatter parser + note loader (fs, build time)
  context/
    LanguageContext.tsx    the vi/en dictionary + useLanguage()
next.config.ts             security headers + CSP
```

---

## 4. Golden rules

1. **This is a content site, not a platform.** Prefer editing the dictionary,
   a data array, a Markdown file, or a className. Do not add state managers,
   routers, CMS layers, config abstraction, or new dependencies for a content
   change. Notes are authored as Markdown files in `content/notes/` — do not add
   a browser editor, login, or database.
2. **Every user-visible UI string is translated.** Strings go through
   `t("some.key")` and the key **must exist in both `vi` and `en`**. A missing
   key silently renders the raw key name. Note bodies are the exception: each
   note is authored in one language and tagged `vi`/`en`. See `docs/I18N.md`.
3. **Never invent or "improve" personal facts.** Links, email, phone, project
   claims, GitHub URLs, and bio sentences are the owner's. Change them only
   when explicitly asked, and change the same value everywhere it is duplicated.
4. **Preserve the warm light visual language.** Reuse the tokens and utility
   classes in `globals.css`. Do not introduce a new palette, and do not add a
   dark theme unless asked — `next-themes` is installed but intentionally unused.
5. **Performance is part of the design.** The background layers are static and
   fixed on purpose. Do not add `backdrop-filter` / `blur()` to scrolling
   surfaces, and do not animate layout properties. See `docs/DESIGN-SYSTEM.md`.
6. **New external origins must be added to the CSP** in `next.config.ts`
   (`script-src`, `connect-src`, `img-src`, `font-src`, …) or the browser will
   block them in production while local dev still works.
7. **Respect the server/client boundary.** `layout.tsx`, `page.tsx`, and all
   `src/app/notes/` pages stay server components. Note bodies are rendered on
   the server by `NoteMarkdown`; only the translated chrome (`NotesList`,
   `NoteView`) is a client component. Any component using hooks, motion, or
   `useLanguage` needs `"use client"` on line 1.
8. **No dead-end edits.** If you touch one social link, one stat, or one
   project, check whether the same fact lives in a second file and update both.

---

## 5. Common tasks → read this

| Task | Guide |
|---|---|
| Add / edit / remove a project card | `SKILLS.md` §1, `docs/CONTENT.md` |
| Add or edit a note (Markdown + downloads) | `SKILLS.md` §10, `docs/CONTENT.md` §10 |
| Add a skill, category, or stat | `SKILLS.md` §2, `docs/CONTENT.md` |
| Add a new page section | `SKILLS.md` §3, `docs/ARCHITECTURE.md` |
| Change colors, fonts, or the look | `SKILLS.md` §4, `docs/DESIGN-SYSTEM.md` |
| Add or rename any text | `SKILLS.md` §5, `docs/I18N.md` |
| Add a third language | `docs/I18N.md` |
| Change metadata / SEO / social preview | `docs/CONTENT.md` |
| Add a script, font, or third-party service | `SKILLS.md` §6, `docs/DEVELOPMENT.md` |
| Understand how the app is wired | `docs/ARCHITECTURE.md` |
| Code style and component patterns | `docs/CONVENTIONS.md` |
| Something is broken locally | `docs/DEVELOPMENT.md` §Troubleshooting |

`SKILLS.md` is a playbook index (not an auto-loaded agent skill). Use it when a
task has a known, repeatable procedure.

---

## 6. Editing conventions in one screen

- Components: `export const Name = () => { ... }` with a **named** export and
  `"use client"` first. App Router files (`layout.tsx`, `page.tsx`,
  `providers.tsx`) use **default** exports. The same default-export rule applies
  to `src/app/notes/**` route files; `src/lib/notes.ts` is a server-only module.
- Match the indentation of the file you edit: **4 spaces** in `src/components`,
  `src/context`, and `src/lib`; **2 spaces** in `src/app/layout.tsx`,
  `src/app/page.tsx`, and `src/app/notes/**`.
- Import with the `@/` alias (`@/components/Hero`, `@/context/LanguageContext`).
  Do not use long `../../` chains.
- Tailwind classes inline; shared visual patterns live in `globals.css`
  (`glass-card`, `chip`, `btn-primary`, `accent-text`, `grid-bg`, `warm-glow*`).
- Icons come from `lucide-react`; size them explicitly (`size={18}`).
- No `any`, no unused imports, no `console.log` left behind.
- Comments explain *why* (performance, i18n, a11y), never *what*.
- Keep `data-scroll-behavior="smooth"` on `<html>` in `src/app/layout.tsx`;
  Next 16 needs it while `globals.css` sets `scroll-behavior: smooth`.

Full detail: `docs/CONVENTIONS.md`.

---

## 7. Definition of done

Before reporting completion:

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Both languages checked: toggle VI ⇄ EN **and reload** the page
- [ ] Verified at ~375px, ~768px, and ~1440px widths
- [ ] Keyboard focus still visible; decorative layers still `aria-hidden`
- [ ] No new dependency, external origin, or CSP entry without saying so
- [ ] Personal facts (links, email, claims) unchanged unless that was the task
- [ ] If a note was added: list card opens the detail page, Markdown renders,
      and every `downloads.href` returns 200

If a check could not be run, say so explicitly instead of implying it passed.

---

## 8. Git and delivery

- Default branch is `master`; `origin` is
  `https://github.com/ldchinh2114/My-Portfolio-Webpage.git`.
- Commit subjects in this repo are plain, sentence-case summaries
  (`Redesign portfolio with warm light theme and AI-focused content`,
  `Replace Text Extractor with HELMO mobile app project`). No
  `feat:`/`fix:` prefixes, no ticket numbers.
- Keep commits scoped: a content change should not also restyle a section.
- When you open a PR, link it in the thread that requested the work.

---

## 9. Documentation upkeep

`AGENTS.md` and `docs/` are the source of truth for how this repo works. If you
change a command, add a dependency, move a file, or establish a new pattern,
update the matching doc in the same change. Keep new docs in `docs/` and add
them to the index in `docs/README.md`.
