# Conventions

Code style and component patterns. Follow the surrounding file first; this page
records the patterns that already exist. When a rule and the neighbouring code
disagree, match the neighbour and mention the drift.

---

## 1. File and folder layout

```
src/app/<route files>        App Router entries, default exports
src/components/<Name>.tsx    One section per file, PascalCase, named export
src/context/<Name>.tsx       React contexts, PascalCase, named export + hook
src/app/globals.css          Tokens + shared utilities (single stylesheet)
```

- No `index.ts` barrels. Import the file directly.
- No `utils/`, `hooks/`, or `lib/` folders exist yet. Create one only when a
  second consumer appears — not pre-emptively.
- Components are not nested by feature; the page is flat and small.

---

## 2. TypeScript

- `strict: true`, `noEmit: true`. Never widen to `any`; if a third-party type is
  awkward, use `unknown` plus a narrow.
- Type props inline for single-use components
  (`({ children }: { children: React.ReactNode })`), or with a local `interface`
  when there are more than three fields (`LanguageContextType`).
- Union types over enums: `type Language = "vi" | "en"`.
- `import type { Metadata } from "next"` for type-only imports.
- Data arrays that drive rendering are untyped object literals; TypeScript infers
  them. Do not add a `Project` interface unless the array is shared between
  files.

---

## 3. Imports

Order, top to bottom, separated by no blank lines (existing style):

```ts
"use client";                                        // must be line 1
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Cpu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
```

- React / Next first, then third-party, then `@/` project imports.
- Import `React` explicitly in client components (`import React from "react"`),
  even though the new JSX transform does not require it. This is the house style.
- Always use the `@/*` alias (mapped to `./src/*`). Never `../../../`.
- Import only the lucide icons you use; there is no icon barrel.
- Remove imports you stop using — `npm run lint` fails on unused vars.

---

## 4. Components

```tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Section = () => {
    const { t } = useLanguage();

    return (
        <section id="section" className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
            {/* decorative layer, never interactive */}
            <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[760px] h-[320px] warm-glow" />
            </div>

            <div className="max-w-6xl mx-auto">{/* content */}</div>
        </section>
    );
};
```

Rules encoded above:

- Arrow function components, `const`, named export.
- Indentation: **4 spaces** in `src/components`, `src/context` and
  `src/app/providers.tsx`; **2 spaces** in `src/app/layout.tsx` and
  `src/app/page.tsx`. Match, don't reformat.
- Every section is a `<section id="...">` matching its navbar anchor.
- Section spacing is `py-20 md:py-28 px-4 md:px-6`, content is
  `max-w-6xl mx-auto` (Contact uses `max-w-4xl`).
- Decorative wrappers always carry `aria-hidden`, `pointer-events-none`,
  `-z-10`, and `overflow-hidden`.
- Section headings follow one pattern:
  `text-4xl md:text-5xl font-extrabold uppercase tracking-tight` with the second
  word wrapped in `<span className="accent-text">`.

---

## 5. Event handlers

- Inline arrow handlers for one-liners (`onClick={() => setIsMenuOpen(false)}`).
- Named local functions when the body exceeds one statement
  (`const scrollTo = (href: string) => { ... }`).
- Anchor navigation calls `e.preventDefault()` then
  `document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })`.
  On `/` the Navbar scrolls immediately; from `/notes` it routes home, then
  scrolls in a `useEffect` once the home sections have mounted.
  `html { scroll-behavior: smooth }` handles direct links.
- External links always use `target="_blank" rel="noopener noreferrer"`;
  `mailto:` links omit `target`.

---

## 6. Styling

- Tailwind utilities inline. One-off brand tints use arbitrary values
  (`bg-[#c2571f]/10`), but a value that appears three or more times belongs in
  `@theme` or a utility class.
- Class order: layout → box → spacing → typography → colour → state/animation.
  No tool enforces this; keep it readable.
- Conditional classes use template literals with a leading space
  (`` `relative ${project.iconColor}` ``). There is no `clsx`/`cn()` helper —
  do not introduce one for a single case.
- `hover:` and `group-hover:` for interaction; no JS hover state.
- Responsive: mobile-first, breakpoints `sm` / `md` / `lg` only. Nothing above
  `lg` is used.
- Never use `!important`, and never edit generated `.next` output.

---

## 7. Motion

- Entrance animations use `initial` + `whileInView` with
  `viewport={{ once: true, margin: "-60px" }}` (or `-80px` for large blocks).
- Stagger with `transition={{ delay: index * 0.07, duration: 0.6 }}`.
- House easing `[0.16, 1, 0.3, 1]` for hero/large entrances.
- Animate `opacity` and `transform` only. Do not animate `height`, `width`,
  `top`, or `box-shadow` on frequently re-rendered elements.
- `AnimatePresence` is used for the mobile menu — keep `initial`/`animate`/`exit`
  symmetrical there.
- Guard any new looping animation with `useReducedMotion()`.

---

## 8. Accessibility

- Decorative layers: `aria-hidden` plus `pointer-events-none`.
- Interactive overlays inside a `pointer-events-none` wrapper (e.g. the Navbar
  mobile dropdown) must set `pointer-events-auto` or their links cannot be clicked.
- Icon-only buttons and links need `aria-label`
  (`aria-label="Toggle Language"`, `aria-label={social.label}`).
- Heading order per section is `h2` for the section title, `h3`/`h4` inside
  cards. `Hero` owns the only `h1`.
- Do not remove the default browser focus ring, and do not set
  `outline: none` without a replacement.
- Text contrast: body copy uses `text-muted` (#6f6153) on `#faf6ef`, which is
  acceptable for body size but not for small secondary labels on tinted
  backgrounds — check when you add tinted cards.
- Keep `suppressHydrationWarning` on `<html>` unless you also remove the
  localStorage-driven language restore.

---

## 9. Content hygiene

- No lorem ipsum, no placeholder names, no invented metrics.
- Vietnamese copy uses proper diacritics and sentence case; English copy uses
  sentence case too, except intentional uppercase display headings.
- Keep the two languages semantically equivalent — do not translate loosely
  enough that one language makes a claim the other does not.
- Punctuation in the marquee uses `•` separators and a trailing separator.

---

## 10. Review checklist for a diff

- [ ] Smallest possible diff; no drive-by reformatting or import reordering.
- [ ] `"use client"` present exactly where hooks are used, and absent where not.
- [ ] Every new `t("...")` key exists in both `vi` and `en`.
- [ ] Both duplicated social arrays still agree.
- [ ] No new dependency, and `package-lock.json` unchanged unless intended.
- [ ] No CSP-breaking external origin.
- [ ] Lint, typecheck and build pass.
