import React, { useState, useEffect, useRef } from 'react';

interface Option {
    value: string;
    label: string;
}

interface MultiselectProps {
    options: Option[];
    placeholder?: string;
    searchable?: boolean;
    label?: string;
    labelClass?: string;
    placeholderClass?: string;
    clearable?: boolean;
}

const Multiselect: React.FC<MultiselectProps> = ({
    options = [],
    placeholder = 'Select...',
    searchable = false,
    label,
    labelClass = '',
    placeholderClass = '',
    clearable = false,
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelectOption = (value: string) => {
        const newSelection = selectedOptions.includes(value)
            ? selectedOptions.filter((item) => item !== value)
            : [...selectedOptions, value];
        setSelectedOptions(newSelection);
    };

    const handleRemoveSelected = (value: string) => {
        setSelectedOptions(selectedOptions.filter((item) => item !== value));
    };

    const handleClearSelection = () => {
        setSelectedOptions([]);
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className={`block text-sm font-bold text-black ${labelClass}`}>{label}</label>
            <div
                onClick={handleToggleDropdown}
                className="cursor-pointer flex w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
                <span className="text-gray-600">
                    {selectedOptions.length ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedOptions.map((value) => {
                                const selectedOption = options.find((opt) => opt.value === value);
                                return (
                                    selectedOption && (
                                        <div
                                            key={value}
                                            className="flex items-center px-2 text-black border-black rounded-full border-[1px] !cursor-default"
                                        >
                                            <span className='text-[13px]'>{selectedOption.label}</span>
                                            <button
                                                onClick={() => handleRemoveSelected(value)}
                                                className="ml-2 text-black cursor-pointer"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    ) : (
                        <p className={`py-[1.3px] ${placeholderClass}`}>{placeholder}</p>
                    )}
                </span>
                {(clearable && selectedOptions.length>0) && (
                    <button
                        onClick={handleClearSelection}
                        className="ml-auto text-gray-400 hover:text-black cursor-pointer"
                        aria-label="Clear selection"
                    >
                        &times;
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {searchable && (
                        <div className="p-2">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus={isOpen}
                            />
                        </div>
                    )}
                    <ul className="max-h-48 overflow-y-auto">
                        {filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedOptions.includes(option.value) ? 'bg-gray-100' : 'bg-white'}`}
                                onClick={() => handleSelectOption(option.value)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export { Multiselect };