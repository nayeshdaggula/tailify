import React from 'react';
import { useTailify } from '../TailifyProvider';
import clsx from 'clsx'; // Install clsx for cleaner class merging

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | string; // Allow custom sizes like '30%', '100px'
    padding?: string; // Custom padding (e.g., 'p-4', 'px-6 py-8', 'p-[20px]')
    margin?: string; // Custom margin (e.g., 'm-4', 'mt-2 mb-6', 'm-[10px]')
}

const Container: React.FC<ContainerProps> = ({
    children,
    size = 'md',
    padding = 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
    margin = 'mx-auto',
    className,
    ...props
}) => {
    const { themeVariant } = useTailify(); // Get theme from context

    // Determine the size class
    const sizeClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    }[size] || (size.endsWith('%') || size.endsWith('px') ? `w-[${size}]` : 'max-w-md');

    return (
        <div
            className={clsx(
                'container', 
                margin, 
                padding, 
                sizeClass, 
                themeVariant === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export { Container };