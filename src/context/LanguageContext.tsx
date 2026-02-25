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
        "hero.description": "Đam mê phần mềm là khi bạn nhìn thấy một vấn đề và thay vì than phiền, bạn nghĩ ngay đến việc viết một hàm để giải quyết nó.",
        "hero.viewProjects": "Xem Dự Án",
        "hero.contactMe": "Liên Hệ Với Tôi",

        // About
        "about.title": "Về",
        "about.developer": "bản thân",
        "about.description": "Tôi là một sinh viên mới tốt nghiệp đam mê phát triển phần mềm, đặc biệt là Java và C#. Tôi đang tích cực tìm kiếm cơ hội để áp dụng kỹ năng của mình vào việc xây dựng các ứng dụng mạnh mẽ. Trọng tâm của tôi là viết mã sạch, hiệu quả và liên tục học hỏi công nghệ mới.",
        "about.yearsExp": "Năm Kinh Nghiệm",
        "about.projectsCompleted": "Dự Án Hoàn Thành",
        "about.coreSkill": "Kỹ Năng Cốt Lõi",

        // Skills
        "skills.title": "lập trình",
        "skills.technical": "Kỹ năng",

        // Skill Categories & Items
        "skills.cat.languages": "Ngôn ngữ",
        "skills.cat.backend": "Backend",
        "skills.cat.database": "Cơ sở dữ liệu",
        "skills.cat.tools": "Công cụ",
        "skills.cat.others": "Khác",

        // Skill Items (Text that needs translation if any, most are proper nouns)
        "skills.item.java": "Java",
        "skills.item.csharp": "C#",
        "skills.item.javascript": "JavaScript/TypeScript",
        "skills.item.htmlcss": "HTML & CSS",
        "skills.item.dotnet": ".NET (Winforms)",
        "skills.item.restapi": "RESTful API",
        "skills.item.mysql": "MySQL",
        "skills.item.mssql": "MS SQL Server",
        "skills.item.git": "Git",
        "skills.item.vscode": "VS Code",
        "skills.item.postman": "Postman",
        "skills.item.nextjs": "NextJS",
        "skills.item.tailwindcss": "Tailwind CSS",

        // Projects
        "projects.title": "cá nhân",
        "projects.featured": "Dự án",
        "projects.viewCode": "Xem Code",
        "projects.liveDemo": "Demo Trực Tiếp",

        // Contact
        "contact.title": "Hãy cùng tạo ra",
        "contact.subtitle": "điều gì đó tuyệt vời.",
        "contact.quote": "Xây dựng ứng dụng trong chớp mắt, vì tôi Code bằng Vibe, không chỉ bằng tay.",
        "contact.location": "Địa Chỉ",
        "contact.form.name": "Tên",
        "contact.form.email": "Email",
        "contact.form.message": "Tin Nhắn",
        "contact.form.send": "Gửi Tin Nhắn",
        // Projects Details
        "projects.task.title": "Quản Lý Công Việc",
        "projects.task.desc": "Ứng dụng theo dõi nhiệm vụ toàn diện được thiết kế để tối ưu hóa năng suất cá nhân và quy trình làm việc của dự án.",
        "projects.recorder.title": "Ghi Lại Thao Tác",
        "projects.recorder.desc": "Công cụ tự động ghi và phát lại các tương tác của người dùng, hữu ích cho kiểm thử tự động và tạo macro.",
        "projects.extractor.title": "Text Extractor",
        "projects.extractor.desc": "Công cụ mạnh mẽ giúp trích xuất văn bản từ hình ảnh hoặc vùng chụp trên màn hình. Hỗ trợ phím tắt PrtSc và đa ngôn ngữ.",
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
        "hero.description": "Software passion occurs when you see a problem and, instead of complaining, you immediately think of writing a function to solve it.",
        "hero.viewProjects": "View Projects",
        "hero.contactMe": "Contact Me",

        // About
        "about.title": "About",
        "about.developer": "myself",
        "about.description": "I'm a recent graduate passionate about software development, specifically in Java and C#. I am actively seeking opportunities to apply my skills in building robust applications. My focus is on writing clean, efficient code and continuously learning new technologies.",
        "about.yearsExp": "Year Experience",
        "about.projectsCompleted": "Projects Completed",
        "about.coreSkill": "Core Skill",

        // Skills
        "skills.title": "skills",
        "skills.technical": "Programming",

        // Skill Categories & Items
        "skills.cat.languages": "Languages",
        "skills.cat.backend": "Backend",
        "skills.cat.database": "Databases",
        "skills.cat.tools": "Tools",
        "skills.cat.others": "Others",

        // Skill Items
        "skills.item.java": "Java",
        "skills.item.csharp": "C#",
        "skills.item.javascript": "JavaScript/TypeScript",
        "skills.item.htmlcss": "HTML & CSS",
        "skills.item.dotnet": ".NET (Winforms)",
        "skills.item.restapi": "RESTful API",
        "skills.item.mysql": "MySQL",
        "skills.item.mssql": "MS SQL Server",
        "skills.item.git": "Git",
        "skills.item.vscode": "VS Code",
        "skills.item.postman": "Postman",
        "skills.item.nextjs": "NextJS",
        "skills.item.tailwindcss": "Tailwind CSS",

        // Projects
        "projects.title": "Projects",
        "projects.featured": "Personal",
        "projects.viewCode": "View Code",
        "projects.liveDemo": "Live Demo",

        // Contact
        "contact.title": "Let's create",
        "contact.subtitle": "something amazing.",
        "contact.quote": "Building apps in a blink, because I Code with Vibe, not just by hand.",
        "contact.location": "Location",
        "contact.form.name": "Name",
        "contact.form.email": "Email",
        "contact.form.message": "Message",
        "contact.form.send": "Send Message",
        "contact.placeholder.name": "Your Name",
        "contact.placeholder.email": "your@email.com",
        "contact.placeholder.message": "Tell me about your project...",

        // Projects Details
        "projects.task.title": "Task Management",
        "projects.task.desc": "A comprehensive task tracking application designed to streamline personal productivity and project workflows.",
        "projects.recorder.title": "User Action Recorder",
        "projects.recorder.desc": "Automated tool for recording and replaying user interactions, useful for automated testing and macro creation.",
        "projects.extractor.title": "Text Extractor",
        "projects.extractor.desc": "A powerful tool to extract text from images or screen captures. Supports PrtSc shortcut and multi-language recognition.",
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>("vi");

    // Optional: Persist language (simple implementation)
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
        const keys = key.split(".");
        let value: any = translations[language];

        // Simple flat lookup for now as keys are "nav.home"
        if (value[key]) return value[key];

        // Fallback if key missing
        return key;
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
