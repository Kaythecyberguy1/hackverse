import React from 'react'

export const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-500/30 ${className}`}
    {...props}
  />
))
Input.displayName = 'Input'
