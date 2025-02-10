import React from 'react';
import clsx from 'clsx';

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: string; // Tailwind gap utility (e.g., 'gap-4', 'gap-2')
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
}

const Flex: React.FC<FlexProps> = ({
  children,
  gap = 'gap-4',
  justify = 'flex-start',
  align = 'flex-start',
  wrap = 'nowrap',
  direction = 'row',
  className,
  ...props
}) => {
  // Map the justify prop to the corresponding Tailwind class
  const justifyClassMap: { [key: string]: string } = {
    'flex-start': 'justify-start',
    'center': 'justify-center',
    'flex-end': 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly',
  };

  // Map the align prop to the corresponding Tailwind class
  const alignClassMap: { [key: string]: string } = {
    'flex-start': 'items-start',
    'center': 'items-center',
    'flex-end': 'items-end',
    'stretch': 'items-stretch',
    'baseline': 'items-baseline',
  };

  const flexClasses = clsx(
    'flex', // Set display to flex
    gap,
    justifyClassMap[justify] || 'justify-start', // Use map to get Tailwind class
    alignClassMap[align] || 'items-start', // Use map to get Tailwind class
    wrap === 'nowrap' ? 'flex-nowrap' : wrap === 'wrap' ? 'flex-wrap' : 'flex-wrap-reverse', // Handle wrap
    direction === 'row' ? 'flex-row' : direction === 'column' ? 'flex-col' : direction === 'row-reverse' ? 'flex-row-reverse' : 'flex-col-reverse', // Handle direction
    className // Allows for additional custom classes
  );

  return (
    <div className={flexClasses} {...props}>
      {children}
    </div>
  );
};

export { Flex };
