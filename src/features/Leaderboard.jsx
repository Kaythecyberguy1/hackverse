import { useState, useEffect } from 'react';
import { useApi } from '../services/api';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Target, 
  TrendingUp, 
  Users, 
  Star, 
  Award,
  Calendar,
  Clock,
  Zap,
  TrendingDown
} from 'lucide-react';

export default function Leaderboard({ api }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [timeFilter, categoryFilter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const [leaderboardData, userData] = await Promise.all([
        api.getLeaderboard(),
        api.getCurrentUser()
      ]);
      
      // Apply filters
      let filtered = [...leaderboardData];
      
      if (timeFilter === 'weekly') {
        // Simulate weekly filtering
        filtered = filtered.filter(user => user.xp > 500);
      } else if (timeFilter === 'monthly') {
        filtered = filtered.filter(user => user.xp > 1000);
      }
      
      if (categoryFilter === 'web') {
        filtered = filtered.filter(user => user.completedLabs > 2);
      } else if (categoryFilter === 'pentest') {
        filtered = filtered.filter(user => user.completedLabs > 4);
      }
      
      setLeaderboard(filtered);
      setCurrentUser(userData);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position) => {
    switch (position) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRankColor = (position) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30';
      default: return 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/50';
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 'Elite Hacker': return { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' };
      case 'Security Analyst': return { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
      case 'Penetration Tester': return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
      case 'Script Kiddie': return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
      default: return { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
    }
  };

  const getTrendIcon = (user, previousRank) => {
    const currentRank = leaderboard.findIndex(u => u.id === user.id) + 1;
    if (previousRank && currentRank < previousRank) {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    } else if (previousRank && currentRank > previousRank) {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-7 h-7 text-yellow-400" />
              Global Leaderboard
            </h1>
            <p className="text-gray-400">Compete with hackers worldwide and climb the ranks</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">
              {currentUser ? `#${leaderboard.findIndex(u => u.id === currentUser.id) + 1}` : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Your Rank</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Participants</p>
              <p className="text-2xl font-bold text-white">{leaderboard.length}</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Top Score</p>
              <p className="text-2xl font-bold text-white">{leaderboard[0]?.xp.toLocaleString() || 0}</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Crown className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Avg Score</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(leaderboard.reduce((sum, user) => sum + user.xp, 0) / leaderboard.length).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Your XP</p>
              <p className="text-2xl font-bold text-white">{currentUser?.xp.toLocaleString() || 0}</p>
            </div>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Time Period</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              <option value="web">Web Security</option>
              <option value="pentest">Penetration Testing</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setTimeFilter('all');
                setCategoryFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white">Rankings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">XP</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Labs</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {leaderboard.map((user, index) => {
                const rankBadge = getRankBadge(user.rank);
                const isCurrentUser = currentUser && user.id === currentUser.id;
                
                return (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-gray-800/30 transition-colors ${
                      isCurrentUser ? 'ring-2 ring-cyan-500/50 bg-cyan-500/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(index + 1)}`}>
                          {getRankIcon(index + 1)}
                        </div>
                        <span className="text-lg font-bold text-white">#{index + 1}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{user.avatar}</div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {user.username}
                            {isCurrentUser && <span className="ml-2 text-cyan-400">(You)</span>}
                          </div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">Level {Math.floor(user.xp / 1000)}</div>
                      <div className="text-xs text-gray-400">{user.xp % 1000} / 1000 XP</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-cyan-400">{user.xp.toLocaleString()}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{user.completedLabs || 0}</div>
                      <div className="text-xs text-gray-400">completed</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rankBadge.bg} ${rankBadge.color} ${rankBadge.border}`}>
                        {user.rank}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(user)}
                        <span className="text-xs text-gray-400">
                          {index === 0 ? '🥇 Champion' : 
                           index === 1 ? '🥈 Runner-up' : 
                           index === 2 ? '🥉 Third Place' : 
                           'Competing'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievement System */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaderboard.slice(0, 3).map((user, index) => (
            <div key={user.id} className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
              <div className="text-4xl mb-2">{getRankIcon(index + 1)}</div>
              <div className="text-sm font-medium text-white mb-1">{user.username}</div>
              <div className="text-xs text-gray-400">
                {index === 0 ? '🏆 First Place' : 
                 index === 1 ? '🥈 Second Place' : 
                 '🥉 Third Place'}
              </div>
              <div className="text-xs text-cyan-400 mt-1">{user.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
