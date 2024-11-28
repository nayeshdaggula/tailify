import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type DrawerProps = {
    open: boolean; // Whether the drawer is open
    onClose: () => void; // Function to close the drawer
    children: React.ReactNode; // Drawer content
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    position?: 'left' | 'right' | 'top' | 'bottom'; // Position of the drawer
    closeOnClickOutside?: boolean; // Close the drawer when clicking outside
    closeOnEscape?: boolean; // Close the drawer when pressing Escape
    padding?: string; // Custom padding classes
};

const Drawer: React.FC<DrawerProps> = ({
    open,
    onClose,
    children,
    size = 'md',
    position = 'right',
    closeOnClickOutside = true,
    closeOnEscape = true,
    padding = 'p-4',
}) => {
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Locate or create the portal container
        let portal = document.querySelector('[data-drawer-portal="true"]') as HTMLElement | null;

        if (!portal) {
            portal = document.createElement('div');
            portal.setAttribute('data-drawer-portal', 'true');
            document.body.appendChild(portal);
        }

        setPortalRoot(portal);

        return () => {
            // Optional: Clean up dynamically created portal
            if (portal && document.body.contains(portal)) {
                document.body.removeChild(portal);
            }
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (closeOnEscape && event.key === 'Escape' && open) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
        } else {
            document.removeEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open, closeOnEscape, onClose]);

    const handleClickOutside = (event: MouseEvent) => {
        if (closeOnClickOutside && event.target === portalRoot) {
            onClose();
        }
    };

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, closeOnClickOutside]);

    if (!portalRoot || !open) return null;

    // Drawer size and position classes
    const sizeClasses: Record<string, string> = {
        xs: 'w-[20rem]',
        sm: 'w-[24rem]',
        md: 'w-[32rem]',
        lg: 'w-[48rem]',
        xl: 'w-[64rem]',
    };

    const positionClasses: Record<string, string> = {
        left: `inset-y-0 left-0 transform ${open ? 'translate-x-0' : '-translate-x-full'}`,
        right: `inset-y-0 right-0 transform ${open ? 'translate-x-0' : 'translate-x-full'}`,
        top: `inset-x-0 top-0 transform ${open ? 'translate-y-0' : '-translate-y-full'}`,
        bottom: `inset-x-0 bottom-0 transform ${open ? 'translate-y-0' : 'translate-y-full'}`,
    };

    const drawerSize = sizeClasses[size] || `w-[${size}]`;
    const drawerPosition = positionClasses[position];

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ease-in-out">
            <div
                className={`fixed bg-white shadow-lg ${drawerSize} ${drawerPosition} ${padding} transition-transform duration-300 ease-in-out`}
            >
                {children}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
            </div>
        </div>,
        portalRoot
    );
};

export { Drawer };
