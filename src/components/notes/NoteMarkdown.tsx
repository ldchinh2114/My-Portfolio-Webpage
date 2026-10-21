import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
    a: ({ href = "", children, ...props }) => {
        const isExternal = /^https?:\/\//i.test(href);

        return (
            <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                {...props}
            >
                {children}
            </a>
        );
    },
};

export const NoteMarkdown = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
        </ReactMarkdown>
    );
};
