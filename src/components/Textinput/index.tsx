import React from 'react';
import clsx from 'clsx';

type TextInputProps = {
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  withAsterisk?: boolean;
  error?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>; // Additional props for the input element
};

const Textinput: React.FC<TextInputProps> = ({
  label,
  description,
  placeholder = "Enter text...",
  value,
  onChange,
  labelClassName,
  inputClassName,
  descriptionClassName,
  withAsterisk = false,
  error,
  inputProps,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className={clsx(
            "block text-sm font-bold text-[#000]",
            labelClassName
          )}
        >
          {label}
          {withAsterisk && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p
          className={clsx(
            "text-xs text-gray-500",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      <input
        {...inputProps} // Spread additional props onto the input element
        type="text"
        className={clsx(
          "w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50",
          {
            "border-gray-300 focus:border-blue-500 focus:ring-blue-500": !error,
            "border-red-500 focus:ring-red-500": !!error,
          },
          inputClassName
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { Textinput };
