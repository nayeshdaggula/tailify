import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SingleSelectProps {
  data: Option[];
  placeholder?: string;
  label?: string;
  labelClass?: string;
  placeholderClass?: string;
  clearable?: boolean;
  searchable?: boolean;
  value?: string | null; // Controlled value
  defaultValue?: string | null; // Uncontrolled default value
  onChange?: (value: string | null) => void; // onChange callback
  error?: string;
}

const Select: React.FC<SingleSelectProps> = ({
  data = [],
  placeholder = 'Select...',
  label,
  labelClass = '',
  placeholderClass = '',
  clearable = false,
  searchable = false,
  value = null, // Controlled value
  defaultValue = null, // Default value (initial)
  onChange,
  error
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelectOption = (value: string) => {
    if (onChange) {
      onChange(value); // Notify parent with the selected value
    } else {
      setSelectedOption(value); // Update internal state if no `onChange` prop is provided
    }
    setIsOpen(false); // Close dropdown after selection
  };

  const handleClearSelection = () => {
    if (onChange) {
      onChange(null); // Notify parent to clear selection
    } else {
      setSelectedOption(null); // Clear internal selection
    }
  };

  const filteredOptions = data.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close dropdown if click is outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Use `value` if it's provided (controlled) or fall back to `selectedOption` (internal state)
  const controlledSelection = value !== undefined ? value : selectedOption;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && <label className={`block text-sm font-bold text-black ${labelClass}`}>{label}</label>}
      <div
        onClick={handleToggleDropdown}
        className="cursor-pointer flex w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      >
        <span className="text-gray-600">
          {controlledSelection
            ? data.find((option) => option.value === controlledSelection)?.label
            : <p className={`py-[1.3px] ${placeholderClass}`}>{placeholder}</p>}
        </span>
        {clearable && controlledSelection && (
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

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {searchable && (
            <div className="p-2">
              <input
                type="text"
                className="w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                className={`p-2 cursor-pointer hover:bg-gray-100 ${controlledSelection === option.value ? 'bg-gray-100' : 'bg-white'}`}
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

export { Select };
