import React from "react";
import clsx from "clsx";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: "xl" | "lg" | "md" | "sm" | "xs";
  align?: "stretch" | "center" | "flex-start" | "flex-end";
  justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around";
}

const Stack: React.FC<StackProps> = ({
  children,
  gap = "md",
  align = "stretch",
  justify = "flex-start",
  className,
  ...props
}) => {
  const getJustifyClass = (justify: string) => {
    switch (justify) {
      case "center":
        return "justify-center";
      case "flex-start":
        return "justify-start";
      case "flex-end":
        return "justify-end";
      case "space-between":
        return "justify-between";
      case "space-around":
        return "justify-around";
      default:
        return "justify-start";
    }
  };

  const getAlignClass = (align: string) => {
    switch (align) {
      case "stretch":
        return "items-stretch";
      case "center":
        return "items-center";
      case "flex-start":
        return "items-start";
      case "flex-end":
        return "items-end";
      default:
        return "items-stretch";
    }
  };

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
  };

  const stackClasses = clsx(
    "flex flex-col",
    gapClasses(gap),
    getAlignClass(align),
    getJustifyClass(justify),
    className
  );

  return (
    <div className={stackClasses} {...props}>
      {children}
    </div>
  );
};

export { Stack };
