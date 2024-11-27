import React, { useEffect, useState } from "react";
import clsx from "clsx";

type PinInputProps = {
  label?: string; // Label for the input
  description?: string; // Description text below the label
  mask?: boolean; // Mask input values (e.g., show * instead of the actual input)
  numberOfInputs: number; // Number of PIN input boxes
  type?: "number" | "text"; // Input type (number or text)
  placeholder?: string; // Placeholder text for each input
  inputClassName?: string; // Class for individual input
  containerClassName?: string; // Class for the container
  labelClassName?: string; // Class for the label
  descriptionClassName?: string; // Class for the description
  error?: string; // Error message
  errorClassName?: string; // Class for the error message
  value?: string; // Controlled value for the entire PIN
  onChange?: (value: string, pinArray: string[]) => void; // Handler for combined value and array
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

  // Handles input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const inputValue = e.target.value;

    // Validate input based on type
    if ((type === "number" && !/^\d*$/.test(inputValue)) || (type === "text" && !/^[a-zA-Z]*$/.test(inputValue))) {
      return;
    }

    const updatedValues = [...pinValues];
    updatedValues[index] = inputValue.slice(0, 1); // Only take the first character

    setPinValues(updatedValues);
    onChange?.(updatedValues.join(""), updatedValues);

    // Automatically move to the next input
    if (inputValue && index < numberOfInputs - 1) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Sync external value with internal state
  useEffect(() => {
    if (value && value.length === numberOfInputs) {
      setPinValues(value.split(""));
    }
  }, [value, numberOfInputs]);

  // Handles key events (e.g., Backspace)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const updatedValues = [...pinValues];
      updatedValues[index] = ""; // Clear current value

      setPinValues(updatedValues);
      onChange?.(updatedValues.join(""), updatedValues);

      // Move to the previous input on Backspace
      if (index > 0) {
        setTimeout(() => {
          const prevInput = document.getElementById(`pin-input-${index - 1}`);
          prevInput?.focus();
        }, 0);
      }
    }
  };

  // Handles paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("Text");
    const validData = type === "number" ? clipboardData.replace(/\D/g, "") : clipboardData.replace(/[^a-zA-Z]/g, "");

    if (validData) {
      const updatedValues = [...pinValues];
      validData.split("").forEach((char, i) => {
        if (index + i < numberOfInputs) {
          updatedValues[index + i] = char; // Populate values starting from the current index
        }
      });

      setPinValues(updatedValues);
      onChange?.(updatedValues.join(""), updatedValues);

      // Move focus to the last populated input
      const lastPopulatedIndex = Math.min(index + validData.length - 1, numberOfInputs - 1);
      const lastInput = document.getElementById(`pin-input-${lastPopulatedIndex}`);
      lastInput?.focus();
    }
  };

  // Renders all input boxes
  const renderInputs = () =>
    Array.from({ length: numberOfInputs }).map((_, index) => (
      <input
        key={index}
        id={`pin-input-${index}`}
        type={mask ? "password" : "text"}
        value={pinValues[index]} // Always use local state for rendering
        placeholder={placeholder}
        maxLength={1}
        className={clsx(
          "w-10 h-10 border text-center text-lg rounded focus:outline-none focus:ring",
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500",
          inputClassName
        )}
        onChange={(e) => handleChange(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        onPaste={(e) => handlePaste(e, index)} // Add paste handler
      />
    ));

  return (
    <div
        className="flex flex-col space-y-2"
    >
      {label && (
        <label className={clsx("block text-sm font-bold mb-1", labelClassName)}>
          {label}
        </label>
      )}
      {description && (
        <p className={clsx("text-xs text-gray-500 mb-2", descriptionClassName)}>
          {description}
        </p>
      )}
      <div className={clsx("flex gap-2", containerClassName)}>{renderInputs()}</div>
      {error && (
        <p className={clsx("mt-2 text-sm text-red-500", errorClassName)}>{error}</p>
      )}
    </div>
  );
};

export { Pininput };
