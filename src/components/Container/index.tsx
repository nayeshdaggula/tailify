import React from 'react';

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
    ...props
}) => {
    // Function to determine the size class based on the value
    const getSizeClass = (size: string) => {
        switch (size) {
            case 'sm': return 'max-w-sm';
            case 'md': return 'max-w-md';
            case 'lg': return 'max-w-lg';
            case 'xl': return 'max-w-xl';
            default:
                if (size.endsWith('%') || size.endsWith('px')) {
                    return 'w-[' + size +']';
                }
                return 'max-w-md'; // Default size if invalid size is passed
        }
    };

    return (
        <div className={`container ${margin} ${padding} ${getSizeClass(size)}`} {...props}>
            {children}
        </div>
    );
};

export { Container };
