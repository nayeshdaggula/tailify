import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

// Define types for Select component props
interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps {
    label?: string;
    placeholder?: string;
    data: SelectOption[];
    value?: string; // Controlled value
    defaultValue?: string; // Default value
    searchable?: boolean;
    padding?: string;
    margin?: string;
    description?: string;
    onChange?: (value: string | null) => void;
    className?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    dropdownClassName?: string;
    inputClassName?: string;
    withAsterisk?: boolean;
}

const Select: React.FC<SelectProps> = ({
    label,
    placeholder = 'Select an option',
    data,
    value,
    defaultValue,
    searchable = false,
    padding = 'p-2',
    margin = 'm-2',
    description,
    onChange,
    className,
    labelClassName,
    descriptionClassName,
    dropdownClassName,
    inputClassName,
    withAsterisk = false,
    ...props
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize selectedLabel from value or defaultValue
        const initialValue = value || defaultValue;
        if (initialValue) {
            const initialOption = data.find((option) => option.value === initialValue);
            setSelectedLabel(initialOption?.label || null);
        }
    }, [value, defaultValue, data]);

    const handleOptionClick = (value: string, label: string) => {
        setSelectedLabel(label);
        setIsDropdownOpen(false);
        if (onChange) onChange(value);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredData = searchable
        ? data.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : data;

    return (
        <div className={clsx('relative', padding, margin, className)} ref={dropdownRef} {...props}>
            {label && (
                <label className={clsx('block mb-1 font-bold text-black', labelClassName)}>
                    {label}{withAsterisk && <span className="text-red-500"> *</span>}
                </label>
            )}
            {description && (
                <p className={clsx('text-sm text-gray-500 mb-1', descriptionClassName)}>{description}</p>
            )}
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={selectedLabel || ''}
                    onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
                    readOnly
                    className={clsx("w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2", inputClassName)}
                />
                <div
                    className={clsx(
                        'absolute left-0 px-[10px] py-[10px] right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1',
                        dropdownClassName,
                        { hidden: !isDropdownOpen }
                    )}
                >
                    {searchable && (
                        <input
                            type="text"
                            placeholder="Search options"
                            value={searchTerm}
                            onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={clsx("w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2", inputClassName)}
                        />
                    )}
                    {filteredData.length > 0 ? (
                        filteredData.map((option) => (
                            <div
                                key={option.value}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    !option.disabled && handleOptionClick(option.value, option.label);
                                }}
                                className={clsx(
                                    'px-4 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white dropdown-option',
                                    {
                                        'text-gray-400 cursor-not-allowed': option.disabled,
                                        'text-gray-900': !option.disabled,
                                    }
                                )}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500">No options found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Select };
