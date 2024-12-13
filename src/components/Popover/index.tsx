import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

type ArrowPosition = 'top' | 'bottom' | 'left' | 'right';
type FloatingPosition = 'top' | 'bottom' | 'left' | 'right'; // Removed 'center'

interface PopoverProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    children: React.ReactNode;
    arrowOffset?: number;
    arrowPosition?: ArrowPosition;
    arrowRadius?: number;
    arrowSize?: number;
    clickOutsideEvents?: string[];
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    defaultOpened?: boolean;
    disabled?: boolean;
    id?: string;
    keepMounted?: boolean;
    offset?: number;
    onChange?: (opened: boolean) => void;
    onClose?: () => void;
    onOpen?: () => void;
    opened?: boolean;
    position?: FloatingPosition;
    radius?: number | string;
    returnFocus?: boolean;
    shadow?: string;
    trapFocus?: boolean;
    width?: number | string;
    withArrow?: boolean;
    zIndex?: number;
    withinPortal?: boolean;
}

const Popover: React.FC<PopoverProps> & {
    Target: React.FC<PopoverTargetProps>;
    Dropdown: React.FC<PopoverDropdownProps>;
} = ({
    children,
    arrowOffset = 5,
    arrowSize = 7,
    closeOnClickOutside = true,
    closeOnEscape = true,
    defaultOpened,
    disabled = false,
    offset = 8,
    onChange,
    onClose,
    onOpen,
    opened,
    position = 'bottom',
    radius,
    returnFocus = false,
    shadow = 'md',
    trapFocus = false,
    width = 'max-content',
    withArrow = false,
    zIndex = 300,
    className,
    ...props
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(defaultOpened || false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const togglePopover = () => {
        if (disabled) return;
        const newState = !isOpen;
        setIsOpen(newState);
        onChange?.(newState);
        if (newState) {
            onOpen?.();
        } else {
            onClose?.();
        }
    };

    const closePopover = () => {
        setIsOpen(false);
        onChange?.(false);
        onClose?.();
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            closeOnClickOutside &&
            popoverRef.current &&
            !popoverRef.current.contains(event.target as Node)
        ) {
            closePopover();
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (closeOnEscape && event.key === 'Escape') {
            closePopover();
        }
    };

    useEffect(() => {
        if (typeof opened === 'boolean') {
            setIsOpen(opened);
        }
    }, [opened]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div ref={popoverRef} className={clsx('relative', className)} {...props}>
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;

                if (child.type === Popover.Target) {
                    return React.cloneElement(child as React.ReactElement<PopoverTargetProps>, {
                        togglePopover,
                    });
                }

                if (child.type === Popover.Dropdown) {
                    return React.cloneElement(child as React.ReactElement<PopoverDropdownProps>, {
                        isOpen,
                        position,
                        withArrow,
                        arrowSize,
                        arrowOffset,
                        radius,
                        shadow,
                        zIndex,
                        width,
                    });
                }

                return child;
            })}
        </div>
    );
};

interface PopoverTargetProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    togglePopover?: () => void;
}

Popover.Target = ({ children, togglePopover, className, ...props }: PopoverTargetProps) => {
    return (
        <div
            className={clsx('popover-target', className)}
            onClick={togglePopover}
            {...props}
        >
            {children}
        </div>
    );
};

interface PopoverDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    isOpen?: boolean;
    position?: FloatingPosition;
    withArrow?: boolean;
    arrowSize?: number;
    arrowOffset?: number;
    radius?: number | string;
    shadow?: string;
    zIndex?: number;
    width?: number | string;
}

Popover.Dropdown = ({
    children,
    isOpen,
    position = 'bottom',
    withArrow = false,
    arrowSize = 7,
    arrowOffset = 5,
    radius,
    shadow = 'md',
    zIndex = 300,
    width = 'max-content',
    className,
    ...props
}: PopoverDropdownProps) => {
    if (!isOpen) return null;

    const positionClasses = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
    };

    return (
        <div
            className={clsx(
                'absolute z-10 bg-white border border-gray-200 rounded p-2',
                positionClasses[position],
                shadow && `shadow-${shadow}`,
                className
            )}
            style={{
                width,
                zIndex,
                borderRadius: radius,
            }}
            {...props}
        >
            {withArrow && (
                <div
                    className={clsx(
                        'absolute w-3 h-3 bg-white border border-gray-200',
                        {
                            'top-[-6px] left-1/2 -translate-x-1/2 rotate-45': position === 'bottom',
                            'bottom-[-6px] left-1/2 -translate-x-1/2 rotate-45': position === 'top',
                            'right-[-6px] top-1/2 -translate-y-1/2 rotate-45': position === 'left',
                            'left-[-6px] top-1/2 -translate-y-1/2 rotate-45': position === 'right',
                        }
                    )}
                    style={{
                        width: arrowSize,
                        height: arrowSize,
                        zIndex: zIndex - 1,
                        margin: arrowOffset,
                    }}
                />
            )}
            {children}
        </div>
    );
};

export { Popover };
