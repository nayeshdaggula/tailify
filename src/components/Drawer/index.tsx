import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type DrawerProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    position?: 'left' | 'right' | 'top' | 'bottom';
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    padding?: string;
    withCloseButton?: boolean;
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
    withCloseButton = true,
}) => {
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        let portal = document.querySelector('[data-drawer-portal]') as HTMLElement | null;

        if (!portal) {
            portal = document.createElement('div');
            portal.setAttribute('data-drawer-portal', 'true');
            document.body.appendChild(portal);
        }

        setPortalRoot(portal);

        return () => {
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
        if (closeOnClickOutside && portalRoot && event.target === portalRoot) {
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

    const sizeMap: Record<string, string> = {
        xs: '20rem',
        sm: '24rem',
        md: '32rem',
        lg: '48rem',
        xl: '64rem',
    };

    const widthStyle = size in sizeMap ? sizeMap[size] : size; // Allow both preset and custom sizes

    const positionClasses: Record<string, string> = {
        left: `inset-y-0 left-0 transform ${open ? 'translate-x-0' : '-translate-x-full'}`,
        right: `inset-y-0 right-0 transform ${open ? 'translate-x-0' : 'translate-x-full'}`,
        top: `inset-x-0 top-0 transform ${open ? 'translate-y-0' : '-translate-y-full'}`,
        bottom: `inset-x-0 bottom-0 transform ${open ? 'translate-y-0' : 'translate-y-full'}`,
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ease-in-out">
            <div
                className={`fixed bg-white shadow-lg ${positionClasses[position]} ${padding} transition-transform duration-300 ease-in-out`}
                style={{ width: widthStyle }} // Apply width dynamically
            >
                {withCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
                    >
                        ✕
                    </button>
                )}
                <div className="mt-10">{children}</div>
            </div>
        </div>,
        portalRoot
    );
};

export { Drawer };
