"use client"

export function HeroBanner() {
  return (
    <div className="relative h-40 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/80 via-cyan-600/80 to-blue-500/80 animate-gradient-x"></div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-8 w-16 h-16 border-2 border-white/30 rotate-45 animate-float"></div>
        <div className="absolute top-8 right-16 w-12 h-12 bg-white/20 rotate-12 animate-float-delayed"></div>
        <div className="absolute bottom-6 left-20 w-8 h-8 border border-white/40 rotate-45 animate-bounce"></div>
        <div className="absolute top-12 left-1/2 w-6 h-6 bg-cyan-400/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 right-8 w-10 h-10 border-2 border-teal-300/40 rounded-full animate-spin-slow"></div>
      </div>

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Strategic Roadmap Intelligence</h2>
          <p className="text-white/80 text-sm">Powered by next-generation AI planning</p>
        </div>
      </div>
    </div>
  )
} 