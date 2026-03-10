"use client";
import React from "react";
import { Github, Mail, Facebook } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="py-10 bg-gray-100 text-gray-900 border-t border-gray-200">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Portfolio</h3>
                    <p className="text-xs text-gray-500 mt-2">© 2026. All rights reserved.</p>
                </div>

                <div className="flex gap-6">
                    <a href="https://github.com/ldchinh2114" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500 transition-colors duration-300 transform hover:scale-110">
                        <Github size={20} />
                    </a>
                    <a href="https://www.facebook.com/LeeChiinhh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors duration-300 transform hover:scale-110">
                        <Facebook size={20} />
                    </a>
                    <a href="mailto:chinhle6030@gmail.com" className="text-gray-400 hover:text-red-500 transition-colors duration-300 transform hover:scale-110">
                        <Mail size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};
