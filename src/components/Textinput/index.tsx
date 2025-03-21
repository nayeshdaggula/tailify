import React from 'react';
import clsx from 'clsx';
import { useTailify } from '../TailifyProvider';

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
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
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
  const { themeVariant } = useTailify(); // Get theme from context

  return (
    <div className={clsx("textinput-wrapper space-y-2")}>
      {label && (
        <label
          className={clsx(
            "textinput-label block text-sm font-bold mb-0",
            themeVariant === 'dark' ? 'text-white' : 'text-[#000]',
            labelClassName
          )}
        >
          {label}
          {withAsterisk && <span className="textinput-asterisk text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className={clsx("textinput-description text-xs text-gray-500", themeVariant === 'dark' && 'text-gray-300', descriptionClassName)}>
          {description}
        </p>
      )}
      <div className="textinput-bodywraper relative">
        <input
          {...inputProps}
          type={type}
          className={clsx(
            "textinput-input w-full rounded-md border p-2 text-sm shadow-sm focus:ring focus:ring-opacity-50",
            {
              "border-gray-300 focus:border-blue-500 focus:ring-blue-500": !error && themeVariant !== 'dark',
              "border-gray-600 bg-gray-800 text-white focus:border-blue-300 focus:ring-blue-300": themeVariant === 'dark',
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