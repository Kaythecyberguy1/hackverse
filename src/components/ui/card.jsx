export function Card({ className = '', ...props }) {
  return <div className={`rounded-2xl border border-gray-800 bg-gray-900/70 shadow ${className}`} {...props} />
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-6 ${className}`} {...props} />
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
}

export function CardTitle({ className = '', ...props }) {
  return <h3 className={`text-2xl font-semibold leading-none tracking-tight text-white ${className}`} {...props} />
}
  