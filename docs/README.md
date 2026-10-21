# Documentation index

Reference material for `AGENTS.md`. Read the one page that matches your task —
do not load all of `docs/` into context.

| Document | What it answers |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | How the app is wired: rendering model, component tree, data flow, styling layers, headers/CSP, known gaps. |
| [`CONVENTIONS.md`](./CONVENTIONS.md) | Code style: TypeScript, exports, imports, component patterns, animation, error handling, review checklist. |
| [`I18N.md`](./I18N.md) | The vi/en dictionary: add/rename strings, missing-key behaviour, persistence, adding a third language. |
| [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) | Tokens, palette, typography, shared utility classes, motion, accessibility and performance rules. |
| [`CONTENT.md`](./CONTENT.md) | Every editable fact and where it lives: projects, skills, stats, socials, notes, SEO, README. |
| [`DEVELOPMENT.md`](./DEVELOPMENT.md) | Setup, scripts, quality gates, troubleshooting, deployment, adding dependencies or third-party scripts. |

Related files outside `docs/`:

- `AGENTS.md` — the rules and the task router.
- `SKILLS.md` — numbered playbooks for repeatable changes.

## Keeping these docs honest

- If you change a script in `package.json`, update `AGENTS.md` §2 and
  `DEVELOPMENT.md` §2.
- If you add a component, update the tree in `AGENTS.md` §3 and the component
  table in `ARCHITECTURE.md`.
- If you add or rename a `globals.css` utility class, update
  `DESIGN-SYSTEM.md` §4.
- If you add a translated key family, mention it in `I18N.md` §3.
- Docs are written in English, 2-space indented Markdown, one sentence per
  line break where practical. Keep them factual — no aspirational features that
  do not exist in the code.
