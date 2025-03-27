import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface LoaderProps {
    type?: 'dots' | 'oval' | 'bars';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'amber' | 'orange';
    style?: React.CSSProperties;
    className?: string;
    [key: string]: any;
}

const Loader: React.FC<LoaderProps> = ({
    type = 'dots',
    size = 'sm',
    color = 'blue',
    style,
    className,
    ...props
}) => {
    const sizeClasses = {
        xs: 'w-2 h-2', sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12'
    };

    const colorClasses = {
        gray: 'bg-gray-800', red: 'bg-red-800', pink: 'bg-pink-800', 
        grape: 'bg-purple-800', violet: 'bg-violet-800', indigo: 'bg-indigo-800', 
        blue: 'bg-blue-800', cyan: 'bg-cyan-800', teal: 'bg-teal-800', 
        green: 'bg-green-800', lime: 'bg-lime-800', yellow: 'bg-yellow-800', 
        amber: 'bg-amber-800', orange: 'bg-orange-800'
    };

    const mergedStyles = { height: '20px', ...style };
    const colorClass = colorClasses[color] || 'bg-current';
    const sizeClass = sizeClasses[size] || sizeClasses['sm'];

    if (type === 'oval') {
        let newSizeclass
        if (size === 'xl') {
            newSizeclass = 'w-16 h-16 border-6';
        } else if (size === 'lg') {
            newSizeclass = 'w-12 h-12 border-5';
        } else if (size === 'md') {
            newSizeclass = 'w-8 h-8 border-4';
        } else if (size === 'sm') {
            newSizeclass = 'w-6 h-6 border-2';
        } else if (size === 'xs') {
            newSizeclass = 'w-4 h-4 border-2';
        } else {
            newSizeclass = 'w-6 h-6 border-2';
        }

        let newColorclass;
        if (color === 'gray') {
            newColorclass = 'border-gray-800';
        } else if (color === 'red') {
            newColorclass = 'border-red-800';
        } else if (color === 'pink') {
            newColorclass = 'border-pink-800';
        } else if (color === 'grape') {
            newColorclass = 'border-purple-800';
        } else if (color === 'violet') {
            newColorclass = 'border-violet-800';
        } else if (color === 'indigo') {
            newColorclass = 'border-indigo-800';
        } else if (color === 'blue') {
            newColorclass = 'border-blue-800';
        } else if (color === 'cyan') {
            newColorclass = 'border-cyan-800';
        } else if (color === 'teal') {
            newColorclass = 'border-teal-800';
        } else if (color === 'green') {
            newColorclass = 'border-green-800';
        } else if (color === 'lime') {
            newColorclass = 'border-lime-800';
        } else if (color === 'yellow') {
            newColorclass = 'border-yellow-800';
        } else if (color === 'amber') {
            newColorclass = 'border-amber-800';
        } else if (color === 'orange') {
            newColorclass = 'border-orange-800';
        } else {
            newColorclass = 'border-current';
        }

        return (
            <div
                className={clsx(
                    'rounded-full border-t-transparent animate-spin',
                    newSizeclass,
                    newColorclass,
                    className
                )}
                style={{ backgroundColor: 'transparent' }}
                {...props}
            ></div>
        );
    }

    if (type === 'dots') {
        return (
            <div className={clsx('flex space-x-1', className)} style={mergedStyles} {...props}>
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={clsx('rounded-full', sizeClass, colorClass)}
                        initial={{ y: 0 }}
                        animate={{ y: ['0%', '-50%', '0%'] }}
                        transition={{ duration: 0.6, ease: 'easeInOut', repeat: Infinity, delay: i * 0.2 }}
                    />
                ))}
            </div>
        );
    }

    if (type === 'bars') {
        return (
            <div className={clsx('flex space-x-1', className)} style={mergedStyles} {...props}>
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={clsx('rounded', colorClass)}
                        initial={{ height: '20%' }}
                        animate={{ height: ['20%', '100%', '20%'] }}
                        transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity, delay: i * 0.2 }}
                        style={{ width: '10px' }}
                    />
                ))}
            </div>
        );
    }

    return null;
};

export { Loader };