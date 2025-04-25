import React, { useState } from 'react';
import clsx from 'clsx';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

type PasswordInputProps = {
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

const Passwordinput: React.FC<PasswordInputProps> = ({
  label,
  description,
  placeholder = "Enter password...",
  value,
  onChange,
  labelClassName,
  inputClassName,
  descriptionClassName,
  withAsterisk = false,
  error,
  inputProps,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="passwordinput-wrapper space-y-2">
      {label && (
        <label
          className={clsx(
            "textinput-label block text-sm font-bold mb-1 text-gray-900 dark:text-gray-200",
            labelClassName
          )}
        >
          {label}
          {withAsterisk && <span className="passwordinput-asterisk text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p
          className={clsx(
            "passwordinput-description text-xs text-gray-500 dark:text-gray-400",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      <div className="passwordinput-body relative">
        <input
          {...inputProps}
          type={isPasswordVisible ? "text" : "password"}
          className={clsx(
            "passwordinput-input w-full rounded-md border p-2 text-sm transition-all duration-200 outline-none",
            {
              "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400":
                !error,
              "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400": !!error,
            },
            inputClassName
          )}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="cursor-pointer passwordinput-visibletoggle absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
        >
          {isPasswordVisible ? (
            <IconEye stroke={2} />
          ) : (
            <IconEyeOff stroke={2} />
          )}
        </button>
      </div>
      {error && <p className="passwordinput-error text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { Passwordinput };