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
  style,
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
    gray: 'text-gray-800 dark:text-gray-200',
    red: 'text-red-800 dark:text-red-400',
    pink: 'text-pink-800 dark:text-pink-400',
    grape: 'text-grape-800 dark:text-grape-400',
    violet: 'text-violet-800 dark:text-violet-400',
    indigo: 'text-indigo-800 dark:text-indigo-400',
    blue: 'text-blue-800 dark:text-blue-400',
    cyan: 'text-cyan-800 dark:text-cyan-400',
    teal: 'text-teal-800 dark:text-teal-400',
    green: 'text-green-800 dark:text-green-400',
    lime: 'text-lime-800 dark:text-lime-400',
    yellow: 'text-yellow-800 dark:text-yellow-400',
    amber: 'text-amber-800 dark:text-amber-400',
    orange: 'text-orange-800 dark:text-orange-400',
  };

  let newColorStyle;
  let newColorclass;
  if (color.includes('#') || color.includes('rgb')) {
    newColorStyle = {
      color: color
    }
    newColorclass = '';
  } else {
    newColorStyle = {};
    newColorclass = colorStyles[color];
  }

  let newSizeStyle;
  let newSizeclass;
  if (size.includes('px') || size.includes('rem')) {
    newSizeStyle = {
      fontSize: size
    }
    newSizeclass = '';
  } else {
    newSizeStyle = {};
    newSizeclass = sizeStyles[size];
  }

  const stylec = clsx(
    baseStyle,
    newColorclass,
    newSizeclass,
    className
  );

  const Component = component as any;

  return (
    <Component
      className={stylec}
      {...props}
      style={{...newColorStyle, ...newSizeStyle, ...style}}
    >
      {children}
    </Component>
  );
}

export { Text };