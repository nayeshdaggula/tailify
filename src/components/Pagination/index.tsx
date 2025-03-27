import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React from "react";

type PaginationProps = {
    totalpages: number;
    value: number;
    onChange: (page: number) => void;
    siblings?: number;
    boundaries?: number;
    color?: 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'amber' | 'orange';
};

const Pagination: React.FC<PaginationProps> = ({
    totalpages,
    value,
    onChange,
    siblings = 1,
    boundaries = 1,
    color = "blue",
}) => {
    // Tailwind color mapping
    const tailwindColors: Record<string, string> = {
        gray: "bg-gray-500 dark:bg-gray-600",
        red: "bg-red-500 dark:bg-red-600",
        pink: "bg-pink-500 dark:bg-pink-600",
        grape: "bg-purple-500 dark:bg-purple-600",
        violet: "bg-violet-500 dark:bg-violet-600",
        indigo: "bg-indigo-500 dark:bg-indigo-600",
        blue: "bg-blue-500 dark:bg-blue-600",
        cyan: "bg-cyan-500 dark:bg-cyan-600",
        teal: "bg-teal-500 dark:bg-teal-600",
        green: "bg-green-500 dark:bg-green-600",
        lime: "bg-lime-500 dark:bg-lime-600",
        yellow: "bg-yellow-500 dark:bg-yellow-600",
        amber: "bg-amber-500 dark:bg-amber-600",
        orange: "bg-orange-500 dark:bg-orange-600",
    };

    // Determine if a custom color (hex or RGB) is used
    const isCustomColor = color.startsWith("#") || color.startsWith("rgb");
    const activePageStyle = isCustomColor ? { backgroundColor: color } : {};
    const activePageClass = isCustomColor ? "" : tailwindColors[color] || tailwindColors.blue;

    const generatePages = () => {
        if (totalpages <= 1) return [1];

        const pages: (number | "...")[] = [];
        const range = (start: number, end: number) => {
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        };

        const leftBound = Math.max(2, value - siblings);
        const rightBound = Math.min(totalpages - 1, value + siblings);

        if (boundaries > 0) pages.push(...range(1, Math.min(boundaries, totalpages)));

        if (leftBound > boundaries + 2) pages.push("...");
        pages.push(...range(leftBound, rightBound));
        if (rightBound < totalpages - boundaries - 1) pages.push("...");

        if (boundaries > 0)
            pages.push(...range(Math.max(totalpages - boundaries + 1, boundaries + 1), totalpages));

        return pages;
    };

    return (
        <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
                onClick={() => value > 1 && onChange(value - 1)}
                disabled={value === 1}
                className={`p-2 border border-gray-300 rounded dark:border-gray-700 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 
                ${value === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"}`}
            >
                <IconChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            {generatePages().map((p, i) => (
                <button
                    key={i}
                    onClick={() => typeof p === "number" && onChange(p)}
                    style={p === value ? activePageStyle : {}}
                    className={`px-3 py-1 border border-gray-300 rounded 
                        ${p === value
                            ? `text-white ${activePageClass}`
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700 cursor-pointer"
                        }`}
                    disabled={p === "..."}
                >
                    {p}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => value < totalpages && onChange(value + 1)}
                disabled={value >= totalpages}
                className={`p-2 border border-gray-300 rounded dark:border-gray-700 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 
                ${value >= totalpages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"}`}
            >
                <IconChevronRight size={16} />
            </button>
        </div>
    );
};

export { Pagination };