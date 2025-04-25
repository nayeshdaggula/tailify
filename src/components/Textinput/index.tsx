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
  return (
    <div className={clsx("textinput-wrapper space-y-2")}>
      {label && (
        <label
          className={clsx(
            "textinput-label block text-sm font-bold mb-1 text-gray-900 dark:text-gray-200",
            labelClassName
          )}
        >
          {label}
          {withAsterisk && <span className="textinput-asterisk text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className={clsx("textinput-description text-xs text-gray-500 dark:text-gray-400", descriptionClassName)}>
          {description}
        </p>
      )}
      <div className="textinput-bodywraper relative">
        <input
          {...inputProps}
          type={type}
          className={clsx(
            "textinput-input w-full rounded-md border p-2 text-sm transition-all duration-200 outline-none",
            {
              "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400":
                !error,
              "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400": !!error,
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
      {error && <p className="textinput-error text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export { Textinput };