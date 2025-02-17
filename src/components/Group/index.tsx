import React from "react";
import clsx from "clsx";

interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: "xl" | "lg" | "md" | "sm" | "xs"; // Gap between elements
  grow?: boolean; // If true, all items should grow equally in one line
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
}

const Group: React.FC<GroupProps> = ({
  children,
  gap = "md",
  grow = false,
  justify = "flex-start",
  className,
  ...props
}) => {

  const getJustifyclass = (justify: string) => {
    switch (justify) {
      case "flex-start":
        return "justify-start";
      case "center":
        return "justify-center";
      case "flex-end":
        return "justify-end";
      case "space-between":
        return "justify-between";
      default:
        return "justify-start";
    }
  }

  const gapClasses = (gap: string) => {
    switch (gap) {
      case "xl":
        return "gap-8";
      case "lg":
        return "gap-6";
      case "md":
        return "gap-4";
      case "sm":
        return "gap-2";
      case "xs":
        return "gap-1";
      default:
        return "gap-4";
    }
  }

  const groupClasses = clsx(
    "flex", // Set display to flex
    gapClasses(gap), // Set gap between
    grow ? "flex-nowrap justify-between" : `${getJustifyclass(justify)}`, 
    className // Allows for additional custom classes
  );

  return (
    <div className={groupClasses} {...props}>
      {React.Children.map(children, (child) =>
        grow && React.isValidElement(child) ? (
          <div className="flex-grow">{child}</div>
        ) : (
          child
        )
      )}
    </div>
  );
};

export { Group };
