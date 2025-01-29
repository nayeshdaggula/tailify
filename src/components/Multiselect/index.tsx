import React, { useState, useEffect, useRef } from 'react';
import './Multiselect.css';

interface Option {
    value: string;
    label: string;
    group?: string;
    disabled?: boolean;
}

interface MultiselectProps {
    options: Option[];
    placeholder?: string;
    searchable?: boolean;
    label?: string;
    labelClass?: string;
    placeholderClass?: string;
    clearable?: boolean;
    disabled?: boolean;
    error?: string;
    maxSelectedValues?: number;
    dropdownHeight?: string;
    dropdownWidth?: string;
    noOptionsMessage?: string;
    loading?: boolean;
    onSearchChange?: (query: string) => void;
    renderSelected?: (selected: Option[]) => React.ReactNode;
    renderOption?: (option: Option) => React.ReactNode;
    filter?: (option: Option, query: string) => boolean;
    value?: string[];
    onChange?: (selectedValues: string[]) => void;
    contailnerClass?: string;
}

const Multiselect: React.FC<MultiselectProps> = ({
    options = [],
    placeholder = 'Select...',
    searchable = false,
    label,
    labelClass = '',
    placeholderClass = '',
    clearable = false,
    disabled = false,
    error = '',
    maxSelectedValues,
    dropdownHeight = 'max-h-60',
    dropdownWidth = 'w-full',
    noOptionsMessage = 'No options found',
    loading = false,
    onSearchChange,
    renderSelected,
    renderOption,
    filter,
    value = [], // Default value
    onChange, // onChange handler
    contailnerClass = '',
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(value || []);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedOptions(value || []);
    }, [value]);

    const handleToggleDropdown = () => {
        if (!disabled) setIsOpen((prev) => !prev);
    };

    const handleSelectOption = (value: string) => {
        if (maxSelectedValues && selectedOptions.length >= maxSelectedValues) return;
        const newSelection = selectedOptions.includes(value)
            ? selectedOptions.filter((item) => item !== value)
            : [...selectedOptions, value];
        setSelectedOptions(newSelection);
        onChange?.(newSelection); // Notify parent of change
    };

    const handleRemoveSelected = (value: string) => {
        const newSelection = selectedOptions.filter((item) => item !== value);
        setSelectedOptions(newSelection);
        onChange?.(newSelection); // Notify parent of change
    };

    const handleClearSelection = () => {
        setSelectedOptions([]);
        onChange?.([]); // Notify parent of change
    };

    const filteredOptions = filter
        ? options.filter((option) => filter(option, searchQuery))
        : options.filter((option) =>
              option.label.toLowerCase().includes(searchQuery.toLowerCase())
          );

    const groupedOptions = filteredOptions.reduce((acc, option) => {
        if (option.group) {
            if (!acc[option.group]) acc[option.group] = [];
            acc[option.group].push(option);
        } else {
            if (!acc['ungrouped']) acc['ungrouped'] = [];
            acc['ungrouped'].push(option);
        }
        return acc;
    }, {} as Record<string, Option[]>);

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
            {label && (
                <label className={`block text-sm font-bold text-black ${labelClass}`}>
                    {label}
                </label>
            )}
            <div
                onClick={handleToggleDropdown}
                className={`cursor-pointer flex w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50 ${
                    disabled
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                } ${error ? 'border-red-500' : 'border-gray-300'} ${contailnerClass}`}
            >
                <span className="text-gray-600 flex-1 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {selectedOptions && selectedOptions.length ? (
                        renderSelected ? (
                            renderSelected(
                                selectedOptions.map((value) =>
                                    options.find((opt) => opt.value === value)
                                ) as Option[]
                            )
                        ) : (
                            <div className="flex flex-nowrap gap-2">
                                {selectedOptions.map((value) => {
                                    const selectedOption = options.find((opt) => opt.value === value);
                                    return (
                                        selectedOption && (
                                            <div
                                                key={value}
                                                className="flex items-center px-2 text-black border-black rounded-full border-[1px] !cursor-default"
                                            >
                                                <span className="text-[13px]">
                                                    {selectedOption.label}
                                                </span>
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
                        )
                    ) : (
                        <p className={`py-[1.3px] ${placeholderClass}`}>{placeholder}</p>
                    )}
                </span>
                {clearable && selectedOptions.length > 0 && (
                    <button
                        onClick={handleClearSelection}
                        className="ml-auto text-gray-400 hover:text-black cursor-pointer"
                        aria-label="Clear selection"
                    >
                        &times;
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            {isOpen && !disabled && (
                <div
                    className={`absolute left-0 ${dropdownWidth} mt-1 bg-white border rounded-md shadow-lg z-10 ${dropdownHeight} overflow-y-auto`}
                >
                    {searchable && (
                        <div className="p-2">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    onSearchChange?.(e.target.value);
                                }}
                                autoFocus={isOpen}
                            />
                        </div>
                    )}
                    {loading ? (
                        <div className="p-2 text-center text-gray-500">Loading...</div>
                    ) : filteredOptions.length === 0 ? (
                        <div className="p-2 text-center text-gray-500">{noOptionsMessage}</div>
                    ) : (
                        <ul className="max-h-48 overflow-y-auto">
                            {Object.entries(groupedOptions).map(([group, options]) => (
                                <li key={group}>
                                    {group !== 'ungrouped' && (
                                        <div className="p-2 text-sm font-bold text-gray-500 bg-gray-100">
                                            {group}
                                        </div>
                                    )}
                                    {options.map((option) => (
                                        <p
                                            key={option.value}
                                            className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                                selectedOptions.includes(option.value)
                                                    ? 'bg-gray-100'
                                                    : 'bg-white'
                                            } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() =>
                                                !option.disabled && handleSelectOption(option.value)
                                            }
                                        >
                                            {renderOption ? renderOption(option) : option.label}
                                        </p>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export { Multiselect };