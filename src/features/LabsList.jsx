import { useState, useEffect } from 'react';
import { useApi } from '../services/api';
import LabCard from '../components/LabCard';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  X,
  Clock,
  Target,
  Users,
  Star,
  TrendingUp,
  Trophy
} from 'lucide-react';

export default function LabsList({ api, onStart, onStop }) {
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [activeLabs, setActiveLabs] = useState({});

  useEffect(() => {
    loadLabs();
  }, []);

  useEffect(() => {
    filterAndSortLabs();
  }, [labs, searchTerm, selectedDifficulty, selectedCategory, sortBy]);

  const loadLabs = async () => {
    try {
      setLoading(true);
      const labsData = await api.getLabs();
      setLabs(labsData);
      
      // Get active labs status
      const activeStatuses = {};
      for (const lab of labsData) {
        const status = await api.getLabStatus(lab.id);
        if (status) {
          activeStatuses[lab.id] = status;
        }
      }
      setActiveLabs(activeStatuses);
    } catch (error) {
      console.error('Failed to load labs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortLabs = () => {
    let filtered = [...labs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lab =>
        lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(lab => lab.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lab => lab.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3, 'Expert': 4 };
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
      case 'rating':
        filtered.sort((a, b) => b.communityRating - a.communityRating);
        break;
      case 'completion':
        filtered.sort((a, b) => b.completionRate - a.completionRate);
        break;
      case 'xp':
        filtered.sort((a, b) => b.xpReward - a.xpReward);
        break;
      case 'recommended':
      default:
        // Sort by completion status, then by difficulty, then by rating
        filtered.sort((a, b) => {
          if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
          if (a.difficulty !== b.difficulty) {
            const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3, 'Expert': 4 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          }
          return b.communityRating - a.communityRating;
        });
        break;
    }

    setFilteredLabs(filtered);
  };

  const handleStartLab = async (lab) => {
    try {
      const result = await api.startLab(lab);
      setActiveLabs(prev => ({ ...prev, [lab.id]: result }));
      onStart(lab);
      await loadLabs(); // Refresh labs to update progress
    } catch (error) {
      console.error('Failed to start lab:', error);
    }
  };

  const handleStopLab = async (lab) => {
    try {
      await api.stopLab(lab);
      setActiveLabs(prev => {
        const newState = { ...prev };
        delete newState[lab.id];
        return newState;
      });
      onStop(lab);
      await loadLabs(); // Refresh labs to update progress
    } catch (error) {
      console.error('Failed to stop lab:', error);
    }
  };

  const getCategories = () => {
    const categories = [...new Set(labs.map(lab => lab.category))];
    return categories;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
    setSortBy('recommended');
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
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Available Labs</h1>
            <p className="text-gray-400">Master cybersecurity with hands-on practice</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{labs.length} Total Labs</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>{labs.filter(l => l.isCompleted).length} Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{Object.keys(activeLabs).length} Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search labs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Categories</option>
            {getCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="recommended">Recommended</option>
            <option value="difficulty">Difficulty</option>
            <option value="rating">Rating</option>
            <option value="completion">Completion Rate</option>
            <option value="xp">XP Reward</option>
          </select>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-cyan-300">×</button>
              </span>
            )}
            {selectedDifficulty !== 'all' && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                Difficulty: {selectedDifficulty}
                <button onClick={() => setSelectedDifficulty('all')} className="ml-1 hover:text-blue-300">×</button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-blue-300">×</button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-gray-600 text-gray-300 text-xs rounded-full hover:bg-gray-500 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">View:</span>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm text-gray-400">
          Showing {filteredLabs.length} of {labs.length} labs
        </div>
      </div>

      {/* Labs Grid/List */}
      {filteredLabs.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">No labs found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredLabs.map(lab => (
            <LabCard
              key={lab.id}
              lab={lab}
              onStart={handleStartLab}
              onStop={handleStopLab}
              isActive={!!activeLabs[lab.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
