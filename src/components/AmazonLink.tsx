'use client';

import React from 'react';

interface AmazonLinkProps {
    href: string;
    title: string;
    microcopy?: string;
}

export default function AmazonLink({
    href,
    title,
    microcopy = "＼ Amazonでお得にチェック！ ／",
}: AmazonLinkProps) {
    return (
        <div className="flex flex-col items-center justify-center my-10 relative">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex flex-col items-center px-8 py-4 w-full sm:w-auto"
            >
                {/* マイクロコピーの吹き出し (Speech Bubble) */}
                <div className="absolute -top-12 animate-bounce flex flex-col items-center z-10">
                    <div className="bg-red-500 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                        {microcopy}
                    </div>
                    {/* 下向きの三角形 */}
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-red-500 border-r-[6px] border-r-transparent mt-[-1px]"></div>
                </div>

                {/* ボタン本体 (Orange Gradient) */}
                <div className="relative flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-600 hover:from-orange-500 hover:to-amber-700 text-white font-bold text-lg sm:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-[320px] h-[64px] overflow-hidden">

                    {/* 光沢(Shine)エフェクト */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                    <span className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {title}
                    </span>
                </div>
            </a>
        </div>
    );
}
