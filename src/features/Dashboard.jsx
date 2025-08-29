import { useState, useEffect } from 'react';
import { useApi } from '../services/api';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Users, 
  Zap,
  Calendar,
  BarChart3,
  Activity,
  Star
} from 'lucide-react';

export default function Dashboard() {
  const api = useApi();
  const [analytics, setAnalytics] = useState(null);
  const [learningPaths, setLearningPaths] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [analyticsData, pathsData, userData] = await Promise.all([
          api.getAnalytics(),
          api.getLearningPaths(),
          api.getCurrentUser()
        ]);
        
        setAnalytics(analyticsData);
        setLearningPaths(pathsData);
        setUser(userData);
        
        // Simulate recent activity
        setRecentActivity([
          { type: 'lab_completed', lab: 'DVWA', time: '2 hours ago', xp: 150 },
          { type: 'flag_submitted', lab: 'Juice Shop', time: '4 hours ago', xp: 100 },
          { type: 'streak_milestone', milestone: '7 day streak', time: '1 day ago', xp: 50 }
        ]);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      }
    };

    loadDashboard();
  }, [api]);

  if (!analytics || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Elite Hacker': return 'text-purple-400';
      case 'Security Analyst': return 'text-blue-400';
      case 'Penetration Tester': return 'text-green-400';
      case 'Script Kiddie': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getLevelProgress = () => {
    const currentLevel = Math.floor(user.xp / 1000);
    const nextLevel = currentLevel + 1;
    const currentLevelXP = currentLevel * 1000;
    const nextLevelXP = nextLevel * 1000;
    const progress = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    
    return { currentLevel, nextLevel, progress };
  };

  const levelInfo = getLevelProgress();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user.username}! 👋
            </h1>
            <p className="text-gray-400">
              Ready to hack the planet? Let's continue your cybersecurity journey.
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">{user.avatar}</div>
            <div className={`text-sm font-medium ${getRankColor(user.rank)}`}>
              {user.rank}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total XP</p>
              <p className="text-2xl font-bold text-white">{user.xp.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Labs Completed</p>
              <p className="text-2xl font-bold text-white">{analytics.completedLabs}</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Current Streak</p>
              <p className="text-2xl font-bold text-white">{analytics.currentStreak} days</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Weekly Progress</p>
              <p className="text-2xl font-bold text-white">{analytics.weeklyProgress}%</p>
            </div>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Level Progress</h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">Level {levelInfo.currentLevel}</div>
            <div className="text-sm text-gray-400">{user.xp} / {levelInfo.nextLevel * 1000} XP</div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-400">
          {levelInfo.nextLevel * 1000 - user.xp} XP needed for Level {levelInfo.nextLevel}
        </p>
      </div>

      {/* Learning Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Learning Paths</h2>
          </div>
          <div className="space-y-3">
            {learningPaths.map((path) => (
              <div key={path.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{path.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    path.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    path.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {path.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{path.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>⏱️ {path.estimatedTime}</span>
                  <span>🎯 {path.xpReward} XP</span>
                  <span>📚 {path.labs.length} labs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'lab_completed' ? 'bg-green-500/20' :
                  activity.type === 'flag_submitted' ? 'bg-blue-500/20' :
                  'bg-purple-500/20'
                }`}>
                  {activity.type === 'lab_completed' ? <Trophy className="w-4 h-4 text-green-400" /> :
                   activity.type === 'flag_submitted' ? <Target className="w-4 h-4 text-blue-400" /> :
                   <Zap className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    {activity.type === 'lab_completed' ? `Completed ${activity.lab}` :
                     activity.type === 'flag_submitted' ? `Flag submitted in ${activity.lab}` :
                     activity.milestone}
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-cyan-400">+{activity.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Performance Analytics</h2>
        </div>
        <div className="h-64 bg-gray-800/30 rounded-lg border border-gray-600/50 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Advanced analytics and performance charts coming soon!</p>
            <p className="text-sm">Track your learning progress, time spent, and skill development</p>
          </div>
        </div>
      </div>
    </div>
  );
}
