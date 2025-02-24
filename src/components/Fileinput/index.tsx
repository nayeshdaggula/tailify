import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { IconX } from '@tabler/icons-react';

interface FileinputProps {
    label?: string;
    labelClassName?: string;
    withAsterisk?: boolean;
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    description?: string;
    descriptionClassName?: string;
    placeholder?: string;
    clearable?: boolean;
    multiple?: boolean;
    error?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Fileinput: React.FC<FileinputProps> = ({
    label,
    labelClassName,
    withAsterisk = false,
    radius = 'md',
    description,
    descriptionClassName,
    placeholder = 'Choose file(s)',
    clearable = false,
    multiple = false,
    error,
    size = 'md',
    className,
    inputProps,
    onChange,
}) => {
    const sizeStyles = {
        xs: 'text-xs py-1 px-2',
        sm: 'text-sm py-1.5 px-3',
        md: 'text-base py-2 px-4',
        lg: 'text-lg py-2.5 px-5',
        xl: 'text-xl py-3 px-6',
    };

    const radiusStyles = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileNames, setFileNames] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const namesArray = Array.from(files).map(file => file.name);
            setFileNames(namesArray);
            if (onChange) onChange(event);
        }
    };

    const clearFiles = () => {
        setFileNames([]);
        if (onChange) onChange({ target: { files: null } } as any);
    };

    return (
        <div className="w-full flex flex-col gap-2">
            {label && (
                <label className={clsx("font-medium text-gray-700", labelClassName)}>
                    {label}
                    {withAsterisk && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {description && (
                <p className={clsx("text-xs text-gray-500", descriptionClassName)}>
                    {description}
                </p>
            )}

            <div className="w-full relative flex items-center">
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple={multiple}
                    {...inputProps}
                    onChange={handleFileChange}
                />
                {/* Visible Text Input */}
                <div
                    className={clsx(
                        'w-full cursor-pointer focus-visible:!outline-none bg-gray-50 border border-gray-300 text-gray-900 focus:ring-gray-300',
                        sizeStyles[size],
                        radiusStyles[radius],
                        className,
                        "w-full p-2"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {fileNames.length > 0 ? fileNames.join(', ') : placeholder}
                </div>
                {
                    clearable && fileNames.length > 0 && (
                        <IconX
                            className="absolute right-2 cursor-pointer text-gray-500"
                            onClick={clearFiles}
                        />
                    )
                }
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export { Fileinput };
