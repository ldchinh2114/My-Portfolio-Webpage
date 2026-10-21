export const formatNoteDate = (iso: string, language: "vi" | "en"): string => {
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return iso;

    return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};
