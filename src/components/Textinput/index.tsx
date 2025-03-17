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
  rightIcon?: React.ReactNode;
  type?: string;
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
  rightIcon = null,
  type = "text",
}) => {
  return (
    <div className="textinput-wrapper space-y-2">
      {label && (
        <label
          className={clsx(
            "textinput-label block text-sm font-bold text-[#000] mb-0",
            labelClassName
          )}
        >
          {label}
          {withAsterisk && <span className="textinput-asterisk text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p
          className={clsx(
            "textinput-description text-xs text-gray-500",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      <div className="textinput-bodywraper relative">
        <input
          {...inputProps} // Spread additional props onto the input element
          type={type}
          className={clsx(
            "textinput-input w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50",
            {
              "border-gray-300 focus:border-blue-500 focus:ring-blue-500": !error,
              "border-red-500 focus:ring-red-500": !!error,
            },
            inputClassName,
            rightIcon && "pr-10"
          )}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {rightIcon && (
          <div className="textinput-iconwraper absolute right-3 flex items-center pointer-events-none top-0 bottom-0">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="textinput-error text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { Textinput };
