# Development

Setup, quality gates, deployment, and fixes for the failures this project
actually produces.

---

## 1. Prerequisites

- **Node.js 20 or newer** (`node -v`). Next.js 16 dropped Node 18 support.
- npm (a `package-lock.json` is committed — use npm, not pnpm/yarn, unless you
  intend to convert the project).
- Windows is the current dev platform. Vercel builds on Linux, so **file name
  casing must match imports exactly** — Windows tolerates `@/components/hero`
  for `Hero.tsx`, Linux does not.

No environment variables are required. `.env*` is gitignored.

---

## 2. Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies (lockfile-driven). |
| `npm run dev` | Dev server on <http://localhost:3000> with hot reload. |
| `npm run build` | Production build. The authoritative gate. |
| `npm run start` | Serve the production build (run `build` first). |
| `npm run lint` | `eslint` with `eslint-config-next` core-web-vitals + TypeScript. |
| `npx tsc --noEmit` | Typecheck only. No npm script exists; this is the canonical form. |

Port conflict: `npm run dev -- -p 3001`.

There is no test runner wired up, no formatter, and no pre-commit hook.

---

## 3. Quality gates

Run all three before claiming a change is done:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

- `tsc` catches prop/type drift that lint does not.
- `lint` catches unused imports, `<img>` instead of `next/image`, missing
  `alt`, and hook dependency issues.
- `build` is the only check that exercises `next/font`, metadata typing, CSP
  config, and server/client boundaries.

If a gate cannot run in your environment, say which one and why. Do not report
"all checks pass" when only lint was run.

---

## 4. Manual verification

Automated checks cannot see layout or language. After a UI change:

1. `npm run dev`, open <http://localhost:3000>.
2. Toggle **VI → EN** in the navbar; reload; confirm the choice persisted.
3. Responsive: 375px, 768px, 1440px. Check the nav pill, the hero headline
   (`lg:text-[5.5rem]` overflows first), and the marquee mask.
4. Keyboard: Tab through the nav, language toggle, project links, social links.
   Focus must stay visible.
5. Scroll the full page and watch for jank — the fixed background layers should
   never repaint.
6. Open devtools → Console for CSP violations and hydration warnings.

---

## 5. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Old content or styles still showing | Stop the server, delete `.next`, restart. |
| Weird TypeScript errors that survive a restart | Delete `tsconfig.tsbuildinfo` (gitignored, regenerated). |
| Tailwind class silently does nothing | Class names must be complete literals. `text-${color}` and `` `bg-[${hex}]` `` are not detectable; write full class strings or map them. |
| A utility class from `globals.css` is ignored | Classes live in the single global stylesheet via `@import "tailwindcss"`; a new `@layer`-scoped file is not imported anywhere. Put it in `globals.css`. |
| Language always resets to Vietnamese | The `language` localStorage key is missing or was cleared. It is applied on mount only. |
| Hydration mismatch around `<html>` or text | Expected on first paint when a stored language differs from the server render. `suppressHydrationWarning` is intentional — do not remove it. |
| Third-party script blocked only in the browser | CSP in `next.config.ts`. Add the origin to `script-src` (and `connect-src` if it calls home). Restart dev after editing the config. |
| Fonts fail to load during build | `next/font/google` fetches at build time; offline builds fail. The CSS fallback is `Arial, Helvetica, sans-serif`. |
| Anchor scrolls under the navbar | `scroll-padding-top: 96px` on `html`; keep it aligned with nav height. |
| Build fails on Vercel but passes locally | Import casing, or an uncommitted file. Compare `git status` and file names. |
| `npm run lint` complains about `<img>` | Use `next/image`, or justify and scope a rule override in `eslint.config.mjs`. |

---

## 6. Deployment

- Vercel, project linked to `ldchinh2114/My-Portfolio-Webpage`.
- Production domain: <https://ldchinh.vercel.app>.
- Pushing to `master` triggers a production deploy; other branches get previews.
- `@vercel/analytics` is mounted in `layout.tsx` (`<Analytics />`) and needs no
  key. Removing it should also remove the `<Analytics />` import and the
  analytics entries in the CSP `script-src` / `connect-src`.
- Security headers and CSP ship from `next.config.ts` for every route, including
  preview deployments.

Pre-deploy checklist: build passes → no CSP console errors → both languages
verified → metadata still accurate.

---

## 7. Adding a dependency

The default answer is **no**. This site runs on Next, React, Tailwind, Framer
Motion, lucide, plus `react-markdown` and `remark-gfm` for the notes body;
content changes almost never need anything else.

If a new package is genuinely required:

1. Justify it in the change description; prefer a small local function over a
   utility package.
2. Note that `next-themes`, `clsx` and `tailwind-merge` are already installed and
   unused — check whether one of those covers the need before adding a fourth.
3. Install with npm so `package-lock.json` stays in sync.
4. If it injects a script or makes network calls, extend the CSP.
5. If it ships CSS, make sure it is imported once, in `globals.css` or
   `layout.tsx`.
6. Update `AGENTS.md` §1 and `docs/ARCHITECTURE.md` if the stack description
   changes.

---

## 8. Adding a third-party script or service

1. Add the origin to the relevant CSP directive in `next.config.ts`:
   `script-src` for `<script>`, `connect-src` for XHR/fetch/beacon,
   `img-src` for pixels, `font-src` for font CDNs, `frame-src` for embeds
   (**not currently present** — adding an iframe also requires adding the
   directive).
2. Prefer `next/script` with an explicit `strategy` (`afterInteractive` for
   analytics) over a raw `<script>` tag.
3. Keep `'unsafe-inline'` / `'unsafe-eval'` assumptions in mind: the current
   policy already allows them, which weakens CSP. Do not weaken it further
   without saying so.
4. Verify in the browser console with the production build, not just dev.

---

## 9. Tests (not set up)

`@playwright/test` is a devDependency and `.gitignore` already excludes
`/test-results/`, `/playwright-report/`, `/playwright/.cache/`, but there is no
config and no specs.

If asked to add coverage, the minimal sensible setup is:

1. `playwright.config.ts` with `webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true }`.
2. `npx playwright install --with-deps chromium`.
3. `tests/home.spec.ts` covering: hero heading visible, nav anchors scroll,
   VI→EN toggle changes the hero, projects grid renders 4 cards, no console
   errors (CSP violations especially).
4. Add `"test:e2e": "playwright test"` to `package.json` and document it here.

Do not add a test runner or CI workflow unless the task asks for it.

---

## 10. Repo hygiene

- `tsconfig.tsbuildinfo`, `.next/`, `node_modules/` are dev artifacts; never
  commit them (all gitignored).
- `public/*.svg` are unused Next.js starter assets. Removing them is safe but
  unrelated to content work — do it as its own change.
- Keep `README.md` pointed at the live site; it is intentionally one line.
