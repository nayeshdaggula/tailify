import React from "react";
import clsx from "clsx";

interface HovercardProps {
  children: React.ReactNode;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

interface HovercardComponent extends React.FC<HovercardProps> {
  Target: React.FC<TargetProps>;
  Body: React.FC<BodyProps>;
}

const Hovercard: HovercardComponent = ({ children, className, onOpen, onClose }) => {
  const handleMouseEnter = () => {
    if (onOpen) {
      onOpen();
    }
  };

  const handleMouseLeave = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={clsx("group relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

interface TargetProps {
  children: React.ReactNode;
  className?: string;
}

const Target: React.FC<TargetProps> = ({ children, className }) => {
  return <div className={clsx("cursor-pointer", className)}>{children}</div>;
};

interface BodyProps {
  children: React.ReactNode;
  className?: string;
}

const Body: React.FC<BodyProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "absolute left-1/2 top-full mt-2 w-48 -translate-x-1/2 rounded-lg bg-white p-4 shadow-lg opacity-0 transition-opacity group-hover:opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
};

Hovercard.Target = Target;
Hovercard.Body = Body;

export { Hovercard };
