export default function Logo({ className = 'w-12 h-12' }) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          ⚡
        </div>
        <span className="text-xl font-bold">Hackverse</span>
      </div>
    )
  }
  