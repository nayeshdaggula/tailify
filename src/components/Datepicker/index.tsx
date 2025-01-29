import React, { useState } from 'react';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  clearable?: boolean;
  dateFormat?: string;
}

const DatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select a year',
  clearable = true,
  dateFormat = 'YYYY',
}) => {
  const [year, setYear] = useState<number | null>(value ? dayjs(value).year() : null);

  // Format the year based on the dateFormat prop
  const formatDate = (year: number | null) => {
    return year ? dayjs().year(year).format(dateFormat) : '';
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value ? parseInt(e.target.value, 10) : null;
    setYear(selectedYear);
    onChange(selectedYear ? dayjs().year(selectedYear).toDate() : null);
  };

  const handleClear = () => {
    setYear(null);
    onChange(null);
  };

  const currentYear = dayjs().year();
  const yearsArray = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="relative w-full">
      <select
        value={year ?? ''}
        onChange={handleYearChange}
        className="w-full p-2 border rounded-md shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {yearsArray.map((yearOption) => (
          <option key={yearOption} value={yearOption}>
            {yearOption}
          </option>
        ))}
      </select>

      <div className="mt-2 text-gray-700">
        {year && `Selected Year: ${formatDate(year)}`}
      </div>

      {clearable && year && (
        <button
          onClick={handleClear}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export { DatePicker };
