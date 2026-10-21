# Article writing guideline

This is the working guide for notes published on **ldchinh.vercel.app**. A note
is a short, first-person write-up about something I learned, fixed, built or
want to share. Every note goes live in Vietnamese and English.

## 1. Pick the topic and the slug

- One note = one idea. If two ideas need separate conclusions, write two notes.
- Choose the slug before writing: lowercase letters, digits and hyphens only
  (for example `fix-hydration-mismatch`).
- The slug is the public URL: `/notes/<slug>`. Renaming it later breaks every
  existing link.
- Pick the date once, in `YYYY-MM-DD` form. Both language files must declare the
  same date.

## 2. Create the two files

Every note is a pair that shares a slug:

```text
content/notes/<slug>.vi.md   →  /notes/<slug>  (Vietnamese)
content/notes/<slug>.en.md   →  /notes/<slug>  (English)
```

- Both files are required. A pair with one missing file fails the build.
- The `.vi.md` / `.en.md` suffix is the language. There is no `language` key in
  frontmatter.
- Prefix **both** filenames with `_` to keep a draft out of the build
  (`_my-note.vi.md`, `_my-note.en.md`). Prefixing only one file still breaks the
  pair.
- Do not add date or language folders: the loader reads `content/notes/`
  directly.

## 3. Fill the frontmatter

Both files start with the same shape, written for their own language:

```yaml
---
title: "A short, specific title"
date: "2026-08-14"
summary: "One sentence that says what the note covers and why it is useful."
tags: ["Next.js", "AI"]
downloads:
  - label: "Starter files"
    href: "/downloads/starter-files.zip"
    meta: "ZIP"
---
```

| Key | Required | Rules |
| --- | --- | --- |
| `title` | yes | Specific, not "Notes #3". Translated per language. |
| `date` | yes | `YYYY-MM-DD`; identical in both files. Drives the order (newest first). |
| `summary` | recommended | One sentence, roughly 12–25 words. Used on the note card and as the meta description. |
| `tags` | optional | 2–5 short topic names in an inline array. |
| `downloads` | optional | List of `label` + `href`; optional `meta`. |

Frontmatter details:

- The loader is intentionally small: flat `key: value`, inline arrays, and
  indented lists. Do not use anchors, multiline scalars or nested objects.
- Tags are split on commas, so keep a comma out of a tag name.
- `href` must start with `/` (a file under `public/`) or `https://`. A bare
  filename or `//host` is ignored.
- A download entry without both `label` and `href` is silently dropped. Point
  only at files that are committed.
- There is no manual order field: newest `date` first, ties broken by the
  Vietnamese title.

## 4. Write the body

- Start at `##`. The page already renders `title` as the `h1`, so never add a
  `#` heading in the body.
- Open with one short paragraph: the problem, what changed, or what the reader
  will get. Skip "In this article I will…".
- Use `##` for sections, one idea each. Use `###` only when a section genuinely
  has sub-parts.
- Prefer concrete detail: the error text, versions, the command, the file path,
  the trade-off. A note is more useful when the reader can reproduce it.
- Use lists for steps and options, tables for comparisons, `>` for a caveat or
  aside, and horizontal rules sparingly.
- Give every code fence a language tag so its intent is clear. Code renders on
  the dark surface without syntax highlighting, so keep snippets short and
  focused.
- Links work as usual. Relative links such as `/notes/...` stay in the tab;
  `http(s)://` links open in a new tab with `rel="noopener noreferrer"`.
- Images use standard Markdown (`![alt](/images/example.png)`) with real alt
  text. Put the file under `public/`.
- Length: aim for a 1–8 minute read (about 200–1,600 words). Reading time is
  estimated automatically at ~200 words per minute and ignores code blocks;
  there is no field to set it.

### Voice

- First person, plain language, concrete examples.
- Explain *why*, not only *what*. A command without context is hard to reuse
  later.
- Write the Vietnamese and English versions separately. Do not publish a
  machine translation without editing it.
- Keep the same facts, links and numbers in both versions.

## 5. Add downloads

1. Put the real file in `public/downloads/` (create the folder if needed).
2. Zip a folder before linking to it; a folder cannot be downloaded as a folder.
3. Reference it as `/downloads/<file>` in **each** language file.
4. Give each language its own `label` (and `meta` if useful). The `href` normally
   points at the same file; point at a language-specific file when the download
   itself is translated.
5. External `https://` links open in a new tab; local files download in place.

The downloads card renders after the body and switches with the note language.

## 6. Keep the pair in sync

- Same slug, same date, same links, same facts.
- Translate `title`, `summary`, `tags`, download labels and the body.
- If one version changes a number, command or link, update the other version in
  the same commit.
- The VI/EN switch on the note page swaps the article and also sets the site
  language, so the navbar and the notes list stay in sync. The choice is
  remembered in `localStorage`.

## 7. Publish and verify

1. Create both files and any downloads.
2. Run `npm run build`. The build fails with a `[notes]` error for a missing
   pair, a missing `title`/`date`, an invalid date, or mismatched dates.
3. Check `/notes` and `/notes/<slug>` with the VI/EN switch in both directions.
4. Commit the two Markdown files and the downloads together, push to `master`,
   and let Vercel redeploy.
5. Open the live URL and repeat the switch and download checks.

## 8. Checklist

- [ ] `<slug>.vi.md` and `<slug>.en.md` exist, with the same slug and date.
- [ ] `title`, `summary`, `tags` and body are written in both languages.
- [ ] The body starts at `##` and has a clear opening paragraph.
- [ ] Code blocks declare a language; links and images resolve.
- [ ] Every `downloads.href` exists in `public/downloads/` and returns 200.
- [ ] `npm run build` passes.
- [ ] Both languages were checked after deploy; no horizontal scroll at 375px.
