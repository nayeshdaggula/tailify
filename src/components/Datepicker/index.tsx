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
  placeholder = 'Select a date',
  clearable = true,
  dateFormat = 'YYYY/MM/DD',
}) => {
  const [date, setDate] = useState<Date | null>(value);

  // Format the date based on the dateFormat prop
  const formatDate = (date: Date | null) => {
    return date ? dayjs(date).format(dateFormat) : '';
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value ? new Date(e.target.value) : null;
    setDate(selectedDate);
    onChange(selectedDate);
  };

  const handleClear = () => {
    setDate(null);
    onChange(null);
  };

  return (
    <div className="relative w-full">
      <input
        type="date"
        value={date ? dayjs(date).format('YYYY-MM-DD') : ''} // Format to YYYY-MM-DD for the input
        onChange={handleDateChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded-md shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-2 text-gray-700">{date && `Selected Date: ${formatDate(date)}`}</div>

      {clearable && date && (
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
