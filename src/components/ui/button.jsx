import React from 'react'

export const Button = React.forwardRef(
  ({ className = '', size = 'base', variant = 'default', ...props }, ref) => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      base: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    }
    const variants = {
      default: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      ghost: 'bg-transparent hover:bg-gray-800 text-gray-100',
      destructive: 'bg-red-600 hover:bg-red-500 text-white',
    }
    return (
      <button
        ref={ref}
        className={`rounded-2xl font-medium transition shadow-sm focus:outline-none focus:ring focus:ring-indigo-500/30 ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
