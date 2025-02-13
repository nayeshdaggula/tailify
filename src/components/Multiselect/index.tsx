import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface Option {
    value: string;
    label: string;
    group?: string;
    disabled?: boolean;
}

interface MultiselectProps {
    data: Option[];
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
    renderSelected?: (selected: Option[]) => React.ReactNode;
    renderOption?: (option: Option) => React.ReactNode;
    filter?: (option: Option, query: string) => boolean;
    value?: string[];
    onChange?: (selectedValues: string[]) => void;
    containerClass?: string;
}

const Multiselect: React.FC<MultiselectProps> = ({
    data = [],
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
    renderSelected,
    renderOption,
    filter,
    value = [],
    onChange,
    containerClass = '',
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(value || []);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    // Create Portal for Dropdown
    useEffect(() => {
        let portal = document.querySelector('[data-portal="true"]') as HTMLElement | null;
        if (!portal) {
            portal = document.createElement('div');
            portal.setAttribute('data-portal', 'true');
            document.body.appendChild(portal);
        }
        setPortalRoot(portal);
    }, []);

    useEffect(() => {
        if (JSON.stringify(selectedOptions) !== JSON.stringify(value)) {
            setSelectedOptions(value || []);
        }
    }, [value]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Adjust dropdown position dynamically
    useEffect(() => {
        if (isOpen && inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            const dropdownHeight = 200; // Approximate dropdown height

            let top = rect.bottom + window.scrollY + 5;
            let bottomSpace = window.innerHeight - rect.bottom;

            if (bottomSpace < dropdownHeight) {
                // Move dropdown above the input if not enough space below
                top = rect.top + window.scrollY - dropdownHeight - 5;
            }

            setDropdownStyle({
                position: "absolute",
                top: `${top}px`,
                left: `${rect.left + window.scrollX}px`,
                width: `${rect.width}px`,
                zIndex: 1050, // Ensure it's above other elements
            });
        }
    }, [isOpen]);

    const handleToggleDropdown = () => {
        if (!disabled) setIsOpen((prev) => !prev);
    };

    const handleSelectOption = (value: string) => {
        if (maxSelectedValues && selectedOptions.length >= maxSelectedValues) return;
        const newSelection = selectedOptions.includes(value)
            ? selectedOptions.filter((item) => item !== value)
            : [...selectedOptions, value];
        setSelectedOptions(newSelection);
        onChange?.(newSelection);
    };

    const handleRemoveSelected = (value: string) => {
        const newSelection = selectedOptions.filter((item) => item !== value);
        setSelectedOptions(newSelection);
        onChange?.(newSelection);
    };

    const handleClearSelection = () => {
        setSelectedOptions([]);
        onChange?.([]);
    };

    const filteredOptions = filter
        ? data.filter((option) => filter(option, searchQuery))
        : data.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className={`relative w-full ${containerClass}`} ref={inputRef}>
            {label && (
                <label className={`block text-sm font-bold text-black ${labelClass}`}>
                    {label}
                </label>
            )}
            <div
                onClick={handleToggleDropdown}
                className={`cursor-pointer flex w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50 ${disabled
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                    } ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
                <span className="text-gray-600 flex-1 overflow-x-auto whitespace-nowrap">
                    {selectedOptions.length ? (
                        renderSelected ? (
                            renderSelected(
                                selectedOptions.map((value) =>
                                    data.find((opt) => opt.value === value)
                                ) as Option[]
                            )
                        ) : (
                            <div className="flex flex-nowrap gap-2">
                                {selectedOptions.map((value) => {
                                    const selectedOption = data.find((opt) => opt.value === value);
                                    return (
                                        selectedOption && (
                                            <div
                                                key={value}
                                                className="flex items-center px-2 text-black border-black rounded-full border-[1px]"
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

            {portalRoot && isOpen &&
                ReactDOM.createPortal(
                    <div
                        style={dropdownStyle}
                        className={`bg-white border rounded-md shadow-lg ${dropdownHeight} overflow-y-auto ${dropdownWidth}`}
                        ref={dropdownRef}
                    >
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
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelectOption(option.value)}
                                >
                                    {renderOption ? renderOption(option) : option.label}
                                </li>
                            ))}
                        </ul>
                    </div>,
                    portalRoot
                )}
        </div>
    );
};

export { Multiselect };
