import clsx from 'clsx';
import React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?:
    | 'gray'
    | 'red'
    | 'pink'
    | 'grape'
    | 'violet'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'green'
    | 'lime'
    | 'yellow'
    | 'amber'
    | 'orange';
}

function Text({
  size = 'md',
  color = 'blue',
  component = 'p',
  className,
  children,
  ...props
}: TextProps) {
  const baseStyle = 'font-medium';

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const colorStyles = {
    gray: 'text-gray-800',
    red: 'text-red-800',
    pink: 'text-pink-800',
    grape: 'text-grape-800',
    violet: 'text-violet-800',
    indigo: 'text-indigo-800',
    blue: 'text-blue-800',
    cyan: 'text-cyan-800',
    teal: 'text-teal-800',
    green: 'text-green-800',
    lime: 'text-lime-800',
    yellow: 'text-yellow-800',
    amber: 'text-amber-800',
    orange: 'text-orange-800',
  };

  
  if (color.includes('#') || color.includes('rgb')) {
    colorStyles[color] = `text-[${color}]`;
  }

  if (size.includes('px') || size.includes('rem')) {
    sizeStyles[size] = `text-[${size}]`;
  }

  const style = clsx(
    baseStyle,
    sizeStyles[size],
    colorStyles[color],
    className
  );

  const Component = component as any;

  return (
    <Component
      className={style}
      {...props}
    >
      {children}
    </Component>
  );
}

export {Text};
