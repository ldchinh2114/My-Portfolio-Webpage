# Architecture

How the portfolio is put together: one main page at `/`, a notes index at
`/notes`, and statically generated note pages at `/notes/<slug>`. No backend.

---

## 1. Rendering model

```
Request /
  └─ src/app/layout.tsx            (Server Component)
       ├─ <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
       ├─ next/font/google  Plus Jakarta Sans → CSS var --font-plus-jakarta-sans
       ├─ <Providers>               (Client boundary)
       │    └─ <LanguageProvider>   holds language state + t()
       │         └─ {children}
       │              └─ src/app/page.tsx   (Server Component)
       │                   ├─ <SiteBackground />  fixed gradient + grid layers
       │                   ├─ <Navbar />  <Hero />  <About />
       │                   │  <Skills />  <Projects />  <Contact />
       │                   └─ <Footer />
       └─ <Analytics />             @vercel/analytics
```

Notes routes share the same providers and chrome:

```
Request /notes
  └─ src/app/notes/layout.tsx              (Server)
       ├─ <SiteBackground /> + <Navbar />
       ├─ src/app/notes/page.tsx           (Server, reads content/notes)
       │    └─ <NotesList notes={summaries} />   (Client: translated labels)
       └─ <Footer />

Request /notes/<slug>  (prerendered by generateStaticParams)
  └─ src/app/notes/[slug]/page.tsx         (Server)
       └─ <NoteView note={summary} bodies={...}>  (Client: translated chrome + switch)
            ├─ <NoteMarkdown content={vi} />       (Server: Markdown → HTML)
            └─ <NoteMarkdown content={en} />       (Server: Markdown → HTML)
```

Both Markdown bodies stay server-rendered and are passed into the client
`NoteView` as props, so `react-markdown` is not shipped to the browser. Only
note summaries (no body strings) and the two rendered bodies cross the boundary;
the VI/EN switch decides which body is mounted.

- **Server components:** `layout.tsx`, `page.tsx`, and everything under
  `src/app/notes/`. The home page reads no data; the notes pages read
  `content/notes/` from disk at build time (via `src/lib/notes.ts`) and use
  `generateStaticParams` / `generateMetadata`.
- **Client boundary:** `providers.tsx` is the only place `"use client"` is
  introduced at the top of the tree. Every home section is also a client
  component because it calls `useLanguage()` and/or uses Framer Motion.
- **Consequence:** the home page is client-rendered after the initial server
  HTML. Notes bodies are the exception — their Markdown is turned into HTML on
  the server and only the translated chrome hydrates. Keep new sections free of
  heavy client logic; prefer static Tailwind output.
- There is no `loading.tsx`, `error.tsx`, `not-found.tsx`, route handler, or
  middleware. Do not add them for a content change.

---

## 2. Component inventory

Home section components take **no props** and are named exports. Notes
components take serialisable note data as props.

| Component | File | State | Notable behaviour |
|---|---|---|---|
| `Navbar` | `src/components/Navbar.tsx` | `isMenuOpen` | Fixed pill nav; on `/` it smooth-scrolls to `#about`, `#skills`, `#projects`, `#contact`. From `/notes` the same links route home and scroll after the home sections mount. The mobile dropdown is `pointer-events-auto` because the outer nav is `pointer-events-none`. Also links to `/notes`, toggles VI/EN. |
| `Hero` | `src/components/Hero.tsx` | none | Full-height intro, stat strip, bottom marquee (`t("hero.marquee").repeat(2)`), scroll hint to `#about`. |
| `About` | `src/components/About.tsx` | none | Two-column: bio + 4 stats, then 4 platform cards (web / mobile / desktop / game). |
| `Skills` | `src/components/Skills.tsx` | none | 6 category cards, each with a lucide icon, tint and chip list. |
| `Projects` | `src/components/Projects.tsx` | none | Local `projects` array (4 entries) rendered as a 2-column card grid with cover art, tags and links. |
| `Contact` | `src/components/Contact.tsx` | none | Heading, quote, 4 social cards (GitHub, Facebook, Zalo, Email). |
| `Footer` | `src/components/Footer.tsx` | none | Brand + translated credit line + the same 4 social icons. |
| `SiteBackground` | `src/components/SiteBackground.tsx` | none | The two fixed background layers, shared by `/` and `/notes/*` so the look never drifts. |
| `NotesList` | `src/components/notes/NotesList.tsx` | none | Client component: translated header, one column of note cards (title/summary/tags from the active language), empty state, dates via `Intl.DateTimeFormat`. |
| `NoteView` | `src/components/notes/NoteView.tsx` | none (language lives in `LanguageContext`) | Client chrome for a note: back links, VI/EN switch, date/reading-time meta, tags, prose wrapper, downloads card after the body. Receives both server-rendered Markdown bodies as `bodies` and picks one from the site language. |
| `NoteMarkdown` | `src/components/notes/NoteMarkdown.tsx` | none | Server component: `react-markdown` + `remark-gfm`; external links get `target="_blank"` and `rel="noopener noreferrer"`. |

Route files in `src/app/notes/` are default exports and stay server-side.
Sections of the home page are ordered in `src/app/page.tsx` inside
`<div className="flex flex-col gap-0">`. That array of imports is the one place
that defines page order.

---

## 3. Data flow

There is no data layer, no fetch, and no API. Content comes from four places:

1. **Translation dictionary** — `src/context/LanguageContext.tsx`
   `translations.vi` and `translations.en`, consumed with `useLanguage().t(key)`.
2. **Module-level arrays inside components** — e.g. `projects` in
   `Projects.tsx`, `socials` in `Contact.tsx` and `Footer.tsx`,
   `skills`/`stats`/`platforms` built inline from `t()` calls.
3. **Hardcoded literals** — numeric stat values (`"3"`, `"10+"`, `"5+"`),
   project tags (`["C#", ".NET"]`), URLs, metadata in `layout.tsx`.
4. **Markdown files** — `content/notes/*.vi.md` and `*.en.md`, read at build
   time by `src/lib/notes.ts`. A note is a pair of files sharing a slug and a
   `date`, with per-language `title`, `summary`, `tags`, optional `downloads`
   and body. The language suffix in the filename decides the language; a
   missing half or mismatched dates fail the build. Files starting with `_` are
   ignored (drafts), and `getAllNotes()` sorts newest first. `getNote()` rejects
   unknown or unsafe slugs before touching the filesystem. Note bodies are not
   in the translation dictionary: both languages are authored content and the
   note page's switch chooses which one to render.

Language state:

```
LanguageProvider (useState<"vi"|"en">("vi"))
  ├─ mount  → localStorage.getItem("language") applied if present
  ├─ toggle → setLanguage + localStorage.setItem("language", lang)
  └─ t(key) → translations[language][key] ?? key
```

No cookie, no URL param, no server-side language negotiation. SEO metadata is
English-only and static.

---

## 4. Styling layers

| Layer | Where | Purpose |
|---|---|---|
| Raw tokens | `:root` in `globals.css` | Source of truth for the palette (`--background`, `--primary`, …). |
| Tailwind theme | `@theme inline` | Maps tokens to utilities: `bg-background`, `text-ink`, `border-line`, `text-primary`, `bg-card`, `bg-chip`, `text-muted`, `text-secondary`, `text-accent`, `font-sans`. |
| Utility classes | `globals.css` | Repeated compositions: `.glass-nav`, `.glass-card`, `.btn-primary`, `.btn-ghost`, `.chip`, `.gradient-text`, `.accent-text`, `.glow-text`, `.grid-bg`, `.warm-glow*`, `.mask-fade-x`, `.animate-marquee`, `.transform-gpu`, `.text-balance`, `.note-prose`. |
| Inline Tailwind | JSX | Everything else: layout, spacing, responsive breakpoints. |
| Inline `style` | `SiteBackground.tsx` only | Multi-stop radial gradients too verbose for a class. |

There is **no `tailwind.config.ts`** — Tailwind v4 is configured entirely in CSS
via `@import "tailwindcss"` and `@theme`. Adding a `tailwind.config.js` will not
do what you expect; add tokens in `@theme` instead.

---

## 5. Motion

Framer Motion only, no CSS animation library.

- Entrance: `initial={{ opacity: 0, y: 20 }}` +
  `whileInView={{ opacity: 1, y: 0 }}` with
  `viewport={{ once: true, margin: "-60px" | "-80px" }}`.
- Durations `0.5–0.8s`; the house easing is `[0.16, 1, 0.3, 1]`.
- Stagger is manual: `transition={{ delay: index * 0.07 }}`.
- The only CSS keyframe animation is `marquee` (40s linear, infinite), disabled
  under `prefers-reduced-motion: reduce`.
- Framer Motion does **not** automatically respect reduced motion here; if you
  add a large or looping motion, guard it with `useReducedMotion()`.

---

## 6. Headers, CSP and third parties

`next.config.ts` applies these to every route:

`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` (camera, microphone, geolocation, payment disabled),
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, and a
`Content-Security-Policy` whose allowlist is currently:

| Directive | Allowed |
|---|---|
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval'`, `*.vercel.app`, `*.vercel.com`, `*.vercel-scripts.com`, `*.google-analytics.com`, `*.googletagmanager.com` |
| `style-src` | `'self' 'unsafe-inline'` |
| `img-src` | `'self' data: https:` |
| `font-src` | `'self' data:` |
| `connect-src` | the same Vercel + Google Analytics hosts |
| `frame-ancestors` | `'none'` |
| `form-action`, `base-uri` | `'self'` |
| `object-src` | `'none'` |

Practical effect: `next/font` self-hosts fonts, so no `fonts.gstatic.com` entry
is needed. Any new analytics tool, embed, iframe, CDN script, or external API
call will be blocked until you extend the matching directive.

---

## 7. Performance model (do not regress)

- Backgrounds are `position: fixed` divs painted once, above/below content via
  negative `z-index`; they never repaint during scroll. `/notes/*` reuses the
  same `SiteBackground` component.
- No `backdrop-filter` anywhere — the comment in `globals.css` is a deliberate
  decision. Frosted looks are faked with translucent `rgba` gradients.
- Glows are radial gradients, not blurred boxes.
- `will-change: transform` is applied only to the marquee.
- `overflow-x: hidden` is set on `body` and on `main` to contain the oversized
  glow layers.
- No images are shipped from the page; the cover art is CSS gradient + icon.

---

## 8. Known gaps / deliberate omissions

Recorded so an agent does not "fix" them by accident or think they are bugs:

- `next-themes`, `clsx`, `tailwind-merge` are installed but **unused**. There is
  no `cn()` helper, no `ThemeProvider`, and no dark mode.
- `@playwright/test` is installed and `.gitignore` has Playwright paths, but
  there is no `playwright.config.*` and no test files.
- `README.md` is a single line pointing at the live site.
- `public/*.svg` are the default Next.js starter assets and are unused.
- `<html lang="en">` is hardcoded while the default UI language is Vietnamese;
  see `I18N.md` §5.
- Social links are duplicated between `Contact.tsx` and `Footer.tsx`.
- Notes have no search, tag filter, pagination, RSS feed, or browser editor.
  Every add/edit is a Markdown file plus a deploy; there are no drafts in the UI
  (prefix a filename with `_` to hide it from the list).
