import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

export type NoteLanguage = "vi" | "en";

export interface NoteDownload {
    label: string;
    href: string;
    meta?: string;
}

export interface NoteTranslationSummary {
    language: NoteLanguage;
    title: string;
    summary: string;
    tags: string[];
    downloads: NoteDownload[];
    readingMinutes: number;
}

export interface NoteTranslation extends NoteTranslationSummary {
    content: string;
}

export interface NoteSummary {
    slug: string;
    date: string;
    languages: NoteLanguage[];
    translations: Record<NoteLanguage, NoteTranslationSummary>;
}

export interface Note {
    slug: string;
    date: string;
    languages: NoteLanguage[];
    translations: Record<NoteLanguage, NoteTranslation>;
}

const NOTES_DIR = path.join(process.cwd(), "content", "notes");
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9-]+$/i;
const FILE_PATTERN = /^([a-z0-9-]+)\.(vi|en)\.md$/;
const LANGUAGES: NoteLanguage[] = ["vi", "en"];

type FrontmatterValue = string | Array<string | Record<string, string>>;
type Frontmatter = Record<string, FrontmatterValue>;

const stripQuotes = (value: string): string => {
    const trimmed = value.trim();
    if (trimmed.length >= 2) {
        const first = trimmed[0];
        const last = trimmed[trimmed.length - 1];
        if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
            return trimmed.slice(1, -1);
        }
    }
    return trimmed;
};

/**
 * Minimal frontmatter reader: flat `key: value`, inline arrays `[a, b]`, and
 * indented lists of either strings or `key: value` maps (used for downloads).
 * A YAML dependency would be overkill for this content shape.
 */
const parseFrontmatter = (raw: string): { data: Frontmatter; body: string } => {
    const normalized = raw.replace(/^\uFEFF/, "");
    if (!normalized.startsWith("---")) {
        return { data: {}, body: normalized.trim() };
    }

    const closing = normalized.indexOf("\n---", 3);
    if (closing === -1) {
        return { data: {}, body: normalized.trim() };
    }

    const header = normalized.slice(3, closing).replace(/^\r?\n/, "");
    const body = normalized.slice(closing + 4).replace(/^\r?\n/, "").trim();
    const data: Frontmatter = {};
    let listKey: string | null = null;
    let currentItem: Record<string, string> | null = null;

    for (const rawLine of header.split(/\r?\n/)) {
        if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;

        const line = rawLine.trim();
        const indented = /^\s/.test(rawLine);

        if (indented && listKey) {
            const list = data[listKey];
            if (!Array.isArray(list)) continue;

            if (line.startsWith("- ")) {
                const item = line.slice(2).trim();
                const separator = item.indexOf(":");

                if (separator === -1) {
                    currentItem = null;
                    list.push(stripQuotes(item));
                } else {
                    const record: Record<string, string> = {
                        [item.slice(0, separator).trim()]: stripQuotes(item.slice(separator + 1)),
                    };
                    currentItem = record;
                    list.push(record);
                }
            } else if (currentItem) {
                const separator = line.indexOf(":");
                if (separator !== -1) {
                    currentItem[line.slice(0, separator).trim()] = stripQuotes(
                        line.slice(separator + 1),
                    );
                }
            }
            continue;
        }

        const separator = line.indexOf(":");
        if (separator === -1) continue;

        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();
        listKey = null;
        currentItem = null;

        if (!value) {
            data[key] = [];
            listKey = key;
        } else if (value.startsWith("[") && value.endsWith("]")) {
            data[key] = value
                .slice(1, -1)
                .split(",")
                .map(stripQuotes)
                .filter(Boolean);
        } else {
            data[key] = stripQuotes(value);
        }
    }

    return { data, body };
};

const readString = (data: Frontmatter, key: string): string =>
    typeof data[key] === "string" ? (data[key] as string) : "";

const readStringList = (data: Frontmatter, key: string): string[] => {
    const value = data[key];
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === "string");
};

const isSafeHref = (href: string): boolean =>
    (href.startsWith("/") && !href.startsWith("//")) || /^https?:\/\//i.test(href);

const readDownloads = (data: Frontmatter): NoteDownload[] => {
    const value = data.downloads;
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
        if (typeof item === "string") return [];

        const label = item.label?.trim();
        const href = item.href?.trim();
        if (!label || !href || !isSafeHref(href)) return [];

        return [{ label, href, meta: item.meta?.trim() || undefined }];
    });
};

const estimateReadingMinutes = (body: string): number => {
    const words = body
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#>*_`[\]()!-]/g, " ")
        .split(/\s+/)
        .filter(Boolean).length;

    return Math.max(1, Math.round(words / 200));
};

interface NoteFile extends NoteTranslation {
    date: string;
}

/**
 * A published note is a pair of files that share a slug and a date:
 *   content/notes/<slug>.vi.md
 *   content/notes/<slug>.en.md
 * The language suffix is authoritative, so the reader switch never lies about
 * which version is being rendered.
 */
const readNoteFile = (slug: string, language: NoteLanguage): NoteFile => {
    const file = `${slug}.${language}.md`;
    const filePath = path.join(NOTES_DIR, file);

    if (!existsSync(filePath)) {
        throw new Error(
            `[notes] Missing content/notes/${file}. Every note needs both <slug>.vi.md and <slug>.en.md; add the missing translation or prefix both filenames with "_" to keep the note as a draft.`,
        );
    }

    const raw = readFileSync(filePath, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const title = readString(data, "title").trim();
    const date = readString(data, "date").trim();
    const declaredLanguage = readString(data, "language").trim();

    if (!title) {
        throw new Error(`[notes] content/notes/${file} is missing a "title" in frontmatter.`);
    }
    if (!DATE_PATTERN.test(date)) {
        throw new Error(`[notes] content/notes/${file} needs a "date" in YYYY-MM-DD format.`);
    }
    if (declaredLanguage && declaredLanguage !== language) {
        throw new Error(
            `[notes] content/notes/${file} declares language "${declaredLanguage}" but its filename says "${language}". Drop the "language" key; the filename decides.`,
        );
    }

    return {
        date,
        language,
        title,
        summary: readString(data, "summary").trim(),
        tags: readStringList(data, "tags").map((tag) => tag.trim()).filter(Boolean),
        downloads: readDownloads(data),
        readingMinutes: estimateReadingMinutes(body),
        content: body,
    };
};

const toTranslation = (file: NoteFile): NoteTranslation => ({
    language: file.language,
    title: file.title,
    summary: file.summary,
    tags: file.tags,
    downloads: file.downloads,
    readingMinutes: file.readingMinutes,
    content: file.content,
});

const readNote = (slug: string): Note => {
    const vi = readNoteFile(slug, "vi");
    const en = readNoteFile(slug, "en");

    if (vi.date !== en.date) {
        throw new Error(
            `[notes] content/notes/${slug}.vi.md and ${slug}.en.md must share the same "date" (${vi.date} vs ${en.date}).`,
        );
    }

    return {
        slug,
        date: vi.date,
        languages: [...LANGUAGES],
        translations: {
            vi: toTranslation(vi),
            en: toTranslation(en),
        },
    };
};

const listSlugs = (): string[] => {
    if (!existsSync(NOTES_DIR)) return [];

    const slugs = new Set<string>();

    for (const file of readdirSync(NOTES_DIR)) {
        if (!file.endsWith(".md") || file.startsWith("_") || file.startsWith(".")) continue;

        const match = FILE_PATTERN.exec(file);
        if (!match) {
            throw new Error(
                `[notes] content/notes/${file} must be named "<slug>.vi.md" or "<slug>.en.md".`,
            );
        }

        const [, slug] = match;
        if (!SLUG_PATTERN.test(slug)) {
            throw new Error(
                `[notes] "${slug}" is not a valid slug. Use lowercase letters, digits, and hyphens.`,
            );
        }

        slugs.add(slug);
    }

    return [...slugs];
};

const toTranslationSummary = (translation: NoteTranslation): NoteTranslationSummary => ({
    language: translation.language,
    title: translation.title,
    summary: translation.summary,
    tags: translation.tags,
    downloads: translation.downloads,
    readingMinutes: translation.readingMinutes,
});

/** Strips the Markdown bodies so a note can cross into the client boundary. */
export const toNoteSummary = (note: Note): NoteSummary => ({
    slug: note.slug,
    date: note.date,
    languages: note.languages,
    translations: {
        vi: toTranslationSummary(note.translations.vi),
        en: toTranslationSummary(note.translations.en),
    },
});

export const getAllNotes = (): NoteSummary[] =>
    listSlugs()
        .map(readNote)
        .sort(
            (a, b) =>
                b.date.localeCompare(a.date) ||
                a.translations.vi.title.localeCompare(b.translations.vi.title),
        )
        .map(toNoteSummary);

export const getNote = (slug: string): Note | null => {
    if (!SLUG_PATTERN.test(slug) || !listSlugs().includes(slug)) return null;
    return readNote(slug);
};
