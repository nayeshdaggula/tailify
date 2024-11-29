import React from 'react';

type LoadingOverlayProps = {
    visible: boolean; // Whether the overlay is visible
    zIndex?: number; // Custom z-index for the overlay
    overlayBg?: string; // Background color for the overlay
};

const Loadingoverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    zIndex = 1000, // Default z-index
    overlayBg = 'rgba(255, 255, 255, 0.75)', // Default light overlay background
}) => {
    if (!visible) return null;

    return (
        <div
            className="loading-overlay-root"
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex,
            }}
        >
            <span className="loading-overlay-loader" style={{
                width: '3rem',
                height: '3rem',
                border: '0.4rem solid rgba(255, 255, 255, 0.5)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }}></span>
            <div
                className="loading-overlay-background"
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: overlayBg,
                    filter: 'blur(2px)',
                    borderRadius: 'var(--mantine-radius-sm)',
                    zIndex: zIndex - 1,
                }}
            ></div>
        </div>
    );
};

export { Loadingoverlay };
