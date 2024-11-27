import React from 'react';

// Define prop types for flexible configuration
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gutter?: string;
  children: React.ReactNode;
}

// Define the Grid component
function Grid({ columns = 2, gutter = '4', children, ...props }: GridProps) {
  const baseStyle = `grid grid-cols-${columns} gap-${gutter}`;

  return (
    <div className={baseStyle} {...props}>
      {children}
    </div>
  );
}

export {Grid};