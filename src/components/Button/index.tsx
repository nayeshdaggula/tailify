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
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
    xl: 'px-6 py-3.5 text-xl',
  };
  
  const colorStyles = {
    gray: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-gray-800',
      light: 'text-gray-800 bg-gray-200',
      outline: 'text-gray-800 bg-transparent border border-gray-300',
      subtle: 'text-gray-800 bg-gray-50',
      transparent: 'text-gray-800 bg-transparent',
      white: 'text-gray-800 bg-white',
    },
    red: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-red-800',
      light: 'text-red-800 bg-red-200',
      outline: 'text-red-800 bg-transparent border border-red-300',
      subtle: 'text-red-800 bg-red-50',
      transparent: 'text-red-800 bg-transparent',
      white: 'text-red-800 bg-white',
    },
    pink: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-pink-800',
      light: 'text-pink-800 bg-pink-200',
      outline: 'text-pink-800 bg-transparent border border-pink-300',
      subtle: 'text-pink-800 bg-pink-50',
      transparent: 'text-pink-800 bg-transparent',
      white: 'text-pink-800 bg-white',
    },
    grape: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-grape-800',
      light: 'text-grape-800 bg-grape-200',
      outline: 'text-grape-800 bg-transparent border border-grape-300',
      subtle: 'text-grape-800 bg-grape-50',
      transparent: 'text-grape-800 bg-transparent',
      white: 'text-grape-800 bg-white',
    },
    violet: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-violet-800',
      light: 'text-violet-800 bg-violet-200',
      outline: 'text-violet-800 bg-transparent border border-violet-300',
      subtle: 'text-violet-800 bg-violet-50',
      transparent: 'text-violet-800 bg-transparent',
      white: 'text-violet-800 bg-white',
    },
    indigo: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-indigo-800',
      light: 'text-indigo-800 bg-indigo-200',
      outline: 'text-indigo-800 bg-transparent border border-indigo-300',
      subtle: 'text-indigo-800 bg-indigo-50',
      transparent : 'text-indigo-800 bg-transparent',
      white: 'text-indigo-800 bg-white',
    },
    blue: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-blue-800',
      light: 'text-blue-800 bg-blue-200',
      outline: 'text-blue-800 bg-transparent border border-blue-300',
      subtle: 'text-blue-800 bg-blue-50',
      transparent: 'text-blue-800 bg-transparent',
      white: 'text-blue-800 bg-white',
    },
    cyan: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-cyan-800',
      light: 'text-cyan-800 bg-cyan-200',
      outline: 'text-cyan-800 bg-transparent border border-cyan-300',
      subtle: 'text-cyan-800 bg-cyan-50',
      transparent: 'text-cyan-800 bg-transparent',
      white: 'text-cyan-800 bg-white',
    },
    teal: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-teal-800',
      light: 'text-teal-800 bg-teal-200',
      outline: 'text-teal-800 bg-transparent border border-teal-300',
      subtle: 'text-teal-800 bg-teal-50',
      transparent: 'text-teal-800 bg-transparent',
      white: 'text-teal-800 bg-white',
    },
    green: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-green-800',
      light: 'text-green-800 bg-green-200',
      outline: 'text-green-800 bg-transparent border border-green-300',
      subtle: 'text-green-800 bg-green-50',
      transparent: 'text-green-800 bg-transparent',
      white: 'text-green-800 bg-white',
    },
    lime: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-lime-800',
      light: 'text-lime-800 bg-lime-200',
      outline: 'text-lime-800 bg-transparent border border-lime-300',
      subtle: 'text-lime-800 bg-lime-50',
      transparent: 'text-lime-800 bg-transparent',
      white: 'text-lime-800 bg-white',
    },
    yellow: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-yellow-800',
      light: 'text-yellow-800 bg-yellow-200',
      outline: 'text-yellow-800 bg-transparent border border-yellow-300',
      subtle: 'text-yellow-800 bg-yellow-50',
      transparent: 'text-yellow-800 bg-transparent',
      white: 'text-yellow-800 bg-white',
    },
    amber: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-amber-800',
      light: 'text-amber-800 bg-amber-200',
      outline: 'text-amber-800 bg-transparent border border-amber-300',
      subtle: 'text-amber-800 bg-amber-50',
      transparent: 'text-amber-800 bg-transparent',
      white: 'text-amber-800 bg-white',
    },
    orange: {
      default: 'text-black-800 bg-transparent border border-black-300',
      filled: 'text-white bg-orange-800',
      light: 'text-orange-800 bg-orange-200',
      outline: 'text-orange-800 bg-transparent border border-orange-300',
      subtle: 'text-orange-800 bg-orange-50',
      transparent: 'text-orange-800 bg-transparent',
      white: 'text-orange-800 bg-white',
    }
  };

  //check color contains #with color code or rgb
  if (color.includes('#') || color.includes('rgb')) {
    colorStyles[color] = {
      default: 'text-black-800 bg-transparent border border-black-300 hover:bg-gray-100',
      filled: `text-white bg-[${color}]`,
      light: `text-white bg-[${color}]`,
      outline: `text-[${color}] bg-transparent border border-[${color}]`,
      subtle: `text-white bg-[${color}]`,
      transparent: `text-[${color}] bg-transparent`,
      white: `text-white bg-[${color}]`,
    }
  }

  const style = clsx(
    baseStyle,
    sizeStyles[size],
    colorStyles[color][variant],
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
