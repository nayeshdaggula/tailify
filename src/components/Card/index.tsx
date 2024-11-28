import React from 'react';
import clsx from 'clsx';

// Define the types for Card props
interface CardProps {
  children: React.ReactNode;
  padding?: string;
  margin?: string; 
  radius?: string | number;
  shadow?: string; 
  withBorder?: boolean;
  className?: string;
}

// Define the types for Card.Section props
interface CardSectionProps {
  children: React.ReactNode;
  inheritPadding?: boolean;
  withBorder?: boolean;
  padding?: string;
  margin?: string;
  className?: string;
}

// Main Card component
const Card: React.FC<CardProps> & { Section: React.FC<CardSectionProps> } = ({
  children,
  padding = 'p-4',
  margin = 'm-0',
  radius = 'rounded-lg',
  shadow = 'shadow-none',
  withBorder = false,
  className,
  ...props
}) => {
  const cardClasses = clsx(
    'w-full h-auto bg-white',
    padding,
    margin,
    radius,
    shadow,
    {
      'border border-gray-300': withBorder,
    },
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card.Section component
const CardSection: React.FC<CardSectionProps> = ({
  children,
  inheritPadding = false,
  withBorder = false,
  padding = 'p-4',
  margin = 'm-0',
  className,
  ...props
}) => {
  const sectionClasses = clsx(
    'border-b border-gray-300', // Default bottom border
    padding,
    margin,
    {
      'pl-4 pr-4': inheritPadding, // Inherit left and right padding from Card
      'border-t border-gray-300': withBorder,
    },
    className
  );

  return (
    <div className={sectionClasses} {...props}>
      {children}
    </div>
  );
};

Card.Section = CardSection;

export { Card };