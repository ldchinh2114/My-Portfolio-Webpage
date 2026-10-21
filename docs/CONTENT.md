# Content map

Every editable fact on the site, and exactly where it lives. Content edits are
the most common task in this repo, and the most common way to break it is
changing one copy of a duplicated value.

> Personal facts here belong to the owner. Do not alter names, claims, links or
> contact details unless the request says so explicitly.

---

## 1. Where content lives

| Content | File | Shape |
|---|---|---|
| SEO title, description, keywords, Open Graph | `src/app/layout.tsx` → `metadata` | Next `Metadata` object |
| Nav labels | `LanguageContext.tsx` → `nav.*` | translated |
| Hero headline, description, CTA labels, scroll hint, marquee | `hero.*` | translated (split across `title` / `subtitle` / `title2`) |
| Hero stat **values** | `Hero.tsx` → `stats` | hardcoded `"3"`, `"10+"`, `t(...)` |
| Hero stat **labels** | `hero.stat.*` | translated |
| Bio, eyebrow, "what I build" panel | `about.*` | translated |
| About platform cards (web/mobile/desktop/game) | `about.p.<key>.{title,desc}` + `about.p.game.badge` | translated |
| About stat values | `About.tsx` → `stats` | hardcoded `"5+"`, `"8"`, `"3"`, `"1"` |
| Skill categories and items | `Skills.tsx` → `skills` + `skills.cat.*` / `skills.item.*` | icons/tints in TSX, labels translated |
| Project entries | `Projects.tsx` → `projects` | TSX array + `projects.<name>.*` translations |
| Project tags | `Projects.tsx` → `tags` | hardcoded, not translated |
| Project links | `Projects.tsx` → `github` / `demo` | hardcoded URLs or `null` |
| Contact heading + quote + "find me" label | `contact.*` | translated |
| Social links (cards) | `Contact.tsx` → `socials` | hardcoded |
| Social links (icons) | `Footer.tsx` → `socials` | **duplicate of the above** |
| Footer credit line | `contact.footer` | translated |
| Notes (title, summary, body, tags, downloads per language) | `content/notes/<slug>.vi.md` + `<slug>.en.md` | frontmatter + Markdown |
| Note download files | `public/downloads/*` referenced from note frontmatter | static files |
| Live site link | `README.md` | single line |

---

## 2. Facts duplicated in more than one place

Update **all** copies in one change:

1. **Social links** — `Contact.tsx` (`socials`) and `Footer.tsx` (`socials`).
   Same four entries, same order, same URLs, same labels.
2. **Game "in progress" badge** — `about.p.game.badge` is rendered in both the
   About platform card and the Projects card badge.
3. **Project count / platform claims** — `Hero` says `3` platforms and `10+`
   stack items; `About` says `8` languages / `3` platforms / `1` game. These are
   independent literals; keep them mutually plausible.
4. **The owner's name** — `L.D.Chinh` appears in `layout.tsx` metadata, the
   `Navbar` brand, the `Footer` brand, and the `contact.footer` translations.

---

## 3. Adding a project card

`Projects.tsx`

```tsx
{
    titleKey: "projects.<name>.title",
    descKey: "projects.<name>.desc",
    kindKey: "projects.kind.desktop",          // desktop | web | mobile | game
    tags: ["C#", ".NET", "Windows API"],
    icon: Monitor,                              // any lucide icon, must be imported
    cover: "from-[#f6e3d2] via-[#fbf1e6] to-[#fffdf9]",
    iconColor: "text-[#b8551f]",
    github: "https://github.com/ldchinh2114/<repo>",  // or null
    demo: "https://<app>.vercel.app/",                // or null
    // badge: true,                             // optional "in progress" pill
},
```

Then:

1. Add `projects.<name>.title` and `.desc` to **both** `vi` and `en`.
2. Import the new icon from `lucide-react` at the top of the file.
3. Pick a `cover` gradient from the warm family (`#f6e3d2`, `#f4e8cf`,
   `#efe0d2`, `#f3dfd2`) — do not introduce a cool hue.
4. Order the array so the strongest project is first; the grid is
   `md:grid-cols-2`, so keep an even count if you care about the last row.
5. If the card has neither `github` nor `demo`, the component renders the
   "in progress" label automatically.

Project `desc` style: one sentence, 12–25 words, concrete, no superlatives. The
Vietnamese version is not a literal translation — keep the same claim, natural
phrasing.

---

## 4. Adding or changing a skill

All skill content is in `Skills.tsx`:

```tsx
{
    category: t("skills.cat.<key>"),
    items: [t("skills.item.<a>"), t("skills.item.<b>")],
    icon: Code,
    tint: "bg-[#b08236]/12",
    iconColor: "text-secondary",
}
```

- To add an **item**: add `skills.item.<name>` to both locales, then reference it
  in the right category's `items` array.
- To add a **category**: add `skills.cat.<name>`, then a new object with an icon,
  tint and `iconColor`. The grid is `sm:grid-cols-2 lg:grid-cols-3`; six cards
  fill it evenly today.
- Categories are ordered AI → Languages → Backend → Database → Tools → Other.
  The AI category is first because the site's identity is "AI-native".
- Keep 2–5 chips per card; the chip row wraps and long labels look unbalanced.
- Technology names stay untranslated (`skills.item.nextjs` is `"Next.js"` in both
  locales). Only human-language labels differ.

---

## 5. Stats

Values are plain strings in the component, labels are translated.

- `Hero.tsx` → `stats`: platform count, stack count, focus label (`"With AI"`).
- `About.tsx` → `stats`: AI tools, languages, platforms, game projects.

If you change a number, change the matching label in both locales if it implies
a category (e.g. don't claim `1` game project while adding a second game card).

---

## 6. Contact and social links

Both `Contact.tsx` and `Footer.tsx`:

```tsx
{ icon: Github,   href: "https://github.com/ldchinh2114",                label: "GitHub" },
{ icon: Facebook, href: "https://www.facebook.com/LeeChiinhh",           label: "Facebook" },
{ icon: MessageCircle, href: "https://zalo.me/84707166199",              label: "Zalo" },
{ icon: Mail,     href: "mailto:chinhle6030@gmail.com",                  label: "Email" },
```

Rules:

- `label` is used as the visible text (Contact) and the `aria-label` (Footer).
- `mailto:` links must not get `target="_blank"`; the components already branch
  on `href.startsWith("mailto")`.
- Adding a fifth network: add it to both arrays, pick a lucide icon, and confirm
  the grid (`grid-cols-2 sm:grid-cols-4`) does not leave an orphan cell — either
  keep it at four or adjust the column count.
- Never point a social link at a URL you have not verified. The owner's handles
  are exact (`ldchinh2114`, `LeeChiinhh`).

---

## 7. SEO and metadata

`src/app/layout.tsx`:

```ts
export const metadata: Metadata = {
    title: "L.D.Chinh — AI-Native Developer",
    description: "Portfolio of L.D.Chinh — an AI-assisted developer building web, mobile and desktop apps, working toward making games with AI.",
    keywords: ["AI developer", "Next.js", "React Native", ".NET", "game development", "Vietnam"],
    openGraph: { title: …, description: …, type: "website" },
};
```

Notes:

- Metadata is static English, not translated, and is not affected by the toggle.
- There is no `metadataBase`, `twitter` card, `icons`, `robots.ts`, or
  `sitemap.ts`. Adding `metadataBase` is the prerequisite if you add absolute
  Open Graph image URLs.
- The em dash `—` is intentional in the title; keep the character, not `--`.
- `description` must stay under ~160 characters.

---

## 8. Content voice

- First person, calm, specific. No hype, no "revolutionary", no invented client
  work or metrics.
- The identity is **AI-assisted / AI-native developer**: AI writes and reviews;
  the owner designs, verifies and refines. Keep that nuance — do not claim the
  owner hand-writes everything, and do not claim AI ships unattended.
- Platforms and scope: web, mobile, desktop, and a first game in progress.
- Vietnamese copy is written naturally, not machine-translated; keep diacritics
  and sentence casing.
- Em dashes, `•` separators in the marquee, and `&ldquo;…&rdquo;` for quotes are
  the established punctuation.

---

## 9. Content change checklist

- [ ] Value updated in every place listed in §2.
- [ ] Keys added to both `vi` and `en`, in the same relative order.
- [ ] Tags/URLs/icons are real and reachable.
- [ ] No placeholder text, no "Project 1", no `TODO`.
- [ ] Layout still balanced at 375px (long Vietnamese strings wrap first).
- [ ] `npm run build` passes.

---

## 10. Notes

A published note is **two Markdown files that share a slug**: a Vietnamese one
and an English one.

```
content/notes/my-note.vi.md  →  /notes/my-note  (Vietnamese)
content/notes/my-note.en.md  →  /notes/my-note  (English)
```

The slug (`my-note`) is the URL. Use lowercase letters, digits, and hyphens.
The `.vi` / `.en` suffix decides which language the file is, and the note page
shows a VI/EN switch that swaps the title, summary, tags, downloads and body.
Both files must exist; a note with only one language fails the build. Prefix
both filenames with `_` to keep a note out of the build (draft).

### Frontmatter

Each file carries the same `date`, and its own language-specific `title`,
`summary`, `tags`, `downloads` and body:

```md
---
title: "A short, specific title"
date: "2026-10-21"
summary: "One sentence shown on the list card and in search results."
tags: ["Notes", "Markdown"]
downloads:
  - label: "Article writing guideline"
    href: "/downloads/article-writing-guideline.en.md"
    meta: "MD"
---

Body starts here. **Markdown** and GFM tables/lists are supported.
```

Frontmatter rules:

- `title` and `date` are required in both files. The date must be `YYYY-MM-DD`;
  the build fails with a clear `[notes]` error otherwise, so a broken note
  cannot ship silently.
- The two files must declare the **same `date`**. A mismatch fails the build.
- `summary` is optional but should be one sentence (12–25 words). It becomes the
  meta description.
- There is no `language` key: the `.vi.md` / `.en.md` suffix is authoritative.
  A leftover `language` key that disagrees with the filename fails the build.
- `tags` are technology/topic names; translate them only when the language has
  an established term.
- `downloads` is optional and lives in each language file, so labels can be
  translated while `href`s point at the same file. Each entry needs `label` and
  `href`; `meta` is the small line under the label (e.g. `"ZIP"`, `"1.2 MB"`).
  `href` must be a `/`-rooted path or an `https://` URL. Drop an entry rather
  than pointing at a file that is not committed.
- Sort order is automatic: newest `date` first. Ties break by the Vietnamese
  title.

### Downloads

1. Put the file in `public/downloads/`.
2. For a folder, zip it first and commit the `.zip`; a folder cannot be
   downloaded as a folder.
3. Reference it as `/downloads/<file>` in each note file's frontmatter.
4. The link renders with a `download` attribute. External `https://` links open
   in a new tab instead.
5. The downloads card renders after the Markdown body, above the "All notes"
   footer link, and switches with the note language.

`public/downloads/article-writing-guideline.vi.md` and
`article-writing-guideline.en.md` are the downloadable writing guides, one per
language. They document the structure and rules above; they are references, not
copy-paste templates. Keep the starter note
(`vi-sao-minh-them-trang-notes.*.md`) or delete the pair once you have real posts.

### Publishing

There is no editor or database: edit the two files, commit, and push. Vercel
rebuilds the static pages. `npm run build` regenerates every `/notes/<slug>`
page via `generateStaticParams`; a new pair appears on the next deploy.

Checklist for a note:

- [ ] Both `<slug>.vi.md` and `<slug>.en.md` exist with a safe slug.
- [ ] Frontmatter parses in both files (`date` valid and identical).
- [ ] `/notes` shows the card in both UI languages.
- [ ] `/notes/<slug>` renders the body in both languages; the switch swaps
      title, summary, tags, downloads and body.
- [ ] Every `downloads.href` returns 200 and the file is in `public/downloads/`.
