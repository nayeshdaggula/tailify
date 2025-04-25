import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import ReactDOM from 'react-dom';

type DateTimePickerProps = {
  label?: string;
  description?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  withAsterisk?: boolean;
  error?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  format?: string;
  withPortal?: boolean;
};

const Datetimepicker: React.FC<DateTimePickerProps> = ({
  label,
  description,
  value,
  onChange,
  labelClassName,
  inputClassName,
  descriptionClassName,
  withAsterisk = false,
  error,
  inputProps,
  format = 'YYYY-MM-DD',
  withPortal = true,
}) => {
  const [viewDate, setViewDate] = useState<Date>(value || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'date' | 'month' | 'year'>('date');
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const justOpenedRef = useRef(false);

  const [hours, setHours] = useState(value ? value.getHours() % 12 || 12 : 12);
  const [minutes, setMinutes] = useState(value ? value.getMinutes() : 0);
  const [ampm, setAmpm] = useState(value && value.getHours() >= 12 ? 'PM' : 'AM');


  useEffect(() => {
    if (value) {
      const hr = value.getHours();
      setHours(hr % 12 || 12);
      setMinutes(value.getMinutes());
      setAmpm(hr >= 12 ? 'PM' : 'AM');
    }
  }, [value]);

  useEffect(() => {
    if (withPortal) {
      let portal = document.querySelector('[data-datepicker-portal="true"]') as HTMLElement | null;
      if (!portal) {
        portal = document.createElement('div');
        portal.setAttribute('data-datepicker-portal', 'true');
        document.body.appendChild(portal);
      }
      setPortalRoot(portal);
    }
  }, [withPortal]);

  useEffect(() => {
    if (value) {
      setViewDate(value);
      setSelectedDate(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (justOpenedRef.current) {
        justOpenedRef.current = false;
        return;
      }
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateDropdownPosition = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = 300;
    const bottomSpace = window.innerHeight - rect.bottom;

    const top = bottomSpace >= dropdownHeight
      ? rect.bottom + 4 + window.scrollY
      : rect.top - dropdownHeight - 4 + window.scrollY;

    const modalEl = inputRef.current.closest('[data-modal="true"]') as HTMLElement | null;
    const drawerEl = inputRef.current.closest('[data-drawer="true"]') as HTMLElement | null;

    let zIndex = 9999;
    if (modalEl) {
      zIndex = parseInt(modalEl.style.zIndex || window.getComputedStyle(modalEl).zIndex || '0', 10) + 1;
    } else if (drawerEl) {
      zIndex = parseInt(drawerEl.style.zIndex || window.getComputedStyle(drawerEl).zIndex || '0', 10) + 1;
    }

    setDropdownStyle({
      position: 'absolute',
      top,
      left: rect.left + window.scrollX,
      width: rect.width,
      zIndex,
    });
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      justOpenedRef.current = true;
      setTimeout(() => {
        updateDropdownPosition();
      }, 0);
    }
    setMode('date');
  };

  useEffect(() => {
    if (isOpen && withPortal) {
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      updateDropdownPosition();
    }
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen, withPortal]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);


  // 👇 When date is selected, also include time
  const handleDateSelect = (day: number) => {
    const baseDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    let h = hours % 12;
    if (ampm === 'PM') h += 12;
    const finalDate = new Date(baseDate.setHours(h, minutes, 0, 0));
    setSelectedDate(finalDate);
    onChange?.(finalDate);
    setIsOpen(false);
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(month);
    setViewDate(newDate);
    setMode('date');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
    setMode('month');
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (mode === 'date') {
      newDate.setMonth(currentMonth + (direction === 'prev' ? -1 : 1));
    } else if (mode === 'month') {
      newDate.setFullYear(currentYear + (direction === 'prev' ? -1 : 1));
    } else if (mode === 'year') {
      newDate.setFullYear(currentYear + (direction === 'prev' ? -12 : 12));
    }
    setViewDate(newDate);
  };


  const renderTimePicker = () => (
    <div className='mt-4 mx-auto w-[150px]'>
    <div className="flex items-center justify-between gap-2">
      <select
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        className="border rounded-md p-1 text-sm"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
          <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
        ))}
      </select>
      <span>:</span>
      <select
        value={minutes}
        onChange={(e) => setMinutes(Number(e.target.value))}
        className="border rounded-md p-1 text-sm"
      >
        {Array.from({ length: 60 }, (_, i) => i).map((m) => (
          <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
        ))}
      </select>
      <select
        value={ampm}
        onChange={(e) => setAmpm(e.target.value as 'AM' | 'PM')}
        className="border rounded-md p-1 text-sm"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
    </div>
  );

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={() => handleMonthChange('prev')} className="text-gray-600 hover:text-blue-500 cursor-pointer">
        <IconChevronLeft />
      </button>
      <div className="flex gap-2 text-lg font-semibold text-gray-900">
        <button onClick={() => setMode('month')} className="hover:text-blue-500">
          {viewDate.toLocaleString('default', { month: 'long' })}
        </button>
        <button onClick={() => setMode('year')} className="hover:text-blue-500">
          {currentYear}
        </button>
      </div>
      <button onClick={() => handleMonthChange('next')} className="text-gray-600 hover:text-blue-500 cursor-pointer">
        <IconChevronRight />
      </button>
    </div>
  );

  const renderBody = () => {
    if (mode === 'year') {
      const years = Array.from({ length: 12 }, (_, i) => currentYear - 6 + i);
      return (
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={clsx(
                'p-2 rounded-md cursor-pointer',
                year === currentYear ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-800'
              )}
            >
              {year}
            </button>
          ))}
        </div>
      );
    }

    if (mode === 'month') {
      const months = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString('default', { month: 'short' })
      );
      return (
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          {months.map((month, i) => (
            <button
              key={i}
              onClick={() => handleMonthSelect(i)}
              className={clsx(
                'p-2 rounded-md cursor-pointer',
                i === currentMonth ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-800'
              )}
            >
              {month}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-gray-500 font-medium">{d}</div>
        ))}
        {emptyDays.map((_, i) => <div key={`e-${i}`} />)}
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleDateSelect(day)}
            className={clsx(
              'p-2 rounded-full cursor-pointer',
              day === selectedDate.getDate() &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 text-gray-800'
            )}
          >
            {day}
          </button>
        ))}
      </div>
    );
  };

  const calendar = (
    <div
      ref={dropdownRef}
      className="mt-2 w-80 max-w-[405px] overflow-y-auto rounded-lg shadow-lg bg-white border border-gray-200"
      style={withPortal ? dropdownStyle : {}}
    >
      <div className="p-4">
        {renderHeader()}
        {renderBody()}
        {renderTimePicker()}
      </div>
    </div>
  );

  const formattedDate = dayjs(selectedDate).format(`${format} hh:mm A`);

  return (
    <div className="space-y-2" ref={inputRef}>
      {label && (
        <label className={clsx('block text-sm font-bold text-gray-900', labelClassName)}>
          {label}
          {withAsterisk && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {description && (
        <p className={clsx('text-xs text-gray-500', descriptionClassName)}>{description}</p>
      )}
      <div>
        <input
          {...inputProps}
          type="text"
          readOnly
          value={formattedDate}
          onClick={handleOpen}
          className={clsx(
            'w-full rounded-md border p-2 text-sm cursor-pointer',
            {
              'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500': !error,
              'border-red-500 focus:ring-red-500': !!error,
            },
            inputClassName
          )}
        />
        {isOpen &&
          (withPortal && portalRoot
            ? ReactDOM.createPortal(calendar, portalRoot)
            : calendar)}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { Datetimepicker };