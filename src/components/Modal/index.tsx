import { IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullscreen?: boolean;
    padding?: string;
    margin?: string;
    zIndex?: number;
    withCloseButton?: boolean;
    containerClassName?: string;
    title?: string;
    mainBodyClass?: string;
    mainHeaderClass?: string;
    overlyClassName?: string;
};

const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    children,
    size = 'md',
    fullscreen = false,
    padding = 'p-4',
    margin = 'm-0',
    zIndex = 50,
    withCloseButton = true,
    containerClassName = '',
    title = '',
    mainBodyClass = '',
    mainHeaderClass = '',
    overlyClassName = '',
}) => {
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        let portal = document.querySelector('[data-portal="true"]') as HTMLElement | null;

        if (!portal) {
            portal = document.createElement('div');
            portal.setAttribute('data-portal', 'true');
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
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!portalRoot || !open) return null;

    const sizeClasses = {
        xs: 'w-[320px] min-h-[10rem]',
        sm: 'w-[380px] min-h-[10rem]',
        md: 'w-[440px] min-h-[10rem]',
        lg: 'w-[620px] min-h-[10rem]',
        xl: 'w-[780px] min-h-[10rem]',
    };

    let customWidthHeight: React.CSSProperties = {};
    if (size.includes('%') || size.includes('vw')) {
        sizeClasses[size] = '';
        customWidthHeight = { width: size, minHeight: '10rem' };
    }

    if (fullscreen) {
        sizeClasses[size] = 'w-full h-full';
    }

    return ReactDOM.createPortal(
        <div
            className={`modal-overlaywrapper max-h-[calc(100vh - 0px)] overflow-y-auto fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 ${margin} ${overlyClassName}`}
            style={{ zIndex }}
            data-modal="true"
        >
            <section
                style={customWidthHeight}
                className={`modal-mainwrapper relative bg-white dark:bg-gray-800 rounded-sm shadow-sm ${sizeClasses[size]} ${padding} ${containerClassName}`}
            >
                {(title || withCloseButton) && (
                    <header className={`modal-header flex items-center ${title ? 'justify-between' : 'justify-end'} mb-4 px-3 ${mainHeaderClass}`}>
                        {title && <h2 className="modal-headertitle text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h2>}
                        {withCloseButton && (
                            <IconX
                                size={'20px'}
                                color="currentColor"
                                onClick={onClose}
                                className="modal-headericon cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            />
                        )}
                    </header>
                )}
                <div className={`modal-body overflow-x-hidden overflow-y-auto ${mainBodyClass}`}>
                    {children}
                </div>
            </section>
        </div>,
        portalRoot
    );
};

export { Modal };