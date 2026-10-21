# Design system

A warm, light, paper-like palette with copper accents. Everything is defined in
`src/app/globals.css`; there is no `tailwind.config.*` (Tailwind v4 is
CSS-first).

**Direction in one line:** warm cream paper, fine grid, soft copper glows,
near-black ink, generous whitespace, restrained motion — no glass blur, no dark
mode, no neon.

---

## 1. Palette

Source of truth: `:root` in `globals.css`. Change a value there, not in JSX.

| Token | Hex / RGBA | Role |
|---|---|---|
| `--background` | `#faf6ef` | Page paper |
| `--foreground` | `#2c241c` | Default ink |
| `--muted` | `#6f6153` | Body copy, secondary labels |
| `--line` | `#e7dccb` | All 1px borders and separators |
| `--card-bg` | `rgba(255,253,249,.86)` | Nav / card base |
| `--card-bg-strong` | `#fffdf9` | Opaque card, footer band |
| `--chip-bg` | `#f5ede0` | Chip / tag / toggle surfaces |
| `--primary` | `#c2571f` | Copper — links, icons, emphasis |
| `--secondary` | `#b08236` | Gold — secondary accents |
| `--accent` | `#a8452c` | Rust — gradient endpoint |
| `--nav-bg` | `rgba(250,246,239,.88)` | Fixed nav surface |

`@theme inline` maps these (plus duplicates `--color-ink: #2c241c`,
`--color-ink-soft: #6f6153`, `--color-card: #fffdf9`, `--color-chip: #f5ede0`)
into utilities: `bg-background`, `text-foreground`, `text-ink`,
`text-ink-soft`, `text-muted`, `border-line`, `bg-card`, `bg-chip`,
`text-primary`, `text-secondary`, `text-accent`, `font-sans`.

**One-off tints** used inline and acceptable as arbitrary values, because they
are per-card identity rather than system colours:

| Value | Where |
|---|---|
| `#8a6d2f` / `#7a5f26` | Game card + "in progress" badge |
| `#96683f` / `#a5764a` | Tools skill card |
| `#7c7e3c` / `#8a8c4a` | Backend skill card |
| `#c9b89a` | Card / nav shadow tint |
| `#fffaf4` | Text on the primary gradient button |
| `#f3ece1` | Scrollbar track |

If a one-off tint appears a third time, promote it to a token.

### Contrast

- `text-ink` on `--background`: very high, use freely.
- `text-muted` on `--background`: fine at `text-sm` and above; avoid for
  `text-xs` on tinted card fills.
- White on the `btn-primary` gradient: passes at 14px semibold and above.
- Do not put `text-primary` (#c2571f) on `bg-chip` (#f5ede0) for body text —
  reserve it for 14px+ semibold labels.

---

## 2. Type scale

Font: **Plus Jakarta Sans** via `next/font/google`, weights `400 500 600 700 800`,
exposed as `--font-plus-jakarta-sans` and wired to `--font-sans`.
`body` sets `letter-spacing: -0.01em`.

| Role | Classes |
|---|---|
| Hero headline | `text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[0.95]` |
| Page headline (Contact) | `text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-[1.05]` |
| Section heading | `text-4xl md:text-5xl font-extrabold uppercase tracking-tight` |
| Card heading | `text-2xl md:text-3xl font-extrabold` / `text-xl font-bold` |
| Lead paragraph | `text-base md:text-xl` or `text-base md:text-lg` |
| Body | `text-sm` / `text-base`, `leading-relaxed` |
| Eyebrow / badge | `text-sm md:text-base font-bold tracking-wide text-primary` |
| Chip / tag | `text-[13px] font-medium` or `text-xs font-semibold` |
| Marquee | `text-sm font-semibold tracking-[0.2em] text-ink/50` |

Headline pattern: first line `gradient-text`, second line `text-ink/35`
(de-emphasised), third line `accent-text glow-text`. Section headings put the
translated second word in `<span className="accent-text">`.

---

## 3. Layout and spacing

| Concern | Convention |
|---|---|
| Page shell | `min-h-screen bg-background overflow-x-hidden relative` |
| Section | `relative py-20 md:py-28 px-4 md:px-6 overflow-hidden` |
| Container | `max-w-6xl mx-auto` (Contact: `max-w-4xl`) |
| Grid gap | `gap-3` (cards-in-card), `gap-4` / `gap-5` (card grids), `gap-10 lg:gap-16` (two-column) |
| Card padding | `p-5` / `p-6`; large panels `p-6 md:p-8` |
| Radius | `rounded-2xl` cards/panels, `rounded-3xl` large panel, `rounded-full` pills/buttons, `rounded-md` (project tags) / `rounded-xl` (icon tiles) |
| Hairlines | `border border-line`, or `h-px bg-gradient-to-r from-transparent via-[#c9b89a]/60 to-transparent` |
| Anchor offset | `scroll-padding-top: 96px` on `html` — keep in sync with nav height |

Breakpoints in use: `sm` 640, `md` 768, `lg` 1024. Nothing above `lg`.

---

## 4. Shared utility classes

Defined in `globals.css`. **Reuse these instead of re-deriving the effect.**

| Class | Effect | Used by |
|---|---|---|
| `.glass-nav` | `--nav-bg` fill + 1px `--line` border. No blur. | `Navbar` pill |
| `.glass-card` | Vertical `rgba` cream gradient + 1px border. No blur. | About panel, Skills cards, Projects cards, Contact socials |
| `.chip` | Pill: `--chip-bg`, `--line` border, hover lifts 2px and tints copper. | Skill chips |
| `.btn-primary` | Copper→gold gradient pill, white text, copper shadow, lifts on hover. | Hero "View Projects" |
| `.btn-ghost` | Cream pill with border, lifts on hover. | Hero "Contact Me" |
| `.gradient-text` | Ink→brown→copper text clip. | Hero line 1 |
| `.accent-text` | Rust→copper→gold text clip. | Hero line 3, section heading accent word, brand dot |
| `.glow-text` | Soft copper text-shadow. | Hero line 3 |
| `.grid-bg` | 64px square grid with radial mask fade. | Page background, project covers |
| `.warm-glow` | Radial copper fade (`.16 → 0`). | Hero, About, Projects, Contact |
| `.warm-glow-gold` | Radial gold fade (`.18 → 0`). | Hero, Skills |
| `.warm-glow-rust` | Radial rust fade (`.14 → 0`). | Hero mid-band |
| `.mask-fade-x` | Horizontal fade mask for the marquee. | `Hero` marquee |
| `.animate-marquee` | 40s linear infinite `translate3d` loop, `will-change: transform`. | `Hero` marquee |
| `.transform-gpu` | `translateZ(0)` + `backface-visibility: hidden`. | Available, currently unused |
| `.text-balance` | `text-wrap: balance` for headings/leads. | Hero, About, section intros |
| `.note-prose` | Markdown typography scoped to note bodies: headings, lists, links, blockquotes, code, tables, rules, images. | `NoteView` article |

Scrollbar and `::selection` are themed globally in the same file; leave them.

---

## 5. Buttons, chips and cards

- **Primary action per view:** one `btn-primary` only (the hero CTA). Everything
  else is `btn-ghost`, a text link, or a chip.
- **Card hover:** `hover:border-primary/45` plus an optional
  `group-hover:scale-110` on the icon. Do not add shadows on hover.
- **Icon tile:** `p-2.5 rounded-xl border border-line` + a 10–12% tint of the
  card's accent.
- **Badge:** `text-xs font-semibold px-3 py-1.5 rounded-full` with the gold tint
  (`bg-[#8a6d2f]/12 text-[#7a5f26] border-[#8a6d2f]/25-30`).
- **Decorative overlay** inside cards: oversized `rounded-full` circle at
  `-right-12 -top-12 w-28..32 h-28..32` with a 10–14% tint.
- **Note prose:** `.note-prose` owns all Markdown typography. Inline code uses
  `--chip-bg` with a copper text tint; fenced code is the only dark surface
  (`#2c241c` ink with `#f5ede0` cream text), scoped to `pre` so it never leaks
  into cards. Do not add `@tailwindcss/typography` — these styles are the
  replacement.

---

## 6. Motion

| Token | Value |
|---|---|
| Entrance offset | `y: 20–26`, `opacity: 0 → 1` |
| Duration | `0.5` (small), `0.6–0.7` (cards, sections), `0.8` (hero) |
| Easing | `[0.16, 1, 0.3, 1]` for hero and large panels; default ease elsewhere |
| Stagger | `delay: index * 0.07` (0.08 in Projects/About) |
| Viewport | `{ once: true, margin: "-60px" }` cards, `"-80px"` section headers |
| Hover lift | `-translate-y-0.5` / `-translate-y-1` / `-2px` via CSS transition |
| Marquee | 40s linear, duplicated content, masked edges |

Rules:

- Only `opacity` and `transform`. Never animate layout or shadow.
- `prefers-reduced-motion: reduce` disables the marquee and smooth scrolling in
  CSS; JS-driven motion needs `useReducedMotion()`.
- No parallax, no scroll-linked pinning, no scroll-jacking.

---

## 7. Performance rules

These decisions are load-bearing; do not "upgrade" them:

1. **No `backdrop-filter`, no `blur()` on scroll-attached surfaces.** The frosted
   look is translucent gradients. Adding real blur re-introduces repaint cost on
   the fixed background and drops scroll FPS on mid-range phones.
2. **Backgrounds are fixed and painted once** (`-z-20`, `-z-10` in `page.tsx`).
   Do not move glows into individual sections as large blurred elements.
3. **Glows are radial gradients**, not blurred boxes.
4. **Animate transform/opacity only**; the marquee is the only `will-change`.
5. **No decorative images.** The home page ships no images; project "covers" are
   gradient + lucide icon. Note bodies may reference Markdown images; use
   `next/image` only if you add them to components, with explicit dimensions,
   and keep `img-src https:` in the CSP in mind.
6. Keep the fixed background layer count low — three radial stops in one `style`
   plus one grid layer today.

---

## 8. Adding a visual element

1. Search `globals.css` for an existing utility that already does it.
2. If it is a composition used twice or more, add a class there with a comment
   under the matching `/* ---------- Section ---------- */` heading.
3. Otherwise inline Tailwind, using tokens (`border-line`, `text-muted`,
   `bg-card`) rather than raw hex.
4. If you introduce a new colour, add it to `:root` **and** `@theme inline`, then
   to the table in §1.
5. Check it at 375px, 768px and 1440px, in both languages, with reduced motion
   on.
