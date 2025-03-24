import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import ReactDOM from "react-dom";

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
  const [isOpen, setIsOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div
      ref={parentRef}
      className={clsx("relative inline-block w-fit", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) &&
        (child.type as any).displayName &&
        ["HovercardTarget", "HovercardBody"].includes((child.type as any).displayName)
          ? React.cloneElement(child as React.ReactElement<any>, { isOpen, parentRef })
          : child
      )}
    </div>
  );
};

interface TargetProps {
  children: React.ReactNode;
  className?: string;
}

const Target: React.FC<TargetProps & { isOpen?: boolean }> = ({ children, className }) => {
  return <div className={clsx("cursor-pointer", className)}>{children}</div>;
};

Target.displayName = "HovercardTarget";

interface BodyProps {
  children: React.ReactNode;
  className?: string;
  withPortal?: boolean;
  isOpen?: boolean;
  parentRef?: React.RefObject<HTMLDivElement>;
}

const Body: React.FC<BodyProps> = ({ children, className, withPortal = true, isOpen, parentRef }) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (withPortal) {
      let portal = document.querySelector('[data-portal="true"]') as HTMLElement | null;
      if (!portal) {
        portal = document.createElement("div");
        portal.setAttribute("data-portal", "true");
        document.body.appendChild(portal);
      }
      setPortalRoot(portal);
    }
  }, [withPortal]);

  useEffect(() => {
    const updatePosition = () => {
      if (parentRef?.current && bodyRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        const bodyWidth = bodyRef.current.offsetWidth || 200;
        const bodyHeight = bodyRef.current.offsetHeight || 100;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const GAP = 8;

        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        const showAbove = spaceBelow < bodyHeight + GAP && spaceAbove > bodyHeight + GAP;
        const topPosition = showAbove
          ? rect.top + window.scrollY - bodyHeight - GAP
          : rect.bottom + window.scrollY + GAP;

        let leftPosition = rect.left + rect.width / 2 - bodyWidth / 2 + window.scrollX;

        if (leftPosition < 10) leftPosition = 10;
        if (leftPosition + bodyWidth > viewportWidth) leftPosition = viewportWidth - bodyWidth - 10;

        setStyle({
          position: "absolute",
          top: `${topPosition}px`,
          left: `${leftPosition}px`,
          zIndex: 999,
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, parentRef]);

  const rect = parentRef?.current?.getBoundingClientRect() || { bottom: 0 };
  const bodyContent = isOpen ? (
    <div
      ref={bodyRef}
      style={style}
      className={clsx(
        "absolute w-48 border border-gray-300 rounded-lg bg-white p-4 shadow-lg transition-opacity duration-200",
        "dark:bg-gray-800 dark:border-gray-700 dark:shadow-lg",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        style.top && parseFloat(style.top as string) > rect.bottom + window.scrollY ? "mb-2" : "mt-2",
        className
      )}
    >
      {children}
    </div>
  ) : null;

  return withPortal && portalRoot ? ReactDOM.createPortal(bodyContent, portalRoot) : bodyContent;
};

Body.displayName = "HovercardBody";

Hovercard.Target = Target;
Hovercard.Body = Body;

export { Hovercard };