import React from 'react';
import clsx from 'clsx';

interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: string; // Tailwind gap utility (e.g., 'gap-4', 'gap-2')
  grow?: boolean; // If true, all items should grow equally in one line
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between'; // Added justification options
}

const Group: React.FC<GroupProps> = ({
  children,
  gap = 'gap-4',
  grow = false,
  justify = 'flex-start', // Default justify to 'flex-start'
  className,
  ...props
}) => {
  // If grow is true, all items should be on one line and grow equally
  const groupClasses = clsx(
    'flex', // Set display to flex
    gap, // Apply gap between elements
    grow ? 'justify-between flex-nowrap' : justify, // If grow is true, use 'justify-between'; otherwise, apply the provided justify value
    grow ? '' : 'flex-wrap', // If grow is false, enable wrapping
    className // Allows for additional custom classes
  );

  return (
    <div className={groupClasses} {...props}>
      {React.Children.map(children, (child) =>
        grow ? (
          <div className="flex-grow">{child}</div> // Each child grows equally if grow is true
        ) : (
          child
        )
      )}
    </div>
  );
};

export { Group };
