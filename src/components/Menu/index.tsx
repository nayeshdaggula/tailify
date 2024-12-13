import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

type FloatingPosition = 'top' | 'bottom' | 'left' | 'right';
type MenuTrigger = 'hover' | 'click' | 'click-hover';

interface MenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    children: React.ReactNode;
    arrowOffset?: number;
    arrowSize?: number;
    arrowRadius?: number;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    closeOnItemClick?: boolean;
    defaultOpened?: boolean;
    disabled?: boolean;
    offset?: number;
    onChange?: (opened: boolean) => void;
    onClose?: () => void;
    onOpen?: () => void;
    opened?: boolean;
    position?: FloatingPosition;
    radius?: number | string;
    shadow?: string;
    trigger?: MenuTrigger;
    width?: number | string;
    withArrow?: boolean;
    zIndex?: number;
    withinPortal?: boolean;
    transitionProps?: any; // Placeholder for transition animation props
}

const Menu: React.FC<MenuProps> & {
    Target: React.FC<MenuTargetProps>;
    Dropdown: React.FC<MenuDropdownProps>;
    Label: React.FC<MenuLabelProps>;
    Item: React.FC<MenuItemProps>;
} = ({
    children,
    arrowOffset = 5,
    arrowSize = 7,
    closeOnClickOutside = true,
    closeOnEscape = true,
    closeOnItemClick = true,
    defaultOpened,
    disabled = false,
    offset = 8,
    onChange,
    onClose,
    onOpen,
    opened,
    position = 'bottom',
    radius,
    shadow = 'md',
    trigger = 'click',
    width = 'max-content',
    withArrow = false,
    zIndex = 300,
    className,
    ...props
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(defaultOpened || false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
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

    const closeMenu = () => {
        setIsOpen(false);
        onChange?.(false);
        onClose?.();
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            closeOnClickOutside &&
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
        ) {
            closeMenu();
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (closeOnEscape && event.key === 'Escape') {
            closeMenu();
        }
    };

    const handleMouseEnter = () => {
        if (trigger === 'hover' || trigger === 'click-hover') {
            setIsOpen(true);
            onChange?.(true);
            onOpen?.();
        }
    };

    const handleMouseLeave = () => {
        if (trigger === 'hover' || trigger === 'click-hover') {
            closeMenu();
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
        <div
            ref={menuRef}
            className={clsx('relative', className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;

                if (child.type === Menu.Target) {
                    return React.cloneElement(child as React.ReactElement<MenuTargetProps>, { toggleMenu });
                }

                if (child.type === Menu.Dropdown) {
                    return React.cloneElement(child as React.ReactElement<MenuDropdownProps>, {
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

interface MenuTargetProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    toggleMenu?: () => void;
}

Menu.Target = ({ children, toggleMenu, className, ...props }: MenuTargetProps) => {
    return (
        <div
            className={clsx('menu-target', className)}
            onClick={toggleMenu}
            {...props}
        >
            {children}
        </div>
    );
};

interface MenuDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
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

Menu.Dropdown = ({
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
}: MenuDropdownProps) => {
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

interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

Menu.Label = ({ children, className, ...props }: MenuLabelProps) => {
    return (
        <div className={clsx('text-sm font-semibold text-gray-700 mb-2', className)} {...props}>
            {children}
        </div>
    );
};

interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
    children: React.ReactNode;
    closeMenuOnClick?: boolean;
    color?: string;
    disabled?: boolean;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
}

Menu.Item = ({
    children,
    closeMenuOnClick = true,
    color,
    disabled,
    leftSection,
    rightSection,
    onClick,
    className,
    ...props
}: MenuItemProps) => {
    const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            if (onClick) onClick(event);
        };

    return (
        <li
            className={clsx(
                'flex items-center justify-between px-3 py-2 cursor-pointer rounded hover:bg-gray-100',
                disabled ? 'cursor-not-allowed opacity-50' : '',
                color && `text-${color}-600`,
                className
            )}
            onClick={handleClick}
            {...props}
        >
            <div className="flex items-center space-x-2">
                {leftSection && <span>{leftSection}</span>}
                <span>{children}</span>
            </div>
            {rightSection && <div>{rightSection}</div>}
        </li>
    );
};

export { Menu };
