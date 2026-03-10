"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        alert("Message sent! (Simulation)");
    };

    return (
        <section id="contact" className="py-32 relative text-center px-6">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-12 tracking-tighter uppercase text-gray-950 leading-tight">
                        {t("contact.title")} <br />
                        <span className="text-gray-400">{t("contact.subtitle")}</span>
                    </h2>

                    <p className="text-xl md:text-2xl font-light text-gray-400 max-w-3xl mx-auto leading-relaxed italic transform-gpu">
                        "{t("contact.quote")}"
                    </p>

                    <div className="mt-20 flex justify-center flex-wrap gap-10 md:gap-16 font-bold uppercase text-xs tracking-[0.2em] text-gray-500">
                        <a
                            href="https://github.com/ldchinh2114"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-950 transition-colors"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://www.facebook.com/LeeChiinhh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-950 transition-colors"
                        >
                            Facebook
                        </a>
                        <a
                            href="mailto:chinhle6030@gmail.com"
                            className="hover:text-gray-950 transition-colors"
                        >
                            Email
                        </a>
                    </div>

                    <p className="mt-32 text-gray-400 text-[10px] uppercase tracking-[0.5em] opacity-60">
                        © 2026 L.D.Chinh — MADE WITH PASSION
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
