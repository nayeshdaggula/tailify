import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
    open: boolean; // Whether the modal is open
    onClose: () => void; // Function to close the modal
    children: React.ReactNode; // Modal content
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullscreen?: boolean; // Fullscreen modal
    padding?: string; // Custom padding classes
    margin?: string; // Custom margin classes
    zIndex?: number; // Custom z-index for the modal
};

const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    children,
    size = 'md', // Default size
    fullscreen = false, // Default fullscreen
    padding = 'p-4', // Default padding
    margin = 'm-0', // Default margin
    zIndex = 50, // Default z-index
}) => {
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Locate or create the portal container
        let portal = document.querySelector('[data-portal="true"]') as HTMLElement | null;

        if (!portal) {
            portal = document.createElement('div');
            portal.setAttribute('data-portal', 'true');
            document.body.appendChild(portal);
        }

        setPortalRoot(portal);

        return () => {
            // Optional: Clean up dynamically created portal (if required)
            if (portal && document.body.contains(portal)) {
                document.body.removeChild(portal);
            }
        };
    }, []);

    useEffect(() => {
        // Disable background scrolling when the modal is open
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = ''; // Reset scrolling when modal unmounts
        };
    }, [open]);

    if (!portalRoot || !open) return null;

    // Modal width classes
    const sizeClasses = {
        xs: 'w-[20rem] h-[10rem]',
        sm: 'w-[24rem] h-[10rem]',
        md: 'w-[32rem] h-[10rem]',
        lg: 'w-[48rem] h-[10rem]',
        xl: 'w-[64rem] h-[10rem]',
    };

    // Adjust size if it contains % or vw
    if (size.includes('%') || size.includes('vw')) {
        sizeClasses[size] = `w-[${size}] h-[${size}]`;
    }

    // Check if fullscreen is true
    if (fullscreen) {
        sizeClasses[size] = 'w-full h-full';
    }

    // Render modal into the portal
    return ReactDOM.createPortal(
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black/50 ${margin}`}
            style={{ zIndex }}
        >
            <div
                className={`relative bg-white rounded-lg shadow-lg ${sizeClasses[size]} ${padding}`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>,
        portalRoot
    );
};

export { Modal };
