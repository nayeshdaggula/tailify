import React from 'react';
import clsx from 'clsx';

type TextareaProps = {
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelClassName?: string;
  textareaClassName?: string;
  descriptionClassName?: string;
  withAsterisk?: boolean;
  error?: string;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>; // Additional props for the textarea
};

const Textarea: React.FC<TextareaProps> = ({
  label,
  description,
  placeholder = "Enter text...",
  value,
  onChange,
  labelClassName,
  textareaClassName,
  descriptionClassName,
  withAsterisk = false,
  error,
  textareaProps,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className={clsx(
            "block text-sm font-bold text-gray-900 dark:text-white",
            labelClassName
          )}
        >
          {label}
          {withAsterisk && <span className="text-red-500 ml-1 dark:text-red-400">*</span>}
        </label>
      )}
      {description && (
        <p
          className={clsx(
            "text-xs text-gray-500 dark:text-neutral-400",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      <textarea
        {...textareaProps} // Spread additional props onto the textarea
        className={clsx(
          "textareainput-input w-full rounded-md border p-2 text-sm shadow-sm transition-all duration-200 outline-none",
            {
              "border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400":
                !error,
              "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400": !!error,
            },
            "focus:ring focus:ring-opacity-50 focus-visible:ring-0 focus-visible:border-transparent", // Fix for white border
          textareaClassName
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export { Textarea };