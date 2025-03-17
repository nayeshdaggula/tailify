import { IconCheck, IconCircleDashedX, IconSelector } from '@tabler/icons-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    dropDownInputClass?: string;
    dropDownInputPlaceholder?: string;
    dropDownListMainClass?: string;
    dropDownListClass?: string;
    withPortal?: boolean;
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
    dropDownInputClass = '',
    dropDownInputPlaceholder = 'Search...',
    dropDownListMainClass = '',
    dropDownListClass = '',
    withPortal = true,
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
        if (withPortal) {
            let portal = document.querySelector('[data-portal="true"]') as HTMLElement | null;
            if (!portal) {
                portal = document.createElement('div');
                portal.setAttribute('data-portal', 'true');
                document.body.appendChild(portal);
            }
            setPortalRoot(portal);
        }
    }, [withPortal]);

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

    const handleToggleDropdown = useCallback(() => {
        let newisOpen = !isOpen;
        if (!disabled) {
            setIsOpen(newisOpen);
        };

        if (withPortal) {
            if (newisOpen && inputRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                const dropdownHeight = 200; // Approximate dropdown height

                let top = rect.bottom + window.scrollY + 5;
                let bottomSpace = window.innerHeight - rect.bottom;

                if (bottomSpace < dropdownHeight) {
                    // Move dropdown above the input if not enough space below
                    top = rect.top + window.scrollY - dropdownHeight - 5;
                }
                
                const isParentModal = inputRef.current?.closest('[data-portal="true"]') ? true : false;
                if (isParentModal === true) {
                    const parentDrawerStyles = (inputRef.current?.closest('[data-portal="true"]') as HTMLElement)?.innerHTML;
                    let parentDrawerZIndex = parentDrawerStyles.match(/z-index: ([0-9]+);/);
                    let newparentDrawerZIndex = parentDrawerZIndex ? parentDrawerZIndex[1] : '0';

                    setDropdownStyle({
                        position: "absolute",
                        top: `${top}px`,
                        left: `${rect.left + window.scrollX}px`,
                        width: `${rect.width}px`,
                        zIndex: parseInt(newparentDrawerZIndex) + 1,
                    });
                } else {
                    setDropdownStyle({
                        position: "absolute",
                        top: `${top}px`,
                        left: `${rect.left + window.scrollX}px`,
                        width: `${rect.width}px`,
                        zIndex: 999,
                    });
                }
            }
        }
    }, [isOpen, inputRef, disabled, withPortal]);

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

    const dropDownContent = (
        <div
            style={withPortal ? dropdownStyle : {}}
            className={`multiselect-dropdownconatiner bg-white border rounded-md shadow-lg ${dropdownHeight} overflow-y-auto ${dropdownWidth}`}
            ref={dropdownRef}
        >
            {searchable && (
                <div className="multiselect-inputwraper  p-2">
                    <input
                        type="text"
                        className={`multiselect-input focus-visible:!outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-300 dark:focus:border-gray-300 ${dropDownInputClass}`}
                        placeholder={dropDownInputPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus={isOpen}
                    />
                </div>
            )}
            <ul className={`multiselect-dropdownbody ${dropDownListMainClass} max-h-48 overflow-y-auto`}>
                {filteredOptions.map((option, index) => (
                    <li
                        key={`multiselect-${option.value}-${index}`}
                        className={`multiselect-dropdownlist p-2 cursor-pointer hover:bg-gray-100 bg-white ${dropDownListClass}`}
                        onClick={() => handleSelectOption(option.value)}
                    >
                        {
                            renderOption ?
                                renderOption(option) :
                                <div className='multiselect-dropdownlistsingle  text-[14px] flex flex-row justify-between items-center'>
                                    <span>{option.label}</span>
                                    {
                                        selectedOptions.includes(option.value) &&
                                        <IconCheck size="14px" />
                                    }
                                </div>
                        }
                    </li>
                ))}
            </ul>

        </div>
    );

    return (
        <div className={`multiselect-container relative w-full ${containerClass}`} ref={inputRef}>
            {label && (
                <label className={`multiselect-label block text-sm font-bold text-black ${labelClass}`}>
                    {label}
                </label>
            )}
            <div
                onClick={handleToggleDropdown}
                className={`multiselect-option multiselect-label justify-between items-center cursor-pointer flex w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50 ${disabled
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                    } ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
                <span className="multiselect-valuecontainer text-gray-600 flex-1 overflow-x-auto whitespace-nowrap">
                    {selectedOptions.length ? (
                        renderSelected ? (
                            renderSelected(
                                selectedOptions.map((value) =>
                                    data.find((opt) => opt.value === value)
                                ) as Option[]
                            )
                        ) : (
                            <div className="multiselect-valuelist flex flex-nowrap gap-2">
                                {selectedOptions.map((value) => {
                                    const selectedOption = data.find((opt) => opt.value === value);
                                    return (
                                        selectedOption && (
                                            <div
                                                key={value}
                                                className="multiselect-singlevalue flex items-center px-2 text-black border-black rounded-full border-[1px]"
                                            >
                                                <span className="text-[13px]">
                                                    {selectedOption.label}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveSelected(value)}
                                                    className="multiselect-singlevalueremove ml-2 text-black cursor-pointer"
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
                {
                    clearable && selectedOptions.length > 0 ?
                        <IconCircleDashedX
                            onClick={handleClearSelection}
                            size="15px"
                            color='red'
                        />
                        :
                        <IconSelector
                            size="15px"
                        />
                }
            </div>

            {error && <p className="multiselect-error text-red-500 text-sm mt-1">{error}</p>}


            {isOpen && (withPortal && portalRoot ? ReactDOM.createPortal(dropDownContent, portalRoot) : dropDownContent)}
        </div>
    );
};

export { Multiselect };
