import React from 'react';
import clsx from 'clsx';

interface NumberInputProps {
    label?: string;
    labelClassName?: string;
    inputClassName?: string;
    withAsterisk?: boolean;
    error?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>; // Additional props for the input element
    rightIcon?: React.ReactNode;
    min?: number;
    max?: number;
    step?: number;
    value: number; // Controlled value prop
    onChange: (value: number) => void; // Callback to update the value
}

const NumberInput: React.FC<NumberInputProps> = ({
    min,
    max,
    step = 1,
    value,
    onChange,
    label,
    labelClassName,
    inputClassName,
    withAsterisk = false,
    error,
    inputProps,
    rightIcon,
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value);
        if (!isNaN(newValue)) {
            if ((min === undefined || newValue >= min) && (max === undefined || newValue <= max)) {
                onChange(newValue);
            }
        }
    };

    return (
        <div className="">
            {label && (
                <label
                    className={clsx(
                        "block text-sm font-bold text-[#000] mb-0",
                        labelClassName
                    )}
                >
                    {label}
                    {withAsterisk && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    {...inputProps} // Spread additional props onto the input element
                    className={clsx(
                        "w-full rounded-md border p-2 text-sm text-gray-700 shadow-sm focus:ring focus:ring-opacity-50",
                        {
                            "border-gray-300 focus:border-blue-500 focus:ring-blue-500": !error,
                            "border-red-500 focus:ring-red-500": !!error,
                        },
                        inputClassName,
                        rightIcon && "pr-10"
                    )}
                    type="number"
                    value={value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step}
                />
                {rightIcon && (
                    <div className="absolute right-3 flex items-center pointer-events-none top-0 bottom-0">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export { NumberInput };