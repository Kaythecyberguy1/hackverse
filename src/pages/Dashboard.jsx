import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth.js';
import { db } from '../services/database.js';
import { 
  Shield, 
  Trophy, 
  Target, 
  BookOpen, 
  Zap, 
  TrendingUp, 
  Award,
  Clock,
  Users,
  Star,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [recentLabs, setRecentLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (!auth.checkAuth()) {
          navigate('/login');
          return;
        }

        const user = await auth.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        setCurrentUser(user);

        // Load user progress
        const progress = await db.getUserProgress(user.id);
        setUserProgress(progress);

        // Load recent labs
        const labs = await db.getLabs({ status: 'active' });
        setRecentLabs(labs.slice(0, 6));

        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const getLevelProgress = () => {
    const currentLevel = currentUser.level;
    const xpForCurrentLevel = (currentLevel - 1) * 500;
    const xpForNextLevel = currentLevel * 500;
    const xpInCurrentLevel = currentUser.xp - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    return Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Elite Hacker': return 'text-purple-400';
      case 'Security Analyst': return 'text-blue-400';
      case 'Penetration Tester': return 'text-green-400';
      case 'Script Kiddie': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {currentUser.username}! 👋
              </h1>
              <p className="text-gray-400">
                Continue your cybersecurity journey where you left off
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{currentUser.level}</div>
              <div className={`text-sm font-medium ${getRankColor(currentUser.rank)}`}>
                {currentUser.rank}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* XP Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total XP</p>
                <p className="text-2xl font-bold text-white">{currentUser.xp.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Labs Completed */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Labs Completed</p>
                <p className="text-2xl font-bold text-white">{currentUser.totalLabsCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          {/* Challenges Solved */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Challenges Solved</p>
                <p className="text-2xl font-bold text-white">{currentUser.totalChallengesSolved}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">{currentUser.streak} days</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Level Progress</h2>
            <span className="text-gray-400">
              Level {currentUser.level} • {currentUser.xp.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">
            {500 - (currentUser.xp % 500)} XP needed for next level
          </p>
        </div>

        {/* Recent Achievements */}
        {currentUser.achievements && currentUser.achievements.length > 0 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUser.achievements.slice(-6).map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{achievement}</p>
                    <p className="text-gray-400 text-sm">Unlocked!</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue Learning */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Continue Learning</h2>
            <button 
              onClick={() => navigate('/labs')}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-2"
            >
              View All Labs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLabs.map((lab) => (
              <div key={lab.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lab.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    lab.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {lab.difficulty}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{lab.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{lab.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {lab.estimatedTime}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-yellow-400">
                    <Zap className="w-4 h-4" />
                    {lab.xpReward} XP
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/lab/${lab.id}`)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Lab
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/challenges')}
                className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="text-white">Solve CTF Challenges</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              <button 
                onClick={() => navigate('/leaderboard')}
                className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="text-white">View Leaderboard</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="text-white">Update Profile</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Community Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Platform Users</span>
                <span className="text-white font-medium">2,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Labs</span>
                <span className="text-white font-medium">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Completions</span>
                <span className="text-white font-medium">12,394</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Your Rank</span>
                <span className="text-white font-medium">#42</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
