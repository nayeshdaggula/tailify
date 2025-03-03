import { IconCheck, IconCircleDashedX, IconSelector } from '@tabler/icons-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

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
  onChange?: (value: string | null) => void; // onChange callback
  error?: string;
  mainContainerClass?: string;
  dropDownClass?: string;
  dropDownInputClass?: string;
  selectWrapperClass?: string;
  dropDownInputPlaceholder?: string;
  dropDownListMainClass?: string;
  dropDownListClass?: string;
  withPortal?: boolean;
}

const Select: React.FC<SingleSelectProps> = ({
  data = [],
  placeholder = 'Select...',
  label,
  labelClass = '',
  placeholderClass = '',
  clearable = false,
  searchable = false,
  value = null,
  onChange,
  error,
  mainContainerClass = '',
  dropDownClass = '',
  dropDownInputClass = '',
  selectWrapperClass = '',
  dropDownInputPlaceholder = 'Search...',
  dropDownListMainClass = '',
  dropDownListClass = '',
  withPortal = true,
}) => {
  const [localValue, setLocalValue] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

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
    setIsOpen(newisOpen);

    if (withPortal) {
      if (newisOpen && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const dropdownHeight = 200; // Approximate dropdown height

        let height = inputRef.current.clientHeight + 145;

        let top = rect.bottom + window.scrollY + 5;
        let bottomSpace = window.innerHeight - rect.bottom;

        if (bottomSpace < dropdownHeight) {
          top = top - height;
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
  }, [isOpen, inputRef, withPortal]);


  const handleSelectOption = (value: string) => {
    if (onChange) {
      onChange(value);
    } else {
      setLocalValue(value);
    }
    setIsOpen(false);
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening when clicking the clear icon
    if (onChange) {
      onChange(null);
    } else {
      setLocalValue(null);
    }
  };

  const filteredOptions = data.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayValue = value ?? localValue;

  const dropdownContent = (
    <div
      style={withPortal ? dropdownStyle : {}}
      className={`bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto ${dropDownClass}`}
      ref={dropdownRef}
    >
      {searchable && (
        <div className="p-2">
          <input
            type="text"
            className={`focus-visible:!outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-300 dark:focus:border-gray-300 ${dropDownInputClass}`}
            placeholder={dropDownInputPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      )}
      <ul className={`${dropDownListMainClass} max-h-48 overflow-y-auto`}>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <li
              key={`tailifyselect-${option.value}-${index}`}
              className={`${dropDownListClass} flex text-[14px] flex-row justify-between items-center p-2 cursor-pointer hover:bg-gray-100 bg-white`}
              onClick={() => handleSelectOption(option.value)}
            >
              {option.label}
              {displayValue === option.value && <IconCheck size="14px" />}
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm p-2">No options found</li>
        )}
      </ul>
    </div>
  );

  return (
    <div
      className={`relative w-full ${mainContainerClass}`}
      ref={inputRef}
    >
      {label && <label className={`block text-sm font-bold text-black ${labelClass}`}>{label}</label>}
      <div
        onClick={handleToggleDropdown}
        className={`justify-between items-center cursor-pointer flex w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${selectWrapperClass}`}
      >
        <span className="text-gray-600">
          {displayValue
            ? data.find((option) => option.value === displayValue)?.label
            : <p className={`py-[1.3px] ${placeholderClass}`}>{placeholder}</p>}
        </span>
        {clearable && displayValue ? (
          <IconCircleDashedX onClick={handleClearSelection} size="15px" color="red" />
        ) : (
          <IconSelector size="15px" />
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {isOpen && (withPortal && portalRoot ? ReactDOM.createPortal(dropdownContent, portalRoot) : dropdownContent)}
    </div>
  );
};

export { Select };
