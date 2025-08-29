import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Target, Users, Trophy, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <header className="text-center py-20 container mx-auto px-6">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6" style={{
          background: 'linear-gradient(to right, #22d3ee, #3b82f6, #9333ea)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          Learn Cybersecurity, Hands-On.
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Spin up real targets, launch your attack box in the browser, and conquer rooms & CTFs. 
          Built by hackers for learners & defenders. Experience the most advanced cybersecurity 
          training platform that surpasses everything else.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/login" 
            className="btn primary"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Play className="w-5 h-5" />
            Try Hackverse
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/dashbaord" 
            className="btn ghost"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/dashboard" 
            className="btn ghost"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Explore Features
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose Hackverse?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Real-World Labs</h3>
              <p className="text-gray-400">
                Practice on actual vulnerable systems, not simulations. Get hands-on experience 
                with real attack vectors and defense mechanisms.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl hover:border-blue-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Instant Setup</h3>
              <p className="text-gray-400">
                No more waiting for VMs to boot or environments to configure. 
                Launch labs in seconds with our containerized infrastructure.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Progressive Learning</h3>
              <p className="text-gray-400">
                Structured learning paths from beginner to expert. Track your progress, 
                earn achievements, and climb the global leaderboard.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl hover:border-green-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Community Driven</h3>
              <p className="text-gray-400">
                Join a community of security professionals. Share knowledge, 
                collaborate on challenges, and learn from the best.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl hover:border-yellow-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Achievement System</h3>
              <p className="text-gray-400">
                Earn XP, unlock badges, and climb the ranks. Our gamified system 
                keeps you motivated and tracks your cybersecurity journey.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl hover:border-red-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise Ready</h3>
              <p className="text-gray-400">
                Used by Fortune 500 companies and government agencies. 
                Industry-standard training that prepares you for real-world challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Become a Cybersecurity Expert?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of security professionals who have already transformed their careers 
            with Hackverse. Start your journey today.
          </p>
          <Link 
            to="/signup" 
            className="btn primary"
            style={{
              padding: '1.25rem 2.5rem',
              fontSize: '1.25rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Play className="w-6 h-6" />
            Launch Hackverse 2.0
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
