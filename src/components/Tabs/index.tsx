import React, { createContext, useContext, useState } from 'react';
import clsx from 'clsx';

// Context to provide Tabs configuration (variant and orientation)
const TabsContext = createContext<{
    activeTab: string | number | null;
    setActiveTab: (value: string | number) => void;
    variant: 'outline' | 'pills' | 'underline';
    orientation: 'horizontal' | 'vertical';
    color: 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'amber' | 'orange' | 'red';
}>({
    activeTab: null,
    setActiveTab: () => {},
    variant: 'underline',
    orientation: 'horizontal',
    color: 'blue',
});

interface TabsProps {
    children: React.ReactNode;
    variant?: 'outline' | 'pills' | 'underline';
    orientation?: 'horizontal' | 'vertical';
    defaultActiveTab?: string | number | null;
    color?: 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'amber' | 'orange' | 'red';
}

interface TabsComponent extends React.FC<TabsProps> {
    List: typeof TabsList;
    Tab: typeof TabsTab;
    Panel: typeof TabsPanel;
}

const Tabs: TabsComponent = ({
    children,
    variant = 'underline',
    orientation = 'horizontal',
    defaultActiveTab = null,
    color = 'blue',
}) => {
    const [activeTab, setActiveTab] = useState<string | number | null>(defaultActiveTab);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab, variant, orientation, color }}>
            <div
                className={clsx(
                    'tabs-container',
                    orientation === 'vertical' ? 'flex flex-row' : 'flex flex-col',
                    'dark:bg-gray-900' // Dark mode background for the container
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
    const { orientation, variant } = useContext(TabsContext);

    const listClasses = clsx(
        'flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400',
        orientation === 'horizontal' ? 'gap-x-1' : 'flex-col gap-y-1',
        {
            'border-b border-gray-200 dark:border-gray-700': variant === 'underline', // Add dark mode border
        }
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
    const { activeTab, setActiveTab, variant, color } = useContext(TabsContext);

    const isActive = activeTab === value;

    // Consolidated color classes
    const colorClasses = {
        gray: { bg: 'bg-gray-600', border: 'border-gray-600', text: 'text-white', underlineText: 'text-gray-600' },
        red: { bg: 'bg-red-600', border: 'border-red-600', text: 'text-white', underlineText: 'text-red-600' },
        pink: { bg: 'bg-pink-600', border: 'border-pink-600', text: 'text-white', underlineText: 'text-pink-600' },
        grape: { bg: 'bg-grape-600', border: 'border-grape-600', text: 'text-white', underlineText: 'text-grape-600' },
        violet: { bg: 'bg-violet-600', border: 'border-violet-600', text: 'text-white', underlineText: 'text-violet-600' },
        indigo: { bg: 'bg-indigo-600', border: 'border-indigo-600', text: 'text-white', underlineText: 'text-indigo-600' },
        blue: { bg: 'bg-blue-600', border: 'border-blue-600', text: 'text-white', underlineText: 'text-blue-600' },
        cyan: { bg: 'bg-cyan-600', border: 'border-cyan-600', text: 'text-white', underlineText: 'text-cyan-600' },
        teal: { bg: 'bg-teal-600', border: 'border-teal-600', text: 'text-white', underlineText: 'text-teal-600' },
        green: { bg: 'bg-green-600', border: 'border-green-600', text: 'text-white', underlineText: 'text-green-600' },
        lime: { bg: 'bg-lime-600', border: 'border-lime-600', text: 'text-gray-800', underlineText: 'text-lime-800' },
        yellow: { bg: 'bg-yellow-600', border: 'border-yellow-600', text: 'text-gray-800', underlineText: 'text-yellow-800' },
        amber: { bg: 'bg-amber-600', border: 'border-amber-600', text: 'text-gray-800', underlineText: 'text-amber-800' },
        orange: { bg: 'bg-orange-600', border: 'border-orange-600', text: 'text-white', underlineText: 'text-orange-600' },
    };

    // Default to blue if color is not found
    const { bg, border, text, underlineText } = colorClasses[color] || colorClasses.blue;

    // Generate tab classes based on variant and active state
    const tabClasses = clsx(
        'inline-block px-4 py-3 cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
        {
            // Pills variant
            [`${text} ${bg} active rounded-lg`]: variant === 'pills' && isActive,
            [`bg-gray-50 border border-gray-300 text-gray-500 hover:${text} hover:bg-gray-800  dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:text-gray-400 rounded-lg`]: variant === 'pills' && !isActive,

            // Underline variant
            [`border-b-2 ${border} ${underlineText}`]: variant === 'underline' && isActive,
            [`hover:border-gray-300 hover:${underlineText} dark:text-white dark:hover:text-white dark:hover:border-gray-600`]: variant === 'underline' && !isActive,

            // Outline variant
            [`border ${border} ${underlineText} hover:${bg.replace('600', '100')} dark:hover:${bg.replace('600', '800')} dark:text-white rounded-lg`]: variant === 'outline' && !isActive,
            [`border ${border} ${bg} text-white rounded-lg`]: variant === 'outline' && isActive,
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
    const { activeTab, orientation } = useContext(TabsContext);

    const isActive = activeTab === value;

    return (
        <div
            className={clsx(
                'tab-panel p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full',
                isActive ? 'block' : 'hidden',
                orientation === 'horizontal' ? 'mt-3' : 'ml-3'
            )}
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