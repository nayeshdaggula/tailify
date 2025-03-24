import { IconX } from '@tabler/icons-react';
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
    title?: string;
    zIndex?: number;
    mainWrapperClass?: string;
    mainBodyClass?: string;
    mainHeaderClass?: string;
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
    title = '',
    zIndex = 50,
    mainWrapperClass = '',
    mainBodyClass = '',
    mainHeaderClass = '',
}) => {
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {        
        let portal = document.querySelector('[data-drawerportal="true"]') as HTMLElement | null;

        if (!portal) {
            portal = document.createElement('div');
            portal.setAttribute('data-drawerportal', 'true');
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

    const widthStyle = size in sizeMap ? sizeMap[size] : size;

    const positionClasses: Record<string, string> = {
        left: `inset-y-0 left-0 transform ${open ? 'translate-x-0' : '-translate-x-full'}`,
        right: `inset-y-0 right-0 transform ${open ? 'translate-x-0' : 'translate-x-full'}`,
        top: `inset-x-0 top-0 transform ${open ? 'translate-y-0' : '-translate-y-full'}`,
        bottom: `inset-x-0 bottom-0 transform ${open ? 'translate-y-0' : 'translate-y-full'}`,
    };

    return ReactDOM.createPortal(
        <div className={`drawer-overlaywrapper fixed inset-0 z-50 bg-black/50 dark:bg-black/70 transition-opacity duration-300 ease-in-out ${mainWrapperClass}`}>
            <div
                className={`drawer-mainwrapper fixed bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg ${positionClasses[position]} ${padding} transition-transform duration-300 ease-in-out`}
                style={{ 
                    width: widthStyle,
                    zIndex: zIndex,
                 }}
                data-drawer="true"
            >
                {(title || withCloseButton) && (
                    <header className={`drawer-header flex items-center ${title ? 'justify-between' : 'justify-end'} mb-4 px-3 ${mainHeaderClass}`}>
                        {title && <h2 className="drawer-headertitle text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h2>}
                        {withCloseButton && (
                            <IconX
                                size={'20px'}
                                color="currentColor"
                                onClick={onClose} 
                                className='drawer-headericon cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            />
                        )}
                    </header>
                )}
                <div className={`drawer-body overflow-y-auto h-full overflow-x-hidden pb-[60px] ${mainBodyClass}`}>
                    {children}
                </div>
            </div>
        </div>,
        portalRoot
    );
};

export { Drawer };
