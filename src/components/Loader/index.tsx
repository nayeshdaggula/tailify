import React from 'react';
import clsx from 'clsx';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'dots' | 'bars' | 'oval';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'amber' | 'orange';
}

const Loader: React.FC<LoaderProps> = ({
    type = 'dots',
    size = 'sm',
    color = 'blue',
    className,
    ...props
}) => {
    const sizeOvalClasses = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const sizeDotsClasses = {
        xs: 'w-2 h-2',
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
    };

    const sizeBarsClasses = {
        xs: 'w-2 h-8',
        sm: 'w-2 h-10',
        md: 'w-2 h-12',
        lg: 'w-2 h-16',
        xl: 'w-2 h-20',
    };

    const colorClasses = {
        gray: 'border-gray-800',
        red: 'border-red-800',
        pink: 'border-pink-800',
        grape: 'border-purple-800',
        violet: 'border-violet-800',
        indigo: 'border-indigo-800',
        blue: 'border-blue-800',
        cyan: 'border-cyan-800',
        teal: 'border-teal-800',
        green: 'border-green-800',
        lime: 'border-lime-800',
        yellow: 'border-yellow-800',
        amber: 'border-amber-800',
        orange: 'border-orange-800',
    };

    const colorBgClasses = {
        gray: 'bg-gray-800',
        red: 'bg-red-800',
        pink: 'bg-pink-800',
        grape: 'bg-purple-800',
        violet: 'bg-violet-800',
        indigo: 'bg-indigo-800',
        blue: 'bg-blue-800',
        cyan: 'bg-cyan-800',
        teal: 'bg-teal-800',
        green: 'bg-green-800',
        lime: 'bg-lime-800',
        yellow: 'bg-yellow-800',
        amber: 'bg-amber-800',
        orange: 'bg-orange-800',
    };

    let colorClass;
    if (type === 'dots') {
        colorClass = colorBgClasses[color] || 'border-current'
    } else if (type === 'bars') {
        colorClass = colorBgClasses[color] || 'border-current'
    } else {
        colorClass = colorClasses[color] || 'border-current'
    }

    let sizeClass;
    if (type === 'dots') {
        sizeClass = sizeDotsClasses[size] || sizeDotsClasses['sm']
    } else if (type === 'bars') {
        sizeClass = sizeBarsClasses[size] || sizeBarsClasses['sm']
    } else {
        sizeClass = sizeOvalClasses[size] || sizeOvalClasses['sm']
    }   

    if (type === 'oval') {
        return (
            <div
                className={clsx(
                    'rounded-full border-4 border-t-transparent animate-spin',
                    sizeClass,
                    colorClass,
                    className
                )}
                style={{ backgroundColor: 'transparent' }}
                {...props}
            ></div>
        );
    }


    if (type === 'dots') {
        return (
            <div className={clsx('flex space-x-1', className)} {...props}>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            'rounded-full',
                            sizeClass,
                            colorClass,
                            'animate-bounce'
                        )}
                        style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                ))}
            </div>
        );
    }

    if (type === 'bars') {
        return (
            <div className={clsx('flex space-x-1', className)} {...props}>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            'rounded',
                            sizeClass,
                            colorClass
                        )}
                        style={{
                            animation: 'wave 1s ease-in-out infinite',
                            animationDelay: `${i * 0.2}s`,
                            transformOrigin: 'bottom center',
                        }}
                    ></div>
                ))}
            </div>
        );
    }

    return null;
};

// Add keyframes for wave animation
const style = document.createElement('style');
style.textContent = `
@keyframes wave {
    0%, 100% { transform: scaleY(0.4); }
    50% { transform: scaleY(1); }
}`;
document.head.appendChild(style);

export { Loader };