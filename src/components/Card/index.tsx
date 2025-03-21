import React from 'react';
import clsx from 'clsx';
// import { useTailify } from '../TailifyProvider';

// Define the types for Card props
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Define the types for Card.Section props
interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

// Main Card component
const Card: React.FC<CardProps> & { Section: React.FC<CardSectionProps> } = ({
  children,
  className,
  ...props
}) => {
  // const { themeVariant } = useTailify(); // Get theme from context

  const cardClasses = clsx(
    `flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70`,
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
  className,
  ...props
}) => {
  const sectionClasses = clsx(
    'border-b border-gray-300',
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