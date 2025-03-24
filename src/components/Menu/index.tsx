import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  CSSProperties,
} from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

type FloatingPosition = 'top' | 'bottom' | 'left' | 'right';
type MenuTrigger = 'hover' | 'click' | 'click-hover';

interface TransitionProps {
  duration?: number;
  timingFunction?: string;
  delay?: number;
}

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
  onChange?: (opened: boolean) => void;
  onClose?: () => void;
  onOpen?: () => void;
  opened?: boolean;
  position?: FloatingPosition;
  radius?: number | string;
  shadow?: string;
  trigger?: MenuTrigger;
  width?: number | string;
  zIndex?: number;
  withPortal?: boolean;
  transitionProps?: TransitionProps;
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
  onChange,
  onClose,
  onOpen,
  opened,
  position = 'bottom',
  radius,
  shadow = 'md',
  trigger = 'click',
  width = 'max-content',
  zIndex = 300,
  className,
  withPortal = false,
  transitionProps,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpened || false);

  // We'll store the inline style for our Dropdown when withPortal is true
  const [portalStyle, setPortalStyle] = useState<CSSProperties>({});

  // A ref for the entire menu container (for click-outside checks)
  const menuRef = useRef<HTMLDivElement>(null);

  // A ref for the actual trigger element so we can measure it
  const targetRef = useRef<HTMLDivElement>(null!);

  const toggleMenu = useCallback(() => {
    if (disabled) return;
    const newState = !isOpen;
    setIsOpen(newState);
    onChange?.(newState);

    if (newState) {
      onOpen?.();

      // If using a portal, measure the trigger so we can position the dropdown
      if (withPortal && targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();

        // Simple example of placing the dropdown below the trigger:
        const top = rect.bottom + window.scrollY;
        const left = rect.left + window.scrollX;

        setPortalStyle({
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: typeof width === 'number' ? `${width}px` : (rect.width + 'px'),
          zIndex: zIndex,
        });
      }
    } else {
      onClose?.();
    }
  }, [isOpen, disabled, onChange, onOpen, onClose, width, zIndex, withPortal]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    onChange?.(false);
    onClose?.();
  }, [onChange, onClose]);

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

  // Control from outside if `opened` is explicitly passed
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
  }, [handleClickOutside, handleKeyDown]);

  return (
    <div
      ref={menuRef}
      className={clsx('relative inline-block', className)} // inline-block ensures the parent wraps the target
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // If it's the Target, pass the toggle function + a ref
        if (child.type === Menu.Target) {
          return React.cloneElement(child as React.ReactElement<MenuTargetProps>, {
            toggleMenu,
            targetRef,
          });
        }

        // If it's the Dropdown, pass the isOpen + position + style info
        if (child.type === Menu.Dropdown) {
          return React.cloneElement(child as React.ReactElement<MenuDropdownProps>, {
            isOpen,
            position,
            arrowSize,
            arrowOffset,
            radius,
            shadow,
            zIndex,
            width,
            withPortal,
            // When using a portal, we override the position with `portalStyle`
            portalStyle: withPortal ? portalStyle : undefined,
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
  targetRef?: React.RefObject<HTMLDivElement>;
}

Menu.Target = ({ children, toggleMenu, targetRef, className, ...props }: MenuTargetProps) => {
  return (
    <div
      ref={targetRef}
      className={clsx('menu-target cursor-pointer', className)}
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
  arrowSize?: number;
  arrowOffset?: number;
  radius?: number | string;
  shadow?: string;
  zIndex?: number;
  width?: number | string;
  withPortal?: boolean;
  portalStyle?: React.CSSProperties; // inline style from parent if using portal
}

Menu.Dropdown = ({
  children,
  isOpen,
  position = 'bottom',
  arrowSize = 7,
  arrowOffset = 5,
  radius,
  shadow = 'md',
  zIndex = 300,
  width = 'max-content',
  withPortal = false,
  portalStyle,
  className,
  ...props
}: MenuDropdownProps) => {
  if (!isOpen) return null;

  // Synchronously create/retrieve the portal container when withPortal is true.
  const portalRoot = useMemo(() => {
    if (withPortal) {
      let portal = document.querySelector('[data-portal="true"]') as HTMLElement | null;
      if (!portal) {
        portal = document.createElement('div');
        portal.setAttribute('data-portal', 'true');
        document.body.appendChild(portal);
      }
      return portal;
    }
    return null;
  }, [withPortal]);

  // For non-portal usage, you can still anchor the dropdown using utility classes
  const positionClasses = {
    top: 'left-0 bottom-full mb-2',
    bottom: 'left-0 top-full mt-2',
    left: 'right-full mr-2 top-0',
    right: 'left-full ml-2 top-0',
  };

  const dropdownContent = (
    <div
      // If we are not using a portal, rely on relative positioning classes
      // If we are using a portal, rely on the inline `portalStyle`
      className={clsx(
        'absolute z-10 bg-white border border-gray-200 rounded p-2 dark:bg-gray-800 dark:border-gray-600',
        !withPortal && positionClasses[position],
        shadow && `shadow-${shadow}`,
        className
      )}
      style={{
        ...(withPortal ? portalStyle : {}),
        borderRadius: radius,
      }}
      {...props}
    >
      {children}
    </div>
  );

  if (withPortal && portalRoot) {
    return ReactDOM.createPortal(dropdownContent, portalRoot);
  }
  return dropdownContent;
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
    if (closeMenuOnClick) {
      const menuElement = event.currentTarget.closest('[data-menu]') as HTMLDivElement | null;
      if (menuElement) {
        const closeMenuEvent = new CustomEvent('closeMenu');
        menuElement.dispatchEvent(closeMenuEvent);
      }
    }
  };

  return (
    <li
      className={clsx(
        'flex items-center justify-between px-3 py-2 cursor-pointer rounded hover:bg-gray-100',
        'dark:hover:bg-gray-700',
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