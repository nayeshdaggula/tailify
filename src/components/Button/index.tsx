import clsx from 'clsx'

interface ButtonProps extends React.ComponentProps<'button'> {
  primary?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'amber' | 'orange' | 'red'
  variant?: 'default' | 'filled' | 'light' | 'outline' | 'subtle' | 'transparent' | 'white'
}

export function Button({
  primary = false,
  size = 'md',
  color = 'blue',
  variant = 'filled',
  children,
  className,
  ...props
}: ButtonProps) {

  let newColor = color; // Default to the provided color prop
  if (variant === 'default') {
    newColor = "gray";
  }
  const baseStyle = 'cursor-pointer inline-flex items-center justify-center font-medium rounded-md focus:outline-none';

  
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
    xl: 'px-6 py-3.5 text-xl',
  };
  
  const colorStyles = {
    gray: {
      default: 'text-gray-800 bg-transparent border border-gray-300 dark:text-white dark:border-gray-600',
      filled: 'text-white bg-gray-800 dark:bg-gray-900',
      light: 'text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-700',
      outline: 'text-gray-800 bg-transparent border border-gray-300 dark:text-gray-200 dark:border-gray-600',
      subtle: 'text-gray-800 bg-gray-50 dark:text-gray-200 dark:bg-gray-800',
      transparent: 'text-gray-800 bg-transparent dark:text-gray-200',
      white: 'text-gray-800 bg-white dark:text-gray-900 dark:bg-gray-100',
    },
    red: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-red-600',
      filled: 'text-white bg-red-800 dark:bg-red-900',
      light: 'text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-700',
      outline: 'text-red-800 bg-transparent border border-red-300 dark:text-red-200 dark:border-red-600',
      subtle: 'text-red-800 bg-red-50 dark:text-red-200 dark:bg-red-800',
      transparent: 'text-red-800 bg-transparent dark:text-red-200',
      white: 'text-red-800 bg-white dark:text-red-900 dark:bg-red-100',
    },
    pink: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-pink-600',
      filled: 'text-white bg-pink-800 dark:bg-pink-900',
      light: 'text-pink-800 bg-pink-200 dark:text-pink-200 dark:bg-pink-700',
      outline: 'text-pink-800 bg-transparent border border-pink-300 dark:text-pink-200 dark:border-pink-600',
      subtle: 'text-pink-800 bg-pink-50 dark:text-pink-200 dark:bg-pink-800',
      transparent: 'text-pink-800 bg-transparent dark:text-pink-200',
      white: 'text-pink-800 bg-white dark:text-pink-900 dark:bg-pink-100',
    },
    grape: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-grape-600',
      filled: 'text-white bg-grape-800 dark:bg-grape-900',
      light: 'text-grape-800 bg-grape-200 dark:text-grape-200 dark:bg-grape-700',
      outline: 'text-grape-800 bg-transparent border border-grape-300 dark:text-grape-200 dark:border-grape-600',
      subtle: 'text-grape-800 bg-grape-50 dark:text-grape-200 dark:bg-grape-800',
      transparent: 'text-grape-800 bg-transparent dark:text-grape-200',
      white: 'text-grape-800 bg-white dark:text-grape-900 dark:bg-grape-100',
    },
    violet: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-violet-600',
      filled: 'text-white bg-violet-800 dark:bg-violet-900',
      light: 'text-violet-800 bg-violet-200 dark:text-violet-200 dark:bg-violet-700',
      outline: 'text-violet-800 bg-transparent border border-violet-300 dark:text-violet-200 dark:border-violet-600',
      subtle: 'text-violet-800 bg-violet-50 dark:text-violet-200 dark:bg-violet-800',
      transparent: 'text-violet-800 bg-transparent dark:text-violet-200',
      white: 'text-violet-800 bg-white dark:text-violet-900 dark:bg-violet-100',
    },
    indigo: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-indigo-600',
      filled: 'text-white bg-indigo-800 dark:bg-indigo-900',
      light: 'text-indigo-800 bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-700',
      outline: 'text-indigo-800 bg-transparent border border-indigo-300 dark:text-indigo-200 dark:border-indigo-600',
      subtle: 'text-indigo-800 bg-indigo-50 dark:text-indigo-200 dark:bg-indigo-800',
      transparent: 'text-indigo-800 bg-transparent dark:text-indigo-200',
      white: 'text-indigo-800 bg-white dark:text-indigo-900 dark:bg-indigo-100',
    },
    blue: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-blue-600',
      filled: 'text-white bg-blue-800 dark:bg-blue-900',
      light: 'text-blue-800 bg-blue-200 dark:text-blue-200 dark:bg-blue-700',
      outline: 'text-blue-800 bg-transparent border border-blue-300 dark:text-blue-200 dark:border-blue-600',
      subtle: 'text-blue-800 bg-blue-50 dark:text-blue-200 dark:bg-blue-800',
      transparent: 'text-blue-800 bg-transparent dark:text-blue-200',
      white: 'text-blue-800 bg-white dark:text-blue-900 dark:bg-blue-100',
    },
    cyan: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-cyan-600',
      filled: 'text-white bg-cyan-800 dark:bg-cyan-900',
      light: 'text-cyan-800 bg-cyan-200 dark:text-cyan-200 dark:bg-cyan-700',
      outline: 'text-cyan-800 bg-transparent border border-cyan-300 dark:text-cyan-200 dark:border-cyan-600',
      subtle: 'text-cyan-800 bg-cyan-50 dark:text-cyan-200 dark:bg-cyan-800',
      transparent: 'text-cyan-800 bg-transparent dark:text-cyan-200',
      white: 'text-cyan-800 bg-white dark:text-cyan-900 dark:bg-cyan-100',
    },
    teal: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-teal-600',
      filled: 'text-white bg-teal-800 dark:bg-teal-900',
      light: 'text-teal-800 bg-teal-200 dark:text-teal-200 dark:bg-teal-700',
      outline: 'text-teal-800 bg-transparent border border-teal-300 dark:text-teal-200 dark:border-teal-600',
      subtle: 'text-teal-800 bg-teal-50 dark:text-teal-200 dark:bg-teal-800',
      transparent: 'text-teal-800 bg-transparent dark:text-teal-200',
      white: 'text-teal-800 bg-white dark:text-teal-900 dark:bg-teal-100',
    },
    green: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-green-600',
      filled: 'text-white bg-green-800 dark:bg-green-900',
      light: 'text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-700',
      outline: 'text-green-800 bg-transparent border border-green-300 dark:text-green-200 dark:border-green-600',
      subtle: 'text-green-800 bg-green-50 dark:text-green-200 dark:bg-green-800',
      transparent: 'text-green-800 bg-transparent dark:text-green-200',
      white: 'text-green-800 bg-white dark:text-green-900 dark:bg-green-100',
    },
    lime: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-lime-600',
      filled: 'text-white bg-lime-800 dark:bg-lime-900',
      light: 'text-lime-800 bg-lime-200 dark:text-lime-200 dark:bg-lime-700',
      outline: 'text-lime-800 bg-transparent border border-lime-300 dark:text-lime-200 dark:border-lime-600',
      subtle: 'text-lime-800 bg-lime-50 dark:text-lime-200 dark:bg-lime-800',
      transparent: 'text-lime-800 bg-transparent dark:text-lime-200',
      white: 'text-lime-800 bg-white dark:text-lime-900 dark:bg-lime-100',
    },
    yellow: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-yellow-600',
      filled: 'text-white bg-yellow-800 dark:bg-yellow-900',
      light: 'text-yellow-800 bg-yellow-200 dark:text-yellow-200 dark:bg-yellow-700',
      outline: 'text-yellow-800 bg-transparent border border-yellow-300 dark:text-yellow-200 dark:border-yellow-600',
      subtle: 'text-yellow-800 bg-yellow-50 dark:text-yellow-200 dark:bg-yellow-800',
      transparent: 'text-yellow-800 bg-transparent dark:text-yellow-200',
      white: 'text-yellow-800 bg-white dark:text-yellow-900 dark:bg-yellow-100',
    },
    amber: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-amber-600',
      filled: 'text-white bg-amber-800 dark:bg-amber-900',
      light: 'text-amber-800 bg-amber-200 dark:text-amber-200 dark:bg-amber-700',
      outline: 'text-amber-800 bg-transparent border border-amber-300 dark:text-amber-200 dark:border-amber-600',
      subtle: 'text-amber-800 bg-amber-50 dark:text-amber-200 dark:bg-amber-800',
      transparent: 'text-amber-800 bg-transparent dark:text-amber-200',
      white: 'text-amber-800 bg-white dark:text-amber-900 dark:bg-amber-100',
    },
    orange: {
      default: 'text-black-800 bg-transparent border border-black-300 dark:text-white dark:border-orange-600',
      filled: 'text-white bg-orange-800 dark:bg-orange-900',
      light: 'text-orange-800 bg-orange-200 dark:text-orange-200 dark:bg-orange-700',
      outline: 'text-orange-800 bg-transparent border border-orange-300 dark:text-orange-200 dark:border-orange-600',
      subtle: 'text-orange-800 bg-orange-50 dark:text-orange-200 dark:bg-orange-800',
      transparent: 'text-orange-800 bg-transparent dark:text-orange-200',
      white: 'text-orange-800 bg-white dark:text-orange-900 dark:bg-orange-100',
    }
  };

  //check color contains #with color code or rgb
  if (newColor && (newColor.includes('#') || newColor.includes('rgb'))) {
    colorStyles[newColor] = {
      default: 'text-gray-800 bg-transparent border border-gray-300 hover:bg-gray-100',
      filled: `text-white bg-[${newColor}]`,
      light: `text-white bg-[${newColor}]`,
      outline: `text-[${newColor}] bg-transparent border border-[${newColor}]`,
      subtle: `text-white bg-[${newColor}]`,
      transparent: `text-[${newColor}] bg-transparent`,
      white: `text-white bg-[${newColor}]`,
    };
  }

  const style = clsx(
    baseStyle,
    sizeStyles[size],
    colorStyles[newColor][variant],
    className // Allows custom Tailwind classes to be added
  );

  return (
    <button
      type="button"
      className={style}
      {...props}
    >
      {children}
    </button>
  );
}
