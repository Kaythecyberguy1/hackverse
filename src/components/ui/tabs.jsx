import React, { createContext, useContext, useMemo, useState } from 'react'

const TabsContext = createContext()

export function Tabs({ defaultValue, value, onValueChange, className = '', children }) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const setCurrent = onValueChange ?? setInternal
  const ctx = useMemo(() => ({ current, setCurrent }), [current])
  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className = '', children }) {
  return (
    <div className={`inline-flex gap-2 rounded-2xl bg-gray-900 p-2 border border-gray-800 ${className}`}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, className = '', children }) {
  const { current, setCurrent } = useContext(TabsContext)
  const active = current === value
  return (
    <button
      onClick={() => setCurrent(value)}
      className={`px-4 py-2 rounded-xl text-sm transition ${
        active ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className = '', children }) {
  const { current } = useContext(TabsContext)
  if (current !== value) return null
  return <div className={className}>{children}</div>
}
