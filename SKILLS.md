# SKILLS.md — task playbooks

Repeatable procedures for the changes this repository actually receives.

This file is a **documentation index of playbooks**, not an auto-loaded agent
skill. Read `AGENTS.md` first; open a playbook when your task matches one. Each
playbook lists the files to touch, the ordered steps, and how to verify.

| # | Playbook | Use when |
|---|---|---|
| [1](#1-add--edit--remove-a-project-card) | Add / edit / remove a project card | The work is about the Projects grid. |
| [2](#2-add-a-skill-category-or-stat) | Add a skill, category, or stat | The work is about Skills or the stat strips. |
| [3](#3-add-a-new-page-section) | Add a new page section | A new band of content, e.g. Experience or Writing. |
| [4](#4-change-colors-fonts-or-the-look) | Change colors, fonts, or the look | Reskin, token change, typography change. |
| [5](#5-add-rename-or-fix-a-translated-string) | Add / rename / fix a translated string | Any copy change, or a raw `foo.bar.baz` on screen. |
| [6](#6-add-a-script-font-or-third-party-service) | Add a script, font, or third-party service | Analytics, embeds, external CSS, new font. |
| [7](#7-update-metadata--seo) | Update metadata / SEO | Title, description, keywords, Open Graph. |
| [8](#8-ship-a-change) | Ship a change | Every change, right before you report done. |
| [9](#9-refresh-these-docs) | Refresh these docs | You changed a command, file, dependency, or pattern. |
| [10](#10-add-or-edit-a-note) | Add or edit a note | Publishing the VI/EN Markdown pair, attaching downloads, or hiding a draft. |

Global rules that apply to every playbook: keep the diff minimal, translate both
languages, preserve personal facts, do not add dependencies for content work,
and run the gates in §8.

---

## 1. Add / edit / remove a project card

**When:** a new project is shipped, a description changes, or a project is
retired.

**Touch:** `src/components/Projects.tsx`,
`src/context/LanguageContext.tsx` (both locales).

### Add

1. Pick a short kebab-free slug for the keys: `projects.<slug>.title` /
   `.desc`. Existing slugs: `task`, `recorder`, `helmet`, `multitool`, `game`.
   (`projects.task.*` is kept for compatibility even though no card uses it.)
2. Add the entry to the `projects` array in `Projects.tsx`:
   ```tsx
   {
       titleKey: "projects.<slug>.title",
       descKey: "projects.<slug>.desc",
       kindKey: "projects.kind.web",       // desktop | web | mobile | game
       tags: ["Next.js", "Tailwind CSS"],
       icon: Globe,                         // import from lucide-react
       cover: "from-[#efe0d2] via-[#f8efe6] to-[#fffdf9]",
       iconColor: "text-[#a8452c]",
       github: "https://github.com/ldchinh2114/<repo>",
       demo: null,                          // or a verified URL
   },
   ```
3. Add both keys to `translations.vi` **and** `translations.en`, in the
   `// Projects Details` block, same order.
4. Write the copy: one sentence, 12–25 words, concrete. The Vietnamese version
   makes the same claim — it is not a literal translation.
5. Order the array by strength; the grid is `md:grid-cols-2`.

**Remove:** delete the array entry **and** both locale keys. Search the codebase
for the slug first — a stale key is harmless, a dangling `titleKey` renders the
raw key.

**Verify:** four (or an even number of) cards render at `md`; both language
versions show real text; every `github` / `demo` link was actually reachable;
`npm run build` passes.

**Gotchas:** `badge: true` adds the "in progress" pill and is only meaningful
for the game card. A card with `github: null` and `demo: null` gets the pill
automatically. Tags are not translated — keep them as technology names.

---

## 2. Add a skill, category, or stat

**When:** the tech stack on the site changes, or a headline number is stale.

**Touch:** `src/components/Skills.tsx`, `LanguageContext.tsx`, or
`src/components/Hero.tsx` / `About.tsx` for stats.

### Skill item

1. Add `"skills.item.<name>": "<label>"` to both locales. Use the technology's
   real name in both (`"Next.js"`, `"C#"`); translate only human-language labels.
2. Add `t("skills.item.<name>")` to the correct category's `items` array.
3. Keep 2–5 chips per card.

### Skill category

1. Add `skills.cat.<name>` to both locales.
2. Add an object to `skills` with `icon` (import it), `tint`
   (`bg-[#hex]/10–14`), and `iconColor` (`text-primary` / `text-secondary` /
   `text-accent` / an arbitrary hex).
3. The grid is `sm:grid-cols-2 lg:grid-cols-3` — six cards fill it evenly. If you
   go to seven, expect a hole in the last row; consider merging categories.
4. Keep the order: AI → Languages → Backend → Database → Tools → Other.

### Stat

1. `Hero.tsx` → `stats`: change the `value` literal (`"3"`, `"10+"`, or the
   translated focus string).
2. `About.tsx` → `stats`: values are `"5+"`, `"8"`, `"3"`, `"1"`.
3. Change the label key in both locales if the category meaning changed.
4. Cross-check with `docs/CONTENT.md` §2 — the same claim may appear in both
   stat strips and in the project grid.

**Verify:** the card grid still has no orphan row; long Vietnamese chip labels
do not overflow at 375px; both languages re-read naturally.

---

## 3. Add a new page section

**When:** a new content band is needed (Experience, Writing, Testimonials).

**Touch:** new `src/components/<Name>.tsx`, `src/app/page.tsx`,
`LanguageContext.tsx`, optionally `src/components/Navbar.tsx`.

1. Create the component from the house skeleton in `docs/CONVENTIONS.md` §4:
   `"use client"`, 4-space indent, named export, `<section id="<id>">`,
   `aria-hidden` decorative layer, `max-w-6xl mx-auto` container.
2. Insert it in `src/app/page.tsx` **in reading order** inside the
   `<div className="flex flex-col gap-0">` block.
3. Add a nav link in `Navbar.tsx` only if the section belongs in the top-level
   story. The `links` array drives both desktop and mobile menus; add a lucide
   icon and the `#<id>` href.
4. Add the section's keys to both locales under a new `// <Name>` comment.
5. Copy the motion pattern: `initial` + `whileInView` with
   `viewport={{ once: true, margin: "-80px" }}` on the heading and
   `"-60px"` on cards.
6. Give it a top hairline if it follows a tinted section:
   `h-px bg-gradient-to-r from-transparent via-[#c9b89a]/60 to-transparent`.

**Verify:** anchor navigation lands correctly below the fixed nav
(`scroll-padding-top: 96px`); background layers do not introduce a new scroll
repaint; the section does not push the marquee or hero out of place; mobile
stacking works; both languages.

**Gotchas:** do not give a home section its own route — `/`, `/notes`, and
`/notes/<slug>` are the only routes. Do not add a section-level `<h1>` on the
home page; `Hero` owns the only one there. Notes pages own their `<h1>`.

---

## 4. Change colors, fonts, or the look

**When:** reskin, brand refresh, contrast fix, typography change.

**Touch:** `src/app/globals.css` (primary), `src/app/layout.tsx` (font only),
occasionally the arbitrary hex values inside components.

### Palette

1. Edit the value in `:root` — **not** in `@theme inline` (that block maps
   tokens to utilities).
2. If you add a token, add it to both `:root` and `@theme inline`.
3. Update the palette table in `docs/DESIGN-SYSTEM.md` §1 in the same change.
4. One-off `bg-[#hex]/10` tints are per-card identity. If you change the
   system accent, sweep the components for hexes that no longer relate to it:
   `#c2571f`, `#b08236`, `#a8452c`, `#8a6d2f`, `#c9b89a`, `#f5ede0`, `#e7dccb`.

### Font

1. Swap the `next/font/google` import in `layout.tsx` and the weights.
2. Keep `variable: "--font-plus-jakarta-sans"` **or** update
   `--font-sans` in `@theme inline` to the new variable name — both places.
3. Keep a sensible fallback stack in `body` (`Arial, Helvetica, sans-serif`).
4. Re-check the hero: `lg:text-[5.5rem]` with `leading-[0.95]` was tuned for the
   current face. Long, wide fonts will wrap `CODE THE VIBE,` badly.

### Do not

- Add `backdrop-filter` / blur (see `docs/DESIGN-SYSTEM.md` §7).
- Add a dark theme. `next-themes` is installed but unused; a real theme means a
  provider, a toggle, token overrides for every surface, and a CSP/hydration
  review. Treat it as its own project.
- Add a second accent gradient direction; the house gradient is `100deg`.

**Verify:** contrast in both themes of lighting (the palette is light-only),
hover states still distinguishable, scroll FPS unchanged, sections still read as
one family.

---

## 5. Add, rename, or fix a translated string

**When:** any copy change, or you see a raw key like `hero.descripton` on screen.

**Touch:** `src/context/LanguageContext.tsx` and the consuming component.

### Add

1. Choose the key: `<area>.<element>[.<variant>]`, matching §3 of
   `docs/I18N.md`.
2. Add it to `translations.vi` under the matching `// Section` comment.
3. Add the **same key in the mirrored position** to `translations.en`.
4. Use `t("key")` in the component. If the component has no `"use client"`,
   either add it or pass the string down as a prop from a client parent.

### Rename

Rename is a three-part edit and easy to half-finish:

1. `rg "old.key" src/` to find every call site.
2. Rename in **both** locale objects.
3. Update every call site in the same commit.
4. Nothing fails if you miss one — the UI silently shows the raw key. Re-check
   by toggling both languages.

### Fix a missing key

1. Note the exact key string visible in the UI.
2. Add it to **both** locales.
3. If it should not exist (dead key), remove the call site instead.

**Verify:** toggle VI ⇄ EN and reload; no dotted identifiers anywhere on the
page; both locale objects still have matching key sets
(`rg -c '":' src/context/LanguageContext.tsx` is a rough sanity check).

---

## 6. Add a script, font, or third-party service

**When:** analytics, an embed, a hosted asset, a web font.

**Touch:** `next.config.ts` (CSP), `src/app/layout.tsx` or the component,
`package.json` if a package is involved, `docs/ARCHITECTURE.md` §6.

1. Decide the directive: `script-src` (script tag), `connect-src` (XHR/fetch),
   `img-src` (pixel/remote image), `font-src` (font CDN), `frame-src` (iframe —
   **not currently defined**, so adding an embed means adding the directive).
2. Add the narrowest origin that works (`https://*.example.com`, not `https:`).
3. Prefer `next/script` with an explicit strategy over a raw `<script>`.
4. Prefer `next/font` (self-hosted) over a font CDN — that is why no Google Fonts
   origin is in `font-src` today.
5. For a `<img>` from a new host, use `next/image` and confirm `img-src`.
6. Restart `npm run dev` after editing `next.config.ts`.
7. Verify with the **production build** (`npm run build && npm run start`), not
   only dev, and watch the console for CSP violations.
8. Update the directive table in `docs/ARCHITECTURE.md` §6 and the warning in
   `AGENTS.md` §4 if the policy widens.

**Never** add `'unsafe-eval'` to a new directive, loosen `frame-ancestors`, or
remove `object-src 'none'` as a shortcut.

---

## 7. Update metadata / SEO

**When:** the tagline, role, or project positioning changes.

**Touch:** `src/app/layout.tsx`.

1. Keep `title` under ~60 characters and `description` under ~160.
2. Keep the em dash `—` in the title (it is part of the brand line).
3. Update `openGraph.title` / `.description` to match — they are separate
   strings, not derived.
4. Keywords are a light signal only; keep them to the real stack.
5. `metadata` is static English and does **not** follow the language toggle. Do
   not try to make it dynamic without a routing/locale decision.
6. If you add an OG image or absolute URL, add `metadataBase` first.
7. Reflect any change of positioning in `docs/CONTENT.md` §7.

---

## 8. Ship a change

**When:** always, before reporting done.

```bash
npx tsc --noEmit        # types
npm run lint            # style + hooks + a11y rules
npm run build           # the real gate
```

Then:

1. Manual pass per `docs/DEVELOPMENT.md` §4 (both languages, 375/768/1440,
   keyboard focus, console clean).
2. `git status` / `git diff` — confirm only intended files changed and that
   `package-lock.json`, `.next/`, and `tsconfig.tsbuildinfo` are not staged.
3. Commit with a plain sentence-case subject, matching the repo history:
   `Replace Text Extractor with HELMO mobile app project`.
4. One concern per commit; a content change should not also restyle a section.
5. Push to `master` for a Vercel production deploy, or a branch for a preview.
6. If you opened a PR, link it in the requesting thread.

**Report honestly:** list which gates ran, which did not, and any known
regression or follow-up. Do not claim a visual check you did not perform.

---

## 9. Refresh these docs

**When:** you changed a command, a dependency, a file location, or a pattern.

- Command or script → `AGENTS.md` §2 and `docs/DEVELOPMENT.md` §2.
- New component or folder → `AGENTS.md` §3 and `docs/ARCHITECTURE.md` §2.
- New route or content type → `docs/ARCHITECTURE.md` §1–3 and
  `docs/CONTENT.md`.
- New token, utility class, or motion rule → `docs/DESIGN-SYSTEM.md` §4/§6.
- New key family or locale → `docs/I18N.md` §3.
- New editable content location → `docs/CONTENT.md` §1.
- New dependency or external origin → `docs/ARCHITECTURE.md` §6,
  `docs/DEVELOPMENT.md` §7–8, `AGENTS.md` §4.
- New playbook worth repeating → add a numbered section here and a row to the
  table at the top.

Keep the docs factual: describe the code as it is, not as it should be. If you
find drift between a doc and the code, fix the doc in the same change and say so.

---

## 10. Add or edit a note

**When:** publishing a note, fixing a typo in one, or attaching a file/folder.

**Touch:** `content/notes/<slug>.vi.md` + `content/notes/<slug>.en.md`,
optionally `public/downloads/*`. No `LanguageContext.tsx` edit is needed unless
you are changing the notes UI itself.

### Add

1. Create `content/notes/<slug>.vi.md` and `content/notes/<slug>.en.md`. The
   shared filename (without `.vi` / `.en`) **is** the URL: `/notes/<slug>`. Use
   lowercase letters, digits, and hyphens. The frontmatter shape and writing
   rules are in `public/downloads/article-writing-guideline.{vi,en}.md` and
   `docs/CONTENT.md` §10.
2. Fill the frontmatter in both files. They share `date`; everything else is
   per language:
   ```md
   ---
   title: "A short, specific title"
   date: "2026-10-21"
   summary: "One sentence shown on the card and in search results."
   tags: ["Next.js", "AI"]
   downloads:
     - label: "Starter template"
       href: "/downloads/starter-template.zip"
       meta: "ZIP"
   ---
   ```
   There is no `language` key: the filename suffix decides. A leftover key that
   disagrees with the filename fails the build.
3. Write the body in Markdown, once per language (GFM tables and task lists
   work). Headings start at `##`; the page owns the `h1`. Code fences render on
   the dark ink surface.
4. Files go in `public/downloads/` and are referenced as `/downloads/<file>`.
   A folder must be zipped first; a folder cannot be downloaded as a folder.
5. `npm run build` — `generateStaticParams` creates `/notes/<slug>` and the
   loader throws a clear `[notes]` error if a file is missing, `title`/`date` are
   missing, the date is not `YYYY-MM-DD`, or the two dates differ.

The note page has a VI/EN switch that swaps title, summary, tags, downloads and
the Markdown body; it uses the same language as the site toggle, so both stay
in sync.

### Edit / rename / remove

- Editing a body needs no other change. Keep the slug stable so existing links
  keep working.
- Keep both languages in sync when you edit a fact, a link or a download.
- Renaming a file changes the public URL; rename both files and update any
  inbound links.
- Removing the route means removing both files.
- Prefix both filenames with `_` to hide a note from the list and the build.
  This is the draft mechanism — there is no draft flag in frontmatter. A note
  with only one language is not a draft; it fails the build.
- Note order is automatic (newest `date` first); do not add a manual order field.

### Verify

- [ ] `/notes` shows the card with the bilingual badge, date, and reading time,
      and switches its title/summary with the site toggle.
- [ ] Card opens `/notes/<slug>`; the VI/EN switch swaps the whole article
      (title, summary, tags, downloads, body).
- [ ] Every `downloads.href` returns 200 and has a sensible `label`/`meta`.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build`.

**Gotchas:** the renderer is `react-markdown` + `remark-gfm`, chosen over MDX so
content stays portable. Do not add `@tailwindcss/typography` — `.note-prose` in
`globals.css` is the prose theme. Do not import `src/lib/notes.ts` from a client
component except as `import type`; it uses `fs`.
