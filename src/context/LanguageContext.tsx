"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "vi" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    vi: {
        // Navbar
        "nav.home": "Trang Chủ",
        "nav.about": "Giới Thiệu",
        "nav.skills": "Kỹ Năng",
        "nav.projects": "Dự Án",
        "nav.contact": "Liên Hệ",

        // Hero
        "hero.badge": "Sẵn sàng cho các dự án mới",
        "hero.title": "CODE THE VIBE,",
        "hero.subtitle": "BUILD THE",
        "hero.title2": "APP.",
        "hero.description":
            "Đam mê phần mềm là khi bạn nhìn thấy một vấn đề và thay vì than phiền, bạn nghĩ ngay đến việc viết một hàm để giải quyết nó.",
        "hero.viewProjects": "Xem Dự Án",
        "hero.contactMe": "Liên Hệ Với Tôi",
        "hero.scroll": "Cuộn xuống",
        "hero.stat.apps": "Loại app",
        "hero.stat.stack": "Công nghệ",
        "hero.stat.focus": "Trọng tâm",
        "hero.stat.focusValue": "Cùng AI",
        "hero.marquee": "Web App • Mobile App • Desktop App • Game • AI Coding • Next.js • .NET • React Native • Unity • ",

        // About
        "about.title": "Về",
        "about.developer": "bản thân",
        "about.eyebrow": "AI-Assisted Developer",
        "about.description":
            "Tôi lập trình với sự hỗ trợ của AI: dùng mô hình ngôn ngữ để viết code, tìm lỗi và thiết kế kiến trúc, sau đó tự kiểm tra và tinh chỉnh kết quả. Nhờ đó tôi xây dựng nhanh hơn cả web app, mobile app lẫn desktop app, và mục tiêu tiếp theo là ra mắt game đầu tiên của mình bằng AI.",
        "about.whatIbuild": "Tôi xây dựng gì",
        "about.buildTitle": "Một quy trình, nhiều nền tảng",
        "about.buildDesc":
            "AI giúp tôi đi từ ý tưởng đến sản phẩm chạy được nhanh hơn, nên tôi tập trung vào việc kiểm chứng chất lượng và trải nghiệm người dùng.",
        "about.p.web.title": "Web App",
        "about.p.web.desc":
            "Website và ứng dụng web responsive, nhanh, dễ tối ưu SEO và trải nghiệm người dùng.",
        "about.p.mobile.title": "Mobile App",
        "about.p.mobile.desc":
            "Ứng dụng iOS và Android, giao diện mượt mà, ổn định trên nhiều kích thước màn hình.",
        "about.p.desktop.title": "Desktop App",
        "about.p.desktop.desc":
            "Ứng dụng chạy trên Windows/macOS, tối ưu hiệu năng và tích hợp sâu với hệ thống.",
        "about.p.game.title": "Game",
        "about.p.game.desc":
            "Dự án game đầu tiên của tôi, xây dựng hoàn toàn với sự hỗ trợ của AI.",
        "about.p.game.badge": "Sắp ra mắt",
        "about.stats.ai": "Công cụ AI",
        "about.stats.stack": "Ngôn ngữ",
        "about.stats.apps": "Nền tảng",
        "about.stats.games": "Dự án game",

        // Skills
        "skills.title": "kỹ năng",
        "skills.technical": "Công nghệ",
        "skills.subtitle": "Bộ công cụ tôi dùng để biến ý tưởng thành sản phẩm chạy được.",

        // Skill Categories & Items
        "skills.cat.languages": "Ngôn ngữ",
        "skills.cat.backend": "Backend và Framework",
        "skills.cat.database": "Cơ sở dữ liệu",
        "skills.cat.tools": "Công cụ và công nghệ",
        "skills.cat.others": "Frontend & Khác",
        "skills.cat.ai": "AI & Tự động hóa",

        // Skill Items
        "skills.item.java": "Java",
        "skills.item.csharp": "C#",
        "skills.item.javascript": "JavaScript/TypeScript",
        "skills.item.htmlcss": "HTML/CSS",
        "skills.item.dotnet": ".NET (WinForms, ASP.NET)",
        "skills.item.restapi": "RESTful API",
        "skills.item.springboot": "Spring Boot",
        "skills.item.mysql": "MySQL",
        "skills.item.mssql": "MS SQL Server",
        "skills.item.git": "Git",
        "skills.item.vscode": "VS Code",
        "skills.item.postman": "Postman",
        "skills.item.nextjs": "Next.js",
        "skills.item.tailwindcss": "Tailwind CSS",
        "skills.item.reactnative": "React Native",
        "skills.item.unity": "Unity",
        "skills.item.t3": "T3 Code",
        "skills.item.opencode": "OpenCode",
        "skills.item.deepseek": "DeepSeek",
        "skills.item.cline": "Cline",
        "skills.item.grok": "Grok",

        // Projects
        "projects.title": "cá nhân",
        "projects.featured": "Dự án",
        "projects.subtitle": "Những sản phẩm tôi đã xây dựng, từ công cụ desktop đến ứng dụng web.",
        "projects.viewCode": "Xem Code",
        "projects.liveDemo": "Demo Trực Tiếp",
        "projects.kind": "Loại",
        "projects.kind.desktop": "Desktop App",
        "projects.kind.web": "Web App",
        "projects.kind.game": "Game (AI)",

        // Contact
        "contact.title": "Hãy cùng tạo ra",
        "contact.subtitle": "điều gì đó tuyệt vời.",
        "contact.quote": "Tôi code cùng AI, không một mình. Bạn có ý tưởng, tôi lo phần còn lại.",
        "contact.footer": "Được xây dựng với Next.js + AI — Thiết kế và lập trình bởi L.D.Chinh",
        "contact.findMe": "Tìm tôi online",

        // Projects Details
        "projects.task.title": "Quản Lý Công Việc",
        "projects.task.desc": "Ứng dụng theo dõi nhiệm vụ toàn diện được thiết kế để tối ưu hóa năng suất cá nhân và quy trình làm việc của dự án.",
        "projects.recorder.title": "Ghi Lại Thao Tác",
        "projects.recorder.desc": "Công cụ tự động ghi và phát lại các tương tác của người dùng, hữu ích cho kiểm thử tự động và tạo macro.",
        "projects.extractor.title": "Text Extractor",
        "projects.extractor.desc": "Công cụ mạnh mẽ giúp trích xuất văn bản từ hình ảnh hoặc vùng chụp trên màn hình. Hỗ trợ phím tắt PrtSc và đa ngôn ngữ.",
        "projects.multitool.title": "MultiTool",
        "projects.multitool.desc": "Bộ công cụ đa năng được xây dựng với Next.js, React và Tailwind CSS.",
        "projects.game.title": "Game Đầu Tiên Của Tôi",
        "projects.game.desc": "Game tôi đang xây dựng cùng AI — thiết kế thế giới, cơ chế gameplay và code đều có sự hỗ trợ của AI.",
    },
    en: {
        // Navbar
        "nav.home": "Home",
        "nav.about": "About",
        "nav.skills": "Skills",
        "nav.projects": "Projects",
        "nav.contact": "Contact",

        // Hero
        "hero.badge": "READY FOR NEW PROJECTS",
        "hero.title": "CODE THE VIBE,",
        "hero.subtitle": "BUILD THE",
        "hero.title2": "APP.",
        "hero.description":
            "Software passion occurs when you see a problem and, instead of complaining, you immediately think of writing a function to solve it.",
        "hero.viewProjects": "View Projects",
        "hero.contactMe": "Contact Me",
        "hero.scroll": "Scroll down",
        "hero.stat.apps": "Platforms",
        "hero.stat.stack": "Stack",
        "hero.stat.focus": "Focus",
        "hero.stat.focusValue": "With AI",
        "hero.marquee": "Web App • Mobile App • Desktop App • Game • AI Coding • Next.js • .NET • React Native • Unity • ",

        // About
        "about.title": "About",
        "about.developer": "myself",
        "about.eyebrow": "AI-Assisted Developer",
        "about.description":
            "I develop with AI: I use language models to write code, find bugs and design the architecture, then I review and refine the result myself. That lets me ship web, mobile and desktop apps much faster — and my next goal is to release my first game, built with AI.",
        "about.whatIbuild": "What I build",
        "about.buildTitle": "One workflow, every platform",
        "about.buildDesc":
            "AI helps me go from idea to working product faster, so I spend my time on quality, polish and the actual user experience.",
        "about.p.web.title": "Web App",
        "about.p.web.desc":
            "Responsive websites and web apps that are fast, SEO-friendly and pleasant to use.",
        "about.p.mobile.title": "Mobile App",
        "about.p.mobile.desc":
            "iOS and Android apps with smooth interfaces that stay solid across screen sizes.",
        "about.p.desktop.title": "Desktop App",
        "about.p.desktop.desc":
            "Windows and macOS applications, tuned for performance and deep system integration.",
        "about.p.game.title": "Game",
        "about.p.game.desc":
            "My first game project, built with AI doing most of the heavy lifting.",
        "about.p.game.badge": "In progress",
        "about.stats.ai": "AI tools",
        "about.stats.stack": "Languages",
        "about.stats.apps": "Platforms",
        "about.stats.games": "Game projects",

        // Skills
        "skills.title": "stack",
        "skills.technical": "Tech",
        "skills.subtitle": "The tools I use to turn ideas into working products.",

        // Skill Categories & Items
        "skills.cat.languages": "Languages",
        "skills.cat.backend": "Backend & Frameworks",
        "skills.cat.database": "Databases",
        "skills.cat.tools": "Tools & Technologies",
        "skills.cat.others": "Frontend & Others",
        "skills.cat.ai": "AI & Automation",

        // Skill Items
        "skills.item.java": "Java",
        "skills.item.csharp": "C#",
        "skills.item.javascript": "JavaScript/TypeScript",
        "skills.item.htmlcss": "HTML/CSS",
        "skills.item.dotnet": ".NET (WinForms, ASP.NET)",
        "skills.item.restapi": "RESTful API",
        "skills.item.springboot": "Spring Boot",
        "skills.item.mysql": "MySQL",
        "skills.item.mssql": "MS SQL Server",
        "skills.item.git": "Git",
        "skills.item.vscode": "VS Code",
        "skills.item.postman": "Postman",
        "skills.item.nextjs": "Next.js",
        "skills.item.tailwindcss": "Tailwind CSS",
        "skills.item.reactnative": "React Native",
        "skills.item.unity": "Unity",
        "skills.item.t3": "T3 Code",
        "skills.item.opencode": "OpenCode",
        "skills.item.deepseek": "DeepSeek",
        "skills.item.cline": "Cline",
        "skills.item.grok": "Grok",

        // Projects
        "projects.title": "Projects",
        "projects.featured": "Personal",
        "projects.subtitle": "Things I have shipped, from desktop utilities to web apps.",
        "projects.viewCode": "View Code",
        "projects.liveDemo": "Live Demo",
        "projects.kind": "Type",
        "projects.kind.desktop": "Desktop App",
        "projects.kind.web": "Web App",
        "projects.kind.game": "Game (AI)",

        // Contact
        "contact.title": "Let's build",
        "contact.subtitle": "something great.",
        "contact.quote": "I code with AI, not alone. You bring the idea, I handle the rest.",
        "contact.footer": "Built with Next.js + AI — Designed & coded by L.D.Chinh",
        "contact.findMe": "Find me online",

        // Projects Details
        "projects.task.title": "Task Management",
        "projects.task.desc": "A comprehensive task tracking application designed to streamline personal productivity and project workflows.",
        "projects.recorder.title": "User Action Recorder",
        "projects.recorder.desc": "Automated tool for recording and replaying user interactions, useful for automated testing and macro creation.",
        "projects.extractor.title": "Text Extractor",
        "projects.extractor.desc": "A powerful tool to extract text from images or screen captures. Supports PrtSc shortcut and multi-language recognition.",
        "projects.multitool.title": "MultiTool",
        "projects.multitool.desc": "A multi-purpose tool built with Next.js, React, and Tailwind CSS.",
        "projects.game.title": "My First Game",
        "projects.game.desc": "The game I am building with AI — world design, game mechanics and code, all built with AI assistance.",
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>("vi");

    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: string) => {
        const value = translations[language] as Record<string, string>;
        return value[key] ?? key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
