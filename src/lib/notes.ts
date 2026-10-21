import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

export type NoteLanguage = "vi" | "en";

export interface NoteDownload {
    label: string;
    href: string;
    meta?: string;
}

export interface NoteSummary {
    slug: string;
    title: string;
    date: string;
    summary: string;
    language: NoteLanguage;
    tags: string[];
    downloads: NoteDownload[];
    readingMinutes: number;
}

export interface Note extends NoteSummary {
    content: string;
}

const NOTES_DIR = path.join(process.cwd(), "content", "notes");
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9-]+$/i;

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

const readNote = (slug: string): Note => {
    const raw = readFileSync(path.join(NOTES_DIR, `${slug}.md`), "utf8");
    const { data, body } = parseFrontmatter(raw);
    const title = readString(data, "title").trim();
    const date = readString(data, "date").trim();

    if (!title) {
        throw new Error(`[notes] content/notes/${slug}.md is missing a "title" in frontmatter.`);
    }
    if (!DATE_PATTERN.test(date)) {
        throw new Error(
            `[notes] content/notes/${slug}.md needs a "date" in YYYY-MM-DD format.`,
        );
    }

    return {
        slug,
        title,
        date,
        summary: readString(data, "summary").trim(),
        language: readString(data, "language") === "en" ? "en" : "vi",
        tags: readStringList(data, "tags").map((tag) => tag.trim()).filter(Boolean),
        downloads: readDownloads(data),
        readingMinutes: estimateReadingMinutes(body),
        content: body,
    };
};

const listSlugs = (): string[] => {
    if (!existsSync(NOTES_DIR)) return [];

    return readdirSync(NOTES_DIR)
        .filter(
            (file) =>
                file.endsWith(".md") && !file.startsWith("_") && !file.startsWith("."),
        )
        .map((file) => file.slice(0, -3))
        .filter((slug) => SLUG_PATTERN.test(slug));
};

const toSummary = (note: Note): NoteSummary => ({
    slug: note.slug,
    title: note.title,
    date: note.date,
    summary: note.summary,
    language: note.language,
    tags: note.tags,
    downloads: note.downloads,
    readingMinutes: note.readingMinutes,
});

export const getAllNotes = (): NoteSummary[] =>
    listSlugs()
        .map(readNote)
        .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
        .map(toSummary);

export const getNote = (slug: string): Note | null => {
    if (!SLUG_PATTERN.test(slug) || !listSlugs().includes(slug)) return null;
    return readNote(slug);
};
