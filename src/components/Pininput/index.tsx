import React, { useEffect, useState } from "react";
import clsx from "clsx";

type PinInputProps = {
  label?: string;
  description?: string;
  mask?: boolean;
  numberOfInputs: number;
  type?: "number" | "text";
  placeholder?: string;
  inputClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  error?: string;
  errorClassName?: string;
  value?: string;
  onChange?: (value: string, pinArray: string[]) => void;
};

const Pininput: React.FC<PinInputProps> = ({
  label,
  description,
  mask = false,
  numberOfInputs,
  type = "number",
  placeholder = "",
  inputClassName,
  containerClassName,
  labelClassName,
  descriptionClassName,
  error,
  errorClassName,
  value,
  onChange,
}) => {
  const [pinValues, setPinValues] = useState<string[]>(Array(numberOfInputs).fill(""));

  useEffect(() => {
    if (value && value.length === numberOfInputs) {
      setPinValues(value.split(""));
    }
  }, [value, numberOfInputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const inputValue = e.target.value;
    if ((type === "number" && !/^\d*$/.test(inputValue)) || (type === "text" && !/^[a-zA-Z]*$/.test(inputValue))) {
      return;
    }

    const updatedValues = [...pinValues];
    updatedValues[index] = inputValue.slice(0, 1);

    setPinValues(updatedValues);
    onChange?.(updatedValues.join(""), updatedValues);

    if (inputValue && index < numberOfInputs - 1) {
      document.getElementById(`pin-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const updatedValues = [...pinValues];
      updatedValues[index] = "";
      setPinValues(updatedValues);
      onChange?.(updatedValues.join(""), updatedValues);

      if (index > 0) {
        setTimeout(() => document.getElementById(`pin-input-${index - 1}`)?.focus(), 0);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("Text");
    const validData = type === "number" ? clipboardData.replace(/\D/g, "") : clipboardData.replace(/[^a-zA-Z]/g, "");

    if (validData) {
      const updatedValues = [...pinValues];
      validData.split("").forEach((char, i) => {
        if (index + i < numberOfInputs) {
          updatedValues[index + i] = char;
        }
      });

      setPinValues(updatedValues);
      onChange?.(updatedValues.join(""), updatedValues);

      const lastIndex = Math.min(index + validData.length - 1, numberOfInputs - 1);
      document.getElementById(`pin-input-${lastIndex}`)?.focus();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className={clsx("textinput-label block text-sm font-bold mb-1 text-gray-900 dark:text-gray-200", labelClassName)}>
          {label}
        </label>
      )}
      {description && (
        <p className={clsx("text-xs text-gray-500 dark:text-gray-400 mb-2", descriptionClassName)}>
          {description}
        </p>
      )}
      <div className={clsx("flex gap-2", containerClassName)}>
        {Array.from({ length: numberOfInputs }).map((_, index) => (
          <input
            key={index}
            id={`pin-input-${index}`}
            type={mask ? "password" : "text"}
            value={pinValues[index]}
            placeholder={placeholder}
            maxLength={1}
            className={clsx(
              "w-10 h-10 border text-center text-lg rounded focus:outline-none focus:ring",
              "border-gray-300 focus:ring-blue-500 text-gray-900 bg-gray-50",
              "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-400",
              error
                ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
                : "",
              inputClassName
            )}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
          />
        ))}
      </div>
      {error && (
        <p className={clsx("mt-2 text-sm text-red-500 dark:text-red-400", errorClassName)}>{error}</p>
      )}
    </div>
  );
};

export { Pininput };