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
  minDate?: Date;
  maxDate?: Date;
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
  minDate,
  maxDate
}) => {
  const adjustedMinDate = value && minDate && value < minDate ? value : minDate;
  const adjustedMaxDate = value && maxDate && value > maxDate ? value : maxDate;
  const [viewDate, setViewDate] = useState<Date>(value || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'date' | 'month' | 'year'>('date');
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const justOpenedRef = useRef(false);

  const now = new Date();
  const [hours, setHours] = useState(value ? value.getHours() % 12 || 12 : now.getHours() % 12 || 12);
  const [minutes, setMinutes] = useState(value ? value.getMinutes() : now.getMinutes());
  const [ampm, setAmpm] = useState(value ? (value.getHours() >= 12 ? 'PM' : 'AM') : (now.getHours() >= 12 ? 'PM' : 'AM'));


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
    <div className='mt-4 mx-auto w-[200px]'>
      <div className="flex items-center justify-between gap-2">
        <select
          value={hours}
          onChange={(e) => {
            const newHours = Number(e.target.value);
            setHours(newHours);
            const updatedDate = new Date(selectedDate);
            let h = newHours % 12;
            if (ampm === 'PM') h += 12;
            updatedDate.setHours(h, minutes, 0, 0);
            setSelectedDate(updatedDate);
            onChange?.(updatedDate);
          }}
          className="border rounded-md p-1 text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
          ))}
        </select>
        <span>:</span>
        <select
          value={minutes}
          onChange={(e) => {
            const newMinutes = Number(e.target.value);
            setMinutes(newMinutes);
            const updatedDate = new Date(selectedDate);
            let h = hours % 12;
            if (ampm === 'PM') h += 12;
            updatedDate.setHours(h, newMinutes, 0, 0);
            setSelectedDate(updatedDate);
            onChange?.(updatedDate);
          }}
          className="border rounded-md p-1 text-sm"
        >
          {Array.from({ length: 60 }, (_, i) => i).map((m) => (
            <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
          ))}
        </select>
        <select
          value={ampm}
          onChange={(e) => {
            const newAmpm = e.target.value as 'AM' | 'PM';
            setAmpm(newAmpm);
            const updatedDate = new Date(selectedDate);
            let h = hours % 12;
            if (newAmpm === 'PM') h += 12;
            updatedDate.setHours(h, minutes, 0, 0);
            setSelectedDate(updatedDate);
            onChange?.(updatedDate);
          }}
          className="border rounded-md p-1 text-sm"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );

  const renderHeader = () => {
    // Helper to check if a month (0-based) in a year is allowed
    const isMonthAllowed = (year: number, month: number) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
      return (!adjustedMinDate || end >= adjustedMinDate) && (!adjustedMaxDate || start <= adjustedMaxDate);
    };
    // Helper to check if a year is allowed
    const isYearAllowed = (year: number) => {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31, 23, 59, 59, 999);
      return (!adjustedMinDate || end >= adjustedMinDate) && (!adjustedMaxDate || start <= adjustedMaxDate);
    };
    // canGoPrev and canGoNext logic by mode
    const canGoPrev =
      mode === 'date'
        ? isMonthAllowed(currentYear, currentMonth - 1)
        : mode === 'month'
          ? isYearAllowed(currentYear - 1)
          : Array.from({ length: 12 }, (_, i) => currentYear - 12 + i).some(isYearAllowed);

    const canGoNext =
      mode === 'date'
        ? isMonthAllowed(currentYear, currentMonth + 1)
        : mode === 'month'
          ? isYearAllowed(currentYear + 1)
          : Array.from({ length: 12 }, (_, i) => currentYear + 1 + i).some(isYearAllowed);

    return (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={canGoPrev ? () => handleMonthChange('prev') : undefined}
          className={clsx("text-gray-600", {
            'hover:text-blue-500 cursor-pointer': canGoPrev,
            'cursor-not-allowed text-gray-400': !canGoPrev,
          })}
        >
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
        <button
          onClick={canGoNext ? () => handleMonthChange('next') : undefined}
          className={clsx("text-gray-600", {
            'hover:text-blue-500 cursor-pointer': canGoNext,
            'cursor-not-allowed text-gray-400': !canGoNext,
          })}
        >
          <IconChevronRight />
        </button>
      </div>
    );
  };

  const renderBody = () => {
    if (mode === 'year') {
      const years = Array.from({ length: 12 }, (_, i) => currentYear - 6 + i);


      const currentActiveYearclass = 'bg-blue-500 text-white !hover:bg-blue-500 !hover:text-white';
      const inactiveYearclass = 'cursor-pointer hover:bg-gray-100 text-gray-800';
      const YearDisabledclass = 'cursor-not-allowed bg-gray-200 text-gray-400';

      return (
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          {years.map((year) => {
            const isYearDisabled = (adjustedMinDate && new Date(year + 1, 0, 0) < adjustedMinDate)
              || (adjustedMaxDate && new Date(year, 0, 1) > adjustedMaxDate);


            const yearClass = isYearDisabled
              ? YearDisabledclass
              : year === currentYear
                ? currentActiveYearclass
                : inactiveYearclass;

            return (
              <button
                key={year}
                onClick={() => !isYearDisabled && handleYearSelect(year)}
                disabled={isYearDisabled}
                className={clsx('p-2 rounded-md text-sm', yearClass)}
              >
                {year}
              </button>
            );
          })}
        </div>
      );
    }

    if (mode === 'month') {
      const months = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString('default', { month: 'short' })
      );

      const currentActivemonthclass = 'bg-blue-500 text-white !hover:bg-blue-500 !hover:text-white';
      const inactivemonthclass = 'cursor-pointer hover:bg-gray-100 text-gray-800';
      const monthDisabledclass = 'cursor-not-allowed bg-gray-200 text-gray-400';

      return (
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          {months.map((month, i) => {
            const isMonthDisabled =
              (adjustedMinDate && new Date(currentYear, i + 1, 0) < adjustedMinDate) ||
              (adjustedMaxDate && new Date(currentYear, i, 1) > adjustedMaxDate);

            const monthClass = isMonthDisabled
              ? monthDisabledclass
              : i === currentMonth
                ? currentActivemonthclass
                : inactivemonthclass;

            return (
              <button
                key={i}
                onClick={() => !isMonthDisabled && handleMonthSelect(i)}
                disabled={isMonthDisabled}
                className={clsx('p-2 rounded-md text-sm', monthClass)}
              >
                {month}
              </button>
            );
          })}
        </div>
      );
    }

    const currentActiveDateclass = 'bg-blue-500 text-white !hover:bg-blue-500 !hover:text-white';
    const inactiveDateclass = 'cursor-pointer hover:bg-gray-100 text-gray-800';
    const DateDisabledclass = 'cursor-not-allowed bg-gray-200 text-gray-400';

    return (
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-gray-500 font-medium">{d}</div>
        ))}
        {emptyDays.map((_, i) => <div key={`e-${i}`} />)}
        {days.map((day) => {
          const date = new Date(currentYear, currentMonth, day);
          const isBeforeMin = adjustedMinDate && date < new Date(adjustedMinDate.setHours(0, 0, 0, 0));
          const isAfterMax = adjustedMaxDate && date > new Date(adjustedMaxDate.setHours(23, 59, 59, 999));
          const isDisabled = isBeforeMin || isAfterMax;

          const isActive =
            day === selectedDate.getDate() &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;

          const dateClass = isDisabled
            ? DateDisabledclass
            : isActive
              ? currentActiveDateclass
              : inactiveDateclass;

          return (
            <button
              key={day}
              onClick={() => {
                if (!isDisabled) handleDateSelect(day);
              }}
              disabled={isDisabled}
              className={clsx(
                'p-2 rounded-md text-sm',
                dateClass
              )}
            >
              {day}
            </button>
          );
        })}
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