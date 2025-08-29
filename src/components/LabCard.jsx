import { useState } from 'react';
import { Play, Square, ExternalLink, Clock, Star, Target, Trophy, Users, BookOpen } from 'lucide-react';

export default function LabCard({ lab, onStart, onStop, isActive = false }) {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-emerald-500';
    if (progress >= 66) return 'bg-blue-500';
    if (progress >= 33) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const formatTime = (ms) => {
    if (!ms) return '0m';
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <article 
      className={`relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm 
                 border border-gray-700/50 rounded-xl shadow-xl transition-all duration-300 
                 hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:scale-[1.02]
                 ${isActive ? 'ring-2 ring-cyan-500/50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with difficulty and status */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lab.difficulty)}`}>
            {lab.difficulty}
          </span>
          
          {lab.isCompleted && (
            <div className="flex items-center gap-1 text-emerald-400">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">Completed</span>
            </div>
          )}
        </div>

        {/* Lab Title and Description */}
        <h3 className="text-xl font-bold text-white mb-2 hover:text-cyan-400 transition-colors">
          {lab.name}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {lab.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lab.tags?.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md border border-gray-600/50">
              {tag}
            </span>
          ))}
          {lab.tags?.length > 3 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-md">
              +{lab.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{lab.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Target className="w-3 h-3" />
            <span>{lab.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Users className="w-3 h-3" />
            <span>{lab.completionRate}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        {lab.progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-cyan-400 font-medium">{Math.round(lab.progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(lab.progress)}`}
                style={{ width: `${lab.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(lab.communityRating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">
            {lab.communityRating} ({lab.completionRate}% completion)
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {!isActive ? (
            <button 
              onClick={() => onStart(lab)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 
                         text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 
                         transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
            >
              <Play className="w-4 h-4" />
              Start Lab
            </button>
          ) : (
            <button 
              onClick={() => onStop(lab)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 
                         text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-600 
                         transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            >
              <Square className="w-4 h-4" />
              Stop Lab
            </button>
          )}

          <a 
            href={lab.walkthrough} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 
                       rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-all duration-200"
          >
            <BookOpen className="w-4 h-4" />
            Walkthrough
          </a>

          {isActive && lab.ports && (
            <a 
              href={`http://localhost:${Object.values(lab.ports)[0]}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 
                         rounded-lg hover:border-emerald-500 hover:text-emerald-400 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Open Lab
            </a>
          )}
        </div>

        {/* Time Spent Indicator */}
        {lab.timeSpent > 0 && (
          <div className="mt-3 text-xs text-gray-500">
            Time spent: {formatTime(lab.timeSpent)}
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent rounded-xl pointer-events-none" />
      )}
    </article>
  );
}
  