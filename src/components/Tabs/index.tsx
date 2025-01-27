import React, { createContext, useContext, useState } from 'react';
import clsx from 'clsx';

// Context to provide Tabs configuration (variant and orientation)
const TabsContext = createContext<{
    activeTab: string | number | null;
    setActiveTab: (value: string | number) => void;
    variant: 'default' | 'outline' | 'pills';
    orientation: 'horizontal' | 'vertical';
}>({
    activeTab: null,
    setActiveTab: () => { },
    variant: 'default',
    orientation: 'horizontal',
});

interface TabsProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'pills';
    orientation?: 'horizontal' | 'vertical';
    defaultActiveTab?: string | number | null;
}

interface TabsComponent extends React.FC<TabsProps> {
    List: typeof TabsList;
    Tab: typeof TabsTab;
    Panel: typeof TabsPanel;
}

const Tabs: TabsComponent = ({
    children,
    variant = 'default',
    orientation = 'horizontal',
    defaultActiveTab = null, // Add defaultActiveTab
}) => {
    const [activeTab, setActiveTab] = useState<string | number | null>(defaultActiveTab);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab, variant, orientation }}>
            <div
                className={clsx(
                    'tabs-container',
                    orientation === 'vertical' ? 'flex flex-row' : 'flex flex-col'
                )}
            >
                {children}
            </div>
        </TabsContext.Provider>
    );
};
interface TabsListProps {
    children: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ children }) => {
    const { orientation } = useContext(TabsContext);

    const listClasses = clsx(
        'tab-list flex',
        orientation === 'horizontal' ? 'gap-x-1' : 'flex-col gap-y-1'
    );

    return (
        <nav className={listClasses} role="tablist" aria-orientation={orientation}>
            {children}
        </nav>
    );
};

interface TabsTabProps {
    value: string | number;
    children: React.ReactNode;
}

const TabsTab: React.FC<TabsTabProps> = ({ value, children }) => {
    const { activeTab, setActiveTab, variant } = useContext(TabsContext);

    const isActive = activeTab === value;

    const tabClasses = clsx(
        'py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
        {
            'text-gray-500 hover:text-blue-600 focus:text-blue-600 bg-transparent': variant === 'pills',
            'hs-tab-active:bg-blue-600 hs-tab-active:text-white': variant === 'pills' && isActive,
            'border border-gray-300 text-gray-700 hover:bg-gray-100': variant === 'outline',
            'border-b-2 border-current text-blue-600': variant === 'default' && isActive,
        }
    );

    return (
        <button
            className={tabClasses}
            onClick={() => setActiveTab(value)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${value}`}
            id={`tab-${value}`}
        >
            {children}
        </button>
    );
};

interface TabsPanelProps {
    value: string | number;
    children: React.ReactNode;
}

const TabsPanel: React.FC<TabsPanelProps> = ({ value, children }) => {
    const { activeTab } = useContext(TabsContext);

    const isActive = activeTab === value;

    return (
        <div
            className={clsx('tab-panel mt-3', isActive ? 'block' : 'hidden')}
            id={`panel-${value}`}
            role="tabpanel"
            aria-labelledby={`tab-${value}`}
        >
            {children}
        </div>
    );
};

Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;

export { Tabs };
