import React from "react";
import clsx from "clsx";

// Define the types for Card props
interface CardProps {
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
  padding?: string;
}

// Define the types for Card.Section props
interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
  padding?: string;
}

// Card.Section component
const CardSection: React.FC<CardSectionProps> = ({
  children,
  className,
  withBorder = false,
  padding = "p-4",
  ...props
}) => {
  const sectionClasses = clsx(
    withBorder && "border-b border-gray-300 dark:border-neutral-700",
    className,
    padding
  );

  return (
    <div className={sectionClasses} {...props}>
      {children}
    </div>
  );
};

// Main Card component
const Card: React.FC<CardProps> & { Section: React.FC<CardSectionProps> } = ({
  children,
  className,
  withBorder = true,
  padding = "p-4",
  ...props
}) => {
  let newPadding;
  let newPaddingStyle: React.CSSProperties | undefined;

  if (padding.includes("px") || padding.includes("%")) {
    newPadding = "";
    newPaddingStyle = { padding };
  } else {
    newPadding = padding;
    newPaddingStyle = undefined;
  }

  const cardClasses = clsx(
    "flex flex-col shadow-2xs rounded-xl transition-all duration-300",
    "bg-white dark:bg-neutral-900",
    withBorder && "border border-gray-200 dark:border-neutral-700",
    newPadding,
    className
  );

  // Convert children to an array for manipulation
  const childrenArray = React.Children.toArray(children);

  // Process children to remove border from last Card.Section
  const processedChildren = childrenArray.map((child, index) => {
    if (React.isValidElement(child) && child.type === CardSection) {
      const isLastChild = index === childrenArray.length - 1;
      return React.cloneElement(child as React.ReactElement<CardSectionProps>, {
        withBorder: !isLastChild, // Remove border for last Card.Section
      });
    }
    return child;
  });

  return (
    <div className={cardClasses} {...props} style={newPaddingStyle}>
      {processedChildren}
    </div>
  );
};

Card.Section = CardSection;

export { Card };