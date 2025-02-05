import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React from "react";

type PaginationProps = {
    totalpages: number;
    value: number;
    onChange: (page: number) => void;
    siblings?: number;
    boundaries?: number;
    activePageClass?: string;
};

const Pagination: React.FC<PaginationProps> = ({
    totalpages,
    value,
    onChange,
    siblings = 1,
    boundaries = 1,
    activePageClass = "bg-blue-500",
}) => {
    
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
            <button
                onClick={() => value > 1 && onChange(value - 1)}
                disabled={value === 1}
                className="p-2 border rounded disabled:opacity-50"
            >
                <IconChevronLeft size={16} />
            </button>

            {generatePages().map((p, i) => (
                <button
                    key={i}
                    onClick={() => typeof p === "number" && onChange(p)}
                    className={`px-3 py-1 border rounded ${p === value ? `text-white ${activePageClass}` : "hover:bg-gray-100"}`}
                    disabled={p === "..."}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => value < totalpages && onChange(value + 1)}
                disabled={value >= totalpages}
                className="p-2 border rounded disabled:opacity-50"
            >
                <IconChevronRight size={16} />
            </button>
        </div>
    );
};

export { Pagination };
